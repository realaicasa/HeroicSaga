import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  Compass,
  Flame,
  Trophy,
  Wand2,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Plus,
  Trash2,
  Download,
  Smartphone,
  BookOpen,
  Image as ImageIcon,
  Play,
  RotateCcw,
  Check,
  Save,
  Clock,
  BookmarkCheck
} from 'lucide-react';
import { Genre, PovFormat, TargetLength } from '../types';

interface HeroAlly {
  id: string;
  name: string;
  relation: string;
  age: string;
  traits: string;
}

interface HerosJourneyOnboardingProps {
  onStartStoryGeneration: (journeyData: {
    protagonistName: string;
    protagonistAge: string;
    protagonistTraits: string;
    allies: HeroAlly[];
    originWorld: string;
    skills: string[];
    currentChallenge: string;
    ultimateDream: string;
    artStyle: string;
    isProTier: boolean;
  }) => void;
  isLoading: boolean;
}

const PRESET_JOURNEYS = [
  {
    id: 'family_relocation',
    label: 'Family New Frontier',
    desc: 'Relocating to a new tropical realm & building a tech studio legacy with kids',
    protagonistName: 'Alex',
    protagonistAge: '35',
    protagonistTraits: 'Short brown hair, green jacket, leather notebook, resourceful thinker',
    allies: [
      { id: '1', name: 'Maya', relation: 'Daughter', age: '8', traits: 'Curly dark hair, pink backpack, fearless animal lover' },
      { id: '2', name: 'Elena', relation: 'Partner', age: '34', traits: 'Silver compass pendant, sharp analyst, warm smile' }
    ],
    originWorld: 'A bustling, overcast metropolitan tech city',
    skills: ['Software Architecture', 'Star Navigation', 'Archery', 'Cooking'],
    currentChallenge: 'Overcoming fear of the unknown while building a sustainable family estate in the tropics',
    ultimateDream: 'A self-sufficient beachside innovation lab & family sanctuary',
    artStyle: 'Modern 2D graphic novel, vivid lighting, warm tropical palette'
  },
  {
    id: 'founder_ascent',
    label: 'Solo Pioneer Ascent',
    desc: 'Turning a personal life trial into a legendary community platform',
    protagonistName: 'Jordan',
    protagonistAge: '29',
    protagonistTraits: 'Athletic build, vintage glasses, denim jacket, unyielding optimist',
    allies: [
      { id: '1', name: 'Marcus', relation: 'Mentor', age: '62', traits: 'Wise veteran founder, tweed vest, iron discipline' }
    ],
    originWorld: 'A quiet suburban basement studio filled with blueprints',
    skills: ['Growth Hacking', 'Public Speaking', 'Endurance Running', 'Visual Design'],
    currentChallenge: 'Scaling past burnout and securing trust among high-stakes rivals',
    ultimateDream: 'Empowering 100,000 creators to reclaim their economic independence',
    artStyle: 'Cinematic anime style, glowing neon accents, deep twilight atmosphere'
  }
];

export const HerosJourneyOnboarding: React.FC<HerosJourneyOnboardingProps> = ({
  onStartStoryGeneration,
  isLoading
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Form State initialized with draft from localStorage if available
  const [protagonistName, setProtagonistName] = useState(() => {
    const saved = localStorage.getItem('heroic_draft');
    if (saved) {
      try { return JSON.parse(saved).protagonistName || 'Alex'; } catch (e) {}
    }
    return 'Alex';
  });

  const [protagonistAge, setProtagonistAge] = useState(() => {
    const saved = localStorage.getItem('heroic_draft');
    if (saved) {
      try { return JSON.parse(saved).protagonistAge || '35'; } catch (e) {}
    }
    return '35';
  });

  const [protagonistTraits, setProtagonistTraits] = useState(() => {
    const saved = localStorage.getItem('heroic_draft');
    if (saved) {
      try { return JSON.parse(saved).protagonistTraits || 'Short brown hair, green jacket, leather notebook'; } catch (e) {}
    }
    return 'Short brown hair, green jacket, always holding a leather notebook';
  });
  
  const [allies, setAllies] = useState<HeroAlly[]>(() => {
    const saved = localStorage.getItem('heroic_draft');
    if (saved) {
      try { return JSON.parse(saved).allies || []; } catch (e) {}
    }
    return [
      { id: '1', name: 'Maya', relation: 'Daughter', age: '8', traits: 'Curly dark hair, pink backpack, energetic explorer' },
      { id: '2', name: 'Elena', relation: 'Partner', age: '34', traits: 'Silver compass pendant, warm eyes, sharp strategist' }
    ];
  });

  const [originWorld, setOriginWorld] = useState(() => {
    const saved = localStorage.getItem('heroic_draft');
    if (saved) {
      try { return JSON.parse(saved).originWorld || ''; } catch (e) {}
    }
    return 'A busy metropolitan city surrounded by tall glass towers and endless deadlines';
  });

  const [skillsInput, setSkillsInput] = useState(() => {
    const saved = localStorage.getItem('heroic_draft');
    if (saved) {
      try { return JSON.parse(saved).skillsInput || ''; } catch (e) {}
    }
    return 'Full-Stack Coding, Wilderness Navigation, Archery, Storytelling';
  });

  const [currentChallenge, setCurrentChallenge] = useState(() => {
    const saved = localStorage.getItem('heroic_draft');
    if (saved) {
      try { return JSON.parse(saved).currentChallenge || ''; } catch (e) {}
    }
    return 'Relocating family across oceans to launch a new eco-tech studio despite financial risk';
  });

  const [ultimateDream, setUltimateDream] = useState(() => {
    const saved = localStorage.getItem('heroic_draft');
    if (saved) {
      try { return JSON.parse(saved).ultimateDream || ''; } catch (e) {}
    }
    return 'Creating a thriving tropical family sanctuary and empowering 10,000 builders';
  });

  const [artStyle, setArtStyle] = useState('Modern 2D graphic novel, vivid lighting, warm tropical palette');
  const [isProTier, setIsProTier] = useState(true);

  // Auto-Save Draft to LocalStorage whenever form fields change
  useEffect(() => {
    const draftData = {
      protagonistName,
      protagonistAge,
      protagonistTraits,
      allies,
      originWorld,
      skillsInput,
      currentChallenge,
      ultimateDream,
      artStyle,
      step,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    localStorage.setItem('heroic_draft', JSON.stringify(draftData));
    setLastSaved(draftData.updatedAt);
  }, [protagonistName, protagonistAge, protagonistTraits, allies, originWorld, skillsInput, currentChallenge, ultimateDream, artStyle, step]);

  const handleManualSaveDraft = () => {
    const draftData = {
      protagonistName,
      protagonistAge,
      protagonistTraits,
      allies,
      originWorld,
      skillsInput,
      currentChallenge,
      ultimateDream,
      artStyle,
      step,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    localStorage.setItem('heroic_draft', JSON.stringify(draftData));
    setSaveToast(`Progress saved at ${draftData.updatedAt}! Feel free to research family photos/history and return anytime.`);
    setTimeout(() => setSaveToast(null), 5000);
  };

  const handleAddAlly = () => {
    setAllies([
      ...allies,
      { id: Date.now().toString(), name: '', relation: 'Ally', age: '10', traits: '' }
    ]);
  };

  const handleUpdateAlly = (id: string, field: keyof HeroAlly, val: string) => {
    setAllies(allies.map((a) => (a.id === id ? { ...a, [field]: val } : a)));
  };

  const handleRemoveAlly = (id: string) => {
    setAllies(allies.filter((a) => a.id !== id));
  };

  const handleLoadPreset = (presetId: string) => {
    const p = PRESET_JOURNEYS.find((item) => item.id === presetId);
    if (!p) return;
    setProtagonistName(p.protagonistName);
    setProtagonistAge(p.protagonistAge);
    setProtagonistTraits(p.protagonistTraits);
    setAllies(p.allies);
    setOriginWorld(p.originWorld);
    setSkillsInput(p.skills.join(', '));
    setCurrentChallenge(p.currentChallenge);
    setUltimateDream(p.ultimateDream);
    setArtStyle(p.artStyle);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsList = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    onStartStoryGeneration({
      protagonistName,
      protagonistAge,
      protagonistTraits,
      allies,
      originWorld,
      skills: skillsList,
      currentChallenge,
      ultimateDream,
      artStyle,
      isProTier
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Salesy Hero Banner & Concept Intro */}
      <div className="bg-gradient-to-br from-indigo-950/90 via-slate-900 to-purple-950/80 border border-indigo-500/30 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-extrabold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-amber-400" /> Transform Life Memories into an Interactive Story
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 font-serif leading-tight">
            Turn Your Family's True Journey into a Cinematic Legend
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Most app builders ask for database schemas; <strong>Hero's Journey App Engine</strong> asks for your life. By mapping your family members, real-world skills, and personal triumphs onto Joseph Campbell's 12 Hero's Journey stages, we auto-generate an interactive story experience complete with visual character consistency, dynamic storyboards, and 3-pivot branching choices!
          </p>
        </div>

        {/* Save Draft Progress Bar */}
        <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <BookmarkCheck className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>Editing Progress Auto-Saved:</strong> Leave anytime to research family history & photos.
            </span>
            {lastSaved && (
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> Last saved {lastSaved}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleManualSaveDraft}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Save className="w-3.5 h-3.5 text-indigo-400" />
            <span>Save Draft Now</span>
          </button>
        </div>

        {saveToast && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-2xl text-xs text-center font-mono animate-fadeIn">
            {saveToast}
          </div>
        )}

        {/* Preset Selector */}
        <div className="pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-2 font-semibold uppercase tracking-wider font-mono">
            Or Load 1-Click Family Adventure Templates:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_JOURNEYS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleLoadPreset(p.id)}
                className="px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-xs text-slate-200 transition-all flex items-center gap-2 shadow-md"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">{p.label}</span>
                <span className="text-[10px] text-slate-400 font-mono">({p.protagonistName}'s Tribe)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pro Plan Tier Toggle Banner */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
              <GitBranch className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <span className="font-bold text-slate-100 text-xs sm:text-sm block">
                Interactive Choice Tree Engine (Pro Branching Mode)
              </span>
              <span className="text-xs text-slate-400">
                Generates 3 interactive decision points (Threshold, Ordeal, Return) with visual choice cards for end readers.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsProTier(!isProTier)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
              isProTier
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {isProTier ? 'Pro 3-Branch Choice Mode Active' : 'Enable Pro Branching'}
          </button>
        </div>
      </div>

      {/* Multi-Step Guided Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-800/80 pb-4">
          {[
            { num: 1, title: '1. The Tribe', icon: Users },
            { num: 2, title: '2. Equipment & Origin', icon: Compass },
            { num: 3, title: '3. The Dragon', icon: Flame },
            { num: 4, title: '4. The Treasure', icon: Trophy }
          ].map((t) => {
            const Icon = t.icon;
            const isActive = step === t.num;
            return (
              <button
                key={t.num}
                type="button"
                onClick={() => setStep(t.num as any)}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold font-serif truncate">{t.title}</span>
              </button>
            );
          })}
        </div>

        {/* STEP 1: The Tribe & Family Allies */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100 font-serif">The Protagonist & Family Allies</h3>
              <p className="text-xs text-slate-400">
                Define yourself and your real family members or companions. Heroic Saga creates persistent visual character seeds for each person.
              </p>
            </div>

            {/* Protagonist Input */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-bold text-indigo-400 uppercase font-mono block">Hero / Protagonist Details</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Hero Name</label>
                  <input
                    type="text"
                    value={protagonistName}
                    onChange={(e) => setProtagonistName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Age</label>
                  <input
                    type="text"
                    value={protagonistAge}
                    onChange={(e) => setProtagonistAge(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Visual Anchor Traits & Signature Clothing</label>
                <input
                  type="text"
                  value={protagonistTraits}
                  onChange={(e) => setProtagonistTraits(e.target.value)}
                  placeholder="e.g. Short brown hair, green hoodie, silver compass necklace"
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Allies & Family Members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase font-mono">Family Allies & Companions ({allies.length})</span>
                <button
                  type="button"
                  onClick={handleAddAlly}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-400" /> Add Family Ally
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allies.map((a, idx) => (
                  <div key={a.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveAlly(a.id)}
                      className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 text-xs p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Name (e.g. Maya)"
                        value={a.name}
                        onChange={(e) => handleUpdateAlly(a.id, 'name', e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Relation / Age (e.g. Daughter, 8)"
                        value={a.relation}
                        onChange={(e) => handleUpdateAlly(a.id, 'relation', e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Visual Traits (e.g. Curly dark hair, pink backpack)"
                      value={a.traits}
                      onChange={(e) => handleUpdateAlly(a.id, 'traits', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <span>Next: Equipment & Origin World</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: World & Equipment */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100 font-serif">The Origin World & Hero Equipment</h3>
              <p className="text-xs text-slate-400">
                Describe your starting environment, hometown, and real-life skills or talents that become magical artifacts in your journey.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">The Ordinary World (Starting Location / Environment)</label>
              <textarea
                rows={2}
                value={originWorld}
                onChange={(e) => setOriginWorld(e.target.value)}
                placeholder="e.g. A rainy coastal city filled with coffee shops and bustling tech hubs"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-2xl p-3 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Skills, Tools & Talents (Separated by commas)</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. Software Architecture, Wilderness Navigation, Archery, Storytelling"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Visual Art Style & World Atmosphere</label>
              <select
                value={artStyle}
                onChange={(e) => setArtStyle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Modern 2D graphic novel, vivid lighting, warm tropical palette">Modern 2D Graphic Novel (Vivid Tropical)</option>
                <option value="Cinematic anime style, glowing neon accents, deep twilight atmosphere">Cinematic Cyberpunk Anime (Neon Twilight)</option>
                <option value="High fantasy oil painting, golden hour lighting, rich textures">High Fantasy Oil Painting (Golden Hour)</option>
                <option value="Watercolour storybook illustration, soft pastel tones, whimsical glow">Watercolour Storybook (Soft Whimsical)</option>
              </select>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <span>Next: The Dragon & Obstacles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: The Crucible & Dragon */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100 font-serif">The Dragon & Crucible (Real Life Challenges)</h3>
              <p className="text-xs text-slate-400">
                What is the central hurdle or life trial you or your family are actively facing? (e.g. moving, starting a business, overcoming adversity)
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">The Primary Challenge / Crucible Prompt</label>
              <textarea
                rows={4}
                value={currentChallenge}
                onChange={(e) => setCurrentChallenge(e.target.value)}
                placeholder="Describe the main obstacle or hurdle your hero must confront..."
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-2xl p-4 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              />
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <span>Next: The Treasure & Boon</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: The Treasure & Final Submission */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100 font-serif">The Treasure & Ultimate Boon (Dreams & Aspirations)</h3>
              <p className="text-xs text-slate-400">
                What is the ultimate dream state, milestone, or legacy your family is striving to achieve?
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">The Ultimate Dream State / Boon</label>
              <textarea
                rows={3}
                value={ultimateDream}
                onChange={(e) => setUltimateDream(e.target.value)}
                placeholder="Describe your ultimate dream outcome..."
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-2xl p-4 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mapping 12 Hero's Journey Stages...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-amber-300" />
                    <span>Generate Hero's Journey Storyboard App</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
