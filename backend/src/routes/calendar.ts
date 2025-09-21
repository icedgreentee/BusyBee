import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { CalendarService } from '../services/calendarService';
import CalendarIntegration from '../models/CalendarIntegration';

const router = Router();

// Apply authentication to all calendar routes
router.use(authenticateToken);

/**
 * GET /api/calendar/events
 * Fetch events from all connected calendars
 */
router.get('/events', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { start, end } = req.query;

  // Default to next 7 days if no dates provided
  const startDate = start ? new Date(start as string) : new Date();
  const endDate = end ? new Date(end as string) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

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

  // Fetch events from all connected calendars
  const allEvents = [];
  const errors = [];

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
      errors.push({
        provider: integration.provider,
        error: 'Failed to fetch events'
      });
    }
  }

  // Calculate free time blocks
  const freeTimeBlocks = CalendarService.calculateFreeTimeBlocks(
    allEvents,
    startDate,
    endDate,
    30 // minimum 30 minutes
  );

  res.json({
    success: true,
    data: {
      events: allEvents,
      freeTimeBlocks,
      timeRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      errors: errors.length > 0 ? errors : undefined
    }
  });
}));

/**
 * GET /api/calendar/free-time
 * Get available free time blocks
 */
router.get('/free-time', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { start, end, minDuration = 30 } = req.query;

  const startDate = start ? new Date(start as string) : new Date();
  const endDate = end ? new Date(end as string) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const minDurationMinutes = parseInt(minDuration as string) || 30;

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

  // Calculate free time blocks
  const freeTimeBlocks = CalendarService.calculateFreeTimeBlocks(
    allEvents,
    startDate,
    endDate,
    minDurationMinutes
  );

  res.json({
    success: true,
    data: {
      freeTimeBlocks,
      totalBlocks: freeTimeBlocks.length,
      totalFreeTimeMinutes: freeTimeBlocks.reduce((sum, block) => sum + block.duration, 0),
      timeRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    }
  });
}));

/**
 * POST /api/calendar/events
 * Create a new event in the user's calendar
 */
router.post('/events', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { title, start, end, description, location, provider = 'google' } = req.body;

  if (!title || !start || !end) {
    return res.status(400).json({
      success: false,
      error: 'Title, start, and end are required'
    });
  }

  // Get user's calendar integration for the specified provider
  const integration = await CalendarIntegration.findOne({
    where: { userId, provider, isActive: true }
  });

  if (!integration) {
    return res.status(400).json({
      success: false,
      error: `No active ${provider} calendar integration found`
    });
  }

  try {
    let createdEvent;
    
    if (provider === 'google') {
      createdEvent = await CalendarService.createGoogleCalendarEvent(integration, {
        title,
        start: new Date(start),
        end: new Date(end),
        description,
        location
      });
    } else {
      return res.status(400).json({
        success: false,
        error: `Provider ${provider} not supported yet`
      });
    }

    res.json({
      success: true,
      data: { event: createdEvent }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create event'
    });
  }
}));

/**
 * GET /api/calendar/integrations
 * Get user's calendar integrations
 */
router.get('/integrations', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const integrations = await CalendarIntegration.findAll({
    where: { userId },
    attributes: ['id', 'provider', 'isActive', 'createdAt', 'updatedAt']
  });

  res.json({
    success: true,
    data: { integrations }
  });
}));

/**
 * DELETE /api/calendar/integrations/:id
 * Remove a calendar integration
 */
router.delete('/integrations/:id', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const integration = await CalendarIntegration.findOne({
    where: { id, userId }
  });

  if (!integration) {
    return res.status(404).json({
      success: false,
      error: 'Integration not found'
    });
  }

  await integration.update({ isActive: false });

  res.json({
    success: true,
    message: 'Integration removed successfully'
  });
}));

export default router;
