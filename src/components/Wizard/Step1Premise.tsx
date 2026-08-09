import React, { useState } from 'react';
import { Sparkles, BookOpen, User, Flame, Wand2, Compass, Layers, CheckCircle2, Compass as JourneyIcon } from 'lucide-react';
import { Genre, PovFormat, TargetLength } from '../../types';
import { PRESET_TEMPLATES } from '../../data/mockTemplates';
import { HerosJourneyOnboarding } from '../HerosJourneyOnboarding';

interface Step1PremiseProps {
  onSubmit: (formData: {
    title: string;
    authorName: string;
    genre: Genre;
    subgenre: string;
    povFormat: PovFormat;
    targetLength: TargetLength;
    styleProfile: string;
    premise: string;
  }) => void;
  isLoading: boolean;
}

const GENRE_LIST: { id: Genre; label: string; desc: string; icon: any }[] = [
  { id: 'Romance', label: 'Romance', desc: 'Dark, Regency, Contemporary, Slow-burn', icon: Flame },
  { id: 'Thriller/Mystery', label: 'Thriller / Mystery', desc: 'Psychological, Cyber, Murder Whodunit', icon: Compass },
  { id: 'Fantasy/Sci-Fi', label: 'Fantasy / Sci-Fi', desc: 'Epic Court Fantasy, Cyberpunk, Space Opera', icon: Wand2 },
  { id: 'Young Adult', label: 'Young Adult', desc: 'Coming-of-Age, Magic Academy, Dystopian', icon: BookOpen },
  { id: 'Literary Fiction', label: 'Literary Fiction', desc: 'Deep character studies, thematic prose', icon: Layers },
  { id: 'Horror/Dark', label: 'Horror / Dark', desc: 'Gothic terror, psychological dread', icon: Flame },
  { id: 'Cozy Mystery', label: 'Cozy Mystery', desc: 'Small town, amateur sleuth, puzzle box', icon: Compass },
  { id: 'Space Opera', label: 'Space Opera', desc: 'Interstellar empires, galactic intrigue', icon: Wand2 },
];

export const Step1Premise: React.FC<Step1PremiseProps> = ({ onSubmit, isLoading }) => {
  const [mode, setMode] = useState<'heros_journey' | 'custom_fiction'>('heros_journey');
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('Evelyn Vance');
  const [genre, setGenre] = useState<Genre>('Fantasy/Sci-Fi');
  const [subgenre, setSubgenre] = useState('Dark Romantic Fantasy & Court Intrigue');
  const [povFormat, setPovFormat] = useState<PovFormat>('1st Present Dual');
  const [targetLength, setTargetLength] = useState<TargetLength>('Full Novel (40-320 pages)');
  const [styleProfile, setStyleProfile] = useState('High-tension, visceral sensory descriptions, lyrical prose, dark court atmosphere');
  const [premise, setPremise] = useState(
    'A disgraced shadow-mage is forced into a political marriage with her family\'s sworn enemy—a ruthlessly quiet general whose mind is protected by ancient obsidian wards. To save her sister, she must assassinate him before the winter Solstice, but as court conspirators launch a coup, she realizes he is the only one keeping the kingdom\'s dark gods bound.'
  );

  const handleHeroJourneySubmit = (journeyData: {
    protagonistName: string;
    protagonistAge: string;
    protagonistTraits: string;
    allies: Array<{ name: string; relation: string; age: string; traits: string }>;
    originWorld: string;
    skills: string[];
    currentChallenge: string;
    ultimateDream: string;
    artStyle: string;
    isProTier: boolean;
  }) => {
    const generatedTitle = `The Legend of ${journeyData.protagonistName}: Crossing the Threshold`;
    const generatedPremise = `
PROTAGONIST: ${journeyData.protagonistName} (Age ${journeyData.protagonistAge}, Traits: ${journeyData.protagonistTraits}).
ALLIES & FAMILY: ${journeyData.allies.map(a => `${a.name} (${a.relation}, ${a.age}yo, Traits: ${a.traits})`).join('; ')}.
ORIGIN WORLD: ${journeyData.originWorld}.
HERO EQUIPMENT & SKILLS: ${journeyData.skills.join(', ')}.
THE DRAGON / CRUCIBLE (Primary Challenge): ${journeyData.currentChallenge}.
THE TREASURE / BOON (Ultimate Dream): ${journeyData.ultimateDream}.
Map this real family story onto Campbell's 12 Stages of the Hero's Journey with 3 interactive pivot points and character visual consistency.
    `.trim();

    onSubmit({
      title: generatedTitle,
      authorName: `${journeyData.protagonistName} & Family Tribe`,
      genre: 'Fantasy/Sci-Fi',
      subgenre: "Hero's Journey Life Epic",
      povFormat: '1st Present Single',
      targetLength: 'Full Novel (40-320 pages)',
      styleProfile: `${journeyData.artStyle}, vivid sensory details, emotional depth, triumphant atmosphere`,
      premise: generatedPremise,
    });
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (preset) {
      setTitle(preset.title);
      setAuthorName(preset.authorName);
      setGenre(preset.genre);
      setSubgenre(preset.subgenre);
      setPovFormat(preset.povFormat);
      setTargetLength(preset.targetLength);
      setStyleProfile(preset.styleProfile);
      setPremise(preset.premise);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!premise.trim()) return;
    onSubmit({
      title,
      authorName,
      genre,
      subgenre,
      povFormat,
      targetLength,
      styleProfile,
      premise,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      {/* Mode Switcher Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMode('heros_journey')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              mode === 'heros_journey'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Hero's Journey App Engine (Family / Life Story)</span>
          </button>

          <button
            onClick={() => setMode('custom_fiction')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              mode === 'custom_fiction'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Custom Fiction Novel Form</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-indigo-400 hidden sm:block">
          {mode === 'heros_journey' ? 'Interactive Story Mode' : 'KDP Manuscript Mode'}
        </span>
      </div>

      {mode === 'heros_journey' ? (
        <HerosJourneyOnboarding
          onStartStoryGeneration={handleHeroJourneySubmit}
          isLoading={isLoading}
        />
      ) : (
        <div className="space-y-8">
          {/* Step Banner */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Step 1 of 4: Premise & Genre Calibration
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif">
              Turn Your Story Concept into a KDP Novel
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Enter your story premise or choose a pre-calibrated bestseller template. Heroic Saga's Multi-Pass Architecture will craft a tight 3-Act plot blueprint with character continuity anchors.
            </p>

            {/* 1-Click Presets */}
            <div className="pt-2">
              <span className="text-xs text-slate-400 block mb-2 font-medium">Or Load 1-Click Bestseller Presets:</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleApplyPreset(tmpl.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 hover:border-indigo-500/50 transition-all flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span className="font-semibold">{tmpl.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({tmpl.genre})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Input Form */}
          <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Title & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Book Title (Optional or Auto-Invent)
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Obsidian Oath (Leave blank to let AI title)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" /> Author Name / Pen Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Evelyn Vance"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Genre Selector Grid */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Select Genre Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {GENRE_LIST.map((g) => {
                  const isSelected = genre === g.id;
                  const Icon = g.icon;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setGenre(g.id);
                        setSubgenre(g.desc.split(',')[0]);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 text-slate-100 shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 absolute top-3 right-3" />
                      )}
                      <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold block">{g.label}</span>
                      <span className="text-[10px] text-slate-500 block truncate mt-0.5">{g.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subgenre & Format Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Subgenre / Niche</label>
                <input
                  type="text"
                  value={subgenre}
                  onChange={(e) => setSubgenre(e.target.value)}
                  placeholder="e.g. Dark Court Fantasy"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">POV Format</label>
                <select
                  value={povFormat}
                  onChange={(e) => setPovFormat(e.target.value as PovFormat)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="1st Present Dual">1st Person Present (Dual POV)</option>
                  <option value="1st Present Single">1st Person Present (Single POV)</option>
                  <option value="3rd Past Multi">3rd Person Past (Multi-POV)</option>
                  <option value="3rd Past Single">3rd Person Past (Single POV)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Target Manuscript Length</label>
                <select
                  value={targetLength}
                  onChange={(e) => setTargetLength(e.target.value as TargetLength)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Short Story (15-50 pages)">Short Story (15-50 pgs / 4 Ch)</option>
                  <option value="Novella (25-120 pages)">Novella (25-120 pgs / 8 Ch)</option>
                  <option value="Full Novel (40-320 pages)">Full Novel (40-320 pgs / 10 Ch)</option>
                </select>
              </div>
            </div>

            {/* Style Profile */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Voice & Prose Style Profile</label>
              <input
                type="text"
                value={styleProfile}
                onChange={(e) => setStyleProfile(e.target.value)}
                placeholder="e.g. Visceral, sensory descriptions, razor-sharp dialogue, atmospheric tension"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Premise Prompt */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Core Premise & Story Arc Prompt</span>
                <span className="text-[10px] text-slate-500 font-normal">Supports detailed plot ideas, character names, or high concepts</span>
              </label>
              <textarea
                rows={5}
                value={premise}
                onChange={(e) => setPremise(e.target.value)}
                placeholder="Describe your story idea, central conflict, main character goals, or key plot twist..."
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-2xl p-4 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                required
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !premise.trim()}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Running Story Architecture Engine (Pass 1 & 2)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Story & World Blueprint</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

