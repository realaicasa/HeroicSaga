import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PricingModal } from './components/PricingModal';
import { Step1Premise } from './components/Wizard/Step1Premise';
import { Step2Blueprint } from './components/Wizard/Step2Blueprint';
import { Step3GenerationStudio } from './components/Wizard/Step3GenerationStudio';
import { Step4LaunchKit } from './components/Wizard/Step4LaunchKit';
import { ProjectLibrary } from './components/ProjectLibrary';
import { AdminDashboard } from './components/AdminDashboard';
import { CreatorStudio } from './components/CreatorStudio';
import { PwaReader } from './components/PwaReader';
import {
  Project,
  Character,
  StoryThread,
  Chapter,
  LaunchKit,
  EngineMetrics,
  Genre,
  PovFormat,
  TargetLength,
  HeroStory,
} from './types';

export default function App() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeView, setActiveView] = useState<'wizard' | 'creator' | 'admin' | 'pwa'>('wizard');
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('heroic_saga_projects') || localStorage.getItem('booknova_projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [storyThreads, setStoryThreads] = useState<StoryThread[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [launchKit, setLaunchKit] = useState<LaunchKit | null>(null);

  const [isLoadingBlueprint, setIsLoadingBlueprint] = useState(false);
  const [isGeneratingChapter, setIsGeneratingChapter] = useState(false);
  const [currentGeneratingChapter, setCurrentGeneratingChapter] = useState<number | null>(null);
  const [isGeneratingLaunchKit, setIsGeneratingLaunchKit] = useState(false);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [viewingLibrary, setViewingLibrary] = useState(false);
  const [credits, setCredits] = useState(100000);

  const [metrics, setMetrics] = useState<EngineMetrics>({
    lexicalTokensBlocked: 14,
    emDashRatePer300Words: 0.9,
    continuityChecksPassed: 0,
    totalWordsGenerated: 0,
    currentChapterNumber: 1,
    activeTensionPoints: 3,
  });

  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    return localStorage.getItem('heroic_saga_theme') === 'light';
  });

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light');
      localStorage.setItem('heroic_saga_theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('heroic_saga_theme', 'dark');
    }
  }, [isLightMode]);

  // Save projects to localStorage
  useEffect(() => {
    localStorage.setItem('heroic_saga_projects', JSON.stringify(projects));
  }, [projects]);

  // Sync state when current project changes
  useEffect(() => {
    if (currentProject) {
      fetch(`/api/db/state/${currentProject.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.characters) setCharacters(data.characters);
          if (data.story_threads) setStoryThreads(data.story_threads);
          if (data.chapters) setChapters(data.chapters);
          if (data.launch_kit) setLaunchKit(data.launch_kit);
        })
        .catch(() => {});
    }
  }, [currentProject?.id]);

  // Handle Step 1 Submission -> Blueprint Generation (Pass 1 & 2)
  const handleGenerateBlueprint = async (formData: {
    title: string;
    authorName: string;
    genre: Genre;
    subgenre: string;
    povFormat: PovFormat;
    targetLength: TargetLength;
    styleProfile: string;
    premise: string;
  }) => {
    setIsLoadingBlueprint(true);
    try {
      const res = await fetch('/api/blueprint/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to generate blueprint');
      const data = await res.json();

      const newProject: Project = data.project;
      setCurrentProject(newProject);
      setProjects((prev) => [newProject, ...prev.filter((p) => p.id !== newProject.id)]);
      setCharacters(data.characters || []);
      setStoryThreads(data.storyThreads || []);
      setChapters(data.chapters || []);
      setCredits((prev) => Math.max(0, prev - 5000));

      setActiveStep(2);
      setViewingLibrary(false);
    } catch (err) {
      console.error('Error generating blueprint:', err);
    } finally {
      setIsLoadingBlueprint(false);
    }
  };

  // Handle Single Chapter Generation (Pass 3)
  const handleGenerateChapter = async (chapterNumber: number) => {
    if (!currentProject) return;
    setIsGeneratingChapter(true);
    setCurrentGeneratingChapter(chapterNumber);

    try {
      const currentChapterObj = chapters.find((c) => c.chapterNumber === chapterNumber);
      const blacklist = currentChapterObj?.lexicalBlacklist || [];

      const res = await fetch('/api/chapter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: currentProject.id,
          chapterNumber,
          lexicalBlacklist: blacklist,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate chapter');
      const data = await res.json();

      setChapters((prev) =>
        prev.map((c) => (c.chapterNumber === chapterNumber ? data.chapter : c))
      );

      // Update metrics
      setMetrics((prev) => ({
        ...prev,
        lexicalTokensBlocked: prev.lexicalTokensBlocked + (data.updatedBlacklist?.length || 2),
        continuityChecksPassed: prev.continuityChecksPassed + 1,
        totalWordsGenerated: prev.totalWordsGenerated + (data.chapter.wordCount || 800),
      }));

      setCredits((prev) => Math.max(0, prev - 3000));
    } catch (err) {
      console.error('Chapter generation error:', err);
    } finally {
      setIsGeneratingChapter(false);
      setCurrentGeneratingChapter(null);
    }
  };

  // Batch Generate All Chapters
  const handleBatchGenerateAll = async () => {
    if (!currentProject) return;
    for (const chap of chapters) {
      if (chap.status !== 'Audited') {
        await handleGenerateChapter(chap.chapterNumber);
      }
    }
  };

  // Generate Launch Kit (Pass 4)
  const handleGenerateLaunchKit = async () => {
    if (!currentProject) return;
    setIsGeneratingLaunchKit(true);
    try {
      const res = await fetch('/api/launchkit/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: currentProject.id }),
      });

      if (!res.ok) throw new Error('Failed to generate launch kit');
      const kit = await res.json();
      setLaunchKit(kit);
    } catch (err) {
      console.error('Launch kit error:', err);
    } finally {
      setIsGeneratingLaunchKit(false);
    }
  };

  // Generate AI Cover Art
  const handleGenerateCover = async (stylePrompt: string) => {
    if (!currentProject) return;
    setIsGeneratingCover(true);
    try {
      const res = await fetch('/api/cover/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentProject.title,
          genre: currentProject.genre,
          stylePrompt,
          authorName: currentProject.authorName,
        }),
      });

      if (!res.ok) throw new Error('Cover generation failed');
      const data = await res.json();
      if (data.imageUrl) {
        setCoverImage(data.imageUrl);
      }
    } catch (err) {
      console.error('Cover generation error:', err);
    } finally {
      setIsGeneratingCover(false);
    }
  };

  // Manual Chapter Prose Update
  const handleUpdateChapterProse = (chapterNumber: number, prose: string) => {
    const words = prose.trim().split(/\s+/).length;
    const emDashes = (prose.match(/—/g) || []).length;

    setChapters((prev) =>
      prev.map((c) =>
        c.chapterNumber === chapterNumber
          ? { ...c, rawProse: prose, wordCount: words, emDashCount: emDashes }
          : c
      )
    );
  };

  const handleStartNewProject = () => {
    setCurrentProject(null);
    setCharacters([]);
    setStoryThreads([]);
    setChapters([]);
    setLaunchKit(null);
    setCoverImage(null);
    setActiveStep(1);
    setViewingLibrary(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (currentProject?.id === id) {
      handleStartNewProject();
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white ${isLightMode ? 'light' : ''}`}>
      {/* Platform Navigation Header */}
      <Header
        currentProject={currentProject}
        projects={projects}
        onSelectProject={(p) => {
          setCurrentProject(p);
          setViewingLibrary(false);
        }}
        onNewProject={handleStartNewProject}
        onOpenPricing={() => setIsPricingOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        credits={credits}
        isLightMode={isLightMode}
        onToggleLightMode={() => setIsLightMode(!isLightMode)}
      />

      {/* Main View Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeView === 'admin' && (
          <AdminDashboard
            projects={projects}
            onToggleProTier={(projectId) => {
              setProjects((prev) =>
                prev.map((p) =>
                  p.id === projectId ? { ...p, isProBranching: !p.isProBranching } : p
                )
              );
            }}
            onGrantCredits={(amount) => setCredits((prev) => prev + amount)}
            credits={credits}
          />
        )}

        {activeView === 'creator' && (
          <CreatorStudio
            currentProject={currentProject || {
              id: 'demo_proj',
              title: "The Golden Crest Adventure",
              authorName: "Alex & Family",
              logline: "A family's journey turned into a Hero's Journey saga.",
              theme: "Courage and family unity",
              genre: "Heroic Life Adventure",
              subgenre: "Family Legend",
              targetLength: "Interactive Storyboard (12 Hero Stages)",
              povFormat: "1st Present Single",
              styleProfile: "Cinematic Comic",
              premise: "Transform family memories into interactive legend",
              totalChapters: 12,
              status: "Blueprint",
              creditsCost: 200,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }}
            onSaveStoryData={(updatedStory) => {
              if (currentProject) {
                const updatedProj = { ...currentProject, heroStoryData: updatedStory };
                setCurrentProject(updatedProj);
                setProjects((prev) =>
                  prev.map((p) => (p.id === currentProject.id ? updatedProj : p))
                );
              }
            }}
            onOpenPwaReader={() => setActiveView('pwa')}
          />
        )}

        {activeView === 'pwa' && (
          <PwaReader
            story={
              currentProject?.heroStoryData || {
                title: currentProject?.title || "The Journey of the Golden Crest",
                artStyleAnchor: "Cinematic Graphic Novel",
                summary: "Transform real family memories into an interactive Hero's Journey.",
                protagonistName: currentProject?.authorName || "Alex",
                familyAllies: ["Maya", "Marcus"],
                currentNodeId: "stage_1",
                characters: [
                  {
                    characterId: "c1",
                    name: currentProject?.authorName || "Alex",
                    role: "Protagonist",
                    visualAnchorPrompt: "Young hero in brown coat, silver pendant",
                    suggestedSeed: 48201
                  }
                ],
                storyNodes: [
                  {
                    nodeId: "stage_1",
                    parentNodeId: "root",
                    stageNumber: 1,
                    stageName: "1. The Ordinary World",
                    isChoicePoint: false,
                    choiceLabel: "Begin Journey",
                    narrativeText: "Alex and Maya lived in the peaceful valley of Oakhaven, where mountain winds carried whispers of ancient legends.",
                    imagePrompt: "Sunlit peaceful mountain village, warm comic art style",
                    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                    comicPanels: [
                      {
                        panelNumber: 1,
                        caption: "It began on a quiet Tuesday evening...",
                        speechBubble: "Look at the light over the ridge, Alex!",
                        speakerName: "Maya",
                        artPrompt: "Warm mountain sunset",
                        imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                      },
                      {
                        panelNumber: 2,
                        caption: "An ancient silver key tumbled from an old leather journal.",
                        speechBubble: "This key carries our family crest!",
                        speakerName: "Alex",
                        artPrompt: "Hands holding glowing key",
                        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
                      }
                    ]
                  },
                  {
                    nodeId: "stage_4",
                    parentNodeId: "stage_1",
                    stageNumber: 4,
                    stageName: "4. Crossing the First Threshold",
                    isChoicePoint: true,
                    choiceLabel: "Stand before the Obsidian Gate",
                    narrativeText: "At the boundary of the Whispering Woods, Alex and Maya stood before the ancient Obsidian Portal.",
                    imagePrompt: "Ancient stone archway with glowing runes in dark forest",
                    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
                  },
                  {
                    nodeId: "stage_4_branch_a",
                    parentNodeId: "stage_4",
                    stageNumber: 5,
                    stageName: "5A. Celestial Caverns",
                    isChoicePoint: false,
                    choiceLabel: "Enter the Celestial Caverns",
                    choiceOptionSummary: "Uncover subterranean constellation maps and sapphire crystals.",
                    narrativeText: "Stepping into bioluminescent caves, glowing crystals illuminated constellation maps overhead.",
                    imagePrompt: "Bioluminescent cavern with sapphire crystal pillars",
                    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
                  },
                  {
                    nodeId: "stage_4_branch_b",
                    parentNodeId: "stage_4",
                    stageNumber: 5,
                    stageName: "5B. Sunken Sky Bridge",
                    isChoicePoint: false,
                    choiceLabel: "Cross the Sunken Sky Bridge",
                    choiceOptionSummary: "Brave suspended rope bridges high above the cloud mist.",
                    narrativeText: "High above the clouds, an ancient stone bridge swung softly in the mountain winds.",
                    imagePrompt: "Rope bridge suspended between high mountain peaks above sea of clouds",
                    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
                  }
                ]
              }
            }
          />
        )}

        {activeView === 'wizard' && (
          viewingLibrary ? (
            <ProjectLibrary
              projects={projects}
              onSelectProject={(p) => {
                setCurrentProject(p);
                setViewingLibrary(false);
              }}
              onNewProject={handleStartNewProject}
              onDeleteProject={handleDeleteProject}
            />
          ) : (
            <>
              {activeStep === 1 && (
                <Step1Premise
                  onSubmit={handleGenerateBlueprint}
                  isLoading={isLoadingBlueprint}
                />
              )}

              {activeStep === 2 && currentProject && (
                <Step2Blueprint
                  project={currentProject}
                  characters={characters}
                  storyThreads={storyThreads}
                  chapters={chapters}
                  onConfirmBlueprint={() => setActiveStep(3)}
                  onUpdateCharacters={setCharacters}
                  onUpdateThreads={setStoryThreads}
                  onUpdateChapters={setChapters}
                />
              )}

              {activeStep === 3 && currentProject && (
                <Step3GenerationStudio
                  project={currentProject}
                  characters={characters}
                  storyThreads={storyThreads}
                  chapters={chapters}
                  onGenerateChapter={handleGenerateChapter}
                  onBatchGenerateAll={handleBatchGenerateAll}
                  onProceedToLaunchKit={() => {
                    setActiveStep(4);
                    if (!launchKit) handleGenerateLaunchKit();
                  }}
                  isGenerating={isGeneratingChapter}
                  currentGeneratingChapter={currentGeneratingChapter}
                  metrics={metrics}
                  onUpdateChapterProse={handleUpdateChapterProse}
                />
              )}

              {activeStep === 4 && currentProject && (
                <Step4LaunchKit
                  project={currentProject}
                  characters={characters}
                  chapters={chapters}
                  launchKit={launchKit}
                  onGenerateLaunchKit={handleGenerateLaunchKit}
                  onGenerateCover={handleGenerateCover}
                  isGeneratingLaunchKit={isGeneratingLaunchKit}
                  isGeneratingCover={isGeneratingCover}
                  coverImage={coverImage}
                />
              )}
            </>
          )
        )}
      </main>

      {/* Pricing Tiers & Limited Offer Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onSelectTier={(tierId) => {
          setCredits((prev) => prev + 100000);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Heroic Saga Engine • Google AI Studio & Antigravity Pipeline</span>
          <div className="flex items-center space-x-4">
            <button onClick={() => setViewingLibrary(!viewingLibrary)} className="hover:text-slate-300">
              {viewingLibrary ? 'Back to Editor' : 'Saga Library'}
            </button>
            <button onClick={() => setIsPricingOpen(true)} className="hover:text-slate-300 font-semibold text-amber-400">
              Pro Credits Offer
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className="text-slate-700 hover:text-slate-500 transition-colors p-1"
              title="Secret Admin Access"
            >
              🛡️
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
