import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { JournalEntry } from '../../../types/journal';

interface LatestDecisionEntryProps {
  entry: JournalEntry;
  onViewEntry: (entry: JournalEntry) => void;
}

export default function LatestDecisionEntry({ entry, onViewEntry }: LatestDecisionEntryProps) {
  const decision = JSON.parse(entry.content || '{}');

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Latest Decision Analysis</h3>
        <button 
          onClick={() => onViewEntry(entry)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View Full Analysis
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Question</h4>
          <p className="text-gray-600">{decision.question}</p>
        </div>
        {decision.factors && decision.factors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Key Factors</h4>
            <ul className="mt-2 space-y-1">
              {decision.factors.slice(0, 2).map((factor: any, index: number) => (
                <li key={index} className="text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  {factor.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}