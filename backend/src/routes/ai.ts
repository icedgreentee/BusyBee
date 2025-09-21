import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AIService } from '../services/aiService';
import { CalendarService } from '../services/calendarService';
import CalendarIntegration from '../models/CalendarIntegration';
import { SchedulingQuery } from '../types';

const router = Router();

// Apply authentication to all AI routes
router.use(authenticateToken);

/**
 * POST /api/ai/schedule
 * Process a natural language scheduling query
 */
router.post('/schedule', asyncHandler(async (req: Request, res: Response) => {
  const { query, duration, preferredTimes, constraints } = req.body;
  const userId = req.user!.id;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Query is required and must be a string'
    });
  }

  // Get user's calendar integrations
  const integrations = await CalendarIntegration.findAll({
    where: { userId, isActive: true }
  });

  if (integrations.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No active calendar integrations found. Please connect a calendar first.'
    });
  }

  // Define time range (next 7 days)
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  // Fetch events from all connected calendars
  const allEvents = [];
  for (const integration of integrations) {
    try {
      if (integration.provider === 'google') {
        const events = await CalendarService.fetchGoogleCalendarEvents(
          integration,
          startDate,
          endDate
        );
        allEvents.push(...events);
      }
      // TODO: Add support for other calendar providers
    } catch (error) {
      console.error(`Failed to fetch events from ${integration.provider}:`, error);
      // Continue with other integrations
    }
  }

  // Calculate free time blocks
  const freeTimeBlocks = CalendarService.calculateFreeTimeBlocks(
    allEvents,
    startDate,
    endDate,
    30 // minimum 30 minutes
  );

  // Create scheduling query
  const schedulingQuery: SchedulingQuery = {
    query,
    duration,
    preferredTimes,
    constraints,
    userId
  };

  // Get AI suggestions
  const suggestions = await AIService.processSchedulingQuery(
    schedulingQuery,
    freeTimeBlocks,
    allEvents
  );

  res.json({
    success: true,
    data: {
      suggestions,
      freeTimeBlocks: freeTimeBlocks.slice(0, 10), // Limit response size
      totalEvents: allEvents.length,
      query: schedulingQuery
    }
  });
}));

/**
 * POST /api/ai/analyze
 * Analyze calendar patterns and provide insights
 */
router.post('/analyze', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  // Get user's calendar integrations
  const integrations = await CalendarIntegration.findAll({
    where: { userId, isActive: true }
  });

  if (integrations.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No active calendar integrations found'
    });
  }

  // Define time range (last 30 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  // Fetch events from all connected calendars
  const allEvents = [];
  for (const integration of integrations) {
    try {
      if (integration.provider === 'google') {
        const events = await CalendarService.fetchGoogleCalendarEvents(
          integration,
          startDate,
          endDate
        );
        allEvents.push(...events);
      }
    } catch (error) {
      console.error(`Failed to fetch events from ${integration.provider}:`, error);
    }
  }

  // Get AI analysis
  const analysis = await AIService.analyzeCalendarPatterns(allEvents);

  // Calculate some basic statistics
  const totalEvents = allEvents.length;
  const totalDuration = allEvents.reduce((sum, event) => {
    return sum + (event.end.getTime() - event.start.getTime()) / (1000 * 60); // minutes
  }, 0);

  const freeTimeBlocks = CalendarService.calculateFreeTimeBlocks(
    allEvents,
    startDate,
    endDate,
    30
  );

  res.json({
    success: true,
    data: {
      analysis,
      statistics: {
        totalEvents,
        totalDurationMinutes: Math.round(totalDuration),
        averageEventDuration: totalEvents > 0 ? Math.round(totalDuration / totalEvents) : 0,
        freeTimeBlocks: freeTimeBlocks.length,
        totalFreeTimeMinutes: freeTimeBlocks.reduce((sum, block) => sum + block.duration, 0)
      },
      timeRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    }
  });
}));

export default router;
