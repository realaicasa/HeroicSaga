import React from 'react';
import { Compass, ShieldAlert, Smartphone, Sparkles, Crown, Plus, Sun, Moon, Palette } from 'lucide-react';
import { Project } from '../types';

interface HeaderProps {
  currentProject: Project | null;
  projects: Project[];
  onSelectProject: (proj: Project) => void;
  onNewProject: () => void;
  onOpenPricing: () => void;
  activeView: 'creator' | 'admin' | 'pwa' | 'wizard';
  setActiveView: (view: 'creator' | 'admin' | 'pwa' | 'wizard') => void;
  credits: number;
  isLightMode: boolean;
  onToggleLightMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onNewProject,
  onOpenPricing,
  activeView,
  setActiveView,
  credits,
  isLightMode,
  onToggleLightMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Compass className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-100 font-serif">
                Heroic<span className="text-amber-400">Saga</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Hero's Journey Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Family Memory & Adventure Story Platform</p>
          </div>
        </div>

        {/* Dashboards & Views Switcher Bar */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs font-medium self-center">
          <button
            onClick={() => setActiveView('wizard')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeView === 'wizard'
                ? 'bg-indigo-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Story Engine</span>
          </button>

          <button
            onClick={() => setActiveView('creator')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeView === 'creator'
                ? 'bg-indigo-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Creator Studio</span>
          </button>

          <button
            onClick={() => setActiveView('pwa')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeView === 'pwa'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Story Reader</span>
          </button>
        </nav>

        {/* Actions & Global Controls */}
        <div className="flex items-center space-x-2">
          {/* Secret Admin Access Trigger */}
          <button
            onClick={() => setActiveView('admin')}
            className={`p-2 rounded-xl border text-xs font-medium transition-all ${
              activeView === 'admin'
                ? 'bg-purple-600/30 text-purple-300 border-purple-500/50 shadow-sm'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-500 hover:text-purple-400 border-slate-800/80'
            }`}
            title="Secret Admin Access"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
          {projects.length > 0 && (
            <div className="relative">
              <select
                value={currentProject?.id || ''}
                onChange={(e) => {
                  const found = projects.find((p) => p.id === e.target.value);
                  if (found) onSelectProject(found);
                }}
                className="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[130px] truncate font-mono"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title || 'Untitled Story'}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={onNewProject}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Create New Story"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">New Saga</span>
          </button>

          {/* Light / Dark Theme Toggle Button */}
          <button
            onClick={onToggleLightMode}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium flex items-center justify-center transition-all"
            title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLightMode ? (
              <Moon className="w-4 h-4 text-amber-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Credits & Pricing Upgrade Button */}
          <button
            onClick={onOpenPricing}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 hover:from-indigo-800/60 hover:to-purple-800/60 border border-indigo-500/40 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-indigo-200">{credits.toLocaleString()} Cr</span>
          </button>
        </div>
      </div>
    </header>
  );
};

