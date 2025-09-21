import { Router, Request, Response } from 'express';
import { google } from 'googleapis';
import { generateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import User from '../models/User';
import CalendarIntegration from '../models/CalendarIntegration';

const router = Router();

/**
 * GET /api/auth/google
 * Initiate Google OAuth flow
 */
router.get('/google', asyncHandler(async (req: Request, res: Response) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  res.json({
    success: true,
    data: { authUrl }
  });
}));

/**
 * GET /api/auth/google/callback
 * Handle Google OAuth callback
 */
router.get('/google/callback', asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      success: false,
      error: 'Authorization code not provided'
    });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    if (!userInfo.data.email) {
      throw new Error('Email not provided by Google');
    }

    // Find or create user
    let user = await User.findOne({ where: { email: userInfo.data.email } });
    
    if (!user) {
      user = await User.create({
        email: userInfo.data.email,
        name: userInfo.data.name || userInfo.data.email
      });
    }

    // Create or update calendar integration
    const [integration, created] = await CalendarIntegration.findOrCreate({
      where: {
        userId: user.id,
        provider: 'google'
      },
      defaults: {
        userId: user.id,
        provider: 'google',
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        isActive: true
      }
    });

    if (!created) {
      // Update existing integration
      await integration.update({
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        isActive: true
      });
    }

    // Generate JWT token
    const jwtToken = generateToken(user);

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${jwtToken}&success=true`);
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?success=false&error=oauth_failed`);
  }
}));

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  
  const user = await User.findByPk(userId, {
    include: [{
      model: CalendarIntegration,
      as: 'integrations',
      where: { isActive: true },
      required: false
    }]
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      },
      integrations: (user as any).integrations || []
    }
  });
}));

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  // In a JWT-based system, logout is typically handled client-side
  // by removing the token from storage
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

export default router;
