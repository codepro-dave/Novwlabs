import React, { useState } from 'react';
import { Search, X, ChevronRight, Cpu, BookOpen, Newspaper, Users, Sparkles } from 'lucide-react';
import { NavigationTab } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const quickLinks = [
    { label: 'Arduino Servo Arm Circuit', category: 'NOVALAB', tab: 'novalab' as NavigationTab, icon: Cpu },
    { label: 'James Webb Exoplanet Discovery', category: 'NEWS', tab: 'news' as NavigationTab, icon: Newspaper },
    { label: 'Python for Hardware Innovators', category: 'ACADEMY', tab: 'academy' as NavigationTab, icon: BookOpen },
    { label: 'Solar Autonomous Crop Drone', category: 'HUB', tab: 'hub' as NavigationTab, icon: Users },
    { label: 'Quantum Computing Fundamentals', category: 'AI ASSISTANT', tab: 'ai' as NavigationTab, icon: Sparkles },
    { label: 'Clean Water IoT Challenge 2026', category: 'CHALLENGES', tab: 'hub' as NavigationTab, icon: Users },
  ];

  const filteredLinks = query.trim()
    ? quickLinks.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase()) || 
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : quickLinks;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#090e29] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden glow-card">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tutorials, news, circuits..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none font-mono"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-2 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Categories / Quick Results */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider px-2">
            Suggested Discoveries & Navigation
          </div>

          <div className="space-y-1">
            {filteredLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(item.tab);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-cyan-950/40 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#050814] border border-cyan-900/40 text-cyan-400 group-hover:text-amber-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-100 group-hover:text-cyan-200">
                        {item.label}
                      </div>
                      <div className="text-[10px] font-mono text-cyan-400/70">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}

            {filteredLinks.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-sm">
                No matching topics found for "{query}". You can ask FREEDREAM AI directly!
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-[#050814]/80 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>FREEDREAM Global Index</span>
          <span>Press ESC or click outside to dismiss</span>
        </div>
      </div>
    </div>
  );
};
