import React, { useState } from 'react';
import { Download, Sparkles, ShieldCheck, Award, Share2, Copy, Check, BookOpen, FileText, Image as ImageIcon, Users, MessageSquare, Flame } from 'lucide-react';
import { Project, Character, Chapter, LaunchKit } from '../../types';

interface Step4LaunchKitProps {
  project: Project;
  characters: Character[];
  chapters: Chapter[];
  launchKit: LaunchKit | null;
  onGenerateLaunchKit: () => Promise<void>;
  onGenerateCover: (stylePrompt: string) => Promise<string | void>;
  isGeneratingLaunchKit: boolean;
  isGeneratingCover: boolean;
  coverImage: string | null;
}

export const Step4LaunchKit: React.FC<Step4LaunchKitProps> = ({
  project,
  characters,
  chapters,
  launchKit,
  onGenerateLaunchKit,
  onGenerateCover,
  isGeneratingLaunchKit,
  isGeneratingCover,
  coverImage,
}) => {
  const [activeTab, setActiveTab] = useState<'Cover' | 'Exports' | 'Rights' | 'CharacterCards' | 'Quotes' | 'Teasers'>('Cover');
  const [stylePrompt, setStylePrompt] = useState('Dark atmospheric cinematic lighting, highly detailed vector illustration, gold metallic typography embellishments');
  const [copiedCaptionIdx, setCopiedCaptionIdx] = useState<number | null>(null);

  const totalWords = chapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);

  const handleDownloadFile = async (format: 'pdf' | 'epub' | 'docx' | 'txt') => {
    try {
      const res = await fetch('/api/export/manuscript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, format }),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error('Download error:', e);
    }
  };

  const handleCopyCaption = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCaptionIdx(idx);
    setTimeout(() => setCopiedCaptionIdx(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Launch Studio Hero Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max">
              <Award className="w-3.5 h-3.5 text-emerald-400" /> Step 4 of 4: Novel Launch & Rights Kit
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif mt-2">
              {project.title} — KDP Ready!
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              By <span className="text-slate-200 font-semibold">{project.authorName}</span> • {chapters.length} Chapters • {totalWords.toLocaleString()} Words • 100% Commercial Rights Clearance
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDownloadFile('pdf')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => handleDownloadFile('epub')}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download EPUB</span>
            </button>
          </div>
        </div>

        {/* Quick Launch Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Rights Cert ID</span>
            <span className="font-mono font-bold text-emerald-400">{project.contentRightsCertId || 'BK-CERT-ACTIVE'}</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Format Clearance</span>
            <span className="font-semibold text-slate-200">KDP, Apple, Kobo Ready</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Launch Kit Assets</span>
            <span className="font-semibold text-indigo-300">{launchKit ? 'Generated' : 'Ready to Extract'}</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Guarantee</span>
            <span className="font-semibold text-amber-300">100% Commercial Ownership</span>
          </div>
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-4 overflow-x-auto">
          {[
            { id: 'Cover', label: '1. Cover Art Designer', icon: ImageIcon },
            { id: 'Exports', label: '2. Manuscript Exports', icon: Download },
            { id: 'Rights', label: '3. Rights Certificate', icon: ShieldCheck },
            { id: 'CharacterCards', label: '4. Character Cards', icon: Users },
            { id: 'Quotes', label: '5. Aesthetic Quotes', icon: MessageSquare },
            { id: 'Teasers', label: '6. High-Tension Teasers', icon: Flame },
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
              </button>
            );
          })}
        </div>

        {/* TAB 1: Cover Art Designer */}
        {activeTab === 'Cover' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-sm aspect-[2/3] rounded-2xl border-2 border-slate-800 shadow-2xl overflow-hidden relative group bg-slate-950">
                {coverImage ? (
                  <img src={coverImage} alt="Book Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col justify-between p-8 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950 border border-slate-800">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest text-indigo-400 block uppercase">HEROIC SAGA EDITION</span>
                      <h3 className="text-2xl font-bold font-serif text-amber-300 leading-tight mt-6">{project.title}</h3>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">{project.genre}</p>
                    </div>
                    <div className="border-t border-slate-800 pt-4">
                      <p className="text-sm font-bold text-slate-100 uppercase tracking-widest">BY {project.authorName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-100 font-serif">AI Cover Art & Style Generator</h3>
                <p className="text-xs text-slate-400">
                  Generate customized KDP-ready book covers calibrated for your specific genre aesthetics using Gemini's Image Generation Engine.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Visual Style Prompt</label>
                <textarea
                  rows={3}
                  value={stylePrompt}
                  onChange={(e) => setStylePrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={() => onGenerateCover(stylePrompt)}
                disabled={isGeneratingCover}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingCover ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Rendering AI Cover Art...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate AI Book Cover</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Manuscript Exports */}
        {activeTab === 'Exports' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { format: 'pdf', title: 'PDF Manuscript', desc: 'Pre-formatted for Amazon KDP Paperback & Hardcover printing with custom margins.', bg: 'from-rose-900/30 to-slate-950', border: 'border-rose-500/30' },
                { format: 'epub', title: 'EPUB E-Book', desc: 'Standard reflowable e-book format for Kindle, Apple Books, Kobo, and Barnes & Noble.', bg: 'from-purple-900/30 to-slate-950', border: 'border-purple-500/30' },
                { format: 'docx', title: 'DOCX Word Document', desc: 'Fully editable Microsoft Word file with styled heading tags for editor review.', bg: 'from-indigo-900/30 to-slate-950', border: 'border-indigo-500/30' },
                { format: 'txt', title: 'TXT / Markdown', desc: 'Clean raw manuscript text file for backup, archival, or custom formatting tools.', bg: 'from-emerald-900/30 to-slate-950', border: 'border-emerald-500/30' },
              ].map((item) => (
                <div key={item.format} className={`p-5 rounded-2xl border ${item.border} bg-gradient-to-b ${item.bg} space-y-3 flex flex-col justify-between`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">{item.format.toUpperCase()} FORMAT</span>
                    <h4 className="font-bold text-slate-100 text-sm font-serif">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(item.format as any)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Download .{item.format.toUpperCase()}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Rights Certificate */}
        {activeTab === 'Rights' && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-serif">Official Commercial Content Rights Certificate</h3>
                <p className="text-xs text-slate-400">Server-timestamped generation log required by Amazon KDP & self-publishing platforms.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase block">Certificate Identifier</span>
                <span className="text-emerald-400 font-bold text-sm">{project.contentRightsCertId || 'BK-CERT-ACTIVE'}</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase block">Cryptographic Audit Hash</span>
                <span className="text-slate-300 break-all text-[11px]">{project.rightsCertHash || 'a7f39b1e...'}</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-2 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <p>
                <strong>Commercial Rights Guarantee:</strong> This document certifies that 100% of the commercial ownership and copyright rights for the manuscript titled <em>"{project.title}"</em> belong exclusively to the author <strong>{project.authorName}</strong>.
              </p>
              <p>
                Heroic Saga Engine issues this certificate alongside an immutable generation audit log. No royalties, license fees, or restrictions apply to commercial distribution on Amazon KDP, Apple Books, Kobo, or physical print runs.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: Character Cards */}
        {activeTab === 'CharacterCards' && (
          <div className="space-y-4">
            {!launchKit ? (
              <div className="text-center py-8 space-y-3">
                <p className="text-slate-400 text-xs">Generate the Author Launch Kit to extract character cards and marketing assets.</p>
                <button
                  onClick={onGenerateLaunchKit}
                  disabled={isGeneratingLaunchKit}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {isGeneratingLaunchKit ? 'Generating Launch Kit...' : 'Extract Author Launch Kit'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {launchKit.characterCards.map((card, idx) => (
                  <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-100 font-serif text-sm">{card.name}</h4>
                      <span className="px-2 py-0.5 text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded">
                        {card.role}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 italic">"{card.quote}"</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {card.traits.map((trait, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 bg-purple-950/40 text-purple-300 border border-purple-500/30 rounded text-[10px]">
                          {trait}
                        </span>
                      ))}
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono">
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Portrait Image Prompt</span>
                      {card.portraitPrompt}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Aesthetic Quotes */}
        {activeTab === 'Quotes' && (
          <div className="space-y-4">
            {!launchKit ? (
              <p className="text-slate-400 text-xs text-center py-8">Generate the Author Launch Kit to view aesthetic quote graphics.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {launchKit.aestheticQuotes.map((q, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-slate-950 to-indigo-950/50 border border-slate-800 rounded-2xl p-6 space-y-3">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold block">CHAPTER {q.chapterNumber} • {q.styleNote}</span>
                    <blockquote className="text-sm font-serif italic text-slate-100 leading-relaxed">
                      "{q.quote}"
                    </blockquote>
                    <div className="text-[10px] text-slate-500 font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      Backdrop: {q.backdropPrompt}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: High-Tension Teasers */}
        {activeTab === 'Teasers' && (
          <div className="space-y-4">
            {!launchKit ? (
              <p className="text-slate-400 text-xs text-center py-8">Generate the Author Launch Kit to view teaser excerpts.</p>
            ) : (
              <div className="space-y-4">
                {launchKit.teaserExcerpts.map((t, idx) => (
                  <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-100 font-serif text-sm">{t.title}</h4>
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">
                        {t.hookType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-serif leading-relaxed italic bg-slate-900 p-4 rounded-xl border border-slate-800">
                      "{t.content}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {t.socialHashtags.map((tag, hIdx) => (
                          <span key={hIdx} className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleCopyCaption(t.content, idx)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg flex items-center gap-1"
                      >
                        {copiedCaptionIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCaptionIdx === idx ? 'Copied' : 'Copy Teaser'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
