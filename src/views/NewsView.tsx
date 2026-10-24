import React, { useState } from 'react';
import { NewsArticle, UserProfile } from '../types';
import { 
  Newspaper, 
  Search, 
  Bookmark, 
  Check, 
  ExternalLink, 
  Clock, 
  Calendar, 
  Globe, 
  ShieldCheck, 
  Share2,
  X,
  ChevronRight
} from 'lucide-react';

interface NewsViewProps {
  articles: NewsArticle[];
  userProfile: UserProfile;
  onBookmarkArticle: (articleId: string) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({
  articles,
  userProfile,
  onBookmarkArticle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  const categories = [
    'All',
    'Nigerian & African Tech',
    'Artificial Intelligence',
    'Space & Astronomy',
    'Scientific Breakthroughs',
    'Robotics & AI'
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = searchQuery.trim() === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* News Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0c1538] via-[#090e29] to-[#050814] border border-cyan-500/30 p-6 glow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                GLOBAL & AFRICAN DEEP-TECH TELEMETRY FEED
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              FREEDREAM <span className="text-amber-400">NEWS WIRE</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Verified scientific breakthroughs, Nigerian hardware engineering milestones, artificial intelligence developments, and astrophysics discoveries from credible research institutions.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#050814] p-3 rounded-2xl border border-slate-800 shrink-0 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Curated & Verified Sources</span>
          </div>
        </div>

        {/* Search Bar & Categories */}
        <div className="mt-6 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news by topic, breakthrough, keyword, or source institution..."
              className="w-full bg-[#050814]/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-mono transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured / Lead Article */}
      {filteredArticles.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <div 
          onClick={() => setActiveArticle(filteredArticles[0])}
          className="relative rounded-3xl overflow-hidden border border-cyan-500/40 bg-[#090e29] cursor-pointer group glow-card transition-all"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-64 md:h-full overflow-hidden bg-slate-900">
              <img
                src={filteredArticles[0].imageUrl}
                alt={filteredArticles[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-mono text-amber-300 border border-amber-500/40 font-semibold">
                FEATURED DISCOVERY
              </div>
            </div>

            <div className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span>{filteredArticles[0].category}</span>
                  <span>•</span>
                  <span>{filteredArticles[0].source}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors leading-tight">
                  {filteredArticles[0].title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {filteredArticles[0].summary}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {filteredArticles[0].date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {filteredArticles[0].readTime}
                  </span>
                </div>

                <span className="text-amber-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                  Read Full Telemetry &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map(article => {
          const isBookmarked = userProfile.savedArticles.includes(article.id);
          return (
            <div
              key={article.id}
              className="rounded-2xl bg-[#090e29]/70 border border-slate-800 hover:border-cyan-500/40 overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 glow-card"
            >
              <div 
                onClick={() => setActiveArticle(article)}
                className="cursor-pointer"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                    {article.category}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-cyan-400/90 font-semibold">{article.source}</span>
                    <span>{article.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white hover:text-cyan-300 line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 mt-2">
                <span className="text-[11px]">{article.readTime}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onBookmarkArticle(article.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isBookmarked
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={isBookmarked ? 'Article Bookmarked' : 'Bookmark Article'}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActiveArticle(article)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono"
                  >
                    Read
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredArticles.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs font-mono bg-[#090e29]/40 rounded-2xl border border-dashed border-slate-800">
            No news dispatches matched your query. Try searching for "Lagos", "AI", "Webb", or "Sensors".
          </div>
        )}
      </div>

      {/* Article Detail Reading Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#090e29] border border-cyan-500/40 rounded-3xl p-6 space-y-5 overflow-y-auto glow-card">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800">
                    {activeArticle.category}
                  </span>
                  <span>•</span>
                  <span>{activeArticle.source}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-2">
                  {activeArticle.title}
                </h2>
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 ml-3"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/80">
              <span>Published: {activeArticle.date}</span>
              <span>Reading: {activeArticle.readTime}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Peer Verified
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              <p className="text-sm sm:text-base font-medium text-cyan-100">
                {activeArticle.summary}
              </p>

              <p>
                Researchers and engineers reporting from {activeArticle.source} emphasize that this breakthrough unlocks new avenues for rapid commercial and educational adoption. By leveraging open architecture standards and decentralized telemetry networks, innovators can implement these findings into actionable prototypes.
              </p>

              <div className="p-4 rounded-xl bg-[#050814] border border-slate-800 space-y-2">
                <h4 className="text-xs font-mono text-amber-400 uppercase font-semibold">
                  Why This Matters for FREEDREAM Innovators:
                </h4>
                <p className="text-xs text-slate-300">
                  Deep-tech breakthroughs thrive when accessible to builders on the ground. You can incorporate the core findings of this research directly into your hardware projects in NovaLab.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => onBookmarkArticle(activeArticle.id)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>
                  {userProfile.savedArticles.includes(activeArticle.id) ? 'Saved in Profile' : 'Bookmark Story'}
                </span>
              </button>

              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
