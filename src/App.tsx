/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  UserProfile, 
  InventionProject, 
  CommunityProject, 
  NewsArticle, 
  TechChallenge, 
  AcademyCourse, 
  ExperimentRecord,
  FeatureSettings
} from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SearchModal } from './components/SearchModal';
import { NotificationModal, AppNotification } from './components/NotificationModal';
import { PublishShareModal } from './components/PublishShareModal';

// Views
import { DashboardView } from './views/DashboardView';
import { NovaLabView } from './views/NovaLabView';
import { AiAssistantView } from './views/AiAssistantView';
import { AcademyView } from './views/AcademyView';
import { InnovationHubView } from './views/InnovationHubView';
import { NewsView } from './views/NewsView';
import { ProfileView } from './views/ProfileView';
import { OwnerControlCenterView } from './views/OwnerControlCenterView';

export default function App() {
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    return !sessionStorage.getItem('freedream_welcome_seen');
  });

  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('freedream_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      name: 'FREEDREAM Innovator',
      handle: '@innovator',
      role: 'Hardware & AI Explorer',
      location: 'Lagos, Nigeria',
      avatar: '🚀',
      bio: 'Exploring deep-tech breakthroughs, designing prototypes in NovaLab, and collaborating on the future of technology.',
      xp: 150,
      level: 1,
      streakDays: 1,
      completedCourses: [],
      savedArticles: [],
      savedProjectIds: [],
      bookmarkedIdeas: [],
      currency: 'NGN',
      accentGlow: 'cyan',
      phoneFrameMode: false,
    };
  });

  // Saved NovaLab Projects
  const [savedProjects, setSavedProjects] = useState<InventionProject[]>(() => {
    const saved = localStorage.getItem('freedream_saved_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Experiment records
  const [experimentRecords, setExperimentRecords] = useState<ExperimentRecord[]>(() => {
    const saved = localStorage.getItem('freedream_experiments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Community Hub Projects
  const [communityProjects, setCommunityProjects] = useState<CommunityProject[]>([]);
  // News Articles
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  // Feature Matrix Settings
  const [featureSettings, setFeatureSettings] = useState<FeatureSettings | null>(null);
  // Tech Challenges
  const [challenges, setChallenges] = useState<TechChallenge[]>([]);
  // Academy Courses
  const [academyCourses, setAcademyCourses] = useState<AcademyCourse[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Innovation Hub Ready',
      message: 'Welcome to the FREEDREAM Innovation Hub. Share your invention and explore open blueprints.',
      time: 'Just now',
      category: 'System',
      read: false,
      targetTab: 'hub'
    },
    {
      id: 'notif-2',
      title: 'James Webb Exoplanet Telemetry',
      message: 'Spectroscopic mapping confirms organic carbon-bearing molecules in the habitable zone of star K2-18.',
      time: '2h ago',
      category: 'Space',
      read: false,
      targetTab: 'news'
    },
    {
      id: 'notif-3',
      title: 'FREEDREAM Neural Matrix Online',
      message: 'Full-stack AI Engine ready for real-time invention blueprint synthesis and hardware guidance.',
      time: '1d ago',
      category: 'AI',
      read: true,
      targetTab: 'ai'
    }
  ]);

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('freedream_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('freedream_saved_projects', JSON.stringify(savedProjects));
  }, [savedProjects]);

  useEffect(() => {
    localStorage.setItem('freedream_experiments', JSON.stringify(experimentRecords));
  }, [experimentRecords]);

  // Public News Sync Helper
  const fetchPublicNews = async () => {
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        setNewsArticles(data.articles || []);
      }
    } catch (e) {
      console.error('Failed to sync public news:', e);
    }
  };

  // Feature Settings Sync Helper
  const fetchFeatureSettings = async () => {
    try {
      const res = await fetch('/api/features');
      if (res.ok) {
        const data = await res.json();
        setFeatureSettings(data.features || null);
      }
    } catch (e) {
      console.error('Failed to sync feature settings:', e);
    }
  };

  // Initial Data Fetching from Express backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, hubRes, chalRes, acadRes, featRes] = await Promise.all([
          fetch('/api/news'),
          fetch('/api/hub/projects'),
          fetch('/api/challenges'),
          fetch('/api/academy/courses'),
          fetch('/api/features')
        ]);

        if (newsRes.ok) {
          const data = await newsRes.json();
          setNewsArticles(data.articles || []);
        }
        if (hubRes.ok) {
          const data = await hubRes.json();
          setCommunityProjects(data.projects || []);
        }
        if (chalRes.ok) {
          const data = await chalRes.json();
          setChallenges(data.challenges || []);
        }
        if (acadRes.ok) {
          const data = await acadRes.json();
          setAcademyCourses(data.courses || []);
        }
        if (featRes.ok) {
          const data = await featRes.json();
          setFeatureSettings(data.features || null);
        }
      } catch (err) {
        console.error('Failed to fetch initial platform data:', err);
      }
    };

    fetchData();
  }, []);

  const handleEnterPlatform = () => {
    setShowWelcome(false);
    sessionStorage.setItem('freedream_welcome_seen', 'true');
  };

  const handleToggleCurrency = () => {
    setUserProfile(prev => ({
      ...prev,
      currency: prev.currency === 'USD' ? 'NGN' : 'USD'
    }));
  };

  const handleTogglePhoneFrame = () => {
    setUserProfile(prev => ({
      ...prev,
      phoneFrameMode: !prev.phoneFrameMode
    }));
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updated }));
  };

  const handleSaveProject = (project: InventionProject) => {
    setSavedProjects(prev => {
      const exists = prev.some(p => p.id === project.id);
      if (exists) {
        return prev.map(p => p.id === project.id ? project : p);
      }
      return [project, ...prev];
    });

    setUserProfile(prev => ({
      ...prev,
      xp: prev.xp + 50,
      savedProjectIds: [...new Set([...prev.savedProjectIds, project.id])]
    }));
  };

  const handleUpdateProject = (project: InventionProject) => {
    setSavedProjects(prev => prev.map(p => p.id === project.id ? project : p));
  };

  const handleRemoveProject = (projectId: string) => {
    setSavedProjects(prev => prev.filter(p => p.id !== projectId));
    setUserProfile(prev => ({
      ...prev,
      savedProjectIds: prev.savedProjectIds.filter(id => id !== projectId)
    }));
  };

  const handleAddExperiment = (record: ExperimentRecord) => {
    setExperimentRecords(prev => [record, ...prev]);
    setUserProfile(prev => ({
      ...prev,
      xp: prev.xp + 40
    }));
  };

  const handleBookmarkIdea = (idea: string) => {
    setUserProfile(prev => ({
      ...prev,
      bookmarkedIdeas: prev.bookmarkedIdeas.includes(idea)
        ? prev.bookmarkedIdeas
        : [idea, ...prev.bookmarkedIdeas]
    }));
  };

  const handleRemoveIdea = (idea: string) => {
    setUserProfile(prev => ({
      ...prev,
      bookmarkedIdeas: prev.bookmarkedIdeas.filter(i => i !== idea)
    }));
  };

  const handleBookmarkArticle = (articleId: string) => {
    setUserProfile(prev => ({
      ...prev,
      savedArticles: prev.savedArticles.includes(articleId)
        ? prev.savedArticles.filter(id => id !== articleId)
        : [...prev.savedArticles, articleId]
    }));
  };

  const handleCompleteCourse = (courseId: string, xpEarned: number) => {
    setUserProfile(prev => {
      const already = prev.completedCourses.includes(courseId);
      if (already) return prev;
      const newXp = prev.xp + xpEarned;
      const newLevel = Math.floor(newXp / 300) + 1;
      return {
        ...prev,
        xp: newXp,
        level: Math.max(prev.level, newLevel),
        completedCourses: [...prev.completedCourses, courseId]
      };
    });
  };

  const handleVoteProject = async (projectId: string) => {
    try {
      const res = await fetch(`/api/hub/projects/${projectId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'current_user' })
      });
      const data = await res.json();
      if (data.success) {
        setCommunityProjects(prev => prev.map(p => {
          if (p.id === projectId) {
            return {
              ...p,
              votes: data.votes,
              votedUserIds: data.hasVoted 
                ? [...p.votedUserIds, 'current_user'] 
                : p.votedUserIds.filter(u => u !== 'current_user')
            };
          }
          return p;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitCommunityProject = async (projectData: Partial<CommunityProject>) => {
    try {
      const res = await fetch('/api/hub/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      const data = await res.json();
      if (data.project) {
        setCommunityProjects(prev => [data.project, ...prev]);
        setUserProfile(prev => ({ ...prev, xp: prev.xp + 100 }));
        alert(`Your invention "${data.project.title}" was submitted to the FREEDREAM Innovation Commons!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Render the Welcome / Splash screen if active
  if (showWelcome) {
    return <WelcomeScreen onEnter={handleEnterPlatform} />;
  }

  // App Main Shell
  const appContent = (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        userProfile={userProfile}
        onToggleCurrency={handleToggleCurrency}
        onTogglePhoneFrame={handleTogglePhoneFrame}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-5 pb-28 lg:pb-8">
        {/* Maintenance Mode Banner for active users when enabled by Owner */}
        {featureSettings?.maintenanceMode && currentTab !== 'owner' && (
          <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-950/90 via-[#0c1538] to-[#050814] border-2 border-rose-500/70 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-mono text-rose-300 font-extrabold uppercase tracking-wider">
                  FREEDREAM SYSTEM MAINTENANCE IN PROGRESS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200">
                {featureSettings.maintenanceMessage || 'Platform telemetry upgrade in progress. Regular services will resume shortly.'}
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('owner')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold font-mono text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-all cursor-pointer"
            >
              <span>👑 Owner Suite Bypass</span>
            </button>
          </div>
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            onNavigate={setCurrentTab}
            newsArticles={newsArticles}
            onBookmarkIdea={handleBookmarkIdea}
            onOpenPublishModal={() => setIsPublishModalOpen(true)}
          />
        )}

        {currentTab === 'novalab' && (
          <NovaLabView
            userProfile={userProfile}
            savedProjects={savedProjects}
            onSaveProject={handleSaveProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleRemoveProject}
            experimentRecords={experimentRecords}
            onAddExperimentRecord={handleAddExperiment}
          />
        )}

        {currentTab === 'ai' && (
          <AiAssistantView
            userProfile={userProfile}
            onExportToNovaLab={handleSaveProject}
          />
        )}

        {currentTab === 'academy' && (
          <AcademyView
            userProfile={userProfile}
            courses={academyCourses}
            onCompleteCourse={handleCompleteCourse}
          />
        )}

        {currentTab === 'hub' && (
          <InnovationHubView
            userProfile={userProfile}
            projects={communityProjects}
            challenges={challenges}
            onVoteProject={handleVoteProject}
            onSubmitProject={handleSubmitCommunityProject}
          />
        )}

        {currentTab === 'news' && (
          <NewsView
            articles={newsArticles}
            userProfile={userProfile}
            onBookmarkArticle={handleBookmarkArticle}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            savedProjects={savedProjects}
            newsArticles={newsArticles}
            onRemoveProject={handleRemoveProject}
            onRemoveBookmark={handleBookmarkArticle}
            onRemoveIdea={handleRemoveIdea}
            onOpenPublishModal={() => setIsPublishModalOpen(true)}
            onNavigateToOwner={() => setCurrentTab('owner')}
          />
        )}

        {currentTab === 'owner' && (
          <OwnerControlCenterView
            onBackToApp={() => setCurrentTab('dashboard')}
            onNavigateTab={setCurrentTab}
            onRefreshPublicNews={fetchPublicNews}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setCurrentTab}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onNavigate={setCurrentTab}
      />

      {/* Publish & App Sharing Modal */}
      <PublishShareModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />
    </div>
  );

  // If Phone Frame Simulator is enabled on larger screens
  if (userProfile.phoneFrameMode) {
    return (
      <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-2 sm:p-6 bg-circuit-dots">
        {/* Device Frame Wrapper */}
        <div className="relative w-full max-w-[430px] h-[92vh] max-h-[880px] bg-[#050814] rounded-[44px] border-[10px] border-[#162142] shadow-[0_0_60px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden">
          {/* Android Speaker Grill & Camera Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-1 rounded-full bg-black/90 border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-900 border border-cyan-400/40" />
            <span className="w-12 h-1 rounded-full bg-slate-800" />
          </div>

          {/* Android Status Bar */}
          <div className="h-7 w-full bg-[#050814] flex items-center justify-between px-6 text-[10px] font-mono text-cyan-400 select-none shrink-0 pt-1">
            <span>09:45</span>
            <div className="flex items-center gap-1.5 text-[9px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Scrollable Viewport inside handset */}
          <div className="flex-1 overflow-y-auto">
            {appContent}
          </div>
        </div>
      </div>
    );
  }

  return appContent;
}
