import React from 'react';
import { Sparkles, TrendingUp, Quote } from 'lucide-react';
import type { JournalEntry } from '../../../types/journal';
import { quotes } from '../../../data/quotes';

interface InsightsSectionProps {
  entries: JournalEntry[];
}

function InsightsSection({ entries }: InsightsSectionProps) {
  // Get recent themes from AI insights
  const recentThemes = React.useMemo(() => {
    const themes = entries
      .slice(0, 5)
      .flatMap(entry => entry.ai_insights?.themes || []);
    return Array.from(new Set(themes));
  }, [entries]);

  // Get mood trends
  const moodTrends = React.useMemo(() => {
    const moodCounts = entries.reduce((acc, entry) => {
      if (entry.mood) {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(moodCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  }, [entries]);

  // Get relevant quote based on recent themes
  const relevantQuote = React.useMemo(() => {
    if (!recentThemes.length) return null;
    
    const matchingQuotes = quotes.filter(quote =>
      quote.tags.some(tag => recentThemes.includes(tag.toLowerCase()))
    );
    
    if (!matchingQuotes.length) return null;
    return matchingQuotes[Math.floor(Math.random() * matchingQuotes.length)];
  }, [recentThemes]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* AI Insights Summary */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h3 className="font-medium">Recent Themes</h3>
        </div>
        {recentThemes.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {recentThemes.map((theme, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                >
                  {theme}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              These themes have emerged from your recent journal entries.
              Consider exploring them further in your next reflection.
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Start journaling to discover patterns and themes in your reflections.
          </p>
        )}
      </div>

      {/* Mood Trends */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium">Mood Patterns</h3>
        </div>
        {moodTrends.length > 0 ? (
          <div className="space-y-3">
            {moodTrends.map(([mood, count]) => (
              <div key={mood} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-sm font-medium capitalize">{mood}</div>
                  <div className="text-xs text-gray-500">
                    {Math.round((count / entries.length) * 100)}% of entries
                  </div>
                </div>
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${(count / entries.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Track your moods to see patterns emerge over time.
          </p>
        )}
      </div>

      {/* Relevant Quote */}
      {relevantQuote && (
        <div className="md:col-span-2 bg-white border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Quote className="h-5 w-5 text-gray-400" />
            <h3 className="font-medium">Relevant Wisdom</h3>
          </div>
          <blockquote className="text-lg mb-2">
            "{relevantQuote.text}"
          </blockquote>
          <cite className="text-sm text-gray-600">
            — {relevantQuote.author}, {relevantQuote.source}
          </cite>
        </div>
      )}
    </div>
  );
}

export default InsightsSection;