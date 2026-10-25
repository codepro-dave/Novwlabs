import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Lock, 
  User, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  LogOut, 
  Sparkles, 
  Globe, 
  Radio, 
  Users, 
  Sliders, 
  Bell, 
  FileText, 
  Zap, 
  Layers, 
  Search, 
  X, 
  ChevronRight, 
  ExternalLink, 
  Download, 
  Check, 
  ArrowLeft,
  Server,
  Activity,
  Cpu,
  Flame,
  Clock,
  Calendar,
  Image as ImageIcon,
  Tag,
  Save,
  Send,
  BookmarkCheck
} from 'lucide-react';
import { 
  NewsArticle, 
  OwnerDashboardStats, 
  OwnerUser, 
  FeatureSettings, 
  AnnouncementItem, 
  AuditLogEntry, 
  FeedbackReport, 
  NavigationTab,
  AdminRole 
} from '../types';
import { Logo } from '../components/Logo';

interface OwnerControlCenterViewProps {
  onBackToApp: () => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onRefreshPublicNews?: () => void;
}

export const OwnerControlCenterView: React.FC<OwnerControlCenterViewProps> = ({
  onBackToApp,
  onNavigateTab,
  onRefreshPublicNews
}) => {
  // Authentication State
  const [authToken, setAuthToken] = useState<string>(() => localStorage.getItem('freedream_owner_token') || '');
  const [currentUser, setCurrentUser] = useState<OwnerUser | null>(() => {
    const saved = localStorage.getItem('freedream_owner_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null;
  });

  const [setupRequired, setSetupRequired] = useState<boolean>(false);
  const [ownerEmailMasked, setOwnerEmailMasked] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>('');
  const [authSuccessNotice, setAuthSuccessNotice] = useState<string>('');

  // Setup / Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Setup Form
  const [setupName, setSetupName] = useState('Chief Executive Innovator');
  const [setupEmail, setSetupEmail] = useState('owner@freedream.tech');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [setupSecurityAnswer, setSetupSecurityAnswer] = useState('');
  const [generatedRecoveryKey, setGeneratedRecoveryKey] = useState<string>('');

  // Password Recovery Modal
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCredential, setRecoveryCredential] = useState('');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Active Control Center Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'news' | 'features' | 'announcements' | 'users' | 'audit'>('overview');

  // Loaded Dashboard Data
  const [stats, setStats] = useState<OwnerDashboardStats | null>(null);
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [features, setFeatures] = useState<FeatureSettings | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [usersList, setUsersList] = useState<OwnerUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [feedbackReports, setFeedbackReports] = useState<FeedbackReport[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<NewsArticle> | null>(null);
  const [previewArticle, setPreviewArticle] = useState<NewsArticle | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<'Urgent' | 'Update' | 'Maintenance' | 'Feature' | 'Milestone'>('Update');

  const [userRoleModalTarget, setUserRoleModalTarget] = useState<OwnerUser | null>(null);
  const [suspendConfirmTarget, setSuspendConfirmTarget] = useState<OwnerUser | null>(null);

  // Categories State
  const [categories, setCategories] = useState<string[]>([
    'Global Technology',
    'Nigerian Technology',
    'Artificial Intelligence',
    'Space and Astronomy',
    'Science and Innovation',
    'Robotics and Electronics'
  ]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatOldName, setEditingCatOldName] = useState<string | null>(null);
  const [editingCatNewName, setEditingCatNewName] = useState('');
  const [categoryDeletingName, setCategoryDeletingName] = useState<string | null>(null);

  // News filters
  const [newsFilterCategory, setNewsFilterCategory] = useState<string>('All');
  const [newsSearchQuery, setNewsSearchQuery] = useState<string>('');

  // User search
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');

  // Check initial owner status
  useEffect(() => {
    checkOwnerStatus();
  }, []);

  // When token changes or on login, fetch data
  useEffect(() => {
    if (authToken) {
      loadAllControlCenterData();
    }
  }, [authToken]);

  // Notice auto-dismiss
  useEffect(() => {
    if (actionNotice) {
      const timer = setTimeout(() => setActionNotice(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [actionNotice]);

  const checkOwnerStatus = async () => {
    setAuthLoading(true);
    try {
      const res = await fetch('/api/owner/status');
      const data = await res.json();
      setSetupRequired(Boolean(data.setupRequired));
      if (data.ownerEmailMasked) {
        setOwnerEmailMasked(data.ownerEmailMasked);
      }

      // If we have a stored token, verify it
      if (authToken) {
        const verifyRes = await fetch('/api/owner/me', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          setCurrentUser(verifyData.user);
        } else {
          // Token expired
          handleLogout();
        }
      }
    } catch (err) {
      console.error('Failed to query owner status:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessNotice('');

    try {
      const res = await fetch('/api/owner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed. Please verify credentials.');
        return;
      }

      setAuthToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('freedream_owner_token', data.token);
      localStorage.setItem('freedream_owner_user', JSON.stringify(data.user));
      setAuthSuccessNotice(`Welcome back, ${data.user.name}`);
    } catch (err: any) {
      setAuthError('Connection failed: ' + (err.message || 'Unable to reach FREEDREAM server.'));
    }
  };

  const handleSetupOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (setupPassword !== setupConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    if (setupPassword.length < 8) {
      setAuthError('Password must be at least 8 characters long.');
      return;
    }

    try {
      const res = await fetch('/api/owner/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: setupName,
          email: setupEmail,
          password: setupPassword,
          recoveryAnswer: setupSecurityAnswer
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Setup failed. Please check your inputs.');
        return;
      }

      setGeneratedRecoveryKey(data.recoveryKey);
      setAuthToken(data.token);
      setCurrentUser(data.user);
      setSetupRequired(false);
      localStorage.setItem('freedream_owner_token', data.token);
      localStorage.setItem('freedream_owner_user', JSON.stringify(data.user));
    } catch (err: any) {
      setAuthError('Server error during setup: ' + err.message);
    }
  };

  const handleLogout = async () => {
    if (authToken) {
      try {
        await fetch('/api/owner/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` }
        });
      } catch (e) { /* ignore */ }
    }
    setAuthToken('');
    setCurrentUser(null);
    localStorage.removeItem('freedream_owner_token');
    localStorage.removeItem('freedream_owner_user');
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMessage(null);

    try {
      const res = await fetch('/api/owner/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: recoveryEmail,
          recoveryKeyOrAnswer: recoveryCredential,
          newPassword: recoveryNewPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setRecoveryMessage({ type: 'error', text: data.error || 'Recovery failed.' });
        return;
      }

      setRecoveryMessage({ type: 'success', text: 'Password reset successfully! You can now log in.' });
      setTimeout(() => {
        setIsRecoveryOpen(false);
        setRecoveryMessage(null);
      }, 2000);
    } catch (err: any) {
      setRecoveryMessage({ type: 'error', text: 'Network error: ' + err.message });
    }
  };

  // Load all dashboard collections
  const loadAllControlCenterData = async () => {
    if (!authToken) return;
    setIsLoadingData(true);

    const headers = { Authorization: `Bearer ${authToken}` };

    try {
      const [statsRes, newsRes, featRes, annRes, usersRes, logsRes, repRes, catRes] = await Promise.all([
        fetch('/api/owner/stats', { headers }),
        fetch('/api/owner/news', { headers }),
        fetch('/api/owner/features', { headers }),
        fetch('/api/owner/announcements', { headers }),
        fetch('/api/owner/users', { headers }),
        fetch('/api/owner/audit-logs', { headers }),
        fetch('/api/owner/feedback', { headers }),
        fetch('/api/news/categories'),
      ]);

      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.stats);
      }
      if (newsRes.ok) {
        const d = await newsRes.json();
        setNewsList(d.articles);
      }
      if (featRes.ok) {
        const d = await featRes.json();
        setFeatures(d.features);
      }
      if (annRes.ok) {
        const d = await annRes.json();
        setAnnouncements(d.announcements);
      }
      if (usersRes.ok) {
        const d = await usersRes.json();
        setUsersList(d.users);
      }
      if (logsRes.ok) {
        const d = await logsRes.json();
        setAuditLogs(d.logs);
      }
      if (repRes.ok) {
        const d = await repRes.json();
        setFeedbackReports(d.reports);
      }
      if (catRes.ok) {
        const d = await catRes.json();
        if (Array.isArray(d.categories) && d.categories.length > 0) {
          setCategories(d.categories);
        }
      }
    } catch (err) {
      console.error('Error fetching owner data:', err);
      setActionNotice({ message: 'Failed to sync latest telemetry from server.', type: 'error' });
    } finally {
      setIsLoadingData(false);
    }
  };

  // Category Management Handlers
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;

    try {
      const res = await fetch('/api/owner/news/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ name: trimmed })
      });
      const data = await res.json();
      if (!res.ok) {
        setActionNotice({ message: data.error || 'Failed to add category.', type: 'error' });
        return;
      }
      setCategories(data.categories);
      setNewCatName('');
      setActionNotice({ message: `Category "${trimmed}" successfully added.`, type: 'success' });
      if (onRefreshPublicNews) onRefreshPublicNews();
    } catch (err: any) {
      setActionNotice({ message: 'Error adding category: ' + err.message, type: 'error' });
    }
  };

  const handleRenameCategory = async (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) {
      setEditingCatOldName(null);
      return;
    }

    try {
      const res = await fetch('/api/owner/news/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ oldName, newName: trimmed })
      });
      const data = await res.json();
      if (!res.ok) {
        setActionNotice({ message: data.error || 'Failed to rename category.', type: 'error' });
        return;
      }
      setCategories(data.categories);
      setEditingCatOldName(null);
      setEditingCatNewName('');
      setActionNotice({ message: `Category renamed to "${trimmed}".`, type: 'success' });
      loadAllControlCenterData();
      if (onRefreshPublicNews) onRefreshPublicNews();
    } catch (err: any) {
      setActionNotice({ message: 'Error renaming category: ' + err.message, type: 'error' });
    }
  };

  const handleDeleteCategory = async (catName: string) => {
    try {
      const res = await fetch(`/api/owner/news/categories/${encodeURIComponent(catName)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        setActionNotice({ message: data.error || 'Failed to delete category.', type: 'error' });
        return;
      }
      setCategories(data.categories);
      setCategoryDeletingName(null);
      setActionNotice({ message: `Category "${catName}" deleted. Articles reassigned.`, type: 'success' });
      loadAllControlCenterData();
      if (onRefreshPublicNews) onRefreshPublicNews();
    } catch (err: any) {
      setActionNotice({ message: 'Error deleting category: ' + err.message, type: 'error' });
    }
  };

  // News Actions
  const handleSaveArticle = async (e?: React.FormEvent, forcePublishedStatus?: boolean) => {
    if (e) e.preventDefault();
    if (!editingArticle || !editingArticle.title || !editingArticle.summary) {
      setActionNotice({ message: 'Article Headline and Summary are required.', type: 'error' });
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    };

    const isEdit = Boolean(editingArticle.id);
    const url = isEdit ? `/api/owner/news/${editingArticle.id}` : '/api/owner/news';
    const method = isEdit ? 'PUT' : 'POST';

    // Determine publish status
    const shouldPublish = forcePublishedStatus !== undefined 
      ? forcePublishedStatus 
      : (editingArticle.isPublished ?? true);

    const articlePayload = {
      ...editingArticle,
      isPublished: shouldPublish,
      status: shouldPublish ? 'published' : 'draft',
      date: editingArticle.date || new Date().toISOString().split('T')[0],
      category: editingArticle.category || categories[0] || 'Global Technology',
      source: editingArticle.source || 'FREEDREAM Technologies',
      readTime: editingArticle.readTime || '3 min read',
      url: editingArticle.url || 'https://freedream.tech'
    };

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(articlePayload)
      });

      const data = await res.json();
      if (!res.ok) {
        setActionNotice({ message: data.error || 'Failed to save article.', type: 'error' });
        return;
      }

      setArticleModalOpen(false);
      setEditingArticle(null);
      setActionNotice({ 
        message: shouldPublish 
          ? (isEdit ? 'Article updated and published to public wire.' : 'Article published live on FREEDREAM NEWS.') 
          : 'Article saved securely as a private draft.', 
        type: 'success' 
      });
      loadAllControlCenterData();
      if (onRefreshPublicNews) onRefreshPublicNews();
    } catch (err: any) {
      setActionNotice({ message: 'Error saving article: ' + err.message, type: 'error' });
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/owner/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        setActionNotice({ message: 'Article permanently deleted from database.', type: 'success' });
        loadAllControlCenterData();
        if (onRefreshPublicNews) onRefreshPublicNews();
      }
    } catch (err: any) {
      setActionNotice({ message: 'Failed to delete: ' + err.message, type: 'error' });
    }
  };

  const handleTogglePublish = async (article: NewsArticle) => {
    const updatedStatus = !article.isPublished;
    try {
      const res = await fetch(`/api/owner/news/${article.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ 
          isPublished: updatedStatus,
          status: updatedStatus ? 'published' : 'draft'
        })
      });
      if (res.ok) {
        setActionNotice({ 
          message: updatedStatus 
            ? 'Article published to live FREEDREAM NEWS feed.' 
            : 'Article unpublished and moved to private drafts.', 
          type: 'success' 
        });
        loadAllControlCenterData();
        if (onRefreshPublicNews) onRefreshPublicNews();
      }
    } catch (err: any) {
      setActionNotice({ message: 'Update failed: ' + err.message, type: 'error' });
    }
  };

  // Feature Updates
  const handleUpdateFeatures = async (partialUpdates: Partial<FeatureSettings>) => {
    if (!features) return;
    const merged = { ...features, ...partialUpdates };
    setFeatures(merged);

    try {
      const res = await fetch('/api/owner/features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(partialUpdates)
      });
      const data = await res.json();
      if (!res.ok) {
        setActionNotice({ message: data.error || 'Failed to update feature settings.', type: 'error' });
        loadAllControlCenterData();
      } else {
        setActionNotice({ message: 'Feature settings synchronized across all client sessions.', type: 'success' });
      }
    } catch (err: any) {
      setActionNotice({ message: 'Network error: ' + err.message, type: 'error' });
      loadAllControlCenterData();
    }
  };

  // Announcement Broadcast
  const handleBroadcastAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    try {
      const res = await fetch('/api/owner/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: broadcastTitle,
          message: broadcastMessage,
          category: broadcastCategory
        })
      });

      if (res.ok) {
        setBroadcastModalOpen(false);
        setBroadcastTitle('');
        setBroadcastMessage('');
        setActionNotice({ message: 'Official Announcement broadcasted successfully to all devices.', type: 'success' });
        loadAllControlCenterData();
      }
    } catch (err: any) {
      setActionNotice({ message: 'Broadcast failed: ' + err.message, type: 'error' });
    }
  };

  const handleToggleAnnouncement = async (id: string, active: boolean) => {
    try {
      const res = await fetch(`/api/owner/announcements/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ active })
      });
      if (res.ok) {
        setActionNotice({ message: `Announcement set to ${active ? 'Active' : 'Inactive'}.`, type: 'success' });
        loadAllControlCenterData();
      }
    } catch (err: any) {
      setActionNotice({ message: 'Error: ' + err.message, type: 'error' });
    }
  };

  // User RBAC Actions
  const handleUpdateRole = async (userId: string, newRole: AdminRole) => {
    try {
      const res = await fetch(`/api/owner/users/${userId}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await res.json();
      if (!res.ok) {
        setActionNotice({ message: data.error || 'Failed to update user role.', type: 'error' });
      } else {
        setUserRoleModalTarget(null);
        setActionNotice({ message: `Role changed to ${newRole.toUpperCase()}.`, type: 'success' });
        loadAllControlCenterData();
      }
    } catch (err: any) {
      setActionNotice({ message: 'Error: ' + err.message, type: 'error' });
    }
  };

  const handleToggleSuspendUser = async (user: OwnerUser) => {
    const isSuspended = user.status === 'suspended';
    try {
      const res = await fetch(`/api/owner/users/${user.id}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ suspend: !isSuspended })
      });

      const data = await res.json();
      if (!res.ok) {
        setActionNotice({ message: data.error || 'Operation forbidden.', type: 'error' });
      } else {
        setSuspendConfirmTarget(null);
        setActionNotice({ message: `Account for ${user.name} has been ${isSuspended ? 'Restored' : 'Suspended'}.`, type: 'success' });
        loadAllControlCenterData();
      }
    } catch (err: any) {
      setActionNotice({ message: 'Error: ' + err.message, type: 'error' });
    }
  };

  // Export audit logs as JSON file
  const handleExportAuditLogs = () => {
    const jsonStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freedream-audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered news
  const filteredNews = newsList.filter(item => {
    const matchesCategory = newsFilterCategory === 'All' || item.category === newsFilterCategory;
    const matchesSearch = newsSearchQuery.trim() === '' || 
      item.title.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(newsSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered users
  const filteredUsers = usersList.filter(user => {
    const q = userSearchQuery.toLowerCase();
    return user.name.toLowerCase().includes(q) || 
      user.email.toLowerCase().includes(q) || 
      user.handle.toLowerCase().includes(q) || 
      user.role.toLowerCase().includes(q);
  });

  // =========================================================================
  // VIEW 1: AUTHENTICATION & SETUP PORTAL
  // =========================================================================
  if (!authToken || !currentUser) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 animate-in fade-in">
        <div className="w-full max-w-md bg-gradient-to-b from-[#0a1128] via-[#050814] to-[#02040a] rounded-3xl border border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.15)] space-y-6 glow-card">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-cyan-500/20 to-blue-500/30 border border-amber-400/50 shadow-lg text-2xl mb-1">
              👑
            </div>
            <h1 className="text-2xl font-black font-display tracking-tight text-white flex items-center justify-center gap-2">
              FREEDREAM <span className="text-amber-400">CONTROL CENTER</span>
            </h1>
            <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              "One Vision. One Mission. Unlimited Innovation."
            </p>
            <p className="text-[11px] text-slate-400">
              Verified Executive Administration & Global Telemetry Management
            </p>
          </div>

          {/* Feedback & Error Notices */}
          {authError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccessNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{authSuccessNotice}</span>
            </div>
          )}

          {/* Generated Recovery Key Notice (Shown right after first-time setup) */}
          {generatedRecoveryKey && (
            <div className="p-4 rounded-2xl bg-amber-950/60 border-2 border-amber-500 text-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <Key className="w-4 h-4" />
                <span>SAVE YOUR EMERGENCY RECOVERY KEY</span>
              </div>
              <p className="text-[11px] text-slate-300">
                This key is shown only once. Store it in a secure password vault:
              </p>
              <div className="p-2.5 rounded-lg bg-black font-mono text-cyan-300 font-bold select-all tracking-wider text-center text-xs border border-amber-500/40">
                {generatedRecoveryKey}
              </div>
              <button
                type="button"
                onClick={() => setGeneratedRecoveryKey('')}
                className="w-full mt-2 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs"
              >
                I Have Safely Copied My Key • Proceed to Dashboard
              </button>
            </div>
          )}

          {/* Setup vs Login Switch */}
          {setupRequired ? (
            /* First-Time Owner Initialization Form */
            <form onSubmit={handleSetupOwner} className="space-y-4">
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>First-Time Owner Setup:</strong> No owner account is registered yet. Create your permanent master executive credentials.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Executive Owner Full Name</label>
                <input
                  type="text"
                  required
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                  placeholder="e.g. Adewale Adeleke / Chief Executive"
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Master Owner Email</label>
                <input
                  type="email"
                  required
                  value={setupEmail}
                  onChange={(e) => setSetupEmail(e.target.value)}
                  placeholder="owner@freedream.tech"
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Master Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={setupPassword}
                    onChange={(e) => setSetupPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={setupConfirmPassword}
                    onChange={(e) => setSetupConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Secret Security Recovery Word/Passphrase
                </label>
                <input
                  type="text"
                  required
                  value={setupSecurityAnswer}
                  onChange={(e) => setSetupSecurityAnswer(e.target.value)}
                  placeholder="e.g. My favorite prototype name or birthplace"
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Used alongside your Emergency Recovery Key to restore owner access if credentials are lost.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-cyan-500 to-blue-500 hover:from-amber-400 hover:to-cyan-400 text-black font-extrabold font-mono text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Initialize Master Owner Account</span>
              </button>
            </form>
          ) : (
            /* Standard Administrator & Owner Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              {ownerEmailMasked && (
                <div className="text-[11px] font-mono text-slate-400 bg-[#050814] p-2.5 rounded-xl border border-slate-800 text-center">
                  Owner Registry: <span className="text-cyan-400 font-semibold">{ownerEmailMasked}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Administrator / Owner Email</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="owner@freedream.tech"
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsRecoveryOpen(true)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-mono underline"
                  >
                    Forgot / Recovery?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-cyan-500 to-blue-500 hover:from-amber-400 hover:to-cyan-400 text-black font-extrabold font-mono text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Verify & Access Control Center</span>
              </button>
            </form>
          )}

          {/* Back to Public App button */}
          <div className="pt-2 border-t border-slate-800/80 text-center">
            <button
              onClick={onBackToApp}
              className="text-xs font-mono text-slate-400 hover:text-cyan-300 flex items-center justify-center gap-1.5 mx-auto transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public FREEDREAM Technologies App</span>
            </button>
          </div>
        </div>

        {/* Password Recovery Modal */}
        {isRecoveryOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#090e29] rounded-3xl border border-amber-500/50 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold font-display text-sm">
                  <Key className="w-4 h-4" />
                  <span>Secure Owner Password Recovery</span>
                </div>
                <button 
                  onClick={() => setIsRecoveryOpen(false)} 
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Enter your owner email and your Emergency Recovery Key (e.g. <code>FREEDREAM-RECOVERY-...</code>) or security answer to set a new password.
              </p>

              {recoveryMessage && (
                <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  recoveryMessage.type === 'error' ? 'bg-rose-950/80 border border-rose-500 text-rose-300' : 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                }`}>
                  {recoveryMessage.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  <span>{recoveryMessage.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordRecovery} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">Owner Email</label>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="owner@freedream.tech"
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">
                    Emergency Recovery Key or Security Passphrase
                  </label>
                  <input
                    type="text"
                    required
                    value={recoveryCredential}
                    onChange={(e) => setRecoveryCredential(e.target.value)}
                    placeholder="FREEDREAM-RECOVERY-XXXX... or security answer"
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">New Password (Min 8 chars)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={recoveryNewPassword}
                    onChange={(e) => setRecoveryNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRecoveryOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Reset Password</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED OWNER CONTROL CENTER
  // =========================================================================
  return (
    <div className="space-y-6 pb-16 animate-in fade-in">
      {/* Toast Notification Banner */}
      {actionNotice && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-mono border backdrop-blur-md transition-all ${
          actionNotice.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200' 
            : 'bg-rose-950/90 border-rose-500 text-rose-200'
        }`}>
          {actionNotice.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
          <span>{actionNotice.message}</span>
          <button onClick={() => setActionNotice(null)} className="ml-2 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Center Executive Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0c1538] via-[#090e29] to-[#050814] border-2 border-amber-500/40 p-5 sm:p-6 shadow-xl glow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <span>👑</span>
                <span>RESTRICTED EXECUTIVE SUITE</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">LIVE MATRIX ACTIVE</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-display text-white tracking-tight">
              FREEDREAM <span className="text-amber-400">OWNER CONTROL CENTER</span>
            </h1>

            <p className="text-xs sm:text-sm font-mono text-cyan-400">
              "One Vision. One Mission. Unlimited Innovation."
            </p>
          </div>

          {/* User Profile Badge & Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-[#050814]/90 p-2.5 rounded-2xl border border-cyan-900/50">
            <div className="flex items-center gap-2 pl-1 pr-2">
              <span className="text-xl select-none">{currentUser.avatar || '👑'}</span>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-none">{currentUser.name}</div>
                <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider mt-0.5">
                  {currentUser.role} • {currentUser.email}
                </div>
              </div>
            </div>

            <button
              onClick={loadAllControlCenterData}
              disabled={isLoadingData}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 transition-colors"
              title="Refresh All Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onBackToApp}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public App</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/30 transition-colors"
              title="Sign Out of Owner Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t border-slate-800/80 pt-4">
          {[
            { id: 'overview', label: 'Overview & Health', icon: Activity, badge: null },
            { id: 'news', label: 'News Management', icon: FileText, badge: newsList.length },
            { id: 'features', label: 'Feature Matrix', icon: Sliders, badge: features?.maintenanceMode ? 'ALERT' : null },
            { id: 'announcements', label: 'Announcements Engine', icon: Bell, badge: announcements.filter(a => a.active).length },
            { id: 'users', label: 'User Directory & RBAC', icon: Users, badge: usersList.length },
            { id: 'audit', label: 'Security & Audit Logs', icon: ShieldCheck, badge: auditLogs.length },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs flex items-center gap-2 shrink-0 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400 text-black font-extrabold shadow-md shadow-amber-950/40'
                    : 'bg-[#050814]/80 hover:bg-slate-800 text-slate-300 border border-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive 
                      ? 'bg-black text-amber-300 font-bold' 
                      : tab.badge === 'ALERT' 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          TAB 1: EXECUTIVE OVERVIEW & SYSTEM HEALTH
         ===================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-[#090e29]/90 border border-cyan-500/30 space-y-2 glow-card">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Registered Users</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {stats?.totalUsers || usersList.length}
              </div>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span>●</span> {usersList.filter(u => u.status === 'active').length} Active Accounts
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#090e29]/90 border border-amber-500/30 space-y-2 glow-card">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Published News</span>
                <Globe className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-display">
                {newsList.filter(n => n.isPublished).length}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {newsList.length} total in news database
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#090e29]/90 border border-blue-500/30 space-y-2 glow-card">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Active Inventions</span>
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-display">
                {stats?.activeProjects || 2}
              </div>
              <div className="text-[11px] font-mono text-cyan-400">
                NovaLab & Innovation Hub
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#090e29]/90 border border-emerald-500/30 space-y-2 glow-card">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>System Health</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-300 font-display flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>99.98%</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Uptime • Server Response 24ms
              </div>
            </div>
          </div>

          {/* Quick-Access Controls & System Switches */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Quick Action Matrix */}
            <div className="lg:col-span-2 p-5 rounded-3xl bg-[#090e29]/80 border border-slate-800 space-y-4 glow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Master Executive Controls</h3>
                  <p className="text-xs text-slate-400">Instant server-side feature state toggling</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  REAL-TIME SYNC
                </span>
              </div>

              {features && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Maintenance Mode */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    features.maintenanceMode 
                      ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/30' 
                      : 'bg-[#050814] border-slate-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white">Maintenance Mode</span>
                        <p className="text-[11px] text-slate-400">Blocks non-owners with status notice</p>
                      </div>
                      <button
                        onClick={() => handleUpdateFeatures({ maintenanceMode: !features.maintenanceMode })}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          features.maintenanceMode ? 'bg-rose-500' : 'bg-slate-700'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          features.maintenanceMode ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* AI Assistant */}
                  <div className="p-4 rounded-2xl bg-[#050814] border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white">FREEDREAM AI Engine</span>
                        <p className="text-[11px] text-slate-400">Gemini 3.1 Flash-Lite synthesis</p>
                      </div>
                      <button
                        onClick={() => handleUpdateFeatures({ aiAssistantEnabled: !features.aiAssistantEnabled })}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          features.aiAssistantEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          features.aiAssistantEnabled ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* NovaLab Invention Creator */}
                  <div className="p-4 rounded-2xl bg-[#050814] border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white">NovaLab Studio Access</span>
                        <p className="text-[11px] text-slate-400">Hardware & schematic generator</p>
                      </div>
                      <button
                        onClick={() => handleUpdateFeatures({ novaLabEnabled: !features.novaLabEnabled })}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          features.novaLabEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          features.novaLabEnabled ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Community Submissions */}
                  <div className="p-4 rounded-2xl bg-[#050814] border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white">Community Project Submissions</span>
                        <p className="text-[11px] text-slate-400">Open peer prototype entries</p>
                      </div>
                      <button
                        onClick={() => handleUpdateFeatures({ communityHubSubmissions: !features.communityHubSubmissions })}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          features.communityHubSubmissions ? 'bg-amber-500' : 'bg-slate-700'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          features.communityHubSubmissions ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Jump Buttons */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                <button
                  onClick={() => {
                    setEditingArticle({
                      title: '',
                      category: 'Global Technology',
                      source: 'FREEDREAM Wire',
                      date: new Date().toISOString().split('T')[0],
                      readTime: '3 min read',
                      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
                      summary: '',
                      url: 'https://freedream.tech',
                      featured: false,
                      isPublished: true
                    });
                    setArticleModalOpen(true);
                  }}
                  className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create News Article</span>
                </button>

                <button
                  onClick={() => setBroadcastModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Broadcast Announcement</span>
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Manage Users</span>
                </button>
              </div>
            </div>

            {/* Server & Telemetry Status Card */}
            <div className="p-5 rounded-3xl bg-[#090e29]/80 border border-slate-800 space-y-4 glow-card flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white font-bold font-display text-sm">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span>System Diagnostics</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                    <span className="text-slate-400">Platform Core:</span>
                    <span className="text-cyan-400 font-semibold">Node.js / Express</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                    <span className="text-slate-400">Security Layer:</span>
                    <span className="text-amber-400 font-semibold">PBKDF2-SHA512 + RBAC</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                    <span className="text-slate-400">Database Storage:</span>
                    <span className="text-emerald-400 font-semibold">File-Backed Matrix</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                    <span className="text-slate-400">Neural Network:</span>
                    <span className="text-cyan-300 font-semibold">Gemini 3.1 Flash-Lite</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-300">
                    <span className="text-slate-400">Audit Trail:</span>
                    <span className="text-emerald-400 font-semibold">{auditLogs.length} Events Logged</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#050814] border border-cyan-950 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All owner endpoints strictly enforced with Bearer tokens.</span>
              </div>
            </div>
          </div>

          {/* Recent Audit Activity Snapshot */}
          <div className="p-5 rounded-3xl bg-[#090e29]/80 border border-slate-800 space-y-4 glow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold font-display text-sm">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Recent Administrative Actions</span>
              </div>
              <button
                onClick={() => setActiveTab('audit')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>View Full Audit Log</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/80">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-cyan-300 font-mono text-[10px] border border-cyan-900/50">
                      {log.action}
                    </span>
                    <span className="text-slate-200">{log.details}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • {log.actorEmail}
                  </div>
                </div>
              ))}

              {auditLogs.length === 0 && (
                <div className="py-4 text-center text-xs font-mono text-slate-500">
                  No administrative logs recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: COMPLETE NEWS MANAGEMENT (CRUD)
         ===================================================================== */}
      {/* =====================================================================
          TAB 2: FREEDREAM NEWS CONTROL CENTER (EXCLUSIVE OWNER PUBLISHING)
         ===================================================================== */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          {/* Executive News Control Center Header */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0c1538] via-[#090e29] to-[#050814] border-2 border-cyan-500/40 shadow-xl glow-card space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>OWNER EDITORIAL DESK</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>DATABASE CONNECTED</span>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
                  FREEDREAM <span className="text-cyan-400">NEWS CONTROL CENTER</span>
                </h2>
                <p className="text-xs font-mono text-slate-300">
                  Exclusive manual publishing dashboard: write, draft, preview, categorize, and deploy articles across the global matrix.
                </p>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setEditingArticle({
                      title: '',
                      category: categories[0] || 'Global Technology',
                      source: 'FREEDREAM Technologies',
                      date: new Date().toISOString().split('T')[0],
                      readTime: '3 min read',
                      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
                      summary: '',
                      fullText: '',
                      url: 'https://freedream.tech',
                      featured: false,
                      isPublished: true
                    });
                    setArticleModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-extrabold font-mono text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Article</span>
                </button>

                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#050814] hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold font-mono text-xs flex items-center gap-2 transition-colors active:scale-95 cursor-pointer"
                >
                  <Tag className="w-4 h-4" />
                  <span>Manage Categories</span>
                </button>
              </div>
            </div>

            {/* Live News Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800/80">
              <div className="p-2.5 rounded-xl bg-[#050814]/80 border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-slate-400">Total In Database</div>
                <div className="text-lg font-bold text-white font-mono">{newsList.length}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#050814]/80 border border-emerald-950 text-center">
                <div className="text-[10px] font-mono text-emerald-400">Live (Published)</div>
                <div className="text-lg font-bold text-emerald-300 font-mono">
                  {newsList.filter(n => n.isPublished).length}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#050814]/80 border border-amber-950 text-center">
                <div className="text-[10px] font-mono text-amber-400">Drafts (Private)</div>
                <div className="text-lg font-bold text-amber-300 font-mono">
                  {newsList.filter(n => !n.isPublished).length}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#050814]/80 border border-cyan-950 text-center">
                <div className="text-[10px] font-mono text-cyan-400">Active Categories</div>
                <div className="text-lg font-bold text-cyan-300 font-mono">{categories.length}</div>
              </div>
            </div>
          </div>

          {/* Controls Bar & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#090e29]/80 border border-slate-800">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={newsSearchQuery}
                onChange={(e) => setNewsSearchQuery(e.target.value)}
                placeholder="Search articles by title, summary, source, or full text..."
                className="w-full bg-[#050814] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={newsFilterCategory}
                onChange={(e) => setNewsFilterCategory(e.target.value)}
                className="bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="All">All Categories ({newsList.length})</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({newsList.filter(n => n.category === cat).length})
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setEditingArticle({
                    title: '',
                    category: categories[0] || 'Global Technology',
                    source: 'FREEDREAM Technologies',
                    date: new Date().toISOString().split('T')[0],
                    readTime: '3 min read',
                    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
                    summary: '',
                    fullText: '',
                    url: 'https://freedream.tech',
                    featured: false,
                    isPublished: true
                  });
                  setArticleModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-extrabold font-mono text-xs flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Article</span>
              </button>
            </div>
          </div>

          {/* Articles Table / Cards */}
          <div className="space-y-3">
            {filteredNews.map((article) => (
              <div 
                key={article.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#090e29]/70 border border-slate-800/90 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 glow-card"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={article.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'}
                    alt={article.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-slate-800"
                    onError={(e) => {
                      (e.target as any).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop';
                    }}
                  />

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 font-mono text-[10px] border border-cyan-900/50">
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] border border-amber-500/40">
                          🌟 Featured Story
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                        article.isPublished 
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      }`}>
                        {article.isPublished ? '● Published' : '○ Private Draft'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-white leading-snug">
                      {article.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 max-w-2xl">
                      {article.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 pt-1">
                      <span>Source: <strong className="text-slate-300">{article.source}</strong></span>
                      <span>•</span>
                      <span>Date: {article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                      {article.fullText && (
                        <>
                          <span>•</span>
                          <span className="text-cyan-400">Full Text Available</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Article Action Controls */}
                <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 border-slate-800 w-full md:w-auto justify-end">
                  {/* Preview Article */}
                  <button
                    onClick={() => setPreviewArticle(article)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Preview Article as Public User"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Article</span>
                  </button>

                  {/* Publish / Unpublish / Save as Draft */}
                  {article.isPublished ? (
                    <button
                      onClick={() => handleTogglePublish(article)}
                      className="px-3 py-1.5 rounded-xl font-mono text-xs font-semibold bg-amber-950/50 hover:bg-amber-900/70 text-amber-300 border border-amber-500/40 flex items-center gap-1 transition-all cursor-pointer"
                      title="Unpublish this article (Move to Drafts)"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Unpublish Article</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleTogglePublish(article)}
                      className="px-3 py-1.5 rounded-xl font-mono text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 transition-all cursor-pointer"
                      title="Publish this article to public news feed"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish Article</span>
                    </button>
                  )}

                  {/* Edit Article */}
                  <button
                    onClick={() => {
                      setEditingArticle({ ...article });
                      setArticleModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Edit Articles"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Article</span>
                  </button>

                  {/* Delete Article */}
                  <button
                    onClick={() => setDeleteConfirmId(article.id)}
                    className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                    title="Delete Article"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredNews.length === 0 && (
              <div className="p-8 rounded-2xl bg-[#090e29]/50 border border-slate-800 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-mono text-slate-400">No news articles match your filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: FEATURE CONTROL CENTER & MAINTENANCE
         ===================================================================== */}
      {activeTab === 'features' && features && (
        <div className="space-y-6">
          {/* Maintenance Mode Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0c1538] to-[#050814] border-2 border-rose-500/40 space-y-4 glow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <h3 className="text-lg font-bold text-white font-display">System Maintenance Mode</h3>
                </div>
                <p className="text-xs text-slate-300">
                  When active, non-authenticated public users are routed to a custom maintenance screen. Authorized administrators can bypass this screen.
                </p>
              </div>

              <button
                onClick={() => handleUpdateFeatures({ maintenanceMode: !features.maintenanceMode })}
                className={`px-5 py-2.5 rounded-2xl font-mono text-xs font-extrabold flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                  features.maintenanceMode
                    ? 'bg-rose-500 hover:bg-rose-400 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <span>{features.maintenanceMode ? '● Maintenance Mode ACTIVE' : '○ Maintenance INACTIVE'}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Public Maintenance Screen Message
              </label>
              <textarea
                value={features.maintenanceMessage}
                onChange={(e) => setFeatures({ ...features, maintenanceMessage: e.target.value })}
                onBlur={() => handleUpdateFeatures({ maintenanceMessage: features.maintenanceMessage })}
                rows={2}
                className="w-full bg-[#050814] border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-rose-400"
                placeholder="Enter custom maintenance downtime instructions..."
              />
            </div>
          </div>

          {/* Welcome Message Configurator */}
          <div className="p-6 rounded-3xl bg-[#090e29]/80 border border-slate-800 space-y-4 glow-card">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display">Welcome Modal & Headline Banner</h3>
              <p className="text-xs text-slate-400">Customize the brand slogan and introductory copy shown to new visitors.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Welcome Headline</label>
                <input
                  type="text"
                  value={features.welcomeHeadline}
                  onChange={(e) => setFeatures({ ...features, welcomeHeadline: e.target.value })}
                  onBlur={() => handleUpdateFeatures({ welcomeHeadline: features.welcomeHeadline })}
                  className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Welcome Submessage / Vision Statement</label>
                <textarea
                  value={features.welcomeSubmessage}
                  onChange={(e) => setFeatures({ ...features, welcomeSubmessage: e.target.value })}
                  onBlur={() => handleUpdateFeatures({ welcomeSubmessage: features.welcomeSubmessage })}
                  rows={2}
                  className="w-full bg-[#050814] border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Granular Application Feature Toggles */}
          <div className="p-6 rounded-3xl bg-[#090e29]/80 border border-slate-800 space-y-4 glow-card">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display">Subsystem Matrix Toggles</h3>
              <p className="text-xs text-slate-400">Enable or disable specific modules and homepage sections in real time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'aiAssistantEnabled', title: 'FREEDREAM Neural Assistant', desc: 'Allows users to synthesize schematics and chat with Gemini AI' },
                { key: 'novaLabEnabled', title: 'NovaLab Project Creation', desc: 'Permits creating, editing, and saving new hardware prototypes' },
                { key: 'communityHubSubmissions', title: 'Community Hub Submissions', desc: 'Allows open innovation voting and project publishing' },
                { key: 'academyQuizzes', title: 'Academy STEM Interactive Quizzes', desc: 'Enables interactive knowledge challenges and XP rewards' },
                { key: 'featuredNewsBanner', title: 'Featured News Hero Wire', desc: 'Displays top breaking story card on homepage and news view' },
                { key: 'spaceUpdatesSection', title: 'Space & Astronomy Updates', desc: 'Includes astrophysical telemetry from James Webb & AfriSat' },
                { key: 'africanTechSpotlight', title: 'African DeepTech Spotlight', desc: 'Highlights Nigerian and African silicon, drone, and clean energy tech' },
              ].map(item => {
                const isEnabled = (features as any)[item.key];
                return (
                  <div key={item.key} className="p-4 rounded-2xl bg-[#050814] border border-slate-800 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.desc}</div>
                    </div>

                    <button
                      onClick={() => handleUpdateFeatures({ [item.key]: !isEnabled })}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        isEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        isEnabled ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: ANNOUNCEMENTS & NOTIFICATIONS BROADCASTER
         ===================================================================== */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-[#090e29]/80 border border-slate-800">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display">System-Wide Broadcast Engine</h3>
              <p className="text-xs text-slate-400">Broadcast official notifications, firmware releases, and urgent platform notices.</p>
            </div>

            <button
              onClick={() => setBroadcastModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-black font-extrabold font-mono text-xs flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>Compose Broadcast</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div 
                key={ann.id}
                className="p-4 rounded-2xl bg-[#090e29]/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                      ann.category === 'Urgent' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                      ann.category === 'Milestone' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                      'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      {ann.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                      ann.active ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {ann.active ? 'Active on Devices' : 'Archived'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white">{ann.title}</h4>
                  <p className="text-xs text-slate-300 max-w-2xl">{ann.message}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleAnnouncement(ann.id, !ann.active)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold border transition-all ${
                      ann.active
                        ? 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/60'
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/60'
                    }`}
                  >
                    {ann.active ? 'Deactivate' : 'Reactivate'}
                  </button>
                </div>
              </div>
            ))}

            {announcements.length === 0 && (
              <div className="p-8 rounded-2xl bg-[#090e29]/50 border border-slate-800 text-center text-xs font-mono text-slate-400">
                No official announcements created yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: REGISTERED USER DIRECTORY & RBAC
         ===================================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#090e29]/80 border border-slate-800">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search registered accounts by name, email, handle, or role..."
                className="w-full bg-[#050814] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="text-xs font-mono text-slate-400 shrink-0">
              {filteredUsers.length} Users Listed
            </div>
          </div>

          <div className="divide-y divide-slate-800 rounded-3xl bg-[#090e29]/80 border border-slate-800 overflow-hidden">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#0c1538]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                    {user.avatar || '👤'}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{user.name}</span>
                      <span className="text-xs font-mono text-slate-400">{user.handle}</span>
                      <span className={`px-2 py-0.2 rounded-full font-mono text-[10px] font-bold uppercase ${
                        user.role === 'owner' ? 'bg-amber-500 text-black' :
                        user.role === 'admin' ? 'bg-cyan-500 text-black' :
                        user.role === 'moderator' ? 'bg-blue-500 text-white' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {user.role}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                      <span>{user.email}</span>
                      <span>•</span>
                      <span>{user.location || 'Global'}</span>
                      <span>•</span>
                      <span className={user.status === 'active' ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                        {user.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Role & Suspend Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {currentUser.role === 'owner' && user.role !== 'owner' && (
                    <>
                      <button
                        onClick={() => setUserRoleModalTarget(user)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-mono border border-slate-700"
                      >
                        Change Role
                      </button>

                      <button
                        onClick={() => setSuspendConfirmTarget(user)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border ${
                          user.status === 'suspended'
                            ? 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {user.status === 'suspended' ? 'Restore Account' : 'Suspend Account'}
                      </button>
                    </>
                  )}

                  {user.role === 'owner' && (
                    <span className="text-[10px] font-mono text-amber-400 px-2 py-1 rounded bg-amber-950/40 border border-amber-500/30">
                      Primary Master Account
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 6: SECURITY & AUDIT TRAIL LOGS
         ===================================================================== */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#090e29]/80 border border-slate-800">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display">Cryptographic Audit Trail</h3>
              <p className="text-xs text-slate-400">Append-only administrative event log with timestamps and actor telemetry.</p>
            </div>

            <button
              onClick={handleExportAuditLogs}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Trail (JSON)</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 rounded-3xl bg-[#090e29]/80 border border-slate-800 p-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 font-mono text-[10px] font-bold border border-amber-900/50">
                      {log.action}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      By {log.actorEmail} ({log.actorRole})
                    </span>
                  </div>
                  <p className="text-slate-200">{log.details}</p>
                </div>

                <div className="text-[10px] font-mono text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ADD / EDIT NEWS ARTICLE (MANUAL PUBLISHING FORM)
         ===================================================================== */}
      {articleModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#090e29] rounded-3xl border-2 border-cyan-500/50 p-5 sm:p-7 space-y-5 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-display">
                    {editingArticle.id ? 'Edit Article — FREEDREAM NEWS' : 'Add New Article — FREEDREAM NEWS'}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    Manual publishing system • Backend-verified owner access
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setArticleModalOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => handleSaveArticle(e)} className="space-y-4">
              {/* 1. Headline */}
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-200 mb-1">
                  1. News Headline *
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="e.g. Nigerian Robotics Innovators Launch Solar-Powered Agricultural Drones"
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* 2. Short Summary */}
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-200 mb-1">
                  2. Short Summary / Lead Paragraph *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingArticle.summary || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  placeholder="Provide a concise 2-3 sentence overview that appears on news feed cards and mobile previews..."
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* 3. Full Article Text */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono font-semibold text-slate-200">
                    3. Full Article Text (Written by Owner or Licensed)
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400">Supports multi-paragraph editorial</span>
                </div>
                <textarea
                  rows={7}
                  value={editingArticle.fullText || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, fullText: e.target.value })}
                  placeholder="Write the comprehensive article text here. Separate paragraphs with blank lines. Include detailed coverage, technical analysis, quotes, and insights for readers..."
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl p-3.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* 4. News Category & 5. Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono font-semibold text-slate-200">
                      4. News Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="text-[10px] font-mono text-amber-400 hover:underline"
                    >
                      + Manage Categories
                    </button>
                  </div>
                  <select
                    value={editingArticle.category || categories[0] || 'Global Technology'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-200 mb-1">
                    6. Original News Source *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArticle.source || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, source: e.target.value })}
                    placeholder="e.g. FREEDREAM Newsroom / TechCrunch / Nature"
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* 5. Article Image URL */}
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-200 mb-1">
                  5. Article Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={editingArticle.imageUrl || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or public image link"
                    className="flex-1 bg-[#050814] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
                {/* Live Image Preview */}
                {editingArticle.imageUrl && (
                  <div className="mt-2 flex items-center gap-3 p-2.5 rounded-xl bg-[#050814] border border-slate-800">
                    <img
                      src={editingArticle.imageUrl}
                      alt="Article preview"
                      className="w-16 h-12 rounded-lg object-cover border border-slate-700"
                      onError={(e) => {
                        (e.target as any).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                    <div className="text-[11px] font-mono text-cyan-400">
                      Live image preview verified
                    </div>
                  </div>
                )}
              </div>

              {/* 7. Link to Original Source & 8. Publication Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-semibold text-slate-200 mb-1">
                    7. Link to Original Source
                  </label>
                  <input
                    type="url"
                    value={editingArticle.url || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, url: e.target.value })}
                    placeholder="https://freedream.tech or original article link"
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-200 mb-1">
                    8. Original Publication Date
                  </label>
                  <input
                    type="date"
                    value={editingArticle.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* 9. Publication Status & 10. Featured Toggle */}
              <div className="p-3.5 rounded-2xl bg-[#050814] border border-slate-800 space-y-3">
                <div className="text-xs font-mono font-semibold text-slate-200">
                  9. Publication Status
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingArticle({ ...editingArticle, isPublished: true, status: 'published' })}
                    className={`p-3 rounded-xl border text-xs font-mono text-left flex items-center justify-between transition-all cursor-pointer ${
                      editingArticle.isPublished !== false
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold shadow-md shadow-emerald-950/50'
                        : 'bg-[#090e29] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Published (Live Wire)</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Immediately visible to public users in FREEDREAM NEWS
                      </div>
                    </div>
                    {editingArticle.isPublished !== false && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingArticle({ ...editingArticle, isPublished: false, status: 'draft' })}
                    className={`p-3 rounded-xl border text-xs font-mono text-left flex items-center justify-between transition-all cursor-pointer ${
                      editingArticle.isPublished === false
                        ? 'bg-amber-950/80 border-amber-500 text-amber-200 font-bold shadow-md shadow-amber-950/50'
                        : 'bg-[#090e29] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <Save className="w-3.5 h-3.5 text-amber-400" />
                        <span>Save as Draft (Private)</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Stored securely in database; hidden from public feed
                      </div>
                    </div>
                    {editingArticle.isPublished === false && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                </div>

                {/* 10. Featured Article Setting */}
                <div className="pt-2 border-t border-slate-800/80">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-mono text-white">
                    <input
                      type="checkbox"
                      checked={editingArticle.featured || false}
                      onChange={(e) => setEditingArticle({ ...editingArticle, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                    <span>10. Optional Featured Article Setting 🌟 (Highlights at top of news wire)</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    const complete: NewsArticle = {
                      id: editingArticle.id || 'preview-temp',
                      title: editingArticle.title || 'Untitled Article Preview',
                      summary: editingArticle.summary || 'Summary preview placeholder.',
                      fullText: editingArticle.fullText || editingArticle.summary || '',
                      category: editingArticle.category || categories[0] || 'Global Technology',
                      imageUrl: editingArticle.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
                      source: editingArticle.source || 'FREEDREAM Technologies',
                      date: editingArticle.date || new Date().toISOString().split('T')[0],
                      readTime: editingArticle.readTime || '3 min read',
                      url: editingArticle.url || 'https://freedream.tech',
                      featured: editingArticle.featured || false,
                      isPublished: editingArticle.isPublished !== false
                    };
                    setPreviewArticle(complete);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Article</span>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setArticleModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveArticle(undefined, false)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save as Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveArticle(undefined, true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-black font-extrabold font-mono text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-950/50 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{editingArticle.id ? 'Publish Updates' : 'Publish Article'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ARTICLE PREVIEW (READER VIEW PREVIEW)
         ===================================================================== */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#090e29] rounded-3xl border-2 border-cyan-500/50 p-5 sm:p-7 space-y-5 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
                <Eye className="w-4 h-4" />
                <span>Article Public Reader Preview</span>
              </div>
              <button 
                onClick={() => setPreviewArticle(null)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cover Image */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-56 sm:h-72 bg-slate-900">
              <img
                src={previewArticle.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'}
                alt={previewArticle.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as any).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop';
                }}
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-cyan-300 font-mono text-[11px] font-bold border border-cyan-500/40">
                  {previewArticle.category}
                </span>
                {previewArticle.featured && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-black font-mono text-[11px] font-bold">
                    🌟 Featured
                  </span>
                )}
              </div>
            </div>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{previewArticle.source}</span>
                <span>•</span>
                <span>{previewArticle.date}</span>
                <span>•</span>
                <span>{previewArticle.readTime}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                previewArticle.isPublished 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}>
                {previewArticle.isPublished ? 'Status: Published' : 'Status: Draft'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-xl sm:text-2xl font-black font-display text-white leading-tight">
              {previewArticle.title}
            </h1>

            {/* Summary Lead */}
            <div className="p-4 rounded-2xl bg-cyan-950/20 border-l-4 border-cyan-400 text-xs sm:text-sm text-cyan-200 font-mono leading-relaxed">
              {previewArticle.summary}
            </div>

            {/* Full Article Text */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans border-t border-slate-800/80 pt-4">
              {previewArticle.fullText ? (
                previewArticle.fullText.split('\n\n').map((para, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-slate-400 italic font-mono text-xs">
                  (No separate full text provided; summary serves as main body.)
                </p>
              )}
            </div>

            {/* External Link */}
            {previewArticle.url && (
              <div className="p-3 rounded-xl bg-[#050814] border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">External Original Link:</span>
                <a
                  href={previewArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                >
                  <span>{previewArticle.url}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setPreviewArticle(null)}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: MANAGE CATEGORIES (ADD, RENAME, DELETE)
         ===================================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#090e29] rounded-3xl border-2 border-amber-500/50 p-5 sm:p-7 space-y-5 shadow-2xl my-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Manage News Categories
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    Add, rename, or remove categories across FREEDREAM NEWS
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCatOldName(null);
                  setCategoryDeletingName(null);
                }} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} className="space-y-2">
              <label className="block text-xs font-mono font-semibold text-slate-200">
                Add New Category
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Quantum Computing & Semiconductors"
                  className="flex-1 bg-[#050814] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Category</span>
                </button>
              </div>
            </form>

            {/* Active Categories List */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-300">
                Current Categories ({categories.length})
              </div>
              <div className="divide-y divide-slate-800/80 rounded-2xl bg-[#050814] border border-slate-800 max-h-64 overflow-y-auto p-2">
                {categories.map((cat) => {
                  const articleCount = newsList.filter(n => n.category === cat).length;
                  const isEditingThis = editingCatOldName === cat;
                  const isDeletingThis = categoryDeletingName === cat;

                  return (
                    <div key={cat} className="p-2.5 flex items-center justify-between gap-2">
                      {isEditingThis ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingCatNewName}
                            onChange={(e) => setEditingCatNewName(e.target.value)}
                            className="flex-1 bg-slate-900 border border-cyan-500 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleRenameCategory(cat, editingCatNewName)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500 text-black font-mono text-xs font-bold"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCatOldName(null)}
                            className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : isDeletingThis ? (
                        <div className="flex items-center justify-between w-full p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/50">
                          <span className="text-[11px] font-mono text-rose-300">
                            Delete "{cat}"? Articles will be reassigned.
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat)}
                              className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-mono text-[11px] font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setCategoryDeletingName(null)}
                              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-white font-semibold">{cat}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 font-mono text-[10px]">
                              {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCatOldName(cat);
                                setEditingCatNewName(cat);
                              }}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
                              title="Rename Category"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setCategoryDeletingName(cat)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: DELETE ARTICLE CONFIRMATION
         ===================================================================== */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#090e29] rounded-3xl border border-rose-500/60 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold font-display text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>Confirm Article Deletion</span>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete this news article from the FREEDREAM database? This action is recorded in the security audit trail.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteArticle(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-xs"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: BROADCAST ANNOUNCEMENT CONFIRMATION
         ===================================================================== */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090e29] rounded-3xl border-2 border-amber-500/60 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold font-display text-sm">
                <Radio className="w-4 h-4" />
                <span>Broadcast Official FREEDREAM Announcement</span>
              </div>
              <button onClick={() => setBroadcastModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcastAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Announcement Priority / Category</label>
                <select
                  value={broadcastCategory}
                  onChange={(e) => setBroadcastCategory(e.target.value as any)}
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                >
                  <option value="Urgent">🚨 Urgent Security / Operational</option>
                  <option value="Update">🚀 Platform Telemetry Update</option>
                  <option value="Milestone">🏆 Hackathon / Challenge Milestone</option>
                  <option value="Feature">✨ New Hardware / AI Feature</option>
                  <option value="Maintenance">🛠️ Scheduled Maintenance Window</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. FREEDREAM Neural Matrix 2.5 Active"
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Broadcast Message Body</label>
                <textarea
                  required
                  rows={3}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Write message to be shown across user notification bells and homepage..."
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl p-3 text-xs text-white font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-200">
                ⚠️ <strong>Confirmation Required:</strong> This notice will immediately appear on all active client devices upon refresh.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBroadcastModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold font-mono text-xs flex items-center justify-center gap-1.5"
                >
                  <Radio className="w-4 h-4" />
                  <span>Confirm Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: USER ROLE UPDATE
         ===================================================================== */}
      {userRoleModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#090e29] rounded-3xl border border-cyan-500/50 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-sm text-white font-display">Assign User Role</span>
              <button onClick={() => setUserRoleModalTarget(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select new role permissions for <strong className="text-cyan-400">{userRoleModalTarget.name}</strong> ({userRoleModalTarget.email}):
            </p>

            <div className="space-y-2">
              {(['user', 'moderator', 'admin'] as AdminRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => handleUpdateRole(userRoleModalTarget.id, r)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono text-left flex items-center justify-between ${
                    userRoleModalTarget.role === r
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                      : 'bg-[#050814] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="uppercase font-bold">{r}</span>
                  {userRoleModalTarget.role === r && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setUserRoleModalTarget(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: SUSPEND / RESTORE USER CONFIRMATION
         ===================================================================== */}
      {suspendConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#090e29] rounded-3xl border border-rose-500/60 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold font-display text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Account Status Change</span>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to {suspendConfirmTarget.status === 'suspended' ? 'restore' : 'suspend'} the account of{' '}
              <strong className="text-white">{suspendConfirmTarget.name}</strong> ({suspendConfirmTarget.email})?
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSuspendConfirmTarget(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleSuspendUser(suspendConfirmTarget)}
                className={`flex-1 py-2 rounded-xl text-white font-bold font-mono text-xs ${
                  suspendConfirmTarget.status === 'suspended'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {suspendConfirmTarget.status === 'suspended' ? 'Confirm Restore' : 'Confirm Suspension'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
