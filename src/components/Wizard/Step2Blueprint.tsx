import React, { useState } from 'react';
import { Sparkles, Users, GitBranch, FileText, Check, Plus, Edit2, ShieldAlert, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { Project, Character, StoryThread, Chapter } from '../../types';

interface Step2BlueprintProps {
  project: Project;
  characters: Character[];
  storyThreads: StoryThread[];
  chapters: Chapter[];
  onConfirmBlueprint: () => void;
  onUpdateCharacters: (chars: Character[]) => void;
  onUpdateThreads: (threads: StoryThread[]) => void;
  onUpdateChapters: (chaps: Chapter[]) => void;
}

export const Step2Blueprint: React.FC<Step2BlueprintProps> = ({
  project,
  characters,
  storyThreads,
  chapters,
  onConfirmBlueprint,
  onUpdateCharacters,
  onUpdateThreads,
  onUpdateChapters,
}) => {
  const [activeTab, setActiveTab] = useState<'Characters' | 'StoryThreads' | 'ChapterSkeleton'>('Characters');
  const [newFact, setNewFact] = useState('');
  const [selectedCharId, setSelectedCharId] = useState<string>(characters[0]?.id || '');

  const handleAddFact = (charId: string) => {
    if (!newFact.trim()) return;
    const updated = characters.map((c) => {
      if (c.id === charId) {
        return {
          ...c,
          immutableFacts: [...c.immutableFacts, newFact.trim()],
        };
      }
      return c;
    });
    onUpdateCharacters(updated);
    setNewFact('');
  };

  const handleRemoveFact = (charId: string, factIdx: number) => {
    const updated = characters.map((c) => {
      if (c.id === charId) {
        return {
          ...c,
          immutableFacts: c.immutableFacts.filter((_, idx) => idx !== factIdx),
        };
      }
      return c;
    });
    onUpdateCharacters(updated);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Blueprint Hero Summary */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold">
              Step 2 of 4: Story & World Blueprint
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif mt-2">
              {project.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              By <span className="text-slate-200 font-semibold">{project.authorName}</span> • {project.genre} ({project.subgenre}) • {project.povFormat}
            </p>
          </div>

          <button
            onClick={onConfirmBlueprint}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 shrink-0"
          >
            <span>Confirm Blueprint & Start Writing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Logline & Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-indigo-400 font-mono text-[10px] uppercase font-bold">Logline</span>
            <p className="text-slate-200 leading-relaxed italic">"{project.logline}"</p>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-purple-400 font-mono text-[10px] uppercase font-bold">Central Thematic Undercurrent</span>
            <p className="text-slate-200 leading-relaxed font-serif">{project.theme}</p>
          </div>
        </div>
      </div>

      {/* Blueprint Detail Tabs */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-4 overflow-x-auto">
          {[
            { id: 'Characters', label: '1. Characters & Continuity Anchors', icon: Users, count: characters.length },
            { id: 'StoryThreads', label: '2. Subplot Thread Matrix', icon: GitBranch, count: storyThreads.length },
            { id: 'ChapterSkeleton', label: '3. Chapter Skeleton & Craft Techniques', icon: FileText, count: chapters.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Characters & Immutable Facts */}
        {activeTab === 'Characters' && (
          <div className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start space-x-3 text-xs text-amber-200">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block">Continuity Anchor Engine active</span>
                <span>
                  The facts listed below are locked into an immutable state vector. During chapter drafting, Gemini is strictly prohibited from contradicting these facts.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {characters.map((char) => (
                <div key={char.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-100 font-serif text-sm">{char.name}</h3>
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                        char.role === 'Protagonist' 
                          ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                          : char.role === 'Antagonist'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {char.role}
                      </span>
                    </div>

                    <div className="text-xs">
                      <span className="text-slate-500 text-[10px] uppercase font-mono block">Voice Signature</span>
                      <p className="text-slate-300 italic">{char.voiceSignature}</p>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-slate-400 text-[10px] font-bold uppercase font-mono block">Immutable Facts</span>
                      <div className="space-y-1">
                        {char.immutableFacts.map((fact, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px] bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200">
                            <span>• {fact}</span>
                            <button
                              onClick={() => handleRemoveFact(char.id, idx)}
                              className="text-slate-500 hover:text-rose-400 text-xs ml-2"
                              title="Remove fact"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Add Fact Form */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Add locked fact..."
                        value={selectedCharId === char.id ? newFact : ''}
                        onChange={(e) => {
                          setSelectedCharId(char.id);
                          setNewFact(e.target.value);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-[11px] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddFact(char.id)}
                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Story Threads */}
        {activeTab === 'StoryThreads' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {storyThreads.map((thread) => (
                <div key={thread.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-100 font-serif text-sm">{thread.threadName}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                        Ch. {thread.setupChapter} ➔ Ch. {thread.payoffChapter}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded font-semibold">
                        {thread.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{thread.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Chapter Skeleton & Techniques */}
        {activeTab === 'ChapterSkeleton' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Each chapter has been pre-assigned unique opening and ending craft techniques across 8 distinct storytelling methods to prevent repetitive structures.
            </p>

            <div className="space-y-3">
              {chapters.map((chap) => (
                <div key={chap.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 bg-indigo-600/20 text-indigo-300 font-mono text-xs font-bold rounded-lg border border-indigo-500/30">
                        Chapter {chap.chapterNumber}
                      </span>
                      <h3 className="font-bold text-slate-100 font-serif text-sm">{chap.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                      <span>Present: <strong className="text-slate-200">{chap.charactersPresent.join(', ')}</strong></span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{chap.sceneSummary}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-500 text-[10px] uppercase font-mono">Opening Technique</span>
                      <span className="font-bold text-indigo-300">{chap.openingTechnique}</span>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-500 text-[10px] uppercase font-mono">Ending Technique</span>
                      <span className="font-bold text-purple-300">{chap.endingTechnique}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Confirmation CTA */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onConfirmBlueprint}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2"
          >
            <span>Confirm Blueprint & Enter Multi-Pass Craft Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
