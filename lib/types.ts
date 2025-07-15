// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: Date;
  updatedAt: Date;
  profile: UserProfile;
}

export interface UserProfile {
  bio?: string;
  location?: string;
  timezone?: string;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  language: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  reportAlerts: boolean;
  communityUpdates: boolean;
  impactUpdates: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  locationSharing: boolean;
  dataSharing: boolean;
}

export interface UserStats {
  totalReports: number;
  totalPoints: number;
  treesPlanted: number;
  co2Saved: number;
  impactScore: number;
  rank: number;
  badges: Badge[];
}

// Report Types
export interface Report {
  id: string;
  userId: string;
  temperature: number;
  location: Location;
  description: string;
  images: string[];
  voiceNote?: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  weather: WeatherData;
  aiAnalysis?: AIAnalysis;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  description: string;
  icon: string;
}

export interface AIAnalysis {
  heatIndex: number;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  recommendations: string[];
  confidence: number;
}

// Badge Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export type BadgeCategory = 
  | 'reports'
  | 'impact'
  | 'community'
  | 'achievement'
  | 'special';

// Impact Types
export interface ImpactData {
  totalTreesPlanted: number;
  totalCO2Saved: number;
  temperatureReduction: number;
  communityImpact: CommunityImpact;
  personalImpact: PersonalImpact;
  leaderboard: LeaderboardEntry[];
}

export interface CommunityImpact {
  totalReports: number;
  activeUsers: number;
  heatZones: number;
  averageTemperature: number;
  temperatureTrend: TemperatureTrend[];
}

export interface PersonalImpact {
  reportsSubmitted: number;
  treesPlanted: number;
  co2Saved: number;
  impactScore: number;
  rank: number;
  achievements: Achievement[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  impactScore: number;
  treesPlanted: number;
}

export interface TemperatureTrend {
  date: string;
  temperature: number;
  reports: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  progress?: number;
  maxProgress?: number;
}

// Analytics Types
export interface AnalyticsData {
  overview: AnalyticsOverview;
  trends: AnalyticsTrends;
  heatMap: HeatMapData;
  userEngagement: UserEngagement;
}

export interface AnalyticsOverview {
  totalReports: number;
  activeUsers: number;
  heatZones: number;
  averageTemperature: number;
  growthRate: number;
}

export interface AnalyticsTrends {
  temperatureTrend: TimeSeriesData[];
  reportTrend: TimeSeriesData[];
  userGrowth: TimeSeriesData[];
  impactGrowth: TimeSeriesData[];
}

export interface TimeSeriesData {
  date: string;
  value: number;
  change?: number;
}

export interface HeatMapData {
  coordinates: HeatMapPoint[];
  intensity: number;
  timeRange: string;
}

export interface HeatMapPoint {
  lat: number;
  lng: number;
  intensity: number;
  reports: number;
}

export interface UserEngagement {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  retentionRate: number;
  averageSessionDuration: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Types
export interface ReportFormData {
  temperature: number;
  location: string;
  description: string;
  images: File[];
  voiceNote?: File;
  tags: string[];
}

export interface UserProfileFormData {
  name: string;
  bio?: string;
  location?: string;
  preferences: UserPreferences;
}

// Filter Types
export interface ReportFilters {
  severity?: 'low' | 'medium' | 'high' | 'extreme';
  dateRange?: {
    start: Date;
    end: Date;
  };
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
  status?: 'pending' | 'verified' | 'rejected';
  tags?: string[];
}

// Search Types
export interface SearchParams {
  query: string;
  filters: ReportFilters;
  sortBy: 'date' | 'temperature' | 'severity' | 'location';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'report_verified'
  | 'badge_unlocked'
  | 'impact_milestone'
  | 'community_update'
  | 'system_alert';

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  retry?: () => void;
}

// Theme Types
export interface Theme {
  name: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  destructive: string;
  success: string;
  warning: string;
  info: string;
}

export interface ThemeFonts {
  primary: string;
  secondary: string;
  mono: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'skeleton';
}

export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Hook Types
export interface UseLocalStorageOptions<T> {
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

export interface UseDebounceOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
}

export interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

// Event Types
export interface AppEvent {
  type: string;
  payload: any;
  timestamp: Date;
  userId?: string;
}

export interface AnalyticsEvent extends AppEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

// Cache Types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
  serialize?: boolean;
}

// Validation Types
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
} 