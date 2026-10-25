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
  const [categories, setCategories] = useState<string[]>([
    'All',
    'Global Technology',
    'Nigerian Technology',
    'Artificial Intelligence',
    'Space and Astronomy',
    'Science and Innovation',
    'Robotics and Electronics'
  ]);

  // Fetch dynamic owner-managed categories
  React.useEffect(() => {
    fetch('/api/news/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(['All', ...data.categories]);
        }
      })
      .catch(() => {
        // Fallback to default
      });
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
    const matchesSearch = searchQuery.trim() === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.fullText && article.fullText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      article.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* News Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0c1538] via-[#090e29] to-[#050814] border border-cyan-500/30 p-6 glow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                GLOBAL & AFRICAN DEEP-TECH TELEMETRY FEED
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
              FREEDREAM <span className="text-amber-400">NEWS</span>
            </h1>
            <p className="text-amber-400 font-mono text-xs sm:text-sm tracking-wide font-medium">
              "Your World. Your Technology. Your Future."
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              Verified technological breakthroughs, African hardware engineering milestones, artificial intelligence developments, and scientific discoveries.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#050814] p-3 rounded-2xl border border-slate-800 shrink-0 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Owner Verified Publications</span>
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
                className={`px-3 py-1.5 rounded-xl font-mono transition-all shrink-0 cursor-pointer ${
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
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono cursor-pointer transition-colors"
                  >
                    Read Full Story
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredArticles.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 text-xs font-mono bg-[#090e29]/40 rounded-3xl border border-dashed border-slate-800 space-y-2">
            <Newspaper className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No published news articles in this section.</p>
            <p className="text-slate-400">Check back soon or try selecting a different category tab.</p>
          </div>
        )}
      </div>

      {/* Article Detail Reading Page / Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl max-h-[92vh] bg-[#090e29] border border-cyan-500/40 rounded-3xl p-5 sm:p-8 space-y-5 overflow-y-auto glow-card">
            {/* Header info & Back button */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 gap-3">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {activeArticle.category}
                  </span>
                  <span>•</span>
                  <span className="text-slate-300 font-semibold">{activeArticle.source}</span>
                  {activeArticle.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px]">
                      🌟 Featured
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-display text-white leading-tight">
                  {activeArticle.title}
                </h2>
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 cursor-pointer transition-colors"
                title="Back to FREEDREAM NEWS"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Image when available */}
            {activeArticle.imageUrl && (
              <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                <img
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as any).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Meta bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 py-2 border-y border-slate-800/80">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  {activeArticle.date}
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {activeArticle.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Native Share Button */}
                <button
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: activeArticle.title,
                          text: activeArticle.summary,
                          url: window.location.href,
                        });
                      } catch (e) {
                        // user cancelled
                      }
                    } else {
                      navigator.clipboard.writeText(`${activeArticle.title} - ${window.location.href}`);
                      alert('Article headline and link copied to clipboard!');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Share</span>
                </button>

                {/* Bookmark Button */}
                <button
                  onClick={() => onBookmarkArticle(activeArticle.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                    userProfile.savedArticles.includes(activeArticle.id)
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{userProfile.savedArticles.includes(activeArticle.id) ? 'Bookmarked' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* Summary Highlight */}
            {activeArticle.summary && (
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
                <p className="text-xs sm:text-sm font-semibold text-cyan-200 leading-relaxed">
                  {activeArticle.summary}
                </p>
              </div>
            )}

            {/* Full Article Text */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {activeArticle.fullText ? (
                <div className="whitespace-pre-wrap leading-relaxed text-slate-300 space-y-3">
                  {activeArticle.fullText}
                </div>
              ) : (
                <p className="text-slate-400 italic">
                  Additional reporting and telemetry for this breakthrough are published directly through the source institution below.
                </p>
              )}
            </div>

            {/* Footer with Source link and Back to News button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800">
              {activeArticle.url ? (
                <a
                  href={activeArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Read on {activeArticle.source}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div />
              )}

              <button
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-black font-extrabold text-xs font-mono cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Back to FREEDREAM NEWS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
