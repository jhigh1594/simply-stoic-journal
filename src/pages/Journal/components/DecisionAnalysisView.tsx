import React from 'react';
import { Target, Brain, Scale, ArrowRight } from 'lucide-react';
import type { JournalEntry } from '../../../types/journal';

interface DecisionAnalysisViewProps {
  data: NonNullable<JournalEntry['decision_analysis']>;
  isPreview?: boolean;
}

export default function DecisionAnalysisView({ data, isPreview }: DecisionAnalysisViewProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const controllableFactors = data.factors.filter(f => f.type === 'controllable');
  const uncontrollableFactors = data.factors.filter(f => f.type === 'uncontrollable');

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Target className="h-6 w-6 text-gray-500 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-semibold mb-1">Decision Question</h3>
          <p className="text-gray-700">{data.question}</p>
        </div>
      </div>

      {!isPreview && (
        <>
          <div className="flex items-start gap-3">
            <Brain className="h-6 w-6 text-gray-500 flex-shrink-0 mt-1" />
            <div className="space-y-4 w-full">
              <h3 className="text-xl font-semibold">Factors Analysis</h3>
              
              {controllableFactors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Within Our Control</h4>
                  <div className="space-y-2">
                    {controllableFactors.map((factor, i) => (
                      <div
                        key={i}
                        className={`p-3 border rounded-lg flex items-center justify-between ${getImpactColor(factor.impact)}`}
                      >
                        <span>{factor.text}</span>
                        <span className="text-sm font-medium capitalize">{factor.impact} Impact</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uncontrollableFactors.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Beyond Our Control</h4>
                  <div className="space-y-2">
                    {uncontrollableFactors.map((factor, i) => (
                      <div
                        key={i}
                        className={`p-3 border rounded-lg flex items-center justify-between ${getImpactColor(factor.impact)}`}
                      >
                        <span>{factor.text}</span>
                        <span className="text-sm font-medium capitalize">{factor.impact} Impact</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Scale className="h-6 w-6 text-gray-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Analysis</h3>
              <div className="prose prose-gray max-w-none">
                {data.analysis.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {data.conclusion && (
            <div className="flex items-start gap-3">
              <ArrowRight className="h-6 w-6 text-gray-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Conclusion</h3>
                <p className="text-gray-700">{data.conclusion}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}