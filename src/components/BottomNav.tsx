import React from 'react';
import { NavigationTab } from '../types';
import { 
  Home, 
  Cpu, 
  Sparkles, 
  BookOpen, 
  Users, 
  Newspaper, 
  User 
} from 'lucide-react';

interface BottomNavProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'novalab', label: 'NovaLab', icon: <Cpu className="w-5 h-5" /> },
    { id: 'ai', label: 'AI Assist', icon: <Sparkles className="w-5 h-5 text-amber-400" /> },
    { id: 'academy', label: 'Academy', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'hub', label: 'Hub', icon: <Users className="w-5 h-5" /> },
    { id: 'news', label: 'News', icon: <Newspaper className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#050814]/95 backdrop-blur-lg border-t border-cyan-950/80 px-1 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-2xl shadow-cyan-950/90 lg:hidden">
      <div className="max-w-md mx-auto grid grid-cols-7 items-center justify-items-center">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 w-full min-h-[50px] rounded-xl transition-all ${
                isActive 
                  ? 'text-cyan-400 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active top indicator dot */}
              {isActive && (
                <span className="absolute -top-1 w-5 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
              )}
              
              <div className={`p-1 transition-transform ${isActive ? 'scale-110' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[10px] leading-tight font-display tracking-tight truncate max-w-[48px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
