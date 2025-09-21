# BusyBee Deployment Guide

This guide covers deploying BusyBee to Netlify (frontend) and Railway (backend).

## 🚀 Frontend Deployment to Netlify

### Option 1: Deploy via Git (Recommended)

1. **Push to GitHub:**
   ```bash
   # Add all files
   git add .
   
   # Commit changes
   git commit -m "Initial BusyBee commit"
   
   # Add remote repository (replace with your GitHub repo URL)
   git remote add origin https://github.com/yourusername/busybee.git
   
   # Push to GitHub
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com) and sign in
   - Click "New site from Git"
   - Choose GitHub and select your BusyBee repository
   - Configure build settings:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/dist`
   - Click "Deploy site"

3. **Set Environment Variables in Netlify:**
   - Go to Site settings → Environment variables
   - Add the following variables:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     VITE_GOOGLE_CLIENT_ID=your-google-client-id
     VITE_APP_NAME=BusyBee
     ```

### Option 2: Manual Deploy

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `frontend/dist` folder
   - Your site will be deployed instantly

## 🚂 Backend Deployment to Railway

1. **Prepare for Railway:**
   ```bash
   cd backend
   # Ensure all dependencies are installed
   npm install
   ```

2. **Deploy to Railway:**
   - Go to [Railway](https://railway.app) and sign in
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your BusyBee repository
   - Choose the backend folder
   - Railway will automatically detect it's a Node.js app

3. **Set Environment Variables in Railway:**
   - Go to your project → Variables tab
   - Add all the environment variables from `backend/env.example`:
     ```
     PORT=3001
     NODE_ENV=production
     DATABASE_URL=your-postgresql-url
     JWT_SECRET=your-jwt-secret
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     GOOGLE_REDIRECT_URI=https://your-backend-url.railway.app/auth/google/callback
     OPENAI_API_KEY=your-openai-api-key
     FRONTEND_URL=https://your-netlify-site.netlify.app
     ```

4. **Set up PostgreSQL Database:**
   - In Railway, click "New" → "Database" → "PostgreSQL"
   - Copy the connection string to `DATABASE_URL` variable

## 🔧 Google OAuth Setup for Production

1. **Update Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to APIs & Services → Credentials
   - Edit your OAuth 2.0 client
   - Add authorized redirect URIs:
     - `https://your-backend-url.railway.app/auth/google/callback`
   - Add authorized JavaScript origins:
     - `https://your-netlify-site.netlify.app`

2. **Update Environment Variables:**
   - Update `GOOGLE_REDIRECT_URI` in Railway with your production backend URL
   - Update `FRONTEND_URL` in Railway with your Netlify site URL

## 📋 Pre-Deployment Checklist

### Frontend (Netlify)
- [ ] Environment variables set in Netlify
- [ ] Build command configured correctly
- [ ] Publish directory set to `frontend/dist`
- [ ] Custom domain configured (optional)

### Backend (Railway)
- [ ] All environment variables set
- [ ] PostgreSQL database connected
- [ ] Google OAuth redirect URI updated
- [ ] OpenAI API key configured
- [ ] Health check endpoint working (`/health`)

### Google OAuth
- [ ] Production redirect URI added
- [ ] Production JavaScript origin added
- [ ] Client ID and secret updated in environment variables

## 🧪 Testing Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend-url.railway.app/health
   ```
   Should return: `{"status":"OK","timestamp":"...","service":"BusyBee Backend"}`

2. **Test Frontend:**
   - Visit your Netlify URL
   - Try signing in with Google
   - Test the scheduling interface

3. **Test Full Flow:**
   - Sign in with Google
   - Ask BusyBee a scheduling question
   - Verify AI suggestions appear
   - Test adding events to calendar

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure `FRONTEND_URL` in Railway matches your Netlify URL exactly
   - Check that the frontend is making requests to the correct backend URL

2. **Google OAuth Errors:**
   - Verify redirect URI in Google Cloud Console matches Railway URL
   - Check that client ID and secret are correct in environment variables

3. **Database Connection Errors:**
   - Verify PostgreSQL connection string in Railway
   - Check that database is accessible from Railway

4. **Build Failures:**
   - Check Netlify build logs for specific errors
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

### Logs and Debugging

- **Netlify Logs**: Site settings → Functions → View logs
- **Railway Logs**: Project → Deployments → View logs
- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Verify API calls are working

## 🎉 Success!

Once deployed, your BusyBee application will be live and ready to help users optimize their schedules with AI-powered insights!

**Frontend URL**: `https://your-site.netlify.app`
**Backend URL**: `https://your-app.railway.app`
**Health Check**: `https://your-app.railway.app/health`
