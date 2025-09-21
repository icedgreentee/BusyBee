export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  calendarId: string;
  source: 'google' | 'microsoft' | 'apple' | 'notion';
}

export interface FreeTimeBlock {
  start: Date;
  end: Date;
  duration: number; // in minutes
}

export interface SchedulingQuery {
  query: string;
  duration?: number; // in minutes
  preferredTimes?: string[];
  constraints?: string[];
  userId: string;
}

export interface AISuggestion {
  id: string;
  title: string;
  start: Date;
  end: Date;
  confidence: number;
  reasoning: string;
  alternatives?: AISuggestion[];
}

export interface CalendarIntegration {
  id: string;
  userId: string;
  provider: 'google' | 'microsoft' | 'apple' | 'notion';
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  isActive: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface GoogleCalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface MicrosoftCalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}
