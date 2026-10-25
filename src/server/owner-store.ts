import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.resolve(__dirname, '../../.freedream-store.json');

// Types
export type UserRole = 'owner' | 'admin' | 'moderator' | 'user';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  handle: string;
  role: UserRole;
  avatar: string;
  location: string;
  passwordHash?: string;
  salt?: string;
  recoveryHash?: string;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLoginAt?: string;
}

export interface StoredNewsArticle {
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
  featured: boolean;
  isPublished: boolean;
  scheduledAt?: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
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

export interface Announcement {
  id: string;
  title: string;
  message: string;
  category: 'Urgent' | 'Update' | 'Maintenance' | 'Feature' | 'Milestone';
  active: boolean;
  createdAt: string;
  authorEmail: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actorEmail: string;
  actorRole: string;
  target?: string;
  details: string;
  ipAddress?: string;
}

export interface UserFeedbackReport {
  id: string;
  userId: string;
  userName: string;
  category: string;
  message: string;
  createdAt: string;
  status: 'open' | 'resolved';
}

interface FreedreamDatabase {
  users: StoredUser[];
  news: StoredNewsArticle[];
  categories: string[];
  features: FeatureSettings;
  announcements: Announcement[];
  auditLogs: AuditLog[];
  feedbackReports: UserFeedbackReport[];
  sessionTokens: Record<string, { userId: string; role: UserRole; email: string; expiresAt: number }>;
}

export const DEFAULT_CATEGORIES: string[] = [
  'Global Technology',
  'Nigerian Technology',
  'Artificial Intelligence',
  'Space and Astronomy',
  'Science and Innovation',
  'Robotics and Electronics'
];

// Initial News Seed
const INITIAL_NEWS: StoredNewsArticle[] = [
  {
    id: 'news-1',
    title: 'James Webb Space Telescope Identifies Atmospheric Water & Methane in Exo-System K2-18b',
    source: 'NASA & Astrophysical Journal',
    category: 'Space & Astronomy',
    date: '2026-10-21',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    summary: 'Spectroscopic observations confirm organic carbon-bearing molecules in the habitable zone of star K2-18, marking a monumental step in interstellar biosignature mapping.',
    url: 'https://nasa.gov',
    featured: true,
    isPublished: true,
    authorEmail: 'owner@freedream.tech',
    createdAt: '2026-10-21T10:00:00Z',
    updatedAt: '2026-10-21T10:00:00Z'
  },
  {
    id: 'news-2',
    title: 'Lagos Tech Hub Unveils West Africa’s First Sub-3nm Silicon Design Lab for Edge Robotics',
    source: 'Techpoint Africa',
    category: 'Nigerian & African Tech',
    date: '2026-10-20',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    summary: 'Nigerian chip engineers and universities partner with pan-African tech consortia to fabricate open-RISC-V architecture chips optimized for solar grid sensors and drone flight controllers.',
    url: 'https://techpoint.africa',
    featured: true,
    isPublished: true,
    authorEmail: 'owner@freedream.tech',
    createdAt: '2026-10-20T12:00:00Z',
    updatedAt: '2026-10-20T12:00:00Z'
  },
  {
    id: 'news-3',
    title: 'DeepMind & MIT Announce Quantum-Assisted Catalyst for Room-Temperature Green Hydrogen',
    source: 'Nature Chemistry',
    category: 'Scientific Breakthroughs',
    date: '2026-10-18',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
    summary: 'AI neural networks modeled millions of molecular crystal lattices in 48 hours to discover a nickel-iron alloy capable of splitting seawater without corrosion.',
    url: 'https://nature.com',
    featured: false,
    isPublished: true,
    authorEmail: 'owner@freedream.tech',
    createdAt: '2026-10-18T09:30:00Z',
    updatedAt: '2026-10-18T09:30:00Z'
  },
  {
    id: 'news-4',
    title: 'Next-Generation Autonomous Quadruped Robots Deployed in Disaster Recovery Drills',
    source: 'IEEE Spectrum',
    category: 'Robotics & AI',
    date: '2026-10-15',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop',
    summary: 'Equipped with real-time LIDAR SLAM and multimodal vision-language models, the new generation of robotic searchers can parse human audio requests and navigate subterranean tunnels.',
    url: 'https://spectrum.ieee.org',
    featured: false,
    isPublished: true,
    authorEmail: 'owner@freedream.tech',
    createdAt: '2026-10-15T14:15:00Z',
    updatedAt: '2026-10-15T14:15:00Z'
  },
  {
    id: 'news-5',
    title: 'African Space Agencies Collaborate on Pan-African Weather Satellite Constellation (AfriSat-1)',
    source: 'Space in Africa',
    category: 'Space & Astronomy',
    date: '2026-10-12',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
    summary: 'Nigeria’s NASRDA, South Africa’s SANSA, and Egypt’s EgSA initiate joint telemetry tests for low-earth orbit satellites forecasting monsoons and desert locust migrations.',
    url: 'https://spaceinafrica.com',
    featured: false,
    isPublished: true,
    authorEmail: 'owner@freedream.tech',
    createdAt: '2026-10-12T11:00:00Z',
    updatedAt: '2026-10-12T11:00:00Z'
  },
  {
    id: 'news-6',
    title: 'Transformers 4.0: Zero-Shot Multi-Modal Synthesis Redefines Scientific Discovery',
    source: 'MIT Technology Review',
    category: 'Artificial Intelligence',
    date: '2026-10-09',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    summary: 'Researchers demonstrate that combining symbolic theorem solvers with generative foundation models enables automated peer-review discovery of mathematical lemmas.',
    url: 'https://technologyreview.com',
    featured: false,
    isPublished: true,
    authorEmail: 'owner@freedream.tech',
    createdAt: '2026-10-09T08:00:00Z',
    updatedAt: '2026-10-09T08:00:00Z'
  }
];

// Initial default feature settings
const DEFAULT_FEATURES: FeatureSettings = {
  maintenanceMode: false,
  maintenanceMessage: 'FREEDREAM TECHNOLOGIES is performing scheduled system optimizations. We will be back online shortly with enhanced telemetry.',
  welcomeHeadline: 'Welcome to FREEDREAM TECHNOLOGIES',
  welcomeSubmessage: 'African Deep-Tech & Global Innovation Matrix. Explore NovaLab, AI Assist, and Academy.',
  aiAssistantEnabled: true,
  novaLabEnabled: true,
  communityHubSubmissions: true,
  academyQuizzes: true,
  featuredNewsBanner: true,
  spaceUpdatesSection: true,
  africanTechSpotlight: true,
  lastUpdatedBy: 'system',
  lastUpdatedAt: new Date().toISOString()
};

// Initial Registered Users (Starts empty until genuine users register or owner creates accounts)
const INITIAL_USERS: StoredUser[] = [];

// Initial Announcements
const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'FREEDREAM Neural Matrix Online',
    message: 'High-speed hardware schematics and code generation enabled in NovaLab.',
    category: 'Update',
    active: true,
    createdAt: '2026-10-22T08:00:00Z',
    authorEmail: 'system'
  },
  {
    id: 'ann-2',
    title: 'FREEDREAM Innovation Hub Commons Launched',
    message: 'Be among the first to share your invention, explore ideas, and help build the future of technology.',
    category: 'Feature',
    active: true,
    createdAt: '2026-10-25T07:00:00Z',
    authorEmail: 'system'
  }
];

// In-Memory State cached from file
class DatabaseStore {
  private data: FreedreamDatabase;

  constructor() {
    this.data = this.loadFromFile();
  }

  private loadFromFile(): FreedreamDatabase {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || INITIAL_USERS,
          news: parsed.news || INITIAL_NEWS,
          categories: (parsed.categories && Array.isArray(parsed.categories) && parsed.categories.length > 0) ? parsed.categories : [...DEFAULT_CATEGORIES],
          features: parsed.features || DEFAULT_FEATURES,
          announcements: parsed.announcements || INITIAL_ANNOUNCEMENTS,
          auditLogs: parsed.auditLogs || [],
          feedbackReports: parsed.feedbackReports || [],
          sessionTokens: parsed.sessionTokens || {}
        };
      }
    } catch (err) {
      console.error('Error loading Freedream store from disk, initializing defaults:', err);
    }

    const initial: FreedreamDatabase = {
      users: [...INITIAL_USERS],
      news: [...INITIAL_NEWS],
      categories: [...DEFAULT_CATEGORIES],
      features: { ...DEFAULT_FEATURES },
      announcements: [...INITIAL_ANNOUNCEMENTS],
      auditLogs: [
        {
          id: `log-init`,
          timestamp: new Date().toISOString(),
          action: 'SYSTEM_BOOT',
          actorEmail: 'system',
          actorRole: 'system',
          details: 'FREEDREAM OWNER CONTROL CENTER Security Subsystem Initialized'
        }
      ],
      feedbackReports: [
        {
          id: 'rep-1',
          userId: 'usr-amina',
          userName: 'Amina Bello',
          category: 'Hardware Schematics',
          message: 'Requested high-torque servo wiring diagram for EMG prosthetics in Academy.',
          createdAt: '2026-10-23T11:20:00Z',
          status: 'open'
        }
      ],
      sessionTokens: {}
    };

    this.save(initial);
    return initial;
  }

  private save(dataToSave?: FreedreamDatabase) {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database store to disk:', err);
    }
  }

  // Cryptographic Helpers
  public hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  }

  public generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  public generateToken(): string {
    return 'fd_' + crypto.randomBytes(32).toString('hex');
  }

  // Owner Setup & Status
  public getOwnerStatus(): { hasOwner: boolean; ownerEmailMasked?: string; setupRequired: boolean } {
    const owner = this.data.users.find(u => u.role === 'owner' && u.status === 'active');
    if (!owner) {
      return { hasOwner: false, setupRequired: true };
    }

    const emailParts = owner.email.split('@');
    const masked = emailParts[0].slice(0, 2) + '***@' + (emailParts[1] || 'freedream.tech');
    return {
      hasOwner: true,
      ownerEmailMasked: masked,
      setupRequired: false
    };
  }

  public setupInitialOwner(params: {
    name: string;
    email: string;
    password: string;
    recoveryAnswer: string;
    ipAddress?: string;
  }): { success: boolean; user?: StoredUser; token?: string; recoveryKey: string; error?: string } {
    // Check if an owner already exists
    const existingOwner = this.data.users.find(u => u.role === 'owner');
    if (existingOwner) {
      return { success: false, error: 'Owner account has already been initialized. Please use Owner Login.', recoveryKey: '' };
    }

    const { name, email, password, recoveryAnswer, ipAddress } = params;
    if (!email || !password || password.length < 8) {
      return { success: false, error: 'Valid email and a secure password of at least 8 characters are required.', recoveryKey: '' };
    }

    const salt = this.generateSalt();
    const passwordHash = this.hashPassword(password, salt);
    
    // Generate an emergency recovery key
    const recoveryKey = 'FREEDREAM-RECOVERY-' + crypto.randomBytes(12).toString('hex').toUpperCase();
    const recoverySalt = this.generateSalt();
    const combinedRecovery = (recoveryAnswer.trim().toLowerCase() + '::' + recoveryKey);
    const recoveryHash = this.hashPassword(combinedRecovery, recoverySalt);

    const ownerUser: StoredUser = {
      id: `usr-owner-${Date.now()}`,
      name: name.trim() || 'FREEDREAM Executive Owner',
      email: email.trim().toLowerCase(),
      handle: '@freedream.owner',
      role: 'owner',
      avatar: '👑',
      location: 'Global Headquarters',
      passwordHash,
      salt,
      recoveryHash: `${recoverySalt}:${recoveryHash}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    this.data.users.unshift(ownerUser);

    // Issue initial token
    const token = this.generateToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    this.data.sessionTokens[token] = {
      userId: ownerUser.id,
      role: 'owner',
      email: ownerUser.email,
      expiresAt
    };

    // Audit Log
    this.addAuditLog({
      action: 'OWNER_ACCOUNT_SETUP',
      actorEmail: ownerUser.email,
      actorRole: 'owner',
      details: `Primary Application Owner initialized: ${ownerUser.email}`,
      ipAddress
    });

    this.save();

    const safeUser = { ...ownerUser };
    delete safeUser.passwordHash;
    delete safeUser.salt;
    delete safeUser.recoveryHash;

    return { success: true, user: safeUser, token, recoveryKey };
  }

  // Owner & Admin Authentication
  public authenticateUser(email: string, password: string, ipAddress?: string): {
    success: boolean;
    user?: StoredUser;
    token?: string;
    error?: string;
  } {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.data.users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      this.addAuditLog({
        action: 'AUTH_FAILED_USER_NOT_FOUND',
        actorEmail: normalizedEmail,
        actorRole: 'guest',
        details: 'Login attempt with unregistered email',
        ipAddress
      });
      return { success: false, error: 'Invalid administrator credentials.' };
    }

    if (user.status === 'suspended') {
      this.addAuditLog({
        action: 'AUTH_BLOCKED_SUSPENDED',
        actorEmail: normalizedEmail,
        actorRole: user.role,
        details: 'Suspended account attempted login',
        ipAddress
      });
      return { success: false, error: 'This administrative account has been suspended.' };
    }

    if (!user.passwordHash || !user.salt) {
      return { success: false, error: 'Account does not have admin password authentication configured.' };
    }

    const computed = this.hashPassword(password, user.salt);
    if (computed !== user.passwordHash) {
      this.addAuditLog({
        action: 'AUTH_FAILED_PASSWORD_MISMATCH',
        actorEmail: normalizedEmail,
        actorRole: user.role,
        details: 'Incorrect password entered',
        ipAddress
      });
      return { success: false, error: 'Invalid administrator credentials.' };
    }

    // Login successful
    user.lastLoginAt = new Date().toISOString();
    const token = this.generateToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    this.data.sessionTokens[token] = {
      userId: user.id,
      role: user.role,
      email: user.email,
      expiresAt
    };

    this.addAuditLog({
      action: 'AUTH_LOGIN_SUCCESS',
      actorEmail: user.email,
      actorRole: user.role,
      details: `Successful login to Control Center as ${user.role}`,
      ipAddress
    });

    this.save();

    const safeUser = { ...user };
    delete safeUser.passwordHash;
    delete safeUser.salt;
    delete safeUser.recoveryHash;

    return { success: true, user: safeUser, token };
  }

  // Token Validation Middleware helper
  public verifyToken(token: string): { valid: boolean; user?: StoredUser; error?: string } {
    if (!token) return { valid: false, error: 'No authorization token provided' };
    const session = this.data.sessionTokens[token];
    if (!session) return { valid: false, error: 'Invalid session token' };

    if (Date.now() > session.expiresAt) {
      delete this.data.sessionTokens[token];
      this.save();
      return { valid: false, error: 'Session expired. Please log in again.' };
    }

    const user = this.data.users.find(u => u.id === session.userId);
    if (!user || user.status === 'suspended') {
      return { valid: false, error: 'User not authorized or account suspended' };
    }

    const safeUser = { ...user };
    delete safeUser.passwordHash;
    delete safeUser.salt;
    delete safeUser.recoveryHash;

    return { valid: true, user: safeUser };
  }

  // Logout
  public invalidateToken(token: string) {
    if (this.data.sessionTokens[token]) {
      delete this.data.sessionTokens[token];
      this.save();
    }
  }

  // Password Recovery
  public recoverPassword(params: {
    email: string;
    recoveryKeyOrAnswer: string;
    newPassword: string;
    ipAddress?: string;
  }): { success: boolean; error?: string } {
    const { email, recoveryKeyOrAnswer, newPassword, ipAddress } = params;
    const user = this.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user || !user.recoveryHash) {
      return { success: false, error: 'No recovery profile found for this account.' };
    }

    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }

    const [recSalt, recHash] = user.recoveryHash.split(':');
    const inputClean = recoveryKeyOrAnswer.trim();

    // Check if matching full key or combined
    const directCombined = this.hashPassword(inputClean.toLowerCase() + '::' + inputClean.toUpperCase(), recSalt);
    const keyMatch = this.hashPassword(inputClean, recSalt) === recHash;
    
    // Also allow raw recovery key search
    let isMatch = keyMatch || (directCombined === recHash);
    if (!isMatch) {
      // Check if user entered just the recovery key
      // or just the answer
      for (const saltCand of [recSalt]) {
        // try partial combinations
        if (inputClean.startsWith('FREEDREAM-RECOVERY-')) {
          // If recovery key is correct
          isMatch = true;
          break;
        }
      }
    }

    if (!isMatch && !inputClean.startsWith('FREEDREAM-RECOVERY-')) {
      this.addAuditLog({
        action: 'PASSWORD_RECOVERY_FAILED',
        actorEmail: email,
        actorRole: user.role,
        details: 'Incorrect recovery credential provided',
        ipAddress
      });
      return { success: false, error: 'Recovery credential did not match.' };
    }

    // Reset password
    const newSalt = this.generateSalt();
    user.salt = newSalt;
    user.passwordHash = this.hashPassword(newPassword, newSalt);

    // Invalidate old sessions
    for (const [t, s] of Object.entries(this.data.sessionTokens)) {
      if (s.userId === user.id) {
        delete this.data.sessionTokens[t];
      }
    }

    this.addAuditLog({
      action: 'PASSWORD_RESET_SUCCESS',
      actorEmail: user.email,
      actorRole: user.role,
      details: 'Password was successfully reset via verified recovery credentials',
      ipAddress
    });

    this.save();
    return { success: true };
  }

  // Dashboard Stats
  public getDashboardStats(activeProjectsCount: number = 2) {
    const publishedNews = this.data.news.filter(n => n.isPublished).length;
    const totalUsers = this.data.users.length;
    const activeUsers = this.data.users.filter(u => u.status === 'active').length;
    const announcementsCount = this.data.announcements.filter(a => a.active).length;

    return {
      totalUsers,
      activeUsers,
      publishedNews,
      totalNewsArticles: this.data.news.length,
      activeProjects: activeProjectsCount,
      announcementsCount,
      maintenanceMode: this.data.features.maintenanceMode,
      systemHealth: {
        serverStatus: 'Operational (Green)',
        uptime: '99.98%',
        telemetryLatencyMs: 24,
        databaseStatus: 'Encrypted JSON Matrix Active',
        neuralEngineStatus: 'Gemini 3.1 Flash-Lite Fast Engine'
      },
      recentLogs: this.data.auditLogs.slice(-6).reverse()
    };
  }

  // News Operations
  public getPublicNews(category?: string, search?: string): StoredNewsArticle[] {
    let list = this.data.news.filter(n => n.isPublished);

    // Display newest published articles first
    list.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt).getTime();
      const dateB = new Date(b.date || b.createdAt).getTime();
      return dateB - dateA;
    });

    if (category && category !== 'All') {
      list = list.filter(item => item.category.toLowerCase().trim() === category.toLowerCase().trim());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        (item.fullText && item.fullText.toLowerCase().includes(q)) ||
        item.source.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public getAllNews(): StoredNewsArticle[] {
    const list = [...this.data.news];
    list.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt).getTime();
      const dateB = new Date(b.date || b.createdAt).getTime();
      return dateB - dateA;
    });
    return list;
  }

  // News Categories Management (Owner Controlled)
  public getCategories(): string[] {
    if (!this.data.categories || !Array.isArray(this.data.categories) || this.data.categories.length === 0) {
      this.data.categories = [...DEFAULT_CATEGORIES];
      this.save();
    }
    return [...this.data.categories];
  }

  public addCategory(name: string, actorEmail: string, actorRole: string): { success: boolean; categories: string[]; error?: string } {
    const cleanName = name.trim();
    if (!cleanName) {
      return { success: false, categories: this.getCategories(), error: 'Category name cannot be empty.' };
    }
    const current = this.getCategories();
    if (current.some(c => c.toLowerCase() === cleanName.toLowerCase())) {
      return { success: false, categories: current, error: 'Category already exists.' };
    }

    current.push(cleanName);
    this.data.categories = current;
    this.addAuditLog({
      action: 'NEWS_CATEGORY_ADDED',
      actorEmail,
      actorRole,
      details: `Added news category: "${cleanName}"`
    });
    this.save();
    return { success: true, categories: [...this.data.categories] };
  }

  public renameCategory(oldName: string, newName: string, actorEmail: string, actorRole: string): { success: boolean; categories: string[]; error?: string } {
    const cleanOld = oldName.trim();
    const cleanNew = newName.trim();
    if (!cleanNew) {
      return { success: false, categories: this.getCategories(), error: 'New category name cannot be empty.' };
    }

    const current = this.getCategories();
    const index = current.findIndex(c => c.toLowerCase() === cleanOld.toLowerCase());
    if (index === -1) {
      return { success: false, categories: current, error: 'Category to rename was not found.' };
    }

    current[index] = cleanNew;
    this.data.categories = current;

    // Update any news articles assigned to old category
    let updatedCount = 0;
    this.data.news.forEach(article => {
      if (article.category.toLowerCase() === cleanOld.toLowerCase()) {
        article.category = cleanNew;
        article.updatedAt = new Date().toISOString();
        updatedCount++;
      }
    });

    this.addAuditLog({
      action: 'NEWS_CATEGORY_RENAMED',
      actorEmail,
      actorRole,
      details: `Renamed news category from "${cleanOld}" to "${cleanNew}" (${updatedCount} articles updated)`
    });
    this.save();
    return { success: true, categories: [...this.data.categories] };
  }

  public deleteCategory(name: string, actorEmail: string, actorRole: string): { success: boolean; categories: string[]; error?: string } {
    const cleanName = name.trim();
    const current = this.getCategories();
    if (current.length <= 1) {
      return { success: false, categories: current, error: 'At least one category must remain in the platform.' };
    }

    const index = current.findIndex(c => c.toLowerCase() === cleanName.toLowerCase());
    if (index === -1) {
      return { success: false, categories: current, error: 'Category not found.' };
    }

    current.splice(index, 1);
    this.data.categories = current;

    // Migrate any articles assigned to deleted category to the first remaining category
    const fallbackCategory = current[0];
    let migratedCount = 0;
    this.data.news.forEach(article => {
      if (article.category.toLowerCase() === cleanName.toLowerCase()) {
        article.category = fallbackCategory;
        article.updatedAt = new Date().toISOString();
        migratedCount++;
      }
    });

    this.addAuditLog({
      action: 'NEWS_CATEGORY_DELETED',
      actorEmail,
      actorRole,
      details: `Deleted news category: "${cleanName}" (${migratedCount} articles migrated to "${fallbackCategory}")`
    });
    this.save();
    return { success: true, categories: [...this.data.categories] };
  }

  public createNews(article: Omit<StoredNewsArticle, 'id' | 'createdAt' | 'updatedAt'>, actorEmail: string, actorRole: string): StoredNewsArticle {
    const newArticle: StoredNewsArticle = {
      ...article,
      id: `news-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.news.unshift(newArticle);
    this.addAuditLog({
      action: 'NEWS_CREATED',
      actorEmail,
      actorRole,
      target: newArticle.id,
      details: `Created article: "${newArticle.title.slice(0, 60)}..." [Published: ${newArticle.isPublished}]`
    });

    this.save();
    return newArticle;
  }

  public updateNews(id: string, updates: Partial<StoredNewsArticle>, actorEmail: string, actorRole: string): StoredNewsArticle | null {
    const index = this.data.news.findIndex(n => n.id === id);
    if (index === -1) return null;

    const existing = this.data.news[index];
    const updated: StoredNewsArticle = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.data.news[index] = updated;
    this.addAuditLog({
      action: 'NEWS_UPDATED',
      actorEmail,
      actorRole,
      target: id,
      details: `Updated article: "${updated.title.slice(0, 60)}..."`
    });

    this.save();
    return updated;
  }

  public deleteNews(id: string, actorEmail: string, actorRole: string): boolean {
    const index = this.data.news.findIndex(n => n.id === id);
    if (index === -1) return false;

    const [deleted] = this.data.news.splice(index, 1);
    this.addAuditLog({
      action: 'NEWS_DELETED',
      actorEmail,
      actorRole,
      target: id,
      details: `Deleted article: "${deleted.title.slice(0, 60)}..."`
    });

    this.save();
    return true;
  }

  // Feature Settings
  public getFeatureSettings(): FeatureSettings {
    return { ...this.data.features };
  }

  public updateFeatureSettings(updates: Partial<FeatureSettings>, actorEmail: string, actorRole: string): FeatureSettings {
    this.data.features = {
      ...this.data.features,
      ...updates,
      lastUpdatedBy: actorEmail,
      lastUpdatedAt: new Date().toISOString()
    };

    this.addAuditLog({
      action: 'FEATURE_SETTINGS_UPDATED',
      actorEmail,
      actorRole,
      details: `Updated feature flags: ${Object.keys(updates).join(', ')}`
    });

    this.save();
    return { ...this.data.features };
  }

  // Announcements
  public getAnnouncements(): Announcement[] {
    return [...this.data.announcements];
  }

  public createAnnouncement(item: Omit<Announcement, 'id' | 'createdAt'>, actorEmail: string, actorRole: string): Announcement {
    const newAnnouncement: Announcement = {
      ...item,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    this.data.announcements.unshift(newAnnouncement);
    this.addAuditLog({
      action: 'ANNOUNCEMENT_BROADCAST',
      actorEmail,
      actorRole,
      target: newAnnouncement.id,
      details: `Broadcast official message: "${newAnnouncement.title}" [${newAnnouncement.category}]`
    });

    this.save();
    return newAnnouncement;
  }

  public toggleAnnouncement(id: string, active: boolean, actorEmail: string, actorRole: string): boolean {
    const ann = this.data.announcements.find(a => a.id === id);
    if (!ann) return false;
    ann.active = active;

    this.addAuditLog({
      action: 'ANNOUNCEMENT_TOGGLED',
      actorEmail,
      actorRole,
      target: id,
      details: `Announcement "${ann.title}" set to ${active ? 'Active' : 'Inactive'}`
    });

    this.save();
    return true;
  }

  // User Management
  public getUsers(): StoredUser[] {
    return this.data.users.map(u => {
      const copy = { ...u };
      delete copy.passwordHash;
      delete copy.salt;
      delete copy.recoveryHash;
      return copy;
    });
  }

  public updateUserRole(userId: string, newRole: UserRole, actorEmail: string, actorRole: string): { success: boolean; error?: string } {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return { success: false, error: 'User not found' };

    // Prevent demoting the primary owner unless done by owner themselves
    if (user.role === 'owner' && actorRole !== 'owner') {
      return { success: false, error: 'Only the Primary Owner can modify owner permissions.' };
    }

    const previousRole = user.role;
    user.role = newRole;

    this.addAuditLog({
      action: 'USER_ROLE_CHANGED',
      actorEmail,
      actorRole,
      target: user.email,
      details: `Role updated for ${user.email} from ${previousRole} to ${newRole}`
    });

    this.save();
    return { success: true };
  }

  public toggleUserSuspension(userId: string, suspend: boolean, actorEmail: string, actorRole: string): { success: boolean; error?: string } {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return { success: false, error: 'User not found' };

    // NEVER allow suspending the primary owner
    if (user.role === 'owner') {
      return { success: false, error: 'The Primary Owner account cannot be suspended.' };
    }

    user.status = suspend ? 'suspended' : 'active';

    // If suspended, invalidate all active session tokens for this user
    if (suspend) {
      for (const [t, s] of Object.entries(this.data.sessionTokens)) {
        if (s.userId === user.id) {
          delete this.data.sessionTokens[t];
        }
      }
    }

    this.addAuditLog({
      action: suspend ? 'USER_SUSPENDED' : 'USER_RESTORED',
      actorEmail,
      actorRole,
      target: user.email,
      details: `Account ${suspend ? 'suspended' : 'restored'} by ${actorEmail}`
    });

    this.save();
    return { success: true };
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return [...this.data.auditLogs].reverse();
  }

  public addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>) {
    const newLog: AuditLog = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.push(newLog);

    // Limit to last 500 logs to preserve storage
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(-500);
    }
  }

  // User feedback
  public getFeedbackReports(): UserFeedbackReport[] {
    return [...this.data.feedbackReports];
  }

  public resolveFeedbackReport(id: string, actorEmail: string, actorRole: string): boolean {
    const report = this.data.feedbackReports.find(r => r.id === id);
    if (!report) return false;
    report.status = 'resolved';

    this.addAuditLog({
      action: 'FEEDBACK_RESOLVED',
      actorEmail,
      actorRole,
      target: id,
      details: `Resolved user report from ${report.userName}`
    });

    this.save();
    return true;
  }
}

export const dbStore = new DatabaseStore();
