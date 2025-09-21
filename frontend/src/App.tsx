import React, { useState } from 'react';
import { Calendar, Zap, Shield, LogIn, User } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SchedulingInterface } from './components/SchedulingInterface';
import { CalendarView } from './components/CalendarView';
import type { AISuggestion } from './services/api';
import './App.css';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [, setSuggestions] = useState<AISuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<'schedule' | 'calendar'>('schedule');

  const handleSuggestionsGenerated = (newSuggestions: AISuggestion[]) => {
    setSuggestions(newSuggestions);
    setActiveTab('calendar'); // Switch to calendar view to show suggestions
  };

  const handleSuggestionSelect = (suggestion: AISuggestion) => {
    // Remove the selected suggestion from the list
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  if (isLoading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-honey-white-50 to-bee-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-bee-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-hex-black-800 mb-2">BusyBee</h2>
          <p className="text-hex-black-600">Loading your AI scheduling assistant...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-honey-white-50 to-bee-yellow-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-bee-yellow-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-bee-yellow-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-hex-black-800">BusyBee</h1>
              </div>
              <button onClick={login} className="btn-primary flex items-center">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
        </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 hex-pattern opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold text-hex-black-800 mb-6">
                Your AI
                <span className="text-bee-yellow-500"> Scheduling</span>
                <br />Consultant
              </h2>
              <p className="text-xl text-hex-black-600 mb-8 leading-relaxed">
                Ask BusyBee anything about your schedule. From "Can I fit a 6-hour study block?" 
                to "What's the best time to exercise?" - get intelligent, personalized recommendations.
              </p>
              
              <button onClick={login} className="btn-primary text-lg px-8 py-4">
                Connect Your Calendar & Get Started
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="w-12 h-12 bg-bee-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-bee-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-Calendar Sync</h3>
                <p className="text-hex-black-600">Connect Google Calendar, Outlook, iCal, and Notion for complete visibility.</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-bee-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-bee-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
                <p className="text-hex-black-600">Get smart recommendations based on your patterns and preferences.</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-bee-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-bee-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Privacy-First</h3>
                <p className="text-hex-black-600">Your calendar data stays secure with OAuth 2.0 and minimal storage.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-hex-black-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-bee-yellow-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold">BusyBee</h3>
              </div>
              <p className="text-hex-black-300 mb-6">Your intelligent scheduling assistant</p>
              <div className="flex justify-center space-x-6 text-sm text-hex-black-300">
                <a href="#" className="hover:text-bee-yellow-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-bee-yellow-400 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-bee-yellow-400 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Authenticated user interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-honey-white-50 to-bee-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-bee-yellow-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-bee-yellow-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-hex-black-800">BusyBee</h1>
            </div>
            
            {/* Navigation Tabs */}
            <nav className="flex space-x-1 bg-honey-white-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'schedule'
                    ? 'bg-white text-bee-yellow-600 shadow-sm'
                    : 'text-hex-black-600 hover:text-bee-yellow-600'
                }`}
              >
                Schedule
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'calendar'
                    ? 'bg-white text-bee-yellow-600 shadow-sm'
                    : 'text-hex-black-600 hover:text-bee-yellow-600'
                }`}
              >
                Calendar
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-hex-black-600">
                <User className="w-4 h-4" />
                <span>{user?.name}</span>
              </div>
              <button onClick={logout} className="btn-secondary text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'schedule' ? (
          <SchedulingInterface onSuggestionsGenerated={handleSuggestionsGenerated} />
        ) : (
          <CalendarView 
            onSuggestionSelect={handleSuggestionSelect}
          />
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;