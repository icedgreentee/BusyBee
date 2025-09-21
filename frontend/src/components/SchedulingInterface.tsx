import React, { useState } from 'react';
import { MessageCircle, Send, Loader, Sparkles } from 'lucide-react';
import { apiService, type AISuggestion } from '../services/api';

interface SchedulingInterfaceProps {
  onSuggestionsGenerated: (suggestions: AISuggestion[]) => void;
}

export const SchedulingInterface: React.FC<SchedulingInterfaceProps> = ({ onSuggestionsGenerated }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);

  const exampleQueries = [
    "Can I fit a 2-hour workout this week?",
    "What's the best time for a 1-hour study session?",
    "I need 3 hours for a project, when can I schedule it?",
    "Find me time for a 30-minute meditation daily",
    "When can I fit in a 4-hour deep work block?"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await apiService.processSchedulingQuery({
        query: query.trim(),
        duration: extractDuration(query),
        preferredTimes: extractPreferredTimes(query),
        constraints: extractConstraints(query)
      });

      onSuggestionsGenerated(response.suggestions);
      
      // Add to recent queries
      setRecentQueries(prev => {
        const newQueries = [query.trim(), ...prev.filter(q => q !== query.trim())];
        return newQueries.slice(0, 5); // Keep only 5 recent queries
      });

      setQuery('');
    } catch (error) {
      console.error('Failed to process scheduling query:', error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  const extractDuration = (query: string): number | undefined => {
    // Extract duration in minutes from query
    const hourMatch = query.match(/(\d+)\s*hour/i);
    const minuteMatch = query.match(/(\d+)\s*minute/i);
    
    if (hourMatch) {
      return parseInt(hourMatch[1]) * 60;
    }
    if (minuteMatch) {
      return parseInt(minuteMatch[1]);
    }
    
    return undefined;
  };

  const extractPreferredTimes = (query: string): string[] => {
    // Extract preferred times from query
    const times = [];
    const morningMatch = query.match(/morning/i);
    const afternoonMatch = query.match(/afternoon/i);
    const eveningMatch = query.match(/evening/i);
    const nightMatch = query.match(/night/i);
    
    if (morningMatch) times.push('morning');
    if (afternoonMatch) times.push('afternoon');
    if (eveningMatch) times.push('evening');
    if (nightMatch) times.push('night');
    
    return times;
  };

  const extractConstraints = (query: string): string[] => {
    // Extract constraints from query
    const constraints = [];
    const workdayMatch = query.match(/workday|weekday/i);
    const weekendMatch = query.match(/weekend/i);
    const beforeMatch = query.match(/before\s+(\d+)/i);
    const afterMatch = query.match(/after\s+(\d+)/i);
    
    if (workdayMatch) constraints.push('workday');
    if (weekendMatch) constraints.push('weekend');
    if (beforeMatch) constraints.push(`before ${beforeMatch[1]}`);
    if (afterMatch) constraints.push(`after ${afterMatch[1]}`);
    
    return constraints;
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  return (
    <div className="space-y-6">
      {/* Main Query Interface */}
      <div className="card">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-bee-yellow-100 rounded-xl flex items-center justify-center mr-3">
            <Sparkles className="w-5 h-5 text-bee-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Ask BusyBee</h3>
            <p className="text-sm text-hex-black-600">Get AI-powered scheduling recommendations</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="flex items-center bg-honey-white-50 rounded-2xl border border-bee-yellow-200 p-3">
              <MessageCircle className="w-5 h-5 text-bee-yellow-500 ml-2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask BusyBee: 'Can I fit a 2-hour workout this week?'"
                className="flex-1 px-4 py-2 text-lg border-0 bg-transparent focus:ring-0 focus:outline-none placeholder-hex-black-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
          <p className="text-sm text-hex-black-600 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="px-3 py-1 text-sm bg-bee-yellow-100 hover:bg-bee-yellow-200 text-bee-yellow-800 rounded-full transition-colors"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Queries */}
      {recentQueries.length > 0 && (
        <div className="card">
          <h4 className="text-sm font-medium text-hex-black-700 mb-3">Recent Queries</h4>
          <div className="space-y-2">
            {recentQueries.map((recentQuery, index) => (
              <button
                key={index}
                onClick={() => setQuery(recentQuery)}
                className="w-full text-left p-2 text-sm bg-honey-white-50 hover:bg-bee-yellow-50 rounded-lg transition-colors"
                disabled={isLoading}
              >
                {recentQuery}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card bg-gradient-to-r from-bee-yellow-50 to-honey-white-50 border-bee-yellow-200">
        <h4 className="text-sm font-medium text-bee-yellow-800 mb-2">💡 Tips for better results</h4>
        <ul className="text-sm text-bee-yellow-700 space-y-1">
          <li>• Be specific about duration (e.g., "2 hours", "30 minutes")</li>
          <li>• Mention preferred times (e.g., "morning", "after work")</li>
          <li>• Include any constraints (e.g., "weekdays only", "before 5 PM")</li>
          <li>• Ask for alternatives if the first suggestion doesn't work</li>
        </ul>
      </div>
    </div>
  );
};
