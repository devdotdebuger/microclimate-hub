import type { 
  ApiResponse, 
  User, 
  Report, 
  ReportFormData, 
  Notification, 
  ImpactData, 
  AnalyticsData,
  ReportFilters,
  SearchParams,
  PaginationInfo 
} from './types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 10000; // 10 seconds

// Custom fetch with timeout and error handling
async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}, 
  timeout = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API Client class
class ApiClient {
  private baseURL: string;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheKey?: string,
    ttl = 5 * 60 * 1000 // 5 minutes default
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Check cache first
    if (cacheKey && this.isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached.data as T;
      }
    }

    try {
      const response = await fetchWithTimeout(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || `HTTP ${response.status}`,
          errorData.code,
          errorData.details
        );
      }

      const data = await response.json();
      
      // Cache successful responses
      if (cacheKey) {
        this.setCache(cacheKey, data, ttl);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
    }
  }

  // Cache methods
  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < cached.ttl;
  }

  public clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: { name: string; email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/auth/me', {}, 'current-user', 10 * 60 * 1000); // 10 minutes
  }

  // Report methods
  async getReports(filters?: ReportFilters, page = 1, limit = 20): Promise<ApiResponse<{ reports: Report[]; pagination: PaginationInfo }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )),
    });
    
    return this.request(`/reports?${params}`, {}, `reports-${params.toString()}`, 2 * 60 * 1000);
  }

  async getReport(id: string): Promise<ApiResponse<Report>> {
    return this.request(`/reports/${id}`, {}, `report-${id}`, 5 * 60 * 1000);
  }

  async createReport(data: ReportFormData): Promise<ApiResponse<Report>> {
    const formData = new FormData();
    
    // Add text fields
    formData.append('temperature', data.temperature.toString());
    formData.append('location', data.location);
    formData.append('description', data.description);
    formData.append('tags', JSON.stringify(data.tags));
    
    // Add files
    data.images.forEach((image, index) => {
      formData.append(`images`, image);
    });
    
    if (data.voiceNote) {
      formData.append('voiceNote', data.voiceNote);
    }

    const response = await this.request<ApiResponse<Report>>('/reports', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData
      },
    });

    // Clear reports cache after creating new report
    this.clearCache('reports');
    
    return response;
  }

  async updateReport(id: string, data: Partial<ReportFormData>): Promise<ApiResponse<Report>> {
    const response = await this.request<ApiResponse<Report>>(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    // Clear specific report cache
    this.clearCache(`report-${id}`);
    this.clearCache('reports');
    
    return response;
  }

  async deleteReport(id: string): Promise<ApiResponse<void>> {
    const response = await this.request<ApiResponse<void>>(`/reports/${id}`, {
      method: 'DELETE',
    });

    // Clear caches
    this.clearCache(`report-${id}`);
    this.clearCache('reports');
    
    return response;
  }

  // Search methods
  async searchReports(params: SearchParams): Promise<ApiResponse<{ reports: Report[]; pagination: PaginationInfo }>> {
    return this.request('/reports/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Impact methods
  async getImpactData(): Promise<ApiResponse<ImpactData>> {
    return this.request('/impact', {}, 'impact-data', 10 * 60 * 1000); // 10 minutes
  }

  async getPersonalImpact(): Promise<ApiResponse<ImpactData['personalImpact']>> {
    return this.request('/impact/personal', {}, 'personal-impact', 5 * 60 * 1000);
  }

  // Analytics methods
  async getAnalytics(): Promise<ApiResponse<AnalyticsData>> {
    return this.request('/analytics', {}, 'analytics', 15 * 60 * 1000); // 15 minutes
  }

  async getHeatMapData(timeRange: string): Promise<ApiResponse<AnalyticsData['heatMap']>> {
    return this.request(`/analytics/heatmap?timeRange=${timeRange}`, {}, `heatmap-${timeRange}`, 5 * 60 * 1000);
  }

  // Notification methods
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.request('/notifications', {}, 'notifications', 1 * 60 * 1000); // 1 minute
  }

  async markNotificationRead(id: string): Promise<ApiResponse<void>> {
    const response = await this.request<ApiResponse<void>>(`/notifications/${id}/read`, {
      method: 'PUT',
    });

    // Clear notifications cache
    this.clearCache('notifications');
    
    return response;
  }

  async clearAllNotifications(): Promise<ApiResponse<void>> {
    const response = await this.request<ApiResponse<void>>('/notifications', {
      method: 'DELETE',
    });

    // Clear notifications cache
    this.clearCache('notifications');
    
    return response;
  }

  // User profile methods
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.request<ApiResponse<User>>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    // Clear user cache
    this.clearCache('current-user');
    
    return response;
  }

  async updatePreferences(preferences: any): Promise<ApiResponse<User>> {
    const response = await this.request<ApiResponse<User>>('/profile/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });

    // Clear user cache
    this.clearCache('current-user');
    
    return response;
  }

  // Weather methods
  async getWeatherData(lat: number, lng: number): Promise<ApiResponse<any>> {
    return this.request(`/weather?lat=${lat}&lng=${lng}`, {}, `weather-${lat}-${lng}`, 30 * 60 * 1000); // 30 minutes
  }

  // AI Analysis methods
  async analyzeReport(reportId: string): Promise<ApiResponse<any>> {
    return this.request(`/ai/analyze/${reportId}`, {
      method: 'POST',
    });
  }

  // File upload methods
  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('image', file);

    return this.request('/upload/image', {
      method: 'POST',
      body: formData,
    });
  }

  async uploadVoiceNote(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('audio', file);

    return this.request('/upload/audio', {
      method: 'POST',
      body: formData,
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request('/health', {}, 'health', 60 * 1000); // 1 minute
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Hook for using API client with React Query
export function useApiClient() {
  return apiClient;
}

// Utility functions for common API operations
export const apiUtils = {
  // Retry function with exponential backoff
  async retry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (i === maxRetries - 1) {
          throw lastError;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  },

  // Debounce function
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
};

// Export types for convenience
export type { ApiError }; 