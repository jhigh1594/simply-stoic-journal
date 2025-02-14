import React from 'react';
import { Calendar, Scale } from 'lucide-react';
import type { JournalEntry } from '../../../types/journal';
import DailyQuote from './DailyQuote';

interface JournalHomeProps {
  entries: JournalEntry[];
  onNewEntry: (type: 'morning' | 'evening' | 'decision') => void;
  onViewEntry: (entry: JournalEntry) => void;
}

export default function JournalHome({ entries, onNewEntry, onViewEntry }: JournalHomeProps) {
  // Add entry type counters
  const morningEntries = entries.filter(entry => entry.type === 'morning');
  const eveningEntries = entries.filter(entry => entry.type === 'evening');
  const decisionEntries = entries.filter(entry => entry.type === 'decision');

  // Get recent entries
  const recentEntries = entries.slice(0, 2);

  return (
    <div className="space-y-6">
      <DailyQuote entries={entries} />

      {/* Quick Actions section remains the same */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onNewEntry('morning')}
          className="flex items-center gap-3 p-6 bg-white border rounded-lg hover:border-gray-400 transition-colors"
        >
          <Calendar className="h-5 w-5 text-orange-500 flex-shrink-0" />
          <div>
            <h3 className="font-medium mb-1">Morning Reflection</h3>
            <p className="text-sm text-gray-600">
              Start your day with intention and gratitude
            </p>
          </div>
        </button>

        <button
          onClick={() => onNewEntry('evening')}
          className="flex items-center gap-3 p-6 bg-white border rounded-lg hover:border-gray-400 transition-colors"
        >
          <Calendar className="h-5 w-5 text-indigo-500 flex-shrink-0" />
          <div>
            <h3 className="font-medium mb-1">Evening Review</h3>
            <p className="text-sm text-gray-600">
              Reflect on your day and plan for tomorrow
            </p>
          </div>
        </button>

        <button
          onClick={() => onNewEntry('decision')}
          className="flex items-center gap-3 p-6 bg-white border rounded-lg hover:border-gray-400 transition-colors"
        >
          <Scale className="h-5 w-5 text-green-500 flex-shrink-0" />
          <div>
            <h3 className="font-medium mb-1">Decision Analysis</h3>
            <p className="text-sm text-gray-600">
              Analyze decisions using Stoic principles
            </p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-medium mb-4">Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Morning Reflections</div>
              <div className="text-3xl font-semibold">{morningEntries.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Evening Reviews</div>
              <div className="text-3xl font-semibold">{eveningEntries.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Decision Analyses</div>
              <div className="text-3xl font-semibold">{decisionEntries.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-medium mb-4">Recent Activity</h3>
          {recentEntries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onViewEntry(entry)}
              className="w-full text-left mb-3 group"
            >
              <div className="font-medium group-hover:text-gray-900">
                {entry.type === 'morning' 
                  ? 'Morning Reflection' 
                  : entry.type === 'evening'
                  ? 'Evening Review'
                  : 'Decision Analysis'}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(entry.date).toLocaleDateString()} at {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-blue-600 group-hover:text-blue-700">View →</div>
            </button>
          ))}
        </div>
      </div>

      {/* Latest Entry section */}
      {entries.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Latest Entry</h3>
            <button 
              onClick={() => onViewEntry(entries[0])}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View Full Entry →
            </button>
          </div>
          <p className="text-gray-600">
            {entries[0].type === 'evening'
              ? JSON.parse(entries[0].content).mainContent
              : entries[0].content}
          </p>
        </div>
      )}
    </div>
  );
}