import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, InventionProject } from '../types';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Lightbulb, 
  Terminal, 
  Cpu, 
  Globe, 
  CheckCircle2, 
  ArrowUpRight,
  RefreshCw,
  Zap,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface AiAssistantViewProps {
  userProfile: UserProfile;
  onExportToNovaLab: (project: InventionProject) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sourceEngine?: string;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  userProfile,
  onExportToNovaLab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `Greetings! I am **FREEDREAM AI**, the neural core of FREEDREAM TECHNOLOGIES.

Brand Slogan: *"Dream Without Limit."*

I am engineered to help you:
- **Understand Difficult Science:** Quantum superposition, genetic engineering, neural transformers, and thermodynamics.
- **Synthesize Hardware & Software:** Arduino C++, MicroPython, circuit schematics, and embedded sensor pipelines.
- **Solve Everyday Challenges:** Clean solar water purification, African precision agriculture, low-cost bionics, and IoT microgrids.
- **Architect Tech Projects:** Formulate step-by-step prototyping roadmaps and unit-cost economic models.

What technological breakthrough would you like to build or explore today?`,
      timestamp: 'Just now',
      sourceEngine: 'FREEDREAM Neural Network'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<'All' | 'Science' | 'Programming' | 'Robotics' | 'Agriculture' | 'CleanTech' | 'Healthcare'>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const promptSuggestions = [
    { label: 'Explain Quantum Superposition', topic: 'Science' },
    { label: 'Design Solar IoT Soil Monitor for African Farms', topic: 'Agriculture' },
    { label: 'Write Arduino Code for a 4-Axis Robotic Arm', topic: 'Robotics' },
    { label: 'How does CRISPR Gene Editing work technically?', topic: 'Healthcare' },
    { label: 'Build a MicroPython BLE Telemetry Beacon', topic: 'Programming' },
    { label: 'Formulate a 30-Day Prototype Plan for a Clean Water Station', topic: 'CleanTech' }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history for API
      const history = messages.slice(-5).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.content
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          topic: selectedTopic,
          conversationHistory: history
        })
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Synthesizing response...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceEngine: data.source || 'FREEDREAM Neural Network'
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `Connection interruption. FREEDREAM Knowledge Engine guidance:\n\nWhen exploring "${text}", ensure you ground your hardware architecture with rapid breadboard experimentation, maintain dedicated grounds (GND) across sensors, and log all telemetry. Try asking again in a moment.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceEngine: 'FREEDREAM Built-in Engine'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickNovaLabExport = (content: string) => {
    const titleMatch = content.match(/#+\s+(.+)/) || content.match(/\*\*(.+?)\*\*/);
    const title = titleMatch ? titleMatch[1].slice(0, 80) : `Invention from AI Assistant`;

    const project: InventionProject = {
      id: `proj-ai-${Date.now()}`,
      title,
      category: selectedTopic === 'Agriculture' ? 'Agritech' : selectedTopic === 'CleanTech' ? 'Clean Energy' : selectedTopic === 'Healthcare' ? 'Healthcare' : 'Robotics',
      abstract: content.slice(0, 200) + '...',
      problemStatement: 'Identified problem via FREEDREAM AI consultation.',
      solution: content.slice(0, 500),
      materials: [
        { name: 'Microcontroller Development Board', costUsd: 12, costNgn: 18000 },
        { name: 'Hardware Sensor Array', costUsd: 25, costNgn: 37500 },
        { name: 'Lithium Power Source & Enclosure', costUsd: 20, costNgn: 30000 }
      ],
      estimatedTotalUsd: 57,
      estimatedTotalNgn: 85500,
      stage: 'Concept',
      progressPercentage: 20,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onExportToNovaLab(project);
    alert(`Project "${title}" has been saved to your NovaLab Project Planner!`);
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0c1538] via-[#090e29] to-[#050814] border border-cyan-500/30 p-4 glow-card flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/30 to-amber-500/30 border border-cyan-400/50 flex items-center justify-center text-amber-400 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold font-display text-white text-base sm:text-lg">
                FREEDREAM <span className="text-amber-400">AI</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-500/40">
                Gemini 3.8 Flash Neural
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-400/80">
              "Dream Without Limit." • Real Multi-Disciplinary STEM Intelligence
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#050814] border border-slate-800 text-xs font-mono text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Real API Connected</span>
        </div>
      </div>

      {/* Topic Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 text-xs">
        <span className="text-[11px] font-mono text-slate-400 uppercase mr-1">Focus Domain:</span>
        {(['All', 'Science', 'Programming', 'Robotics', 'Agriculture', 'CleanTech', 'Healthcare'] as const).map(t => (
          <button
            key={t}
            onClick={() => setSelectedTopic(t)}
            className={`px-3 py-1 rounded-lg font-mono transition-all shrink-0 ${
              selectedTopic === t
                ? 'bg-cyan-500 text-black font-semibold'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-[#090e29]/50 border border-slate-800/80">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0c1538] to-[#090e29] border border-cyan-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-1 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 space-y-2 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md'
                  : 'bg-[#090e29] border border-cyan-950/90 text-slate-200 rounded-tl-none glow-card'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-[10px] font-mono opacity-70 pb-1 border-b border-white/10">
                <span>{msg.role === 'user' ? userProfile.name : 'FREEDREAM AI'}</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Content with simple formatting */}
              <div className="whitespace-pre-wrap leading-relaxed font-sans">
                {msg.content}
              </div>

              {/* Actions on Assistant Messages */}
              {msg.role === 'assistant' && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-400/80 text-[10px]">
                    {msg.sourceEngine || 'FREEDREAM Engine'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleQuickNovaLabExport(msg.content)}
                      className="p-1 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                      title="Save as NovaLab Project"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Export to NovaLab</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-sm shrink-0 mt-1 select-none">
                {userProfile.avatar}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0c1538] border border-cyan-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#090e29] border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>FREEDREAM AI is synthesizing equations, circuits & code...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0">
        {promptSuggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(s.label)}
            className="px-3 py-1 rounded-full bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-[11px] font-mono text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-all flex items-center gap-1"
          >
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="relative shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#090e29] border border-cyan-500/40 shadow-xl glow-card"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask FREEDREAM AI anything about science, robotics, code, agriculture, healthcare..."
            className="w-full bg-transparent px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold disabled:opacity-40 transition-all shrink-0 shadow-md shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
