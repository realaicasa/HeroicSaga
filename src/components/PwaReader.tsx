import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Tv,
  Film,
  Sparkles,
  Compass,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Download,
  Share2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Layers,
  Award,
  Smartphone,
  CheckCircle,
  Zap,
  Maximize2,
  Printer,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { HeroStory, HeroStoryNode, ComicPanel } from '../types';

interface PwaReaderProps {
  story: HeroStory;
  onUpdateStoryNode?: (newNodeId: string) => void;
}

export const PwaReader: React.FC<PwaReaderProps> = ({ story, onUpdateStoryNode }) => {
  const [viewMode, setViewMode] = useState<'comic' | 'storybook' | 'video'>('comic');
  const [currentNodeId, setCurrentNodeId] = useState<string>(story.currentNodeId || story.storyNodes[0]?.nodeId || 'stage_1');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const [copiedTextToast, setCopiedTextToast] = useState(false);

  // Listen for PWA installation prompt
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') {
          setIsPwaInstalled(true);
        }
        setInstallPrompt(null);
      });
    } else {
      alert('App is ready! In your browser menu, select "Add to Home Screen" to save.');
    }
  };

  const currentNode = story.storyNodes.find((n) => n.nodeId === currentNodeId) || story.storyNodes[0];
  const currentIndex = story.storyNodes.findIndex((n) => n.nodeId === currentNodeId);

  // Web Speech Synthesis Narration Engine
  useEffect(() => {
    if (isPlayingAudio && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = `${currentNode?.stageName || ''}. ${currentNode?.narrativeText || ''}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else if (!isPlayingAudio && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlayingAudio, currentNodeId]);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(story, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(story.title || 'hero_story').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_storyboard.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyText = () => {
    if (currentNode?.narrativeText) {
      navigator.clipboard.writeText(`Stage ${currentNode.stageNumber}: ${currentNode.stageName}\n\n${currentNode.narrativeText}`);
      setCopiedTextToast(true);
      setTimeout(() => setCopiedTextToast(false), 3000);
    }
  };

  const handlePrintStory = () => {
    window.print();
  };

  // Find child branching options if current node is a choice point
  const choiceBranchNodes = story.storyNodes.filter((n) => n.parentNodeId === currentNode?.nodeId);

  const handleSelectChoice = (nextNodeId: string) => {
    setCurrentNodeId(nextNodeId);
    if (onUpdateStoryNode) {
      onUpdateStoryNode(nextNodeId);
    }
  };

  const handleNextStage = () => {
    if (currentIndex < story.storyNodes.length - 1) {
      const nextNode = story.storyNodes[currentIndex + 1];
      setCurrentNodeId(nextNode.nodeId);
      if (onUpdateStoryNode) onUpdateStoryNode(nextNode.nodeId);
    }
  };

  const handlePrevStage = () => {
    if (currentIndex > 0) {
      const prevNode = story.storyNodes[currentIndex - 1];
      setCurrentNodeId(prevNode.nodeId);
      if (onUpdateStoryNode) onUpdateStoryNode(prevNode.nodeId);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: `Read "${story.title}" on the Hero's Journey Story Reader!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2 px-2 sm:px-4">
      {/* PWA Mobile Header & App Install Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                Heroic Story Reader
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Offline-Ready</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 font-serif line-clamp-1">{story.title}</h2>
          </div>
        </div>

        {/* View Mode Selector Tabs & PWA Action Buttons */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('comic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'comic'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Comic</span>
            </button>

            <button
              onClick={() => setViewMode('storybook')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'storybook'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Storybook</span>
            </button>

            <button
              onClick={() => setViewMode('video')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'video'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Motion</span>
            </button>
          </div>

          <button
            onClick={handleCopyText}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all text-xs font-bold flex items-center gap-1.5"
            title="Copy Chapter Prose"
          >
            <Copy className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Copy Text</span>
          </button>

          <button
            onClick={handlePrintStory}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all"
            title="Print / Save Story as PDF"
          >
            <Printer className="w-4 h-4 text-purple-400" />
          </button>

          <button
            onClick={handleExportJSON}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all"
            title="Export Storyboard JSON"
          >
            <FileText className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={handleInstallClick}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            title="Save app to device home screen"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Save App</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all"
            title="Share Story Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {copiedTextToast && (
        <div className="bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 p-3 rounded-2xl text-xs text-center font-mono animate-fadeIn">
          Chapter prose copied to clipboard!
        </div>
      )}

      {showShareToast && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-2xl text-xs text-center font-mono">
          Link copied to clipboard! Share your Hero's Journey story with family and friends.
        </div>
      )}

      {/* 12 Hero's Journey Stage Navigation Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-max">
          <span className="text-[10px] font-mono uppercase text-slate-500 px-2">Hero's Journey Map:</span>
          {story.storyNodes.map((node, index) => {
            const isActive = node.nodeId === currentNodeId;
            return (
              <button
                key={node.nodeId}
                onClick={() => setCurrentNodeId(node.nodeId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>Stage {node.stageNumber}</span>
                {node.isChoicePoint && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" title="Interactive Choice Point" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* READ MODE 1: COMIC / GRAPHIC NOVEL MODE */}
      {viewMode === 'comic' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-8 space-y-6 shadow-2xl">
          {/* Comic Header Panel */}
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase text-indigo-400 tracking-wider block">
                STAGE {currentNode?.stageNumber}: {currentNode?.stageName}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif">
                {story.title}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full text-xs font-mono font-bold">
                Comic Style: {story.artStyleAnchor || 'Cinematic Graphic Novel'}
              </span>
            </div>
          </div>

          {/* Graphic Novel 4-Panel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(currentNode?.comicPanels && currentNode.comicPanels.length > 0
              ? currentNode.comicPanels
              : [
                  {
                    panelNumber: 1,
                    caption: `Stage ${currentNode.stageNumber}: ${currentNode.stageName}`,
                    speechBubble: `The path unfolds before ${story.protagonistName}.`,
                    speakerName: story.protagonistName,
                    artPrompt: currentNode.imagePrompt,
                    imageUrl: currentNode.imageUrl,
                  },
                ]
            ).map((panel, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border-2 border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-xl flex flex-col transition-all group"
              >
                {/* Panel Artwork */}
                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                  <img
                    src={panel.imageUrl || currentNode.imageUrl || `https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80`}
                    alt={`Comic panel ${panel.panelNumber}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Speech Bubble Overlay */}
                  {panel.speechBubble && (
                    <div className="absolute top-4 left-4 right-4 bg-white/95 border-2 border-slate-900 rounded-2xl p-3 text-slate-950 text-xs font-sans font-bold shadow-2xl backdrop-blur-sm max-w-xs">
                      <span className="text-[10px] font-mono text-indigo-700 uppercase block font-extrabold mb-0.5">
                        {panel.speakerName || story.protagonistName}:
                      </span>
                      "{panel.speechBubble}"
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-950/80 text-slate-300 font-mono text-[10px] rounded-md border border-slate-800">
                    Panel #{panel.panelNumber || idx + 1}
                  </div>
                </div>

                {/* Panel Action Caption */}
                <div className="p-4 bg-slate-900 flex-1 flex items-center">
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{panel.caption || currentNode.narrativeText}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stage Narrative Prose Box */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-indigo-400 font-mono uppercase tracking-wider">
              Narrative Progression
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-serif">
              {currentNode.narrativeText}
            </p>
          </div>
        </div>
      )}

      {/* READ MODE 2: STORYBOOK / PICTURE BOOK MODE */}
      {viewMode === 'storybook' && (
        <div className="bg-amber-50/5 text-slate-100 border border-slate-800 rounded-3xl p-6 sm:p-12 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2 border-b border-slate-800/80 pb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                STAGE {currentNode?.stageNumber} OF 12
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-100">
                {currentNode?.stageName}
              </h1>
            </div>

            {/* Illustrated Floating Picture Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 group">
              <img
                src={currentNode.imageUrl || `https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80`}
                alt={currentNode.stageName}
                className="w-full max-h-[420px] object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-6 right-6 text-xs text-amber-200 font-serif italic drop-shadow-md">
                "{currentNode.imagePrompt}"
              </div>
            </div>

            {/* Audio Voiceover Narration Simulator Controls */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-10 h-10 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full flex items-center justify-center font-bold shadow-md transition-all shrink-0"
                >
                  {isPlayingAudio ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">
                    {isPlayingAudio ? 'Audio Narration Playing...' : 'Listen to AI Voiceover'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Calibrated Warm Storyteller Tone</span>
                </div>
              </div>

              {isPlayingAudio && (
                <div className="flex items-center space-x-1 shrink-0">
                  <span className="w-1 h-4 bg-amber-400 animate-bounce" />
                  <span className="w-1 h-6 bg-amber-400 animate-bounce delay-100" />
                  <span className="w-1 h-3 bg-amber-400 animate-bounce delay-200" />
                </div>
              )}
            </div>

            {/* Book Chapter Typography */}
            <div className="prose prose-invert max-w-none text-base sm:text-lg leading-relaxed font-serif text-slate-200 space-y-4">
              <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:font-serif">
                {currentNode.narrativeText}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* READ MODE 3: MOTION STORYBOARD / VIDEO SIMULATOR MODE */}
      {viewMode === 'video' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <Film className="w-5 h-5 text-amber-400 animate-pulse" />
              <h2 className="text-lg font-bold text-slate-100 font-serif">Motion Storyboard Simulator</h2>
            </div>

            <button
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isVideoPlaying ? 'Pause Motion' : 'Play Cinematic Stage'}</span>
            </button>
          </div>

          {/* Video Player Canvas */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-2xl">
            <img
              src={currentNode.imageUrl || `https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80`}
              alt="Video frame"
              className={`w-full h-full object-cover transition-transform duration-10000 ease-linear ${
                isVideoPlaying ? 'scale-125 translate-x-4' : 'scale-100'
              }`}
            />

            {/* Video Motion Overlay HUD */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 flex flex-col justify-between p-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30 rounded-full text-xs font-mono">
                  Camera: {currentNode.videoMotionScript?.cameraMotion || 'Parallax Zoom In'}
                </span>

                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-slate-300 rounded-full text-xs font-mono">
                  Soundscape: {currentNode.videoMotionScript?.ambientSoundscape || 'Soft Wind & Strings'}
                </span>
              </div>

              {/* Lower Subtitle Overlay */}
              <div className="bg-black/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl max-w-2xl mx-auto text-center space-y-1">
                <span className="text-[10px] font-mono uppercase text-indigo-400 block font-bold">
                  Stage {currentNode.stageNumber}: {currentNode.stageName}
                </span>
                <p className="text-sm font-serif text-slate-100 italic">
                  "{currentNode.videoMotionScript?.narrationAudioScript || currentNode.narrativeText}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRO BRANCHING CHOICE ENGINE (AT STAGE 4, 8, OR 12 OR CHOICE POINTS) */}
      {currentNode.isChoicePoint && choiceBranchNodes.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500 text-slate-950 rounded-full text-xs font-mono font-extrabold uppercase">
              <Zap className="w-4 h-4 fill-slate-950" /> Interactive Hero's Choice Pivot
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 font-serif">
              Where does {story.protagonistName}'s destiny lead next?
            </h3>
            <p className="text-xs text-slate-400">
              Your decision dynamically branches the story arc and alters the upcoming storyboard panels!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {choiceBranchNodes.map((child, idx) => (
              <button
                key={child.nodeId}
                onClick={() => handleSelectChoice(child.nodeId)}
                className="bg-slate-900 border border-slate-800 hover:border-amber-400 rounded-2xl p-5 text-left space-y-3 transition-all hover:scale-102 group shadow-xl"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-mono font-bold text-xs group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                  {String.fromCharCode(65 + idx)}
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-100 font-serif group-hover:text-amber-300 transition-colors">
                    {child.choiceLabel}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {child.choiceOptionSummary || child.narrativeText}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[10px] text-amber-400 font-mono font-bold">
                  <span>Branch Stage {child.stageNumber}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stage Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={handlePrevStage}
          disabled={currentIndex === 0}
          className="px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 font-bold text-xs rounded-2xl border border-slate-800 transition-all flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Stage</span>
        </button>

        <span className="text-xs font-mono text-slate-400">
          Stage {currentIndex + 1} of {story.storyNodes.length}
        </span>

        <button
          onClick={handleNextStage}
          disabled={currentIndex === story.storyNodes.length - 1}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2"
        >
          <span>Next Hero Stage</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
