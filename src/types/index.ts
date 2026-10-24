export type NavigationTab = 
  | 'dashboard' 
  | 'novalab' 
  | 'ai' 
  | 'academy' 
  | 'hub' 
  | 'news' 
  | 'profile';

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
  url: string;
  featured?: boolean;
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
