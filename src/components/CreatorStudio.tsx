import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Compass,
  Palette,
  Tv,
  Layers,
  Wand2,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  Trash2,
  RefreshCw,
  Play,
  Zap,
  ArrowRight
} from 'lucide-react';
import { HeroStory, HeroCharacter, HeroStoryNode, Project } from '../types';

interface CreatorStudioProps {
  currentProject: Project;
  onSaveStoryData: (updatedStory: HeroStory) => void;
  onOpenPwaReader: () => void;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({
  currentProject,
  onSaveStoryData,
  onOpenPwaReader
}) => {
  const [activeTab, setActiveTab] = useState<'characters' | 'stages' | 'branching' | 'storyboard'>('characters');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Initialize HeroStory state from project data or default
  const [storyData, setStoryData] = useState<HeroStory>(
    currentProject.heroStoryData || {
      title: currentProject.title || 'The Journey of the Golden Crest',
      artStyleAnchor: 'Vibrant Cinematic Comic, Rich Warm Palette, Detailed Linework',
      summary: currentProject.premise || 'An ordinary family embarks on an extraordinary Hero Journey across mythical realms.',
      protagonistName: currentProject.authorName || 'Alex',
      familyAllies: ['Maya (Sister)', 'Marcus (Grandfather)'],
      currentNodeId: 'stage_1',
      characters: [
        {
          characterId: 'char_1',
          name: currentProject.authorName || 'Alex',
          role: 'Protagonist',
          visualAnchorPrompt: 'Young adventurer, brown coat, courage, silver crest pendant',
          suggestedSeed: 48201,
          avatarImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        },
        {
          characterId: 'char_2',
          name: 'Maya',
          role: 'Ally',
          visualAnchorPrompt: 'Inventive teenager, brass goggles, canvas backpack, bright smile',
          suggestedSeed: 19482,
          avatarImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
        }
      ],
      storyNodes: [
        {
          nodeId: 'stage_1',
          parentNodeId: 'root',
          stageNumber: 1,
          stageName: '1. The Ordinary World',
          isChoicePoint: false,
          choiceLabel: 'Begin Journey',
          narrativeText: 'Alex and Maya lived in the peaceful valley of Oakhaven, where the mountains touched the clouds and life moved to the gentle rhythm of the seasonal harvests.',
          imagePrompt: 'Peaceful sunlit mountain village of Oakhaven, wooden houses, warm golden hour atmosphere, comic art style',
          imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
          comicPanels: [
            {
              panelNumber: 1,
              caption: 'It began on a quiet Tuesday evening in Oakhaven...',
              speechBubble: 'Look at the light over the ridge today, Alex!',
              speakerName: 'Maya',
              artPrompt: 'Warm mountain village sunset',
              imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
            },
            {
              panelNumber: 2,
              caption: 'An unexpected silver key fell from Grandfather Marcus old leather journal.',
              speechBubble: 'This key has the same crest as the ancient temple.',
              speakerName: 'Alex',
              artPrompt: 'Hands holding a glowing silver key with rune carvings',
              imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
            }
          ]
        },
        {
          nodeId: 'stage_4',
          parentNodeId: 'stage_1',
          stageNumber: 4,
          stageName: '4. Crossing the First Threshold',
          isChoicePoint: true,
          choiceLabel: 'Reach the Threshold Gate',
          narrativeText: 'At the boundary of the Whispering Woods, Alex and Maya stood before the ancient Obsidian Portal.',
          imagePrompt: 'Ancient stone archway covered in glowing runes, dark mysterious forest ahead',
          imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
        },
        {
          nodeId: 'stage_4_branch_a',
          parentNodeId: 'stage_4',
          stageNumber: 5,
          stageName: '5A. Path of the Celestial Caverns',
          isChoicePoint: false,
          choiceLabel: 'Enter the Celestial Caverns',
          choiceOptionSummary: 'Uncover ancient star maps beneath the subterranean mountains.',
          narrativeText: 'Stepping into the bioluminescent caves, glowing crystals illuminated floating star maps above.',
          imagePrompt: 'Bioluminescent cavern with sapphire crystal pillars and floating constellation maps',
          imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
        },
        {
          nodeId: 'stage_4_branch_b',
          parentNodeId: 'stage_4',
          stageNumber: 5,
          stageName: '5B. Path of the Sunken Sky Bridge',
          isChoicePoint: false,
          choiceLabel: 'Cross the Sunken Sky Bridge',
          choiceOptionSummary: 'Brave the suspended rope bridges high above the cloud mist.',
          narrativeText: 'High above the clouds, a ancient stone bridge swung softly in the mountain winds.',
          imagePrompt: 'Majestic rope bridge suspended between high mountain peaks above sea of clouds',
          imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
        }
      ]
    }
  );

  const [newCharName, setNewCharName] = useState('');
  const [newCharRole, setNewCharRole] = useState<'Protagonist' | 'Ally' | 'Mentor' | 'Rival'>('Ally');
  const [newCharPrompt, setNewCharPrompt] = useState('');

  const handleAddCharacter = () => {
    if (!newCharName.trim()) return;
    const newChar: HeroCharacter = {
      characterId: `char_${Date.now()}`,
      name: newCharName,
      role: newCharRole,
      visualAnchorPrompt: newCharPrompt || `${newCharName}, detailed character portrait, hero attire`,
      suggestedSeed: Math.floor(10000 + Math.random() * 80000),
      avatarImageUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`
    };
    const updated = { ...storyData, characters: [...storyData.characters, newChar] };
    setStoryData(updated);
    onSaveStoryData(updated);
    setNewCharName('');
    setNewCharPrompt('');
  };

  const handleRemoveCharacter = (id: string) => {
    const updated = {
      ...storyData,
      characters: storyData.characters.filter((c) => c.characterId !== id)
    };
    setStoryData(updated);
    onSaveStoryData(updated);
  };

  const handleAutoGenerateVisualSeeds = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      const updatedChars = storyData.characters.map((c) => ({
        ...c,
        suggestedSeed: Math.floor(10000 + Math.random() * 80000),
        visualAnchorPrompt: `${c.name}, ${c.role} in ${storyData.title}, ${storyData.artStyleAnchor}, high visual consistency seed`
      }));
      const updated = { ...storyData, characters: updatedChars };
      setStoryData(updated);
      onSaveStoryData(updated);
      setIsGeneratingAi(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-4 px-2 sm:px-4">
      {/* Creator Studio Hero Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-mono font-bold uppercase mb-2">
              <Palette className="w-4 h-4 text-indigo-400" /> Creator Studio Workbench
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-serif">
              {storyData.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Configure character anchors, 12 Hero's Journey stages, visual style consistency seeds, and interactive comic panels.
            </p>
          </div>

          <button
            onClick={onOpenPwaReader}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Preview in Story Reader</span>
          </button>
        </div>

        {/* Creator Studio Navigation Tabs */}
        <div className="flex items-center space-x-2 border-t border-slate-800/80 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('characters')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'characters'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Character Seeds & Allies</span>
          </button>

          <button
            onClick={() => setActiveTab('stages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'stages'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>12 Hero Stages Arc</span>
          </button>

          <button
            onClick={() => setActiveTab('branching')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'branching'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>3-Pivot Choice Trees</span>
          </button>

          <button
            onClick={() => setActiveTab('storyboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'storyboard'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Storyboard & Comic Panels</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CHARACTER SEEDS & VISUAL ANCHORS */}
      {activeTab === 'characters' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-serif">Visual Character Consistency Engine</h3>
                <p className="text-xs text-slate-400">
                  Define protagonist and family members. Fixed seeds guarantee facial consistency across comic panels.
                </p>
              </div>

              <button
                onClick={handleAutoGenerateVisualSeeds}
                disabled={isGeneratingAi}
                className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/40 hover:bg-indigo-500/30 text-indigo-300 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <Wand2 className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                <span>Auto-Calibrate Visual Seeds</span>
              </button>
            </div>

            {/* Character Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {storyData.characters.map((char) => (
                <div
                  key={char.characterId}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex gap-4 items-start"
                >
                  <img
                    src={char.avatarImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={char.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-800 shrink-0"
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-100 font-serif">{char.name}</h4>
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-full text-[10px] font-mono font-bold">
                        {char.role}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 italic">"{char.visualAnchorPrompt}"</p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        Seed #{char.suggestedSeed}
                      </span>
                      <button
                        onClick={() => handleRemoveCharacter(char.characterId)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        title="Remove character"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Character Form */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 font-mono uppercase">Add Family Member or Ally</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Character Name (e.g. Maya, Marcus)"
                  value={newCharName}
                  onChange={(e) => setNewCharName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                />

                <select
                  value={newCharRole}
                  onChange={(e: any) => setNewCharRole(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Protagonist">Protagonist</option>
                  <option value="Ally">Ally / Companion</option>
                  <option value="Mentor">Mentor / Guide</option>
                  <option value="Rival">Rival / Antagonist</option>
                </select>

                <input
                  type="text"
                  placeholder="Visual Traits (e.g. brown coat, silver pendant)"
                  value={newCharPrompt}
                  onChange={(e) => setNewCharPrompt(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={handleAddCharacter}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Character to Visual Anchor Registry</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 12 HERO STAGES ARC */}
      {activeTab === 'stages' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-serif">12 Hero's Journey Stage Sequence</h3>
            <p className="text-xs text-slate-400">
              Review and customize Campbell's 12 narrative beats mapped to your family's personal story.
            </p>
          </div>

          <div className="space-y-4">
            {storyData.storyNodes.map((node, index) => (
              <div
                key={node.nodeId}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center border border-indigo-500/40">
                      {node.stageNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 font-serif">{node.stageName}</h4>
                  </div>

                  {node.isChoicePoint && (
                    <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold rounded-full">
                      ★ Branching Pivot Point
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 font-serif leading-relaxed">
                  {node.narrativeText}
                </p>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Image Prompt: {node.imagePrompt.slice(0, 70)}...</span>
                  <span className="text-indigo-400 font-bold">Node #{node.nodeId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 3-PIVOT CHOICE TREES */}
      {activeTab === 'branching' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-serif">Pro Tier: 3-Pivot Choice Tree Manager</h3>
              <p className="text-xs text-slate-400">
                Configure reader choices at Stage 4 (Threshold), Stage 8 (Ordeal), and Stage 12 (Return).
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-amber-300 font-serif">Active Choice Point: Stage 4 (Threshold Crossing)</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block">Branch Option A</span>
                <h5 className="text-xs font-bold text-slate-200">Enter the Celestial Caverns</h5>
                <p className="text-[11px] text-slate-400">Uncover subterranean constellation maps and sapphire crystals.</p>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase block">Branch Option B</span>
                <h5 className="text-xs font-bold text-slate-200">Cross the Sunken Sky Bridge</h5>
                <p className="text-[11px] text-slate-400">Brave the suspended rope bridges high above the cloud mist.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STORYBOARD & COMIC PANELS */}
      {activeTab === 'storyboard' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-serif">Comic Panel & Motion Storyboard Lab</h3>
            <p className="text-xs text-slate-400">
              Preview graphic novel speech bubbles, panel captions, and motion scripts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block">Panel #1 Preview</span>
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                alt="Panel 1"
                className="w-full aspect-video object-cover rounded-xl"
              />
              <p className="text-xs text-slate-300 italic">"It began on a quiet Tuesday evening in Oakhaven..."</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block">Panel #2 Preview</span>
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
                alt="Panel 2"
                className="w-full aspect-video object-cover rounded-xl"
              />
              <p className="text-xs text-slate-300 italic">"An unexpected silver key fell from Grandfather Marcus old leather journal."</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
