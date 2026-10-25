export type NavigationTab = 
  | 'dashboard' 
  | 'novalab' 
  | 'ai' 
  | 'academy' 
  | 'hub' 
  | 'news' 
  | 'profile'
  | 'owner';

export type Currency = 'USD' | 'NGN';

export interface MaterialItem {
  name: string;
  costUsd: number;
  costNgn: number;
  quantity?: number;
}

export interface InventionProject {
  id: string;
  title: string;
  category: 'Robotics' | 'AI & Software' | 'Agritech' | 'Clean Energy' | 'Healthcare' | 'Space';
  abstract: string;
  problemStatement: string;
  solution: string;
  materials: MaterialItem[];
  estimatedTotalUsd: number;
  estimatedTotalNgn: number;
  codeSnippet?: string;
  codeLanguage?: string;
  circuitSteps?: string[];
  experimentProtocols?: string[];
  stage: 'Concept' | 'Prototype' | 'Testing' | 'Deployed';
  progressPercentage: number;
  notes?: string;
  createdAt: string;
}

export interface CommunityProject {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  location: string;
  category: 'Robotics' | 'AI & Software' | 'Agritech' | 'Clean Energy' | 'Healthcare' | 'Space';
  summary: string;
  problem: string;
  solution: string;
  materials: MaterialItem[];
  votes: number;
  votedUserIds: string[];
  commentsCount: number;
  stage: 'Concept' | 'Prototype' | 'Testing' | 'Deployed';
  createdAt: string;
  codeSnippet?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  summary: string;
  fullText?: string;
  url: string;
  featured?: boolean;
  isPublished?: boolean;
  status?: 'draft' | 'published';
  scheduledAt?: string;
  authorEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TechChallenge {
  id: string;
  title: string;
  sponsor: string;
  prizePool: string;
  deadline: string;
  participants: number;
  badge: string;
  description: string;
  focusAreas: string[];
}

export interface AcademyLesson {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
  content?: string;
  codeSnippet?: string;
  codeLanguage?: string;
  takeaways?: string[];
  challenge?: string;
}

export interface AcademyQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface AcademyCourse {
  id: string;
  title: string;
  category: string;
  level: string;
  modulesCount: number;
  duration: string;
  rating: number;
  xpReward: number;
  enrolledCount: number;
  icon: string;
  summary: string;
  lessons: AcademyLesson[];
  quiz: AcademyQuiz;
}

export interface ExperimentRecord {
  id: string;
  projectId: string;
  projectTitle: string;
  trialNumber: number;
  hypothesis: string;
  metricObserved: string;
  expectedValue: string;
  actualValue: string;
  status: 'Passed' | 'Failed' | 'Inconclusive';
  observations: string;
  date: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  role: string;
  location: string;
  avatar: string;
  bio: string;
  xp: number;
  level: number;
  streakDays: number;
  completedCourses: string[];
  savedArticles: string[];
  savedProjectIds: string[];
  bookmarkedIdeas: string[];
  currency: Currency;
  accentGlow: 'cyan' | 'gold';
  phoneFrameMode: boolean;
}

export type AdminRole = 'owner' | 'admin' | 'moderator' | 'user';

export interface OwnerUser {
  id: string;
  name: string;
  email: string;
  handle: string;
  role: AdminRole;
  avatar: string;
  location: string;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLoginAt?: string;
}

export interface FeatureSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  welcomeHeadline: string;
  welcomeSubmessage: string;
  aiAssistantEnabled: boolean;
  novaLabEnabled: boolean;
  communityHubSubmissions: boolean;
  academyQuizzes: boolean;
  featuredNewsBanner: boolean;
  spaceUpdatesSection: boolean;
  africanTechSpotlight: boolean;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  category: 'Urgent' | 'Update' | 'Maintenance' | 'Feature' | 'Milestone';
  active: boolean;
  createdAt: string;
  authorEmail: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actorEmail: string;
  actorRole: string;
  target?: string;
  details: string;
  ipAddress?: string;
}

export interface FeedbackReport {
  id: string;
  userId: string;
  userName: string;
  category: string;
  message: string;
  createdAt: string;
  status: 'open' | 'resolved';
}

export interface OwnerDashboardStats {
  totalUsers: number;
  activeUsers: number;
  publishedNews: number;
  totalNewsArticles: number;
  activeProjects: number;
  announcementsCount: number;
  maintenanceMode: boolean;
  systemHealth: {
    serverStatus: string;
    uptime: string;
    telemetryLatencyMs: number;
    databaseStatus: string;
    neuralEngineStatus: string;
  };
  recentLogs: AuditLogEntry[];
}

