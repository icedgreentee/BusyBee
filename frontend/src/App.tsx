import React, { useState } from 'react';
import { Calendar, Zap, Shield, LogIn, User, MessageCircle, Send, Loader } from 'lucide-react';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'schedule' | 'calendar'>('schedule');

  const handleLogin = () => {
    // Simulate login for demo
    setIsAuthenticated(true);
    setUser({ name: 'Demo User', email: 'demo@busybee.com' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setSuggestions([]);
  };

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setSuggestions([
        {
          id: 1,
          title: "Study Block",
          start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
          confidence: 85,
          reasoning: "This time slot has no conflicts and aligns with your typical study patterns.",
          duration: "2 hours"
        },
        {
          id: 2,
          title: "Workout Session",
          start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          confidence: 78,
          reasoning: "Morning workout time with good energy levels.",
          duration: "1 hour"
        }
      ]);
      setIsLoading(false);
      setActiveTab('calendar');
    }, 2000);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">BusyBee</h1>
      </div>
              <button 
                onClick={handleLogin}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
        </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.1'%3E%3Cpath d='M30 0l15 8.66v17.32L30 34.64 15 25.98V8.66L30 0zM0 17.32l15-8.66 15 8.66v17.32L15 34.64 0 25.98V17.32zM0 42.68l15-8.66 15 8.66v17.32L15 60 0 51.34V42.68zM30 60l15-8.66V34.02L30 25.36 15 34.02v17.32L30 60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                Your AI
                <span className="text-yellow-500"> Scheduling</span>
                <br />Consultant
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Ask BusyBee anything about your schedule. From "Can I fit a 6-hour study block?" 
                to "What's the best time to exercise?" - get intelligent, personalized recommendations.
              </p>
              
              <button 
                onClick={handleLogin}
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-lg px-8 py-4 rounded-lg transition-colors duration-200"
              >
                Connect Your Calendar & Get Started
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-yellow-100 p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-Calendar Sync</h3>
                <p className="text-gray-600">Connect Google Calendar, Outlook, iCal, and Notion for complete visibility.</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-yellow-100 p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
                <p className="text-gray-600">Get smart recommendations based on your patterns and preferences.</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-yellow-100 p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Privacy-First</h3>
                <p className="text-gray-600">Your calendar data stays secure with OAuth 2.0 and minimal storage.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold">BusyBee</h3>
              </div>
              <p className="text-gray-300 mb-6">Your intelligent scheduling assistant</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Authenticated user interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-yellow-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">BusyBee</h1>
            </div>
            
            {/* Navigation Tabs */}
            <nav className="flex space-x-1 bg-yellow-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'schedule'
                    ? 'bg-white text-yellow-600 shadow-sm'
                    : 'text-gray-600 hover:text-yellow-600'
                }`}
              >
                Schedule
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'calendar'
                    ? 'bg-white text-yellow-600 shadow-sm'
                    : 'text-gray-600 hover:text-yellow-600'
                }`}
              >
                Calendar
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-white hover:bg-yellow-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-yellow-200 transition-colors duration-200 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'schedule' ? (
          <div className="space-y-6">
            {/* Scheduling Interface */}
            <div className="bg-white rounded-xl shadow-sm border border-yellow-100 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Ask BusyBee</h3>
                  <p className="text-sm text-gray-600">Get AI-powered scheduling recommendations</p>
                </div>
              </div>

              <form onSubmit={handleQuery} className="space-y-4">
                <div className="relative">
                  <div className="flex items-center bg-yellow-50 rounded-2xl border border-yellow-200 p-3">
                    <MessageCircle className="w-5 h-5 text-yellow-500 ml-2" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask BusyBee: 'Can I fit a 2-hour workout this week?'"
                      className="flex-1 px-4 py-2 text-lg border-0 bg-transparent focus:ring-0 focus:outline-none placeholder-gray-400"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !query.trim()}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Example Queries */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Can I fit a 2-hour workout this week?",
                    "What's the best time for a 1-hour study session?",
                    "I need 3 hours for a project, when can I schedule it?",
                    "Find me time for a 30-minute meditation daily"
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(example)}
                      className="px-3 py-1 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-full transition-colors"
                      disabled={isLoading}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Calendar View */}
            <div className="bg-white rounded-xl shadow-sm border border-yellow-100 p-6">
              <h3 className="text-lg font-semibold mb-4">AI Suggestions</h3>
              {suggestions.length > 0 ? (
                <div className="space-y-4">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-4 rounded-lg border border-green-200 bg-green-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-green-800">{suggestion.title}</h4>
                          <p className="text-sm text-green-700 mt-1">{suggestion.reasoning}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-green-600">
                            <span>
                              {formatDate(suggestion.start)} {formatTime(suggestion.start)} - {formatTime(suggestion.end)}
                            </span>
                            <span className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                              {suggestion.confidence}% confidence
                            </span>
                            <span>{suggestion.duration}</span>
                          </div>
                        </div>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors ml-4">
                          Add to Calendar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No suggestions yet. Ask BusyBee a scheduling question!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;