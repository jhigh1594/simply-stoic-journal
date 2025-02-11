import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import type { JournalEntry } from '../../../types/journal';

interface LatestInsightProps {
  lastEntry?: JournalEntry;
}

function LatestInsight({ lastEntry }: LatestInsightProps) {
  const navigate = useNavigate();

  if (!lastEntry) return null;

  const theme = lastEntry.ai_insights?.themes?.[0];
  const prompt = theme ? `How has your perspective on "${theme}" evolved since your last reflection?` : null;

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center gap-2 text-purple-600 mb-4">
        <Sparkles className="h-5 w-5" />
        <h3 className="font-medium">Continue Your Reflection</h3>
      </div>

      <p className="text-gray-600 mb-2 line-clamp-2">
        {prompt || "Ready to continue your journey of reflection?"}
      </p>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          From {format(new Date(lastEntry.date), 'MMM d, h:mm a')}
        </div>
        <button
          onClick={() => navigate('/journal')}
          className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default LatestInsight;