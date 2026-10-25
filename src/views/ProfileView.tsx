import React, { useState } from 'react';
import { UserProfile, InventionProject, NewsArticle } from '../types';
import { 
  User, 
  Settings, 
  Award, 
  Bookmark, 
  Cpu, 
  Flame, 
  Edit3, 
  Check, 
  DollarSign, 
  Smartphone, 
  Laptop, 
  Sparkles, 
  Share2, 
  ShieldCheck, 
  Trash2,
  ChevronRight,
  MapPin
} from 'lucide-react';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  savedProjects: InventionProject[];
  newsArticles: NewsArticle[];
  onRemoveProject: (projectId: string) => void;
  onRemoveBookmark: (articleId: string) => void;
  onRemoveIdea: (idea: string) => void;
  onOpenPublishModal: () => void;
  onNavigateToOwner?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  savedProjects,
  newsArticles,
  onRemoveProject,
  onRemoveBookmark,
  onRemoveIdea,
  onOpenPublishModal,
  onNavigateToOwner
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [name, setName] = useState(userProfile.name);
  const [role, setRole] = useState(userProfile.role);
  const [location, setLocation] = useState(userProfile.location);
  const [bio, setBio] = useState(userProfile.bio);
  const [avatar, setAvatar] = useState(userProfile.avatar);

  const avatarOptions = [
    { emoji: '👨🏾‍🔬', label: 'Robotics Scientist' },
    { emoji: '👩🏾‍💻', label: 'AI Software Engineer' },
    { emoji: '⚡', label: 'CleanTech Pioneer' },
    { emoji: '🛰️', label: 'Astrophysics Explorer' },
    { emoji: '🌱', label: 'Agritech Innovator' },
    { emoji: '🦾', label: 'Bionics Specialist' },
    { emoji: '🚀', label: 'DeepTech Founder' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      role,
      location,
      bio,
      avatar
    });
    setIsEditing(false);
  };

  const bookmarkedArticles = newsArticles.filter(a => userProfile.savedArticles.includes(a.id));

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Profile Header Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0c1538] via-[#090e29] to-[#050814] border border-cyan-500/30 p-6 glow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/30 to-amber-500/20 border-2 border-cyan-400/60 flex items-center justify-center text-4xl shadow-xl shadow-cyan-950/60">
                {userProfile.avatar}
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-500 text-black font-mono text-[10px] font-extrabold border border-amber-300">
                Lv.{userProfile.level}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {userProfile.name}
                </h1>
                <span className="text-xs font-mono text-cyan-400">
                  {userProfile.handle}
                </span>
              </div>
              
              <p className="text-xs text-amber-300 font-mono font-medium">
                {userProfile.role}
              </p>

              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  {userProfile.location}
                </span>
                <span>•</span>
                <span className="text-cyan-300">
                  {userProfile.xp} XP Accumulated
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed italic border-t border-slate-800/80 pt-3">
          "{userProfile.bio}"
        </p>

        {/* Navigation Tabs */}
        <div className="mt-6 flex items-center gap-2 border-t border-slate-800/80 pt-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-cyan-500 text-black font-semibold shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-amber-500 text-black font-semibold shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Ideas & Articles ({userProfile.bookmarkedIdeas.length + userProfile.savedArticles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-slate-100 text-black font-semibold shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>App Preferences</span>
          </button>
        </div>
      </div>

      {/* Profile Edit Drawer / Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-[#090e29] border border-cyan-500/40 space-y-4 glow-card animate-in fade-in">
          <h3 className="font-bold text-base text-white font-display">
            Update Personal Identity
          </h3>

          <div className="space-y-2">
            <label className="block text-xs font-mono text-slate-400">CHOOSE AVATAR</label>
            <div className="flex flex-wrap gap-2">
              {avatarOptions.map(opt => (
                <button
                  type="button"
                  key={opt.emoji}
                  onClick={() => setAvatar(opt.emoji)}
                  className={`p-2 rounded-xl text-2xl border transition-all ${
                    avatar === opt.emoji
                      ? 'bg-cyan-950 border-cyan-400 scale-110 shadow-md'
                      : 'bg-[#050814] border-slate-800 hover:border-slate-700'
                  }`}
                  title={opt.label}
                >
                  {opt.emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">FULL NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">SPECIALTY / ROLE</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">LOCATION</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">INNOVATION BIO</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* ================= TAB 1: OVERVIEW & STATS ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-[#090e29]/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE PROJECTS</span>
              <div className="text-xl font-bold font-mono text-white">{savedProjects.length}</div>
              <span className="text-[10px] font-mono text-cyan-400">NovaLab Blueprints</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#090e29]/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">DAILY STREAK</span>
              <div className="text-xl font-bold font-mono text-amber-400 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{userProfile.streakDays} Days</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Daily Inventor Habit</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#090e29]/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">ACADEMY MODULES</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {userProfile.completedCourses.length} Passed
              </div>
              <span className="text-[10px] font-mono text-slate-400">Mastery Certifications</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#090e29]/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">COMMUNITY UPVOTES</span>
              <div className="text-xl font-bold font-mono text-cyan-400">
                84 Received
              </div>
              <span className="text-[10px] font-mono text-slate-400">Peer Recognition</span>
            </div>
          </div>

          {/* Active NovaLab Projects Summary */}
          <div className="p-5 rounded-2xl bg-[#090e29]/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base font-display">
                My Active Invention Projects
              </h3>
              <span className="text-xs font-mono text-cyan-400">
                {savedProjects.length} Enrolled
              </span>
            </div>

            <div className="space-y-2">
              {savedProjects.map(proj => (
                <div
                  key={proj.id}
                  className="p-3.5 rounded-xl bg-[#050814] border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-800">
                        {proj.category}
                      </span>
                      <h4 className="font-semibold text-white">{proj.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{proj.abstract}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                      {proj.stage} ({proj.progressPercentage}%)
                    </span>
                    <button
                      onClick={() => onRemoveProject(proj.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: SAVED IDEAS & ARTICLES ================= */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          {/* Saved Ideas of the Day */}
          <div className="p-5 rounded-2xl bg-[#090e29]/80 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-base font-display flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Bookmarked Innovation Ideas ({userProfile.bookmarkedIdeas.length})</span>
            </h3>

            <div className="space-y-2">
              {userProfile.bookmarkedIdeas.map((idea, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#050814] border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-slate-200 font-medium">{idea}</span>
                  </div>

                  <button
                    onClick={() => onRemoveIdea(idea)}
                    className="text-slate-500 hover:text-rose-400 text-xs font-mono p-1"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {userProfile.bookmarkedIdeas.length === 0 && (
                <div className="py-6 text-center text-slate-500 text-xs font-mono">
                  No ideas saved yet. Explore the Dashboard to bookmark ideas of the day!
                </div>
              )}
            </div>
          </div>

          {/* Saved News Dispatches */}
          <div className="p-5 rounded-2xl bg-[#090e29]/80 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-base font-display flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-cyan-400" />
              <span>Saved Technology News Articles ({bookmarkedArticles.length})</span>
            </h3>

            <div className="space-y-2">
              {bookmarkedArticles.map(art => (
                <div
                  key={art.id}
                  className="p-3 rounded-xl bg-[#050814] border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-cyan-400">{art.source} • {art.date}</span>
                    <h4 className="font-semibold text-white">{art.title}</h4>
                  </div>

                  <button
                    onClick={() => onRemoveBookmark(art.id)}
                    className="text-slate-500 hover:text-rose-400 text-xs font-mono p-1"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {bookmarkedArticles.length === 0 && (
                <div className="py-6 text-center text-slate-500 text-xs font-mono">
                  No news articles bookmarked yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: APP PREFERENCES & SETTINGS ================= */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-[#090e29]/80 border border-slate-800 space-y-6 glow-card">
          <div className="space-y-1 border-b border-slate-800 pb-4">
            <h3 className="font-bold text-lg text-white font-display">
              Application & Platform Preferences
            </h3>
            <p className="text-xs text-slate-400">
              Configure currency units, simulator frame viewport, neural engine telemetry, and theme preferences.
            </p>
          </div>

          <div className="space-y-4">
            {/* Currency setting */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#050814] border border-slate-800">
              <div>
                <h4 className="text-sm font-semibold text-white">Default Currency Display</h4>
                <p className="text-xs text-slate-400">Used for Bill of Materials (BOM) & project estimation.</p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => onUpdateProfile({ currency: 'USD' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    userProfile.currency === 'USD'
                      ? 'bg-amber-500 text-black font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  $ USD
                </button>
                <button
                  onClick={() => onUpdateProfile({ currency: 'NGN' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    userProfile.currency === 'NGN'
                      ? 'bg-amber-500 text-black font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ₦ NGN (Naira)
                </button>
              </div>
            </div>

            {/* Viewport Frame Mode */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#050814] border border-slate-800">
              <div>
                <h4 className="text-sm font-semibold text-white">Android Mobile Frame Simulator</h4>
                <p className="text-xs text-slate-400">Simulate Android mobile screen constraints or expand to full fluid width.</p>
              </div>

              <button
                onClick={() => onUpdateProfile({ phoneFrameMode: !userProfile.phoneFrameMode })}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                  userProfile.phoneFrameMode
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'bg-slate-900 text-slate-300 border border-slate-700'
                }`}
              >
                {userProfile.phoneFrameMode ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                <span>{userProfile.phoneFrameMode ? 'Handset Frame Active' : 'Fluid Responsive View'}</span>
              </button>
            </div>

            {/* Online Publishing & App Sharing */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#0c1538] to-[#070c22] border border-cyan-500/40 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">Online Publishing & Public Sharing</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">Generate shareable links, custom domains, QR codes, and WhatsApp/Telegram distribution.</p>
              </div>

              <button
                onClick={onOpenPublishModal}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Open Publishing Hub</span>
              </button>
            </div>

            {/* FREEDREAM Owner Control Center Access */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#171207] via-[#0f172a] to-[#050814] border-2 border-amber-500/50 gap-3 shadow-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base">👑</span>
                  <h4 className="text-sm font-bold text-amber-300 font-display">FREEDREAM Owner Control Center</h4>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                    Restricted Suite
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Private executive suite: news management, system-wide feature flags, maintenance mode, broadcasts, and security audit logs.
                </p>
              </div>

              {onNavigateToOwner && (
                <button
                  onClick={onNavigateToOwner}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 shrink-0 shadow-md transition-all cursor-pointer"
                >
                  <span>👑 Launch Owner Suite</span>
                </button>
              )}
            </div>

            {/* Neural Engine Status */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#050814] border border-slate-800">
              <div>
                <h4 className="text-sm font-semibold text-white">FREEDREAM Neural Backend</h4>
                <p className="text-xs text-slate-400">Powered by Gemini 3.1 Flash-Lite with resilient failover.</p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active & Encrypted</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500 text-center">
            FREEDREAM TECHNOLOGIES • "Dream Without Limit." • Platform Version 2.5.0
          </div>
        </div>
      )}
    </div>
  );
};
