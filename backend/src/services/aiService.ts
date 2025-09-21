import OpenAI from 'openai';
import { SchedulingQuery, AISuggestion, FreeTimeBlock, CalendarEvent } from '../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  /**
   * Process a natural language scheduling query and return AI suggestions
   */
  static async processSchedulingQuery(
    query: SchedulingQuery,
    freeTimeBlocks: FreeTimeBlock[],
    existingEvents: CalendarEvent[]
  ): Promise<AISuggestion[]> {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(query, freeTimeBlocks, existingEvents);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from AI service');
      }

      return this.parseAIResponse(response, freeTimeBlocks);
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to process scheduling query');
    }
  }

  /**
   * Build system prompt for the AI
   */
  private static buildSystemPrompt(): string {
    return `You are BusyBee, an AI scheduling consultant. Your role is to help users find optimal times for their activities based on their calendar availability.

Key principles:
1. Always prioritize user's existing commitments
2. Suggest realistic time blocks based on available free time
3. Consider user preferences and constraints
4. Provide clear reasoning for your suggestions
5. Offer alternatives when possible
6. Be encouraging and supportive

Response format:
- Provide 1-3 specific time suggestions
- Include confidence level (0-100%)
- Explain your reasoning clearly
- Suggest alternatives if the primary option isn't ideal

Always respond in JSON format with this structure:
{
  "suggestions": [
    {
      "title": "Activity name",
      "start": "YYYY-MM-DDTHH:mm:ss",
      "end": "YYYY-MM-DDTHH:mm:ss",
      "confidence": 85,
      "reasoning": "Clear explanation of why this time works well",
      "alternatives": [
        {
          "title": "Alternative activity name",
          "start": "YYYY-MM-DDTHH:mm:ss",
          "end": "YYYY-MM-DDTHH:mm:ss",
          "confidence": 70,
          "reasoning": "Why this alternative works"
        }
      ]
    }
  ]
}`;
  }

  /**
   * Build user prompt with context
   */
  private static buildUserPrompt(
    query: SchedulingQuery,
    freeTimeBlocks: FreeTimeBlock[],
    existingEvents: CalendarEvent[]
  ): string {
    const freeTimeStr = freeTimeBlocks
      .map(block => `${block.start.toISOString()} - ${block.end.toISOString()} (${block.duration} minutes)`)
      .join('\n');

    const eventsStr = existingEvents
      .map(event => `${event.title}: ${event.start.toISOString()} - ${event.end.toISOString()}`)
      .join('\n');

    return `User Query: "${query.query}"

Available Free Time Blocks:
${freeTimeStr || 'No free time blocks available'}

Existing Events:
${eventsStr || 'No existing events'}

Duration Requested: ${query.duration ? `${query.duration} minutes` : 'Not specified'}

Please provide scheduling suggestions based on this information.`;
  }

  /**
   * Parse AI response into structured suggestions
   */
  private static parseAIResponse(response: string, freeTimeBlocks: FreeTimeBlock[]): AISuggestion[] {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response);
      if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
        return parsed.suggestions.map((suggestion: any, index: number) => ({
          id: `suggestion-${index + 1}`,
          title: suggestion.title || 'Scheduled Activity',
          start: new Date(suggestion.start),
          end: new Date(suggestion.end),
          confidence: suggestion.confidence || 75,
          reasoning: suggestion.reasoning || 'AI-generated suggestion',
          alternatives: suggestion.alternatives?.map((alt: any, altIndex: number) => ({
            id: `alt-${index + 1}-${altIndex + 1}`,
            title: alt.title || 'Alternative Activity',
            start: new Date(alt.start),
            end: new Date(alt.end),
            confidence: alt.confidence || 60,
            reasoning: alt.reasoning || 'Alternative option'
          })) || []
        }));
      }
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
    }

    // Fallback: create a simple suggestion based on available free time
    if (freeTimeBlocks.length > 0) {
      const bestBlock = freeTimeBlocks.reduce((best, current) => 
        current.duration > best.duration ? current : best
      );

      return [{
        id: 'fallback-suggestion',
        title: 'Suggested Activity',
        start: bestBlock.start,
        end: new Date(bestBlock.start.getTime() + Math.min(bestBlock.duration, 120) * 60000),
        confidence: 60,
        reasoning: 'Based on your largest available time block',
        alternatives: []
      }];
    }

    return [];
  }

  /**
   * Analyze calendar patterns for insights
   */
  static async analyzeCalendarPatterns(events: CalendarEvent[]): Promise<string> {
    try {
      const systemPrompt = `You are analyzing a user's calendar patterns to provide insights about their schedule. Look for:
1. Busy periods vs free periods
2. Recurring patterns
3. Work-life balance
4. Productivity opportunities

Provide a brief, encouraging analysis in 2-3 sentences.`;

      const eventsSummary = events
        .slice(0, 20) // Limit to recent events
        .map(event => `${event.title}: ${event.start.toISOString()}`)
        .join('\n');

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Recent events:\n${eventsSummary}` }
        ],
        temperature: 0.5,
        max_tokens: 200,
      });

      return completion.choices[0]?.message?.content || 'Calendar analysis completed.';
    } catch (error) {
      console.error('Calendar analysis error:', error);
      return 'Calendar analysis completed.';
    }
  }
}
