import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { JournalEntry } from '../../../types/journal';

interface LatestJournalEntryProps {
  entry: JournalEntry;
  onViewEntry: (entry: JournalEntry) => void;
}

export default function LatestJournalEntry({ entry, onViewEntry }: LatestJournalEntryProps) {
  const content = entry.type === 'evening' 
    ? JSON.parse(entry.content || '{}')
    : { mainContent: entry.content };

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Latest Journal Entry</h3>
        <button 
          onClick={() => onViewEntry(entry)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View Full Entry
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <p className="text-gray-600 line-clamp-3">
        {content.mainContent || 'No content available'}
      </p>
    </div>
  );
}