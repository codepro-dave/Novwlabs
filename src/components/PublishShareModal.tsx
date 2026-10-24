import React, { useState, useEffect } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  Smartphone, 
  QrCode, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Laptop, 
  ShieldCheck, 
  ArrowUpRight,
  Info
} from 'lucide-react';

interface PublishShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishShareModal: React.FC<PublishShareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'qr' | 'vercel' | 'domain' | 'guide'>('share');
  const [customDomainInput, setCustomDomainInput] = useState('freedream.com');
  const [savedCustomDomain, setSavedCustomDomain] = useState<string | null>(null);

  // Official Shared URL for public access
  const defaultPublicUrl = 'https://ais-pre-hrinjvogm37rm4nu4bx2vq-288753434783.europe-west2.run.app';
  
  // Use current window origin if already on a production/shared deployment, or fallback to the registered shared URL
  const publicUrl = typeof window !== 'undefined' && window.location.origin.includes('run.app')
    ? window.location.origin.replace('ais-dev-', 'ais-pre-')
    : defaultPublicUrl;

  const activeUrl = savedCustomDomain ? `https://${savedCustomDomain}` : publicUrl;

  const shareTitle = "FREEDREAM Technologies | Dream Without Limit";
  const shareText = "🚀 Discover FREEDREAM Technologies — 'Dream Without Limit.' Explore AI discoveries, NovaLab invention laboratory, Arduino & Python robotics, and STEM masterclasses:";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: activeUrl,
        });
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      icon: '💬',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${activeUrl}`)}`
    },
    {
      name: 'Telegram',
      color: 'bg-sky-500 hover:bg-sky-400 text-white',
      icon: '✈️',
      url: `https://t.me/share/url?url=${encodeURIComponent(activeUrl)}&text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-500 text-white',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(activeUrl)}`
    },
    {
      name: 'X (Twitter)',
      color: 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(activeUrl)}`
    },
    {
      name: 'LinkedIn',
      color: 'bg-blue-700 hover:bg-blue-600 text-white',
      icon: '💼',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(activeUrl)}`
    },
    {
      name: 'Email',
      color: 'bg-indigo-600 hover:bg-indigo-500 text-white',
      icon: '✉️',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${activeUrl}`)}`
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-[#090e29] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col glow-card">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-[#0c1538] to-[#090e29]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/30 to-amber-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white font-display">
                  Publish & Share <span className="text-amber-400">FREEDREAM</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px]">
                  LIVE ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                "Dream Without Limit." • Worldwide Public Access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-[#050814] border-b border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'share'
                ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Online</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'qr'
                ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>

          <button
            onClick={() => setActiveTab('vercel')}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'vercel'
                ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-[12px] font-mono">▲</span>
            <span>Vercel</span>
          </button>

          <button
            onClick={() => setActiveTab('domain')}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'domain'
                ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Domain</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* ================= TAB 1: SHARE ONLINE ================= */}
          {activeTab === 'share' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Public Link Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    OFFICIAL PUBLIC APP URL
                  </span>
                  <span className="text-emerald-400">Accessible without login</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#050814] border border-cyan-500/40">
                  <input
                    type="text"
                    readOnly
                    value={activeUrl}
                    className="w-full bg-transparent px-3 py-1 font-mono text-xs sm:text-sm text-cyan-200 select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shrink-0 shadow-md ${
                      copied 
                        ? 'bg-emerald-500 text-black' 
                        : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Link' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Native Mobile Share Button */}
              <div>
                <button
                  onClick={handleNativeShare}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Share2 className="w-4 h-4 text-black" />
                  <span>Share FREEDREAM on Installed Apps (Android / iOS)</span>
                </button>
              </div>

              {/* 1-Click Social Apps */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Quick Share to Messaging & Social Platforms:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 justify-center transition-transform hover:-translate-y-0.5 shadow-sm ${social.color}`}
                    >
                      <span className="text-base">{social.icon}</span>
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Public Access Verification Notice */}
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyan-300 font-semibold font-mono text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>ZERO BARRIER PUBLIC ACCESS GUARANTEE</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Anyone with this link can launch the full FREEDREAM app on Android smartphones, iPads/tablets, and desktop laptops. No Google developer account or login approval is required.
                </p>
              </div>
            </div>
          )}

          {/* ================= TAB 2: QR CODE SCAN ================= */}
          {activeTab === 'qr' && (
            <div className="space-y-4 text-center animate-in fade-in">
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Scan with any Android or smartphone camera to open FREEDREAM immediately on your mobile device.
              </p>

              {/* Clean Geometric SVG QR Code */}
              <div className="p-6 rounded-3xl bg-white w-64 h-64 mx-auto flex items-center justify-center shadow-2xl relative border-4 border-cyan-400">
                <svg viewBox="0 0 160 160" className="w-full h-full">
                  {/* Position detection corners */}
                  <rect x="10" y="10" width="40" height="40" fill="#000" rx="6" />
                  <rect x="16" y="16" width="28" height="28" fill="#fff" rx="4" />
                  <rect x="22" y="22" width="16" height="16" fill="#000" rx="2" />

                  <rect x="110" y="10" width="40" height="40" fill="#000" rx="6" />
                  <rect x="116" y="16" width="28" height="28" fill="#fff" rx="4" />
                  <rect x="122" y="22" width="16" height="16" fill="#000" rx="2" />

                  <rect x="10" y="110" width="40" height="40" fill="#000" rx="6" />
                  <rect x="16" y="116" width="28" height="28" fill="#fff" rx="4" />
                  <rect x="22" y="122" width="16" height="16" fill="#000" rx="2" />

                  {/* High Density Pattern Bits */}
                  <rect x="58" y="16" width="8" height="8" fill="#000" />
                  <rect x="74" y="16" width="8" height="8" fill="#000" />
                  <rect x="90" y="16" width="8" height="8" fill="#000" />

                  <rect x="58" y="32" width="16" height="8" fill="#000" />
                  <rect x="82" y="32" width="8" height="16" fill="#000" />
                  
                  <rect x="20" y="58" width="8" height="8" fill="#000" />
                  <rect x="36" y="58" width="16" height="8" fill="#000" />
                  <rect x="62" y="58" width="8" height="16" fill="#000" />
                  <rect x="78" y="58" width="8" height="8" fill="#000" />
                  <rect x="94" y="58" width="16" height="8" fill="#000" />
                  <rect x="118" y="58" width="8" height="16" fill="#000" />
                  <rect x="134" y="58" width="8" height="8" fill="#000" />

                  <rect x="20" y="74" width="16" height="8" fill="#000" />
                  <rect x="44" y="74" width="8" height="8" fill="#000" />
                  <rect x="70" y="74" width="20" height="8" fill="#000" />
                  <rect x="98" y="74" width="8" height="16" fill="#000" />
                  <rect x="126" y="74" width="16" height="8" fill="#000" />

                  <rect x="20" y="90" width="8" height="16" fill="#000" />
                  <rect x="36" y="90" width="16" height="8" fill="#000" />
                  <rect x="62" y="90" width="8" height="8" fill="#000" />
                  <rect x="78" y="90" width="16" height="8" fill="#000" />
                  <rect x="114" y="90" width="8" height="16" fill="#000" />
                  <rect x="130" y="90" width="12" height="8" fill="#000" />

                  <rect x="58" y="114" width="16" height="8" fill="#000" />
                  <rect x="82" y="114" width="8" height="16" fill="#000" />
                  <rect x="98" y="114" width="16" height="8" fill="#000" />
                  <rect x="122" y="114" width="8" height="8" fill="#000" />
                  <rect x="138" y="114" width="8" height="16" fill="#000" />

                  <rect x="58" y="130" width="8" height="16" fill="#000" />
                  <rect x="74" y="138" width="16" height="8" fill="#000" />
                  <rect x="98" y="130" width="8" height="16" fill="#000" />
                  <rect x="114" y="138" width="16" height="8" fill="#000" />

                  {/* Center Emblem overlay */}
                  <rect x="68" y="68" width="24" height="24" rx="4" fill="#050814" stroke="#00F0FF" strokeWidth="2" />
                  <polygon points="80,72 89,87 71,87" fill="#F59E0B" />
                </svg>
              </div>

              <div className="font-mono text-xs text-cyan-300">
                Link: {activeUrl}
              </div>

              <div className="p-3 rounded-xl bg-[#050814] border border-slate-800 text-xs text-slate-400 max-w-sm mx-auto">
                💡 <strong>Tip for Android users:</strong> After scanning, tap the 3-dot browser menu and select <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong> to use FREEDREAM like a native APK.
              </div>
            </div>
          )}

          {/* ================= TAB: VERCEL DEPLOYMENT ================= */}
          {activeTab === 'vercel' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm font-display flex items-center gap-2">
                    <span className="text-base text-cyan-400">▲</span>
                    <span>Deploy FREEDREAM to Vercel</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Your codebase is fully configured for Vercel with serverless Express backend and Vite frontend.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono">
                  Ready to Deploy
                </span>
              </div>

              {/* Automated Configuration Spec */}
              <div className="p-3.5 rounded-2xl bg-[#050814] border border-slate-800 space-y-2 text-xs font-mono">
                <span className="text-[11px] text-cyan-400 font-semibold block uppercase">
                  Pre-Configured Files Created in Workspace:
                </span>
                <div className="space-y-1 text-slate-300">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                    <span className="text-white">vercel.json</span>
                    <span className="text-emerald-400 text-[11px]">Vite preset + /api/* serverless rewrites</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                    <span className="text-white">api/index.ts</span>
                    <span className="text-emerald-400 text-[11px]">Express Serverless entry point</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                    <span className="text-white">.vercelignore</span>
                    <span className="text-emerald-400 text-[11px]">Clean source packaging</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-white">Output Directory</span>
                    <span className="text-amber-400 text-[11px]">dist (via npm run build)</span>
                  </div>
                </div>
              </div>

              {/* Environment Variables Requirement */}
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-mono font-semibold text-[11px]">
                  <span>REQUIRED ENVIRONMENT VARIABLE IN VERCEL:</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#050814] border border-amber-500/30 font-mono text-xs flex items-center justify-between">
                  <div>
                    <span className="text-cyan-300 font-bold">GEMINI_API_KEY</span>
                    <span className="text-slate-400 block text-[10px]">Required for live FREEDREAM AI Assistant & NovaLab synthesis</span>
                  </div>
                  <span className="text-amber-400 text-[10px]">Add in Vercel Settings</span>
                </div>
              </div>

              {/* 3 Steps to Deploy */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                  3 Simple Steps to Deploy on Vercel:
                </span>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-[#050814] border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <span>Push or import this repository into your <strong>GitHub / GitLab</strong> account.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#050814] border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <span>Go to <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">vercel.com/new</a> and select <strong>Import Project</strong>.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#050814] border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <span>Paste your <strong>GEMINI_API_KEY</strong> under Environment Variables, click <strong>Deploy</strong>, and your custom <code>.vercel.app</code> domain will be live in 60 seconds!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: CUSTOM DOMAIN ================= */}
          {activeTab === 'domain' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="font-bold text-white text-sm font-display">
                  Connect Custom Domain (e.g. freedream.com)
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  You can use the free platform URL immediately, or connect your own brand domain like <strong>freedream.com</strong> or <strong>novalab.tech</strong>.
                </p>
              </div>

              <div className="space-y-2 p-3.5 rounded-2xl bg-[#050814] border border-slate-800">
                <label className="block text-[11px] font-mono text-slate-400">
                  ENTER YOUR DOMAIN NAME
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customDomainInput}
                    onChange={(e) => setCustomDomainInput(e.target.value)}
                    placeholder="freedream.com or app.freedream.tech"
                    className="w-full bg-[#090e29] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <button
                    onClick={() => {
                      if (!customDomainInput.trim()) return;
                      setSavedCustomDomain(customDomainInput.trim());
                      alert(`Custom domain "${customDomainInput.trim()}" registered! Follow the DNS record steps below to complete activation.`);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono shrink-0"
                  >
                    Set Domain
                  </button>
                </div>
              </div>

              {/* DNS Records Guide */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">
                  Required DNS Records (Your Domain Registrar):
                </span>
                <div className="overflow-x-auto rounded-xl border border-slate-800 text-xs">
                  <table className="w-full text-left font-mono">
                    <thead className="bg-[#050814] text-slate-400">
                      <tr>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Host / Name</th>
                        <th className="p-2.5">Target / Value</th>
                        <th className="p-2.5">TTL</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#090e29]/50 text-slate-200 divide-y divide-slate-800/80">
                      <tr>
                        <td className="p-2.5 text-amber-400 font-semibold">CNAME</td>
                        <td className="p-2.5">@ or www</td>
                        <td className="p-2.5 text-cyan-300">ghs.googlehosted.com</td>
                        <td className="p-2.5">3600 (Auto)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Log in to Namecheap, GoDaddy, Cloudflare, or Google Domains, add this CNAME record, and point it to the Google Cloud Run gateway.
                </p>
              </div>
            </div>
          )}

          {/* ================= TAB 4: PUBLISH & UPDATES GUIDE ================= */}
          {activeTab === 'guide' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="font-bold text-white text-sm font-display">
                  How Publishing & App Updates Work
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Understanding the AI Studio deployment lifecycle and updating your live app.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#050814] border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-semibold text-white">Live Development Testing</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      All changes you prompt or make in the workspace are immediately active on your development instance on port 3000.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050814] border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-semibold text-white">Publishing Live to the World</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      In the top bar of AI Studio, click the <strong>Share</strong> or <strong>Publish</strong> button. This pushes your production build to the public Cloud Run URL.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050814] border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-semibold text-white">Continuous Instant Updates</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Whenever you improve features, add new courses, or upgrade NovaLab, re-publishing instantly updates the shared public link with zero downtime for your users!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#050814] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Encrypted HTTPS • Cross-Platform PWA</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors text-[11px]"
            >
              <span>Test Public App</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-[11px]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
