import React from 'react';
import { ChevronDown, ChevronUp, Calendar, Sparkles, Target, Brain, ArrowUp } from 'lucide-react';
import type { MonthlyReview } from '../../../types/planning';

interface MonthlyReviewCardProps {
  review: MonthlyReview;
  onUpdate: () => void;
}

function MonthlyReviewCard({ review, onUpdate }: MonthlyReviewCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const formatMonth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="bg-white rounded-lg border hover:border-gray-300 transition-colors">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-gray-400" />
              <h3 className="font-medium">{formatMonth(review.month)}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <h4 className="text-sm font-medium text-gray-700">Key Wins</h4>
                </div>
                <ul className="space-y-1">
                  {review.wins.slice(0, isExpanded ? undefined : 2).map((win, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      {win}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUp className="h-4 w-4 text-blue-500" />
                  <h4 className="text-sm font-medium text-gray-700">Next Month's Focus</h4>
                </div>
                <ul className="space-y-1">
                  {review.next_month_focus.slice(0, isExpanded ? undefined : 2).map((focus, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      {focus}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t pt-4">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <h4 className="text-sm font-medium text-gray-700">Key Learnings</h4>
              </div>
              <ul className="space-y-1">
                {review.learnings.map((learning, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    {learning}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-yellow-500" />
                <h4 className="text-sm font-medium text-gray-700">Areas for Improvement</h4>
              </div>
              <ul className="space-y-1">
                {review.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>

            {review.stoic_reflection && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-gray-400" />
                  <h4 className="text-sm font-medium text-gray-700">Stoic Reflection</h4>
                </div>
                <p className="text-sm text-gray-600">{review.stoic_reflection}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlyReviewCard;