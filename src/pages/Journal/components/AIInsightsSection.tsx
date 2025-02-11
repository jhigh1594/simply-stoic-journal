import React from 'react';
import { Sparkles, ChevronDown, ChevronUp, Brain, Target, Scale } from 'lucide-react';
import type { JournalEntry } from '../../../types/journal';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';

interface AIInsights {
  summary?: string;
  themes?: string[];
  recommendations?: string[];
  stoic_analysis?: string;
}

interface AIInsightsSectionProps {
  insights: JournalEntry['ai_insights'] & AIInsights;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

function AIInsightsSection({ insights, isLoading, error, onRefresh }: AIInsightsSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  if (!insights && !isLoading && !error) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h2 className="font-medium">AI-Powered Insights</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-purple-100">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
              <span className="ml-2">Analyzing your entry...</span>
            </div>
          ) : error ? (
            <ErrorMessage 
              message={error}
              action={onRefresh ? {
                label: "Try Again",
                onClick: onRefresh
              } : undefined}
            />
          ) : insights ? (
            <div className="space-y-6">
              {/* Summary */}
              {insights.summary && (
                <div className="bg-white/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Key Takeaway</h3>
                  <p className="text-gray-600">{insights.summary}</p>
                </div>
              )}

              {/* Themes */}
              {insights.themes && insights.themes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-4 w-4 text-gray-400" />
                    <h3 className="font-medium">Emerging Themes</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {insights.themes.map((theme: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm border border-purple-100"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {insights.recommendations && insights.recommendations.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4 text-gray-400" />
                    <h3 className="font-medium">Stoic Recommendations</h3>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <ul className="space-y-3">
                      {insights.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">
                            {index + 1}
                          </span>
                          <span className="text-gray-600">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Stoic Analysis */}
              {insights.stoic_analysis && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Scale className="h-4 w-4 text-gray-400" />
                    <h3 className="font-medium">Stoic Analysis</h3>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-gray-600">{insights.stoic_analysis}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default AIInsightsSection;