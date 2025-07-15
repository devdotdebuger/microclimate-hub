import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import type { User, Report, Notification, Theme, LoadingState } from './types';

// Store Types
interface AppState {
  // User State
  user: User | null;
  isAuthenticated: boolean;
  
  // UI State
  theme: Theme;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  
  // Data State
  reports: Report[];
  notifications: Notification[];
  loadingStates: Record<string, LoadingState>;
  
  // Cache State
  cache: Record<string, any>;
  lastUpdated: Record<string, number>;
}

interface AppActions {
  // User Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  
  // UI Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  
  // Data Actions
  setReports: (reports: Report[]) => void;
  addReport: (report: Report) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  removeReport: (id: string) => void;
  
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Loading Actions
  setLoading: (key: string, loading: LoadingState) => void;
  clearLoading: (key: string) => void;
  
  // Cache Actions
  setCache: (key: string, data: any, ttl?: number) => void;
  getCache: (key: string) => any;
  clearCache: (key?: string) => void;
  isCacheValid: (key: string) => boolean;
}

type AppStore = AppState & AppActions;

// Initial State
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  
  theme: {
    name: 'dark',
    colors: {
      primary: '#22C55E',
      secondary: '#3B82F6',
      accent: '#8B5CF6',
      background: '#0D0D0D',
      foreground: '#FFFFFF',
      muted: '#6B7280',
      border: '#374151',
      destructive: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
      info: '#3B82F6',
    },
    fonts: {
      primary: 'var(--font-inter)',
      secondary: 'var(--font-poppins)',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
  },
  sidebarOpen: false,
  mobileMenuOpen: false,
  
  reports: [],
  notifications: [],
  loadingStates: {},
  
  cache: {},
  lastUpdated: {},
};

// Store Creation
export const useAppStore = create<AppStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,
        
        // User Actions
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        
        updateUser: (updates) => set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
        
        logout: () => set({ 
          user: null, 
          isAuthenticated: false,
          reports: [],
          notifications: [],
          cache: {},
          lastUpdated: {},
        }),
        
        // UI Actions
        setTheme: (theme) => set({ theme }),
        
        toggleSidebar: () => set((state) => ({ 
          sidebarOpen: !state.sidebarOpen,
          mobileMenuOpen: false, // Close mobile menu when sidebar opens
        })),
        
        toggleMobileMenu: () => set((state) => ({ 
          mobileMenuOpen: !state.mobileMenuOpen,
          sidebarOpen: false, // Close sidebar when mobile menu opens
        })),
        
        // Data Actions
        setReports: (reports) => set({ reports }),
        
        addReport: (report) => set((state) => ({
          reports: [report, ...state.reports],
        })),
        
        updateReport: (id, updates) => set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id ? { ...report, ...updates } : report
          ),
        })),
        
        removeReport: (id) => set((state) => ({
          reports: state.reports.filter((report) => report.id !== id),
        })),
        
        setNotifications: (notifications) => set({ notifications }),
        
        addNotification: (notification) => set((state) => ({
          notifications: [notification, ...state.notifications],
        })),
        
        markNotificationRead: (id) => set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          ),
        })),
        
        clearNotifications: () => set({ notifications: [] }),
        
        // Loading Actions
        setLoading: (key, loading) => set((state) => ({
          loadingStates: { ...state.loadingStates, [key]: loading },
        })),
        
        clearLoading: (key) => set((state) => {
          const { [key]: removed, ...rest } = state.loadingStates;
          return { loadingStates: rest };
        }),
        
        // Cache Actions
        setCache: (key, data, ttl = 5 * 60 * 1000) => set((state) => ({
          cache: { ...state.cache, [key]: data },
          lastUpdated: { ...state.lastUpdated, [key]: Date.now() + ttl },
        })),
        
        getCache: (key) => {
          const state = get();
          return state.cache[key];
        },
        
        clearCache: (key) => set((state) => {
          if (key) {
            const { [key]: removedCache, ...restCache } = state.cache;
            const { [key]: removedTime, ...restTime } = state.lastUpdated;
            return { cache: restCache, lastUpdated: restTime };
          }
          return { cache: {}, lastUpdated: {} };
        }),
        
        isCacheValid: (key) => {
          const state = get();
          const lastUpdated = state.lastUpdated[key];
          return lastUpdated ? Date.now() < lastUpdated : false;
        },
      }),
      {
        name: 'microclimate-hub-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          theme: state.theme,
          notifications: state.notifications,
          cache: state.cache,
          lastUpdated: state.lastUpdated,
        }),
        onRehydrateStorage: () => (state) => {
          // Clean up expired cache entries on rehydration
          if (state) {
            const now = Date.now();
            const validCache: Record<string, any> = {};
            const validLastUpdated: Record<string, number> = {};
            
            Object.entries(state.lastUpdated).forEach(([key, timestamp]) => {
              if (now < timestamp) {
                validCache[key] = state.cache[key];
                validLastUpdated[key] = timestamp;
              }
            });
            
            state.cache = validCache;
            state.lastUpdated = validLastUpdated;
          }
        },
      }
    )
  )
);

// Selectors for performance optimization
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useTheme = () => useAppStore((state) => state.theme);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useMobileMenuOpen = () => useAppStore((state) => state.mobileMenuOpen);
export const useReports = () => useAppStore((state) => state.reports, shallow);
export const useNotifications = () => useAppStore((state) => state.notifications, shallow);
export const useUnreadNotifications = () => useAppStore(
  (state) => state.notifications.filter((n) => !n.read),
  shallow
);
export const useLoadingState = (key: string) => useAppStore((state) => state.loadingStates[key]);

// Derived selectors
export const useReportById = (id: string) => useAppStore(
  (state) => state.reports.find((report) => report.id === id)
);

export const useReportsBySeverity = (severity: string) => useAppStore(
  (state) => state.reports.filter((report) => report.severity === severity),
  shallow
);

export const useUserStats = () => useAppStore((state) => state.user?.profile.stats);

// Actions
export const useAppActions = () => useAppStore((state) => ({
  setUser: state.setUser,
  updateUser: state.updateUser,
  logout: state.logout,
  setTheme: state.setTheme,
  toggleSidebar: state.toggleSidebar,
  toggleMobileMenu: state.toggleMobileMenu,
  setReports: state.setReports,
  addReport: state.addReport,
  updateReport: state.updateReport,
  removeReport: state.removeReport,
  setNotifications: state.setNotifications,
  addNotification: state.addNotification,
  markNotificationRead: state.markNotificationRead,
  clearNotifications: state.clearNotifications,
  setLoading: state.setLoading,
  clearLoading: state.clearLoading,
  setCache: state.setCache,
  getCache: state.getCache,
  clearCache: state.clearCache,
  isCacheValid: state.isCacheValid,
}));

// Subscribe to store changes for analytics
if (typeof window !== 'undefined') {
  useAppStore.subscribe(
    (state) => state.user,
    (user) => {
      if (user) {
        // Track user login
        console.log('User logged in:', user.id);
      }
    }
  );
  
  useAppStore.subscribe(
    (state) => state.reports.length,
    (count) => {
      // Track report count changes
      console.log('Total reports:', count);
    }
  );
} 