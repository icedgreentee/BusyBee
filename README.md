# BusyBee - AI Scheduling Consultant

BusyBee is an intelligent scheduling assistant that connects to your calendars and provides AI-powered scheduling recommendations. Ask questions like "Can I fit a 6-hour study block into my week?" and get smart suggestions for optimal time management.

## Features

- 🔗 **Multi-Calendar Integration**: Google Calendar, Microsoft Outlook, Apple iCal, Notion Calendar
- 🤖 **AI-Powered Scheduling**: Natural language queries with intelligent recommendations
- 📅 **Visual Calendar Overlay**: See AI suggestions overlaid on your existing schedule
- 🔒 **Privacy-First**: OAuth 2.0 authentication with minimal data storage
- 📱 **Responsive Design**: Beautiful, mobile-friendly interface with bee-themed design

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-4o-mini
- **Deployment**: Vercel (frontend) + Railway (backend)

## Getting Started

1. Install dependencies:
```bash
npm run install:all
```

2. Set up environment variables (see `.env.example` files in frontend and backend directories)

3. Start development servers:
```bash
npm run dev
```

## Project Structure

```
BusyBee/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
├── package.json       # Root package.json for scripts
└── README.md
```

## Contributing

This project is built with modern web technologies and follows best practices for security and privacy. All calendar data is processed locally and never sent to external services except for AI recommendations.
