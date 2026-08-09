import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, ArrowRight, ShieldCheck, Sparkles, Clock, Layers, Search } from 'lucide-react';
import { Project } from '../types';

interface ProjectLibraryProps {
  projects: Project[];
  onSelectProject: (p: Project) => void;
  onNewProject: () => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectLibrary: React.FC<ProjectLibraryProps> = ({
  projects,
  onSelectProject,
  onNewProject,
  onDeleteProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 font-serif">Your Story & Saga Library</h1>
          <p className="text-xs text-slate-400">
            Manage your saved family legend projects, chapter drafts, and interactive storyboards.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {projects.length > 0 && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <button
            onClick={onNewProject}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Start New Story</span>
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-indigo-400/50 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-200 font-serif">No Manuscripts Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Create your first novel prompt to initialize the Story Architecture Engine and craft a bestseller.
            </p>
          </div>
          <button
            onClick={onNewProject}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Create Your First Book</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                    {proj.genre}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                    proj.status === 'Complete'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  }`}>
                    {proj.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 font-serif leading-snug">{proj.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 italic">"{proj.logline}"</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Author: {proj.authorName}</span>
                  <span>{proj.totalChapters} Ch.</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => onSelectProject(proj)}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Open Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteProject(proj.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
