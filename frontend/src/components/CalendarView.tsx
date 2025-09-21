import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Check, X } from 'lucide-react';
import { apiService, type CalendarEvent, type FreeTimeBlock, type AISuggestion } from '../services/api';

interface CalendarViewProps {
  onSuggestionSelect?: (suggestion: AISuggestion) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onSuggestionSelect }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [freeTimeBlocks, setFreeTimeBlocks] = useState<FreeTimeBlock[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate] = useState(new Date());

  useEffect(() => {
    loadCalendarData();
  }, [selectedDate]);

  const loadCalendarData = async () => {
    setIsLoading(true);
    try {
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - 7);
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 7);

      const data = await apiService.getEvents(
        startDate.toISOString(),
        endDate.toISOString()
      );

      setEvents(data.events);
      setFreeTimeBlocks(data.freeTimeBlocks);
    } catch (error) {
      console.error('Failed to load calendar data:', error);
    } finally {
      setIsLoading(false);
    }
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

  const getEventColor = (source: string) => {
    switch (source) {
      case 'google': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'microsoft': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'apple': return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'notion': return 'bg-pink-100 border-pink-300 text-pink-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getSuggestionColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 border-green-300 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    return 'bg-orange-100 border-orange-300 text-orange-800';
  };

  const handleAddSuggestion = async (suggestion: AISuggestion) => {
    try {
      await apiService.createEvent({
        title: suggestion.title,
        start: suggestion.start,
        end: suggestion.end,
        description: suggestion.reasoning,
        provider: 'google'
      });
      
      // Remove suggestion from list
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      
      // Reload calendar data
      loadCalendarData();
      
      if (onSuggestionSelect) {
        onSuggestionSelect(suggestion);
      }
    } catch (error) {
      console.error('Failed to add event:', error);
    }
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = new Date(event.start).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  // Group suggestions by date (currently unused but kept for future use)
  // const suggestionsByDate = suggestions.reduce((acc, suggestion) => {
  //   const date = new Date(suggestion.start).toDateString();
  //   if (!acc[date]) acc[date] = [];
  //   acc[date].push(suggestion);
  //   return acc;
  // }, {} as Record<string, AISuggestion[]>);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-hex-black-800">Your Calendar</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadCalendarData}
            disabled={isLoading}
            className="btn-secondary flex items-center"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="card border-l-4 border-l-bee-yellow-500">
          <h3 className="text-lg font-semibold mb-4 text-bee-yellow-700">
            🐝 AI Suggestions
          </h3>
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-4 rounded-lg border ${getSuggestionColor(suggestion.confidence)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <p className="text-sm opacity-75 mt-1">{suggestion.reasoning}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(suggestion.start)} {formatTime(suggestion.start)} - {formatTime(suggestion.end)}
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        {suggestion.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleAddSuggestion(suggestion)}
                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      title="Add to calendar"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRejectSuggestion(suggestion.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      title="Reject suggestion"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Events */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bee-yellow-500 mx-auto"></div>
            <p className="mt-2 text-hex-black-600">Loading calendar...</p>
          </div>
        ) : Object.keys(eventsByDate).length === 0 ? (
          <div className="text-center py-8 text-hex-black-600">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No events found for this period</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(eventsByDate)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, dayEvents]) => (
                <div key={date} className="border-b border-bee-yellow-100 pb-4 last:border-b-0">
                  <h4 className="font-medium text-hex-black-700 mb-2">
                    {formatDate(dayEvents[0].start)}
                  </h4>
                  <div className="space-y-2">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg border ${getEventColor(event.source)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium">{event.title}</h5>
                            {event.description && (
                              <p className="text-sm opacity-75 mt-1">{event.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-xs">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTime(event.start)} - {formatTime(event.end)}
                              </span>
                              {event.location && (
                                <span className="opacity-75">{event.location}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Free Time Blocks */}
      {freeTimeBlocks.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Available Free Time</h3>
          <div className="grid gap-2">
            {freeTimeBlocks.slice(0, 10).map((block, index) => (
              <div
                key={index}
                className="p-3 bg-honey-white-100 rounded-lg border border-bee-yellow-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">
                      {formatDate(block.start)} {formatTime(block.start)} - {formatTime(block.end)}
                    </span>
                    <p className="text-sm text-hex-black-600">
                      {block.duration} minutes available
                    </p>
                  </div>
                  <button className="btn-primary text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
