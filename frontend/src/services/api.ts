const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  calendarId: string;
  source: 'google' | 'microsoft' | 'apple' | 'notion';
}

export interface FreeTimeBlock {
  start: string;
  end: string;
  duration: number;
}

export interface AISuggestion {
  id: string;
  title: string;
  start: string;
  end: string;
  confidence: number;
  reasoning: string;
  alternatives: AISuggestion[];
}

export interface SchedulingQuery {
  query: string;
  duration?: number;
  preferredTimes?: string[];
  constraints?: string[];
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async getGoogleAuthUrl(): Promise<{ authUrl: string }> {
    const response = await this.request<{ authUrl: string }>('/auth/google');
    return response.data!;
  }

  async getCurrentUser(): Promise<{ user: User; integrations: any[] }> {
    const response = await this.request<{ user: User; integrations: any[] }>('/auth/me');
    return response.data!;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    localStorage.removeItem('authToken');
  }

  // Calendar methods
  async getEvents(start?: string, end?: string): Promise<{
    events: CalendarEvent[];
    freeTimeBlocks: FreeTimeBlock[];
    timeRange: { start: string; end: string };
    errors?: any[];
  }> {
    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);
    
    const response = await this.request<{
      events: CalendarEvent[];
      freeTimeBlocks: FreeTimeBlock[];
      timeRange: { start: string; end: string };
      errors?: any[];
    }>(`/calendar/events?${params.toString()}`);
    
    return response.data!;
  }

  async getFreeTime(start?: string, end?: string, minDuration?: number): Promise<{
    freeTimeBlocks: FreeTimeBlock[];
    totalBlocks: number;
    totalFreeTimeMinutes: number;
    timeRange: { start: string; end: string };
  }> {
    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);
    if (minDuration) params.append('minDuration', minDuration.toString());
    
    const response = await this.request<{
      freeTimeBlocks: FreeTimeBlock[];
      totalBlocks: number;
      totalFreeTimeMinutes: number;
      timeRange: { start: string; end: string };
    }>(`/calendar/free-time?${params.toString()}`);
    
    return response.data!;
  }

  async createEvent(event: {
    title: string;
    start: string;
    end: string;
    description?: string;
    location?: string;
    provider?: string;
  }): Promise<{ event: CalendarEvent }> {
    const response = await this.request<{ event: CalendarEvent }>('/calendar/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    
    return response.data!;
  }

  async getIntegrations(): Promise<{ integrations: any[] }> {
    const response = await this.request<{ integrations: any[] }>('/calendar/integrations');
    return response.data!;
  }

  async removeIntegration(id: string): Promise<void> {
    await this.request(`/calendar/integrations/${id}`, { method: 'DELETE' });
  }

  // AI methods
  async processSchedulingQuery(query: SchedulingQuery): Promise<{
    suggestions: AISuggestion[];
    freeTimeBlocks: FreeTimeBlock[];
    totalEvents: number;
    query: SchedulingQuery;
  }> {
    const response = await this.request<{
      suggestions: AISuggestion[];
      freeTimeBlocks: FreeTimeBlock[];
      totalEvents: number;
      query: SchedulingQuery;
    }>('/ai/schedule', {
      method: 'POST',
      body: JSON.stringify(query),
    });
    
    return response.data!;
  }

  async analyzeCalendar(): Promise<{
    analysis: string;
    statistics: {
      totalEvents: number;
      totalDurationMinutes: number;
      averageEventDuration: number;
      freeTimeBlocks: number;
      totalFreeTimeMinutes: number;
    };
    timeRange: { start: string; end: string };
  }> {
    const response = await this.request<{
      analysis: string;
      statistics: {
        totalEvents: number;
        totalDurationMinutes: number;
        averageEventDuration: number;
        freeTimeBlocks: number;
        totalFreeTimeMinutes: number;
      };
      timeRange: { start: string; end: string };
    }>('/ai/analyze', {
      method: 'POST',
    });
    
    return response.data!;
  }
}

export const apiService = new ApiService();
