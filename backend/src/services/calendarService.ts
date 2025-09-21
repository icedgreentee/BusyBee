import { google } from 'googleapis';
import { CalendarEvent, FreeTimeBlock, CalendarIntegration } from '../types';

export class CalendarService {
  /**
   * Fetch events from Google Calendar
   */
  static async fetchGoogleCalendarEvents(
    integration: CalendarIntegration,
    startDate: Date,
    endDate: Date
  ): Promise<CalendarEvent[]> {
    try {
      const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      auth.setCredentials({
        access_token: integration.accessToken,
        refresh_token: integration.refreshToken,
      });

      const calendar = google.calendar({ version: 'v3', auth });
      
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];
      
      return events
        .filter(event => event.start?.dateTime || event.start?.date)
        .map(event => ({
          id: event.id || '',
          title: event.summary || 'Untitled Event',
          start: new Date(event.start?.dateTime || event.start?.date || ''),
          end: new Date(event.end?.dateTime || event.end?.date || ''),
          description: event.description || '',
          location: event.location || '',
          calendarId: 'primary',
          source: 'google' as const,
        }));
    } catch (error) {
      console.error('Google Calendar fetch error:', error);
      throw new Error('Failed to fetch Google Calendar events');
    }
  }

  /**
   * Calculate free time blocks between events
   */
  static calculateFreeTimeBlocks(
    events: CalendarEvent[],
    startDate: Date,
    endDate: Date,
    minDuration: number = 30 // minimum duration in minutes
  ): FreeTimeBlock[] {
    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
    
    const freeBlocks: FreeTimeBlock[] = [];
    let currentTime = new Date(startDate);

    for (const event of sortedEvents) {
      // Check if there's a gap before this event
      if (event.start.getTime() > currentTime.getTime()) {
        const duration = (event.start.getTime() - currentTime.getTime()) / (1000 * 60); // minutes
        
        if (duration >= minDuration) {
          freeBlocks.push({
            start: new Date(currentTime),
            end: new Date(event.start),
            duration: Math.floor(duration),
          });
        }
      }
      
      // Move current time to the end of this event
      currentTime = new Date(Math.max(currentTime.getTime(), event.end.getTime()));
    }

    // Check for free time after the last event
    if (currentTime.getTime() < endDate.getTime()) {
      const duration = (endDate.getTime() - currentTime.getTime()) / (1000 * 60);
      
      if (duration >= minDuration) {
        freeBlocks.push({
          start: new Date(currentTime),
          end: new Date(endDate),
          duration: Math.floor(duration),
        });
      }
    }

    return freeBlocks;
  }

  /**
   * Find optimal time slots for a given duration
   */
  static findOptimalTimeSlots(
    freeBlocks: FreeTimeBlock[],
    requestedDuration: number,
    preferredTimes?: string[]
  ): FreeTimeBlock[] {
    // Filter blocks that are long enough
    const suitableBlocks = freeBlocks.filter(block => block.duration >= requestedDuration);
    
    // Sort by duration (longest first) or by preferred times
    if (preferredTimes && preferredTimes.length > 0) {
      // TODO: Implement preferred time matching
      return suitableBlocks.sort((a, b) => b.duration - a.duration);
    }
    
    return suitableBlocks.sort((a, b) => b.duration - a.duration);
  }

  /**
   * Check for conflicts with existing events
   */
  static checkConflicts(
    proposedStart: Date,
    proposedEnd: Date,
    existingEvents: CalendarEvent[]
  ): CalendarEvent[] {
    return existingEvents.filter(event => {
      return (
        (proposedStart >= event.start && proposedStart < event.end) ||
        (proposedEnd > event.start && proposedEnd <= event.end) ||
        (proposedStart <= event.start && proposedEnd >= event.end)
      );
    });
  }

  /**
   * Create a new event in Google Calendar
   */
  static async createGoogleCalendarEvent(
    integration: CalendarIntegration,
    event: Omit<CalendarEvent, 'id' | 'source' | 'calendarId'>
  ): Promise<CalendarEvent> {
    try {
      const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      auth.setCredentials({
        access_token: integration.accessToken,
        refresh_token: integration.refreshToken,
      });

      const calendar = google.calendar({ version: 'v3', auth });
      
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: event.title,
          description: event.description,
          location: event.location,
          start: {
            dateTime: event.start.toISOString(),
            timeZone: 'UTC',
          },
          end: {
            dateTime: event.end.toISOString(),
            timeZone: 'UTC',
          },
        },
      });

      const createdEvent = response.data;
      
      return {
        id: createdEvent.id || '',
        title: createdEvent.summary || event.title,
        start: new Date(createdEvent.start?.dateTime || event.start),
        end: new Date(createdEvent.end?.dateTime || event.end),
        description: createdEvent.description || event.description,
        location: createdEvent.location || event.location,
        calendarId: 'primary',
        source: 'google',
      };
    } catch (error) {
      console.error('Google Calendar create event error:', error);
      throw new Error('Failed to create Google Calendar event');
    }
  }
}
