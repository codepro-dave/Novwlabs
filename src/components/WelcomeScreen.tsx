import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { Rocket, Sparkles, ChevronRight, Cpu, Globe, Award } from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#050814] flex flex-col justify-between items-center p-6 bg-grid-pattern overflow-hidden text-center select-none">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      
      {/* Top telemetry bar */}
      <div className="w-full max-w-md flex items-center justify-between text-xs font-mono text-cyan-400/60 pt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          SYSTEM: NEURAL V2.5 ONLINE
        </span>
        <button 
          onClick={onEnter}
          className="text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-widest text-[11px]"
        >
          Skip ({countdown}s)
        </button>
      </div>

      {/* Center Hero Identity */}
      <div className="w-full max-w-md flex flex-col items-center my-auto space-y-6">
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-amber-500/20 blur-xl" />
          <Logo size="xl" showSlogan={false} className="relative justify-center scale-110 sm:scale-125 my-4" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
            FREEDREAM <span className="text-amber-400">TECHNOLOGIES</span>
          </h1>
          <div className="inline-block px-4 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs tracking-[0.25em] uppercase">
            "Dream Without Limit."
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-300/90 max-w-xs sm:max-w-sm leading-relaxed">
          The premier platform empowering young pioneers in artificial intelligence, robotics, scientific discovery, and hardware innovation.
        </p>

        {/* Pillar Feature Pills */}
        <div className="grid grid-cols-3 gap-2 w-full pt-2">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center gap-1">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-medium text-slate-200">NOVALAB</span>
            <span className="text-[9px] text-slate-400">Invention Lab</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-medium text-slate-200">AI ASSISTANT</span>
            <span className="text-[9px] text-slate-400">Gemini Neural</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center gap-1">
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-medium text-slate-200">ACADEMY</span>
            <span className="text-[9px] text-slate-400">STEM Mastery</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="w-full max-w-md pb-4 space-y-3">
        <button
          onClick={onEnter}
          className="w-full group relative overflow-hidden rounded-xl p-[1px] focus:outline-none"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-500 rounded-xl" />
          <span className="relative flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-[#090e29] group-hover:bg-[#0c1538] transition-all text-white font-medium text-sm sm:text-base font-display tracking-wide shadow-lg shadow-cyan-950/60">
            <span>Enter FREEDREAM Platform</span>
            <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>

        <p className="text-[11px] text-slate-400 font-mono">
          Engineered for Android & Cross-Platform Web • v2.5.0
        </p>
      </div>
    </div>
  );
};
