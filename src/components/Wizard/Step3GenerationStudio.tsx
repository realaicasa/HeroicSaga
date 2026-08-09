import React, { useState } from 'react';
import { Sparkles, Play, CheckCircle2, ShieldCheck, Cpu, RefreshCw, Copy, Check, FileText, ArrowRight, Eye, AlertTriangle, Flame, Layers } from 'lucide-react';
import { Project, Character, StoryThread, Chapter, EngineMetrics } from '../../types';

interface Step3GenerationStudioProps {
  project: Project;
  characters: Character[];
  storyThreads: StoryThread[];
  chapters: Chapter[];
  onGenerateChapter: (chapterNumber: number) => Promise<void>;
  onBatchGenerateAll: () => Promise<void>;
  onProceedToLaunchKit: () => void;
  isGenerating: boolean;
  currentGeneratingChapter: number | null;
  metrics: EngineMetrics;
  onUpdateChapterProse: (chapterNumber: number, prose: string) => void;
}

export const Step3GenerationStudio: React.FC<Step3GenerationStudioProps> = ({
  project,
  characters,
  storyThreads,
  chapters,
  onGenerateChapter,
  onBatchGenerateAll,
  onProceedToLaunchKit,
  isGenerating,
  currentGeneratingChapter,
  metrics,
  onUpdateChapterProse,
}) => {
  const [selectedChapterNum, setSelectedChapterNum] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const selectedChapter = chapters.find((c) => c.chapterNumber === selectedChapterNum) || chapters[0];
  const totalDrafted = chapters.filter((c) => c.status === 'Audited' || c.rawProse.length > 0).length;
  const progressPercent = Math.round((totalDrafted / chapters.length) * 100);

  const handleCopyProse = () => {
    if (!selectedChapter?.rawProse) return;
    navigator.clipboard.writeText(selectedChapter.rawProse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      {/* Studio Header & Progress Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold">
                Step 3 of 4: Chapter Craft Studio (Pass 3 & Audit)
              </span>
              {isGenerating && (
                <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full text-xs font-bold animate-pulse flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" /> Multi-Pass Engine Writing...
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100 font-serif mt-2">
              {project.title} — Manuscript Generation
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Active Engines: Voice & Lexical Calibration • Story Thread Tracker • Continuity Anchor • Spoiler Audit
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onBatchGenerateAll}
              disabled={isGenerating || progressPercent === 100}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isGenerating ? 'Engine Running...' : 'Draft All Chapters'}</span>
            </button>

            {progressPercent === 100 && (
              <button
                onClick={onProceedToLaunchKit}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
              >
                <span>Proceed to Author Launch Kit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar & Telemetry Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">
              Manuscript Completion: <span className="text-indigo-400 font-mono">{totalDrafted} of {chapters.length} Chapters</span>
            </span>
            <span className="text-indigo-300 font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Multi-Engine Telemetry Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Voice Engine (Em-Dash Rate)</span>
            <span className="text-xs font-bold text-indigo-300 font-mono">
              ~{metrics.emDashRatePer300Words} per 300 words
            </span>
            <span className="text-[10px] text-slate-500 block">Bestseller Cap Enforced</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Lexical Rotation</span>
            <span className="text-xs font-bold text-purple-300 font-mono">
              {metrics.lexicalTokensBlocked} Tokens Filtered
            </span>
            <span className="text-[10px] text-slate-500 block">AI Tropes Blacklisted</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Continuity Anchor</span>
            <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> 100% Locked
            </span>
            <span className="text-[10px] text-slate-500 block">{characters.length} Character Anchors</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Spoiler & Twist Audit</span>
            <span className="text-xs font-bold text-amber-300 font-mono">
              {metrics.continuityChecksPassed} Audits Passed
            </span>
            <span className="text-[10px] text-slate-500 block">Gemini Flash Pass</span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Chapter Sidebar + Prose Reading Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chapter List Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-slate-200 uppercase font-mono">Chapter Skeletons</span>
              <span className="text-[10px] text-slate-500">{chapters.length} Chapters</span>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {chapters.map((chap) => {
                const isSelected = selectedChapterNum === chap.chapterNumber;
                const isCurrentGenerating = currentGeneratingChapter === chap.chapterNumber;
                const isDrafted = chap.status === 'Audited' || chap.rawProse.length > 0;

                return (
                  <button
                    key={chap.id}
                    onClick={() => setSelectedChapterNum(chap.chapterNumber)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-950/70 border-indigo-500 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-mono font-bold text-indigo-400">
                        Ch. {chap.chapterNumber}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-semibold rounded-full border ${
                        isDrafted
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : isCurrentGenerating
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {isCurrentGenerating ? 'Writing...' : isDrafted ? 'Audited' : 'Pending'}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-200 text-xs mt-1 truncate">{chap.title}</h4>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1 border-t border-slate-900">
                      <span>Op: <strong className="text-slate-400">{chap.openingTechnique}</strong></span>
                      <span>{chap.wordCount > 0 ? `${chap.wordCount} words` : '0 words'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Prose View & Editor */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            {/* Prose Pane Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-indigo-400">
                    Chapter {selectedChapter?.chapterNumber}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400 font-mono">
                    Opening: <strong className="text-indigo-300">{selectedChapter?.openingTechnique}</strong>
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400 font-mono">
                    Ending: <strong className="text-purple-300">{selectedChapter?.endingTechnique}</strong>
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-100 font-serif mt-1">
                  {selectedChapter?.title}
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onGenerateChapter(selectedChapter.chapterNumber)}
                  disabled={isGenerating}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{selectedChapter.rawProse ? 'Re-Draft Chapter' : 'Draft Chapter'}</span>
                </button>

                {selectedChapter.rawProse && (
                  <button
                    onClick={handleCopyProse}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all text-xs flex items-center gap-1"
                    title="Copy chapter prose"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                )}
              </div>
            </div>

            {/* Audit Log Banner */}
            {selectedChapter?.auditLog && (
              <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between text-xs text-emerald-200">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Continuity Score: <strong className="font-mono text-emerald-300">{selectedChapter.auditLog.continuityScore}/100</strong> • {selectedChapter.auditLog.notes}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Em-Dashes: {selectedChapter.emDashCount}
                </span>
              </div>
            )}

            {/* Prose Content Container */}
            {!selectedChapter?.rawProse ? (
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-8 text-center space-y-4">
                <FileText className="w-10 h-10 text-indigo-400/50 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-slate-200 font-bold text-sm font-serif">Chapter Prose Pending</h3>
                  <p className="text-slate-400 text-xs max-w-md mx-auto">
                    Click "Draft Chapter" above or "Draft All Chapters" in the studio toolbar to generate this chapter using the Voice & Chapter Craft Engine.
                  </p>
                </div>
                <button
                  onClick={() => onGenerateChapter(selectedChapter.chapterNumber)}
                  disabled={isGenerating}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Draft Chapter {selectedChapter.chapterNumber} Now</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-mono">{selectedChapter.wordCount} words generated</span>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-indigo-400 hover:underline font-medium text-[11px]"
                  >
                    {isEditing ? 'Save Edits' : 'Edit Prose'}
                  </button>
                </div>

                {isEditing ? (
                  <textarea
                    rows={16}
                    value={selectedChapter.rawProse}
                    onChange={(e) => onUpdateChapterProse(selectedChapter.chapterNumber, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm font-serif p-5 rounded-2xl leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                ) : (
                  <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-slate-200 font-serif text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap selection:bg-indigo-500/30">
                    {selectedChapter.rawProse}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
