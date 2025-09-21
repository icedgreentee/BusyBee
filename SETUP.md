# BusyBee Setup Guide

This guide will help you set up and run BusyBee locally for development.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Cloud Console project with Calendar API enabled
- OpenAI API key

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/busybee
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=busybee
   DB_USER=username
   DB_PASSWORD=password

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d

   # Google Calendar API
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback

   # OpenAI Configuration
   OPENAI_API_KEY=your-openai-api-key

   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up PostgreSQL database:**
   ```bash
   createdb busybee
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:3001/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_APP_NAME=BusyBee
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

## Google Calendar API Setup

1. **Go to Google Cloud Console:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Calendar API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

3. **Create OAuth 2.0 credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3001/auth/google/callback` (development)
     - Your production callback URL

4. **Copy credentials:**
   - Copy Client ID and Client Secret to your `.env` files

## OpenAI API Setup

1. **Get OpenAI API key:**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create account or sign in
   - Go to API Keys section
   - Create new API key

2. **Add to environment:**
   - Copy API key to `OPENAI_API_KEY` in backend `.env`

## Running the Application

1. **Start both servers:**
   ```bash
   # From project root
   npm run dev
   ```

   Or start individually:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend  
   cd frontend && npm run dev
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health check: http://localhost:3001/health

## Testing the Application

1. **Open the frontend** in your browser
2. **Click "Sign In"** to authenticate with Google
3. **Grant calendar permissions** when prompted
4. **Try asking BusyBee:**
   - "Can I fit a 2-hour workout this week?"
   - "What's the best time for a 1-hour study session?"
   - "Find me time for a 30-minute meditation daily"

## Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Google OAuth errors:**
   - Check redirect URI matches exactly
   - Ensure Calendar API is enabled
   - Verify client ID and secret

3. **OpenAI API errors:**
   - Check API key is valid
   - Ensure you have credits/billing set up
   - Verify API key has proper permissions

4. **CORS errors:**
   - Check `FRONTEND_URL` in backend `.env`
   - Ensure frontend is running on correct port

### Logs

- Backend logs: Check terminal running `npm run dev`
- Frontend logs: Check browser developer console
- Database logs: Check PostgreSQL logs

## Production Deployment

See the deployment section in the main README.md for production setup instructions.

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the logs for error messages
3. Ensure all environment variables are set correctly
4. Verify all prerequisites are installed
