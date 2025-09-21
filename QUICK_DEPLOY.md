# 🚀 Quick Deploy Guide - BusyBee to Netlify

## Ready to Deploy! Your Git repository is set up with 53 files committed.

### Step 1: Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `busybee`
3. **Don't** initialize with README (we already have files)

### Step 2: Push to GitHub
```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/busybee.git

# Push to GitHub
git push -u origin main
```

### Step 3: Deploy Frontend to Netlify
1. Go to [Netlify](https://netlify.com) and sign in
2. Click **"New site from Git"**
3. Choose **GitHub** and select your `busybee` repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Click **"Deploy site"**

### Step 4: Set Environment Variables in Netlify
Go to **Site settings** → **Environment variables** and add:
```
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APP_NAME=BusyBee
```

### Step 5: Deploy Backend to Railway
1. Go to [Railway](https://railway.app) and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `busybee` repository
4. Choose the `backend` folder
5. Add PostgreSQL database: **"New"** → **"Database"** → **"PostgreSQL"**

### Step 6: Set Environment Variables in Railway
Add these variables in Railway:
```
PORT=3001
NODE_ENV=production
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-backend-url.railway.app/auth/google/callback
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=https://your-netlify-site.netlify.app
```

### Step 7: Update Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Update OAuth redirect URI to: `https://your-backend-url.railway.app/auth/google/callback`
3. Add JavaScript origin: `https://your-netlify-site.netlify.app`

## 🎉 You're Done!

Your BusyBee app will be live at:
- **Frontend**: `https://your-site.netlify.app`
- **Backend**: `https://your-app.railway.app`

## 📚 Need Help?

- **Detailed instructions**: See `DEPLOYMENT.md`
- **Setup guide**: See `SETUP.md`
- **Project overview**: See `PROJECT_SUMMARY.md`

## 🔧 Quick Commands

```bash
# Check Git status
git status

# Add changes and commit
git add .
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Check backend health
curl https://your-backend-url.railway.app/health
```

**Happy deploying! 🐝✨**
