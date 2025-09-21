import React, { useState } from 'react';
import { Calendar, Zap, Shield, User, MessageCircle, Send, Loader, Sparkles, Crown, Star, Heart } from 'lucide-react';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'schedule' | 'calendar'>('schedule');
  const [connectedCalendars, setConnectedCalendars] = useState([
    { id: 1, name: 'Google Calendar', provider: 'google', color: 'bg-blue-500', connected: true },
    { id: 2, name: 'Outlook Calendar', provider: 'microsoft', color: 'bg-purple-500', connected: false },
    { id: 3, name: 'Apple iCal', provider: 'apple', color: 'bg-gray-500', connected: false },
    { id: 4, name: 'Notion Calendar', provider: 'notion', color: 'bg-pink-500', connected: false }
  ]);

  const handleLogin = () => {
    // Simulate login for demo
    setIsAuthenticated(true);
    setUser({ name: 'Princess Bee', email: 'princess@busybee.com' });
    // Simulate connecting Google Calendar
    setConnectedCalendars(prev => 
      prev.map(cal => cal.provider === 'google' ? { ...cal, connected: true } : cal)
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setSuggestions([]);
    setConnectedCalendars(prev => 
      prev.map(cal => ({ ...cal, connected: false }))
    );
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
          title: "✨ Study Session",
          start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
          confidence: 95,
          reasoning: "Perfect golden hour for focused learning - your mind is sharpest during this magical time!",
          duration: "2 hours",
          icon: "📚"
        },
        {
          id: 2,
          title: "🏃‍♀️ Morning Workout",
          start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          confidence: 88,
          reasoning: "Dawn's first light brings the most enchanting energy for your royal fitness routine!",
          duration: "1 hour",
          icon: "💪"
        },
        {
          id: 3,
          title: "🧘‍♀️ Meditation Time",
          start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
          confidence: 92,
          reasoning: "The garden of your mind blooms most beautifully in this peaceful moment.",
          duration: "30 minutes",
          icon: "🌸"
        }
      ]);
      setIsLoading(false);
      setActiveTab('calendar');
    }, 2500);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
  return (
      <div className="min-h-screen bee-pattern">
        {/* Magical Navbar */}
        <nav className="navbar sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg floating">
                  <Crown className="w-7 h-7 text-white" />
                </div>
      <div>
                  <h1 className="text-3xl font-bold golden-text">BusyBee</h1>
                  <p className="text-sm text-amber-600 font-medium">Your Royal Scheduling Assistant</p>
                </div>
              </div>
              <button 
                onClick={handleLogin}
                className="btn-magic sparkle flex items-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Enter the Kingdom</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Enchanted Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 honey-gradient opacity-60"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-amber-200 rounded-full opacity-20 floating"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-300 rounded-full opacity-30 floating" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-orange-200 rounded-full opacity-25 floating" style={{animationDelay: '2s'}}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl floating">
                  <Crown className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-6xl md:text-7xl font-bold mb-6">
                  <span className="golden-text">Your Royal</span>
                  <br />
                  <span className="text-amber-600">AI Scheduling</span>
                  <br />
                  <span className="golden-text">Consultant</span>
                </h2>
                <p className="text-2xl text-amber-700 mb-12 leading-relaxed font-medium">
                  ✨ Ask BusyBee anything about your schedule ✨<br />
                  From "Can I fit a 6-hour study block?" to "What's the best time to exercise?"<br />
                  Get <span className="font-bold golden-text">magical, personalized</span> recommendations!
                </p>
              </div>
              
              <button 
                onClick={handleLogin}
                className="btn-magic sparkle text-xl px-12 py-6 flex items-center space-x-3 mx-auto"
              >
                <Crown className="w-6 h-6" />
                <span>Begin Your Royal Journey</span>
                <Sparkles className="w-6 h-6" />
              </button>
            </div>
          </div>
        </section>

        {/* Enchanted Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold golden-text mb-4">✨ Magical Features ✨</h3>
              <p className="text-xl text-amber-700">Everything you need for a perfectly organized royal schedule</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card-magic text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-amber-800 mb-4">Multi-Calendar Sync</h4>
                <p className="text-amber-700 leading-relaxed">Connect Google Calendar, Outlook, iCal, and Notion for complete royal visibility across all your kingdoms.</p>
              </div>
              
              <div className="card-magic text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-amber-800 mb-4">AI-Powered Magic</h4>
                <p className="text-amber-700 leading-relaxed">Get smart recommendations based on your royal patterns and preferences, powered by the finest AI magic.</p>
              </div>
              
              <div className="card-magic text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-amber-800 mb-4">Royal Privacy</h4>
                <p className="text-amber-700 leading-relaxed">Your royal calendar data stays secure with OAuth 2.0 and minimal storage - your secrets are safe!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Royal Footer */}
        <footer className="bg-gradient-to-r from-amber-800 to-yellow-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold">BusyBee</h3>
              </div>
              <p className="text-amber-200 text-lg mb-8">Your Royal AI Scheduling Assistant</p>
              <div className="flex justify-center space-x-8 text-amber-200">
                <span className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Made with Royal Love</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Magical Scheduling</span>
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Authenticated Royal Interface
  return (
    <div className="min-h-screen bee-pattern">
      {/* Royal Navbar */}
      <nav className="navbar sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold golden-text">BusyBee</h1>
                <p className="text-sm text-amber-600">Welcome, {user?.name}! 👑</p>
              </div>
            </div>
            
            {/* Royal Navigation */}
            <nav className="flex space-x-2 bg-amber-100/80 backdrop-blur-sm rounded-2xl p-2 border-2 border-amber-200">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'schedule'
                    ? 'bg-white text-amber-700 shadow-lg border-2 border-amber-300'
                    : 'text-amber-600 hover:text-amber-700 hover:bg-white/50'
                }`}
              >
                ✨ Schedule
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'calendar'
                    ? 'bg-white text-amber-700 shadow-lg border-2 border-amber-300'
                    : 'text-amber-600 hover:text-amber-700 hover:bg-white/50'
                }`}
              >
                📅 Calendar
              </button>
            </nav>

            {/* Royal User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 text-amber-700">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">{user?.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="btn-secondary"
              >
                👋 Logout
        </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Royal Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'schedule' ? (
          <div className="space-y-8">
            {/* Connected Calendars Display */}
            <div className="card-magic">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-800">Connected Calendars</h3>
                  <p className="text-amber-600">Your royal calendar kingdoms</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {connectedCalendars.map((calendar) => (
                  <div
                    key={calendar.id}
                    className={`calendar-item ${calendar.connected ? 'ring-2 ring-green-300 bg-green-50' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${calendar.color} rounded-lg flex items-center justify-center`}>
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-800 text-sm">{calendar.name}</h4>
                        <p className={`text-xs ${calendar.connected ? 'text-green-600' : 'text-amber-500'}`}>
                          {calendar.connected ? '✅ Connected' : '⏳ Not connected'}
        </p>
      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Royal Scheduling Interface */}
            <div className="card-magic">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center mr-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-800">Ask BusyBee</h3>
                  <p className="text-amber-600">Get magical AI-powered scheduling recommendations</p>
                </div>
              </div>

              <form onSubmit={handleQuery} className="space-y-6">
                <div className="relative">
                  <div className="flex items-center bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl border-2 border-amber-200 p-4 shadow-lg">
                    <MessageCircle className="w-6 h-6 text-amber-500 ml-3" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask BusyBee: 'Can I fit a 2-hour workout this week?'"
                      className="flex-1 px-4 py-3 text-lg border-0 bg-transparent focus:ring-0 focus:outline-none placeholder-amber-400 font-medium"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !query.trim()}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>Thinking...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Ask</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Royal Example Queries */}
              <div className="mt-8">
                <p className="text-amber-700 font-medium mb-4">✨ Try these magical examples:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Can I fit a 2-hour workout this week?",
                    "What's the best time for a 1-hour study session?",
                    "I need 3 hours for a project, when can I schedule it?",
                    "Find me time for a 30-minute meditation daily"
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(example)}
                      className="text-left p-4 bg-gradient-to-r from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 text-amber-800 rounded-xl border border-amber-200 transition-all duration-300 hover:shadow-md"
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
          <div className="space-y-8">
            {/* Royal AI Suggestions */}
            <div className="card-magic">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-800">✨ AI Suggestions ✨</h3>
                  <p className="text-amber-600">Your royal scheduling recommendations</p>
                </div>
              </div>
              
              {suggestions.length > 0 ? (
                <div className="space-y-6">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="suggestion-card"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-2xl">{suggestion.icon}</span>
                            <h4 className="text-xl font-bold text-green-800">{suggestion.title}</h4>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(suggestion.confidence / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-green-700 mb-4 font-medium">{suggestion.reasoning}</p>
                          <div className="flex items-center space-x-6 text-sm text-green-600">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(suggestion.start)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Zap className="w-4 h-4" />
                              <span>{formatTime(suggestion.start)} - {formatTime(suggestion.end)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span>{suggestion.confidence}% confidence</span>
                            </span>
                            <span className="font-semibold">{suggestion.duration}</span>
                          </div>
                        </div>
                        <button className="btn-primary ml-6 flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Add to Calendar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-12 h-12 text-amber-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-amber-800 mb-4">No suggestions yet</h4>
                  <p className="text-amber-600 text-lg">Ask BusyBee a scheduling question to see magical recommendations!</p>
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