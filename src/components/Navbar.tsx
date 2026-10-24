import React from 'react';
import { Logo } from './Logo';
import { Currency, NavigationTab, UserProfile } from '../types';
import { 
  Bell, 
  Search, 
  Smartphone, 
  Laptop, 
  Zap, 
  Sparkles,
  Share2 
} from 'lucide-react';

interface NavbarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  userProfile: UserProfile;
  onToggleCurrency: () => void;
  onTogglePhoneFrame: () => void;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onOpenPublishModal: () => void;
  unreadNotificationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  userProfile,
  onToggleCurrency,
  onTogglePhoneFrame,
  onOpenNotifications,
  onOpenSearch,
  onOpenPublishModal,
  unreadNotificationsCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#050814]/85 backdrop-blur-md border-b border-cyan-950/70 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Slogan */}
        <div 
          onClick={() => onTabChange('dashboard')} 
          className="cursor-pointer transition-opacity hover:opacity-90 flex items-center gap-2"
        >
          <Logo size="sm" showSlogan={false} />
          <div className="hidden sm:block">
            <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-cyan-400 font-semibold block leading-none">
              Technologies
            </span>
            <span className="text-[9px] tracking-wider text-slate-400 font-mono">
              "Dream Without Limit."
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links (hidden on mobile, available on larger viewports) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#090e29]/70 p-1 rounded-xl border border-cyan-950/60 text-xs font-medium">
          {(
            [
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'novalab', label: 'NovaLab 🔬' },
              { id: 'ai', label: 'FREEDREAM AI' },
              { id: 'academy', label: 'Academy' },
              { id: 'hub', label: 'Innovation Hub' },
              { id: 'news', label: 'Tech News' },
            ] as const
          ).map(tab => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-xs"
            title="Search FREEDREAM (Ctrl+K)"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline font-mono text-[11px] text-slate-400">Search</span>
          </button>

          {/* Share & Publish App Button */}
          <button
            onClick={onOpenPublishModal}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-amber-500/20 hover:from-cyan-500/30 hover:to-amber-500/30 border border-cyan-400/50 text-cyan-200 hover:text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm glow-cyan-sm"
            title="Publish & Share FREEDREAM"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Share App</span>
          </button>

          {/* Currency Toggle */}
          <button
            onClick={onToggleCurrency}
            className="px-2.5 py-1.5 rounded-lg bg-[#090e29] hover:bg-[#0c1538] border border-amber-500/30 text-amber-400 hover:text-amber-300 font-mono text-xs font-semibold flex items-center gap-1 transition-all shadow-sm"
            title="Switch currency preference (USD / NGN)"
          >
            <span>{userProfile.currency === 'USD' ? '$ USD' : '₦ NGN'}</span>
          </button>

          {/* Phone Frame Simulator Toggle */}
          <button
            onClick={onTogglePhoneFrame}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
            title={userProfile.phoneFrameMode ? "Switch to Fullscreen Responsive View" : "Simulate Android Mobile Viewport"}
          >
            {userProfile.phoneFrameMode ? (
              <Laptop className="w-4 h-4 text-cyan-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[10px] text-black font-extrabold flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Profile Quick Access */}
          <button
            onClick={() => onTabChange('profile')}
            className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl transition-all border ${
              currentTab === 'profile'
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="text-base select-none">{userProfile.avatar}</span>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-medium leading-none text-white">
                {userProfile.name}
              </span>
              <span className="text-[10px] text-amber-400 font-mono leading-none mt-0.5">
                Lv.{userProfile.level} • {userProfile.xp} XP
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
