import React, { useState } from 'react';
import { 
  UserProfile, 
  CommunityProject, 
  TechChallenge, 
  MaterialItem 
} from '../types';
import { 
  Users, 
  Rocket, 
  Award, 
  ThumbsUp, 
  MessageSquare, 
  Plus, 
  ExternalLink, 
  Share2, 
  Check, 
  ChevronRight, 
  Code, 
  MapPin, 
  Calendar, 
  ShieldAlert,
  X
} from 'lucide-react';

interface InnovationHubViewProps {
  userProfile: UserProfile;
  projects: CommunityProject[];
  challenges: TechChallenge[];
  onVoteProject: (projectId: string) => void;
  onSubmitProject: (projectData: Partial<CommunityProject>) => void;
}

export const InnovationHubView: React.FC<InnovationHubViewProps> = ({
  userProfile,
  projects,
  challenges,
  onVoteProject,
  onSubmitProject,
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'challenges'>('projects');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<CommunityProject | null>(null);
  
  // Submit modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Robotics' | 'AI & Software' | 'Agritech' | 'Clean Energy' | 'Healthcare' | 'Space'>('Robotics');
  const [location, setLocation] = useState(userProfile.location || 'Lagos, Nigeria');
  const [summary, setSummary] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');

  const categories = ['All', 'Robotics', 'Agritech', 'Clean Energy', 'Healthcare', 'AI & Software'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary || !solution) return;

    onSubmitProject({
      title,
      author: userProfile.name,
      authorAvatar: userProfile.avatar,
      location,
      category,
      summary,
      problem,
      solution,
      codeSnippet: codeSnippet || undefined,
      materials: [
        { name: 'Core Microcontroller / Module', costUsd: 15, costNgn: 22500 },
        { name: 'Sensor Array & Power Management', costUsd: 30, costNgn: 45000 },
      ]
    });

    setShowSubmitModal(false);
    setTitle('');
    setSummary('');
    setProblem('');
    setSolution('');
    setCodeSnippet('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Hub Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0c1538] via-[#090e29] to-[#050814] border border-cyan-500/30 p-6 glow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                GLOBAL INVENTORS & COLLABORATIVE COMMONS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              FREEDREAM <span className="text-amber-400">INNOVATION HUB</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Showcase verified inventions, discover hardware breakthroughs from inventors across Nigeria and worldwide, collaborate on open blueprints, and compete in technology challenges.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs font-mono flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Submit an Idea</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex items-center gap-2 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-cyan-500 text-black font-semibold shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>Community Inventions ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'challenges'
                ? 'bg-amber-500 text-black font-semibold shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Active Tech Challenges ({challenges.length})</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: COMMUNITY INVENTIONS ================= */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-mono text-slate-400 uppercase mr-1">Filter Domain:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-mono transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-[#090e29]/90 to-[#050814]/90 p-8 sm:p-14 text-center flex flex-col items-center justify-center space-y-4 glow-card">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
                <Rocket className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Welcome to the FREEDREAM Innovation Hub.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Be among the first to share your invention, explore ideas, and help build the future of technology.
                </p>
              </div>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs font-mono flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>Submit an Idea</span>
              </button>
            </div>
          ) : (
            /* Inventions Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map(proj => {
                const hasVoted = proj.votedUserIds?.includes('current_user') || false;
                return (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-[#090e29]/80 border border-slate-800 hover:border-cyan-500/40 flex flex-col justify-between space-y-4 glow-card transition-all"
                  >
                    <div className="space-y-3">
                      {/* Header info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{proj.authorAvatar}</span>
                          <div>
                            <div className="text-xs font-semibold text-white">{proj.author}</div>
                            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                              <MapPin className="w-3 h-3 text-cyan-400" />
                              <span>{proj.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800">
                            {proj.category}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                            {proj.stage}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white font-display">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                          {proj.summary}
                        </p>
                      </div>

                      {/* Problem highlight pill */}
                      <div className="p-2.5 rounded-xl bg-[#050814] border border-slate-800/80 text-xs text-slate-400">
                        <strong className="text-amber-400 block text-[10px] font-mono">TARGET CHALLENGE:</strong>
                        <span className="line-clamp-2">{proj.problem}</span>
                      </div>
                    </div>

                    {/* Actions & Live Vote Counter */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => onVoteProject(proj.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                          hasVoted
                            ? 'bg-amber-500 text-black font-semibold shadow-md'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-black' : ''}`} />
                        <span>{proj.votes} Upvotes</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedProject(proj)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Inspect Blueprint</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: TECH CHALLENGES ================= */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {challenges.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-[#090e29]/70 to-[#050814]/70 p-8 sm:p-14 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-display text-white">
                No Active Sponsored Challenges
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
                Official innovation competitions, hackathons, and sponsored challenge programs will be listed here once independently verified and confirmed.
              </p>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs font-mono transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>Submit an Idea</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {challenges.map(chal => (
                <div
                  key={chal.id}
                  className="p-5 rounded-2xl bg-[#090e29]/80 border border-amber-500/30 hover:border-amber-500/60 flex flex-col justify-between space-y-4 glow-card transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {chal.badge}
                      </span>
                      <span className="text-slate-400">Deadline: {chal.deadline}</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white font-display">
                        {chal.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 font-mono">
                        Sponsor: <span className="text-cyan-300">{chal.sponsor}</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {chal.description}
                    </p>

                    <div className="p-3 rounded-xl bg-[#050814] border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">INNOVATION PRIZE POOL</span>
                      <div className="text-base font-bold text-amber-400 font-mono">
                        {chal.prizePool}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {chal.focusAreas.map((area, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setShowSubmitModal(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs font-mono shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-black" />
                      <span>Submit an Idea</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Blueprint Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#090e29] border border-cyan-500/40 rounded-3xl p-6 space-y-5 overflow-y-auto glow-card">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800">
                  {selectedProject.category} • Stage: {selectedProject.stage}
                </span>
                <h2 className="text-xl font-bold font-display text-white mt-1">
                  {selectedProject.title}
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Designed by {selectedProject.author} ({selectedProject.location})
                </p>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#050814] border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-rose-400 uppercase font-semibold">Problem Addressed:</span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedProject.problem}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#050814] border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">Technical Architecture & Solution:</span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedProject.solution}</p>
              </div>

              {selectedProject.materials && selectedProject.materials.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase text-cyan-400 font-semibold">Bill of Materials</h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#050814] text-slate-400 font-mono">
                        <tr>
                          <th className="p-2.5">Component</th>
                          <th className="p-2.5 text-right">Cost (USD)</th>
                          <th className="p-2.5 text-right">Cost (NGN)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 bg-[#090e29]/50">
                        {selectedProject.materials.map((m, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 text-white font-medium">{m.name}</td>
                            <td className="p-2.5 text-right font-mono text-slate-300">${m.costUsd}</td>
                            <td className="p-2.5 text-right font-mono text-amber-400">₦{m.costNgn.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedProject.codeSnippet && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase text-cyan-400 font-semibold">Open Source Code Blueprint</h4>
                  <pre className="p-4 rounded-xl bg-[#030611] border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto">
                    <code>{selectedProject.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono"
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Invention Idea Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl max-h-[90vh] bg-[#090e29] border border-amber-500/40 rounded-3xl p-6 space-y-4 overflow-y-auto glow-card">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white font-display flex items-center gap-2">
                <Rocket className="w-5 h-5 text-amber-400" />
                <span>Submit Invention to FREEDREAM Commons</span>
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">INVENTION TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solar Telemetry Soil Health Beacon"
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Robotics">Robotics & Mechatronics</option>
                    <option value="Agritech">Agricultural Tech</option>
                    <option value="Clean Energy">Clean Energy</option>
                    <option value="Healthcare">Healthcare & Bionics</option>
                    <option value="AI & Software">AI & Software</option>
                    <option value="Space">Space</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">ORIGIN LOCATION</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    placeholder="e.g. Lagos, Nigeria"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">SUMMARY</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="A concise 1-sentence description"
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">PROBLEM BEING SOLVED</label>
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="What limitation or challenge does this solve?"
                  rows={2}
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">TECHNICAL SOLUTION & ARCHITECTURE</label>
                <textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Sensors, microcontroller, power source, and operational logic."
                  rows={3}
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">CODE SNIPPET OR SENSOR LOGIC (OPTIONAL)</label>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="Arduino C++ or Python code snippet"
                  rows={3}
                  className="w-full bg-[#030611] border border-slate-700 rounded-xl p-2 font-mono text-xs text-cyan-300 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono shadow-md"
                >
                  Publish Invention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
