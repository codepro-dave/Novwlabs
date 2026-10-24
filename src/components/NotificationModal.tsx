import React from 'react';
import { X, Bell, Sparkles, Rocket, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { NavigationTab } from '../types';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'AI' | 'Space' | 'Challenge' | 'System';
  read: boolean;
  targetTab?: NavigationTab;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-end p-4 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#090e29] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden glow-card max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="font-display font-semibold text-white text-base">
              System Notifications
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded bg-slate-900 border border-slate-800"
            >
              Mark read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {notifications.map((item) => {
            const getIcon = () => {
              switch (item.category) {
                case 'AI': return <Sparkles className="w-4 h-4 text-amber-400" />;
                case 'Space': return <Rocket className="w-4 h-4 text-cyan-400" />;
                case 'Challenge': return <Award className="w-4 h-4 text-emerald-400" />;
                default: return <Bell className="w-4 h-4 text-blue-400" />;
              }
            };

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all ${
                  item.read
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                    : 'bg-cyan-950/30 border-cyan-500/30 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#050814] border border-slate-800 shrink-0">
                      {getIcon()}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100 leading-tight">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-cyan-400/80">
                        {item.category} • {item.time}
                      </span>
                    </div>
                  </div>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1" />
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-2 pl-9 leading-relaxed">
                  {item.message}
                </p>

                {item.targetTab && (
                  <div className="pl-9 mt-2">
                    <button
                      onClick={() => {
                        onNavigate(item.targetTab!);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-amber-400 transition-colors"
                    >
                      <span>Explore Section</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#050814] border-t border-slate-800 text-center text-[11px] font-mono text-slate-500">
          FREEDREAM Alert Dispatcher • Encrypted Stream
        </div>
      </div>
    </div>
  );
};
