import React, { useState } from 'react';
import { 
  NavigationTab, 
  UserProfile, 
  NewsArticle 
} from '../types';
import { 
  Sparkles, 
  Rocket, 
  Cpu, 
  BookOpen, 
  Users, 
  ArrowRight, 
  Flame, 
  Award, 
  Globe, 
  Bookmark, 
  Check, 
  ExternalLink, 
  ChevronRight, 
  TrendingUp, 
  PlayCircle,
  Share2,
  QrCode
} from 'lucide-react';

interface DashboardViewProps {
  userProfile: UserProfile;
  onNavigate: (tab: NavigationTab) => void;
  newsArticles: NewsArticle[];
  onBookmarkIdea: (idea: string) => void;
  onOpenPublishModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  onNavigate,
  newsArticles,
  onBookmarkIdea,
  onOpenPublishModal
}) => {
  const [bookmarkedToday, setBookmarkedToday] = useState(false);

  // Daily Innovation Idea
  const ideaOfTheDay = {
    title: 'Acoustic Ultrasonic Anti-Poaching & Wildlife Boundary Sensor',
    category: 'Robotics & Conservation',
    description: 'A solar-charged edge device using ultrasonic acoustic sensors to detect off-road vehicle engines and chain-saw vibrations in protected wildlife reserves, beaming coordinates via satellite or LoRa.',
    impact: 'Zero power grid requirement, detects intrusion up to 2.5 km away before habitat damage occurs.',
    materialsNeeded: 'ESP32, MEMS Acoustic Sensor, SX1276 LoRa, 6W Solar Panel, IP67 Case',
    estimatedCostUsd: 65,
    estimatedCostNgn: 97500,
  };

  const handleBookmark = () => {
    onBookmarkIdea(ideaOfTheDay.title);
    setBookmarkedToday(true);
    setTimeout(() => setBookmarkedToday(false), 3000);
  };

  const currencySymbol = userProfile.currency === 'USD' ? '$' : '₦';
  const currencyRate = userProfile.currency === 'USD' ? 1 : 1500;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* 1. Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1538] via-[#090e29] to-[#050814] border border-cyan-500/30 p-6 sm:p-8 glow-card">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              FREEDREAM NEURAL PLATFORM • ONLINE
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
              Welcome to <span className="bg-gradient-to-r from-cyan-300 via-white to-amber-400 bg-clip-text text-transparent">FREEDREAM</span>
            </h1>
            
            <p className="text-amber-400 font-mono text-sm tracking-widest uppercase font-semibold">
              "Dream Without Limit."
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore breakthroughs in robotics, artificial intelligence, clean tech, and space exploration. Build your next real-world invention in NovaLab today.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('novalab')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Cpu className="w-4 h-4" />
                <span>Launch NOVALAB</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('ai')}
                className="px-5 py-2.5 rounded-xl bg-[#090e29] hover:bg-[#0f173d] border border-amber-500/40 text-amber-300 hover:text-amber-200 font-medium text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ask FREEDREAM AI</span>
              </button>

              <button
                onClick={onOpenPublishModal}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 border border-amber-400/50 text-amber-300 hover:text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Publish / Share App 🚀</span>
              </button>
            </div>
          </div>

          {/* Quick Learning & Inventor Badge Card */}
          <div className="bg-[#050814]/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 md:w-72 shrink-0 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase">Inventor Status</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                Lv. {userProfile.level}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center text-2xl">
                {userProfile.avatar}
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{userProfile.name}</h4>
                <p className="text-xs text-cyan-400 font-mono">{userProfile.role}</p>
              </div>
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-800/80 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1 text-slate-400">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Daily Streak
                </span>
                <span className="font-mono text-amber-400 font-semibold">{userProfile.streakDays} Days</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1 text-slate-400">
                  <Award className="w-3.5 h-3.5 text-cyan-400" /> Total XP
                </span>
                <span className="font-mono text-cyan-400 font-semibold">{userProfile.xp} XP</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('academy')}
              className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Resume Academy Courses</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 1.5. Live Online Publishing & Universal Sharing Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d173d] via-[#090e29] to-[#070c24] border border-cyan-500/40 glow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm sm:text-base font-display">
                Online Publishing & Public App Sharing
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                Public Live
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              FREEDREAM is live online. Share the public link with anyone on Android, tablet, or PC without needing an account.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent("🚀 Discover FREEDREAM Technologies — 'Dream Without Limit.' Explore AI discoveries, NovaLab invention laboratory, and robotics circuits: https://ais-pre-hrinjvogm37rm4nu4bx2vq-288753434783.europe-west2.run.app")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>WhatsApp</span>
          </a>

          <a
            href={`https://t.me/share/url?url=https://ais-pre-hrinjvogm37rm4nu4bx2vq-288753434783.europe-west2.run.app&text=${encodeURIComponent("🚀 Discover FREEDREAM Technologies: Dream Without Limit.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>Telegram</span>
          </a>

          <button
            onClick={onOpenPublishModal}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold font-mono text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Open Share Hub</span>
          </button>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-white">
              Quick-Access NOVALAB
            </h2>
          </div>
          <button
            onClick={() => onNavigate('novalab')}
            className="text-xs font-mono text-cyan-400 hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <span>Open All Tools</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div 
            onClick={() => onNavigate('novalab')}
            className="p-4 rounded-2xl bg-[#090e29]/70 hover:bg-[#0c1538] border border-cyan-950 hover:border-cyan-500/40 cursor-pointer transition-all group glow-card"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-semibold text-sm text-white group-hover:text-cyan-300">
              AI Invention Lab
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Generate original inventions with schematics, BOM, and code.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('novalab')}
            className="p-4 rounded-2xl bg-[#090e29]/70 hover:bg-[#0c1538] border border-cyan-950 hover:border-cyan-500/40 cursor-pointer transition-all group glow-card"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-white group-hover:text-cyan-300">
              Arduino Studio
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Learn C++ circuits, microcontrollers, and pinout diagrams.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('novalab')}
            className="p-4 rounded-2xl bg-[#090e29]/70 hover:bg-[#0c1538] border border-cyan-950 hover:border-cyan-500/40 cursor-pointer transition-all group glow-card"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <PlayCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-sm text-white group-hover:text-cyan-300">
              Python Playground
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Run and test MicroPython & AI robotics algorithms live.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('novalab')}
            className="p-4 rounded-2xl bg-[#090e29]/70 hover:bg-[#0c1538] border border-cyan-950 hover:border-cyan-500/40 cursor-pointer transition-all group glow-card"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-sm text-white group-hover:text-cyan-300">
              Project Tracker
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Organize milestones, bill of materials, and experimental logs.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Innovation Idea of the Day */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d163d] to-[#070b1e] border border-amber-500/30 p-5 glow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono border border-amber-500/30 font-semibold">
                IDEA OF THE DAY
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {ideaOfTheDay.category}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              {ideaOfTheDay.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {ideaOfTheDay.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-slate-400">
              <span>
                Estimated Cost: <strong className="text-amber-400">
                  {userProfile.currency === 'USD' 
                    ? `$${ideaOfTheDay.estimatedCostUsd}` 
                    : `₦${ideaOfTheDay.estimatedCostNgn.toLocaleString()}`}
                </strong>
              </span>
              <span>•</span>
              <span className="text-emerald-400">{ideaOfTheDay.impact}</span>
            </div>
          </div>

          <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onNavigate('novalab')}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Build in NovaLab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleBookmark}
              className={`flex-1 sm:flex-none px-3 py-2 rounded-xl border text-xs font-mono transition-all flex items-center justify-center gap-1.5 ${
                bookmarkedToday
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {bookmarkedToday ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{bookmarkedToday ? 'Saved to Profile' : 'Bookmark'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Technology Discoveries: AI & Space Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Artificial Intelligence Discoveries */}
        <div className="p-5 rounded-2xl bg-[#090e29]/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-base font-display">
                Artificial Intelligence Frontiers
              </h3>
            </div>
            <button 
              onClick={() => onNavigate('news')}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              More
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#050814] border border-slate-800/80 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400/80 mb-1">
                <span>Transformers 4.0</span>
                <span>MIT / DeepMind</span>
              </div>
              <h4 className="text-xs font-semibold text-white">
                Zero-Shot Multimodal Models Synthesize Mathematical Proofs
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Combining symbolic theorem solvers with generative models reduces complex lemma verification from months to seconds.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#050814] border border-slate-800/80 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-400/80 mb-1">
                <span>Edge AI Microchips</span>
                <span>RISC-V Robotics</span>
              </div>
              <h4 className="text-xs font-semibold text-white">
                Ultra-Low-Power Neural Core Operates on Under 50 Milliwatts
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Enables continuous agricultural crop pest classification on mini-solar cells without cloud latency.
              </p>
            </div>
          </div>
        </div>

        {/* Space & Astronomy Updates */}
        <div className="p-5 rounded-2xl bg-[#090e29]/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-base font-display">
                Space & Astronomy Updates
              </h3>
            </div>
            <button 
              onClick={() => onNavigate('news')}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              More
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#050814] border border-slate-800/80 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400/80 mb-1">
                <span>James Webb Space Telescope</span>
                <span>Exoplanet K2-18b</span>
              </div>
              <h4 className="text-xs font-semibold text-white">
                Spectroscopy Maps Carbon Dioxide & Methane in Habitable Zone
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                High-confidence detection points to possible Hycean planetary ocean conditions 120 light years away.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#050814] border border-slate-800/80 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-400/80 mb-1">
                <span>Pan-African Satellite Constellation</span>
                <span>AfriSat-1 Launch</span>
              </div>
              <h4 className="text-xs font-semibold text-white">
                Joint Telemetry Grid Deployed for Precision Weather & Soil Mapping
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                NASRDA and SANSA orbiters achieve synchronized ground relay across sub-Saharan farming corridors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Daily Technology News Spotlight */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-white">
              Daily Technology News Spotlight
            </h2>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs font-mono text-cyan-400 hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <span>View All News</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {newsArticles.slice(0, 3).map((article) => (
            <div
              key={article.id}
              onClick={() => onNavigate('news')}
              className="group cursor-pointer rounded-2xl bg-[#090e29]/70 border border-slate-800 hover:border-cyan-500/40 overflow-hidden flex flex-col transition-all hover:-translate-y-1 glow-card"
            >
              <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                  {article.category}
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{article.source}</span>
                    <span>{article.date}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-300 line-clamp-2 leading-snug">
                    {article.title}
                  </h4>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span>{article.readTime}</span>
                  <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform text-amber-400">
                    Read Story &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
