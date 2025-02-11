import React from 'react';
import { Sparkles, ChevronDown, ChevronUp, Brain, Target, Scale } from 'lucide-react';
import type { JournalEntry } from '../types/journal';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface AIInsightsSectionProps {
  insights: JournalEntry['ai_insights'];
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  type?: 'journal' | 'decision';
}

function AIInsightsSection({ insights, isLoading, error, onRefresh, type = 'journal' }: AIInsightsSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  if (!insights && !isLoading && !error) return null;

  return (
    <div className="mb-8 border rounded-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h2 className="font-medium">AI-Powered Insights</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 border-t">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
              <span className="ml-2">Analyzing your {type}...</span>
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
              {type === 'journal' ? (
                <>
                  {insights.summary && (
                    <div>
                      <h3 className="font-medium mb-2">Summary</h3>
                      <p className="text-gray-600">{insights.summary}</p>
                    </div>
                  )}

                  {insights.themes && insights.themes.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Key Themes</h3>
                      <div className="flex flex-wrap gap-2">
                        {insights.themes.map((theme, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {insights.recommendations && insights.recommendations.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Stoic Recommendations</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {insights.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {insights.stoic_analysis && (
                    <div>
                      <h3 className="font-medium mb-2">Stoic Analysis</h3>
                      <p className="text-gray-600">{insights.stoic_analysis}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {insights.dichotomy_of_control && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-4 w-4 text-gray-400" />
                        <h3 className="font-medium">Dichotomy of Control</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Within Control</h4>
                          <ul className="space-y-1">
                            {insights.dichotomy_of_control.within_control.map((item, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Partial Control</h4>
                          <ul className="space-y-1">
                            {insights.dichotomy_of_control.partial_control.map((item, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Outside Control</h4>
                          <ul className="space-y-1">
                            {insights.dichotomy_of_control.outside_control.map((item, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {insights.dichotomy_of_control.reflection && (
                        <p className="text-sm text-gray-600 mt-3">
                          {insights.dichotomy_of_control.reflection}
                        </p>
                      )}
                    </div>
                  )}

                  {insights.virtue_analysis && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Scale className="h-4 w-4 text-gray-400" />
                        <h3 className="font-medium">Virtue Analysis</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(insights.virtue_analysis).map(([virtue, analysis]) => (
                          <div key={virtue}>
                            <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                              {virtue}
                            </h4>
                            <p className="text-sm text-gray-600">{analysis}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {insights.recommendations && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="h-4 w-4 text-gray-400" />
                        <h3 className="font-medium">Recommendations</h3>
                      </div>
                      <ul className="space-y-2">
                        {insights.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default AIInsightsSection;