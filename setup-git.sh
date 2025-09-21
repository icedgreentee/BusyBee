#!/bin/bash

# BusyBee Git Setup Script
echo "🐝 Setting up BusyBee for Git deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
fi

# Add all files
echo "Adding files to Git..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial BusyBee commit - AI Scheduling Consultant

Features:
- React + Vite frontend with BusyBee design system
- Node.js + Express backend with TypeScript
- Google Calendar integration with OAuth 2.0
- OpenAI GPT-4o-mini for AI scheduling
- PostgreSQL database with Sequelize ORM
- Ready for Netlify (frontend) and Railway (backend) deployment"

echo "✅ Git repository ready!"
echo ""
echo "Next steps:"
echo "1. Create a GitHub repository at https://github.com/new"
echo "2. Add the remote: git remote add origin https://github.com/yourusername/busybee.git"
echo "3. Push to GitHub: git push -u origin main"
echo "4. Connect to Netlify for frontend deployment"
echo "5. Connect to Railway for backend deployment"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."
