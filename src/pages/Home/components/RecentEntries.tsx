import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Calendar, Clock, Sparkles, Brain } from 'lucide-react';
import { format } from 'date-fns';
import type { JournalEntry } from '../../../types/journal';

interface RecentEntriesProps {
  entries: JournalEntry[];
}

function RecentEntries({ entries }: RecentEntriesProps) {
  const navigate = useNavigate();

  if (!entries.length) return null;

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div className="bg-white rounded-xl border">
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium">Recent Reflections</h3>
        </div>
        <button
          onClick={() => navigate('/journal')}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          View All
        </button>
      </div>

      <div className="divide-y">
        {entries.slice(0, 3).map((entry) => (
          <button
            key={entry.id}
            onClick={() => navigate(`/journal/${entry.id}`)}
            className="w-full text-left p-6 hover:bg-gray-50 transition-colors group"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`px-2.5 py-0.5 rounded-full text-sm ${
                  entry.type === 'morning'
                    ? 'bg-orange-50 text-orange-700'
                    : 'bg-indigo-50 text-indigo-700'
                }`}>
                  {entry.type === 'morning' ? 'Morning' : 'Evening'}
                </div>
                {entry.mood && (
                  <span className="text-sm text-gray-500 capitalize">{entry.mood}</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(entry.date), 'MMM d')}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {format(new Date(entry.date), 'h:mm a')}
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Content Preview */}
            <div className="mb-4">
              <p className="text-gray-600 line-clamp-2">
                {stripHtml(entry.content)}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {/* Tags */}
              {entry.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  {entry.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {entry.tags.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{entry.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* AI Insights Preview */}
              {entry.ai_insights && (
                <div className="flex items-center gap-3">
                  {entry.ai_insights.themes && entry.ai_insights.themes.length > 0 && (
                    <div className="flex items-center gap-1.5 text-purple-600 text-sm">
                      <Brain className="h-4 w-4" />
                      <span>{entry.ai_insights.themes.length} themes</span>
                    </div>
                  )}
                  {entry.ai_insights.recommendations && entry.ai_insights.recommendations.length > 0 && (
                    <div className="flex items-center gap-1.5 text-purple-600 text-sm">
                      <Sparkles className="h-4 w-4" />
                      <span>{entry.ai_insights.recommendations.length} insights</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RecentEntries;