import React from 'react';
import { X, Calendar, Sparkles } from 'lucide-react';
import type { MonthlyReview } from '../../../types/planning';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut';

interface MonthlyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: Omit<MonthlyReview, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
  month: string;
}

function MonthlyReviewModal({ isOpen, onClose, onSubmit, month }: MonthlyReviewModalProps) {
  const [wins, setWins] = React.useState<string[]>(['']);
  const [learnings, setLearnings] = React.useState<string[]>(['']);
  const [improvements, setImprovements] = React.useState<string[]>(['']);
  const [nextMonthFocus, setNextMonthFocus] = React.useState<string[]>(['']);
  const [stoicReflection, setStoicReflection] = React.useState('');

  // Keyboard shortcuts
  useKeyboardShortcut({
    key: 'Enter',
    metaOrCtrlKey: true,
    handler: () => {
      if (isOpen && wins[0] && learnings[0]) handleSubmit(new Event('submit') as any);
    }
  });

  useKeyboardShortcut({
    key: 'Escape',
    handler: () => {
      if (isOpen) onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      month,
      wins: wins.filter(Boolean),
      learnings: learnings.filter(Boolean),
      improvements: improvements.filter(Boolean),
      next_month_focus: nextMonthFocus.filter(Boolean),
      stoic_reflection: stoicReflection || undefined
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Monthly Review</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block font-medium mb-2">Wins & Achievements</label>
              <textarea
                value={wins.join('\n')}
                onChange={(e) => setWins(e.target.value.split('\n'))}
                placeholder="What went well this month? List your accomplishments..."
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[100px] resize-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Key Learnings</label>
              <textarea
                value={learnings.join('\n')}
                onChange={(e) => setLearnings(e.target.value.split('\n'))}
                placeholder="What did you learn? What insights did you gain?"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[100px] resize-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Areas for Improvement</label>
              <textarea
                value={improvements.join('\n')}
                onChange={(e) => setImprovements(e.target.value.split('\n'))}
                placeholder="What could have gone better? Where do you see room for growth?"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[100px] resize-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Next Month's Focus</label>
              <textarea
                value={nextMonthFocus.join('\n')}
                onChange={(e) => setNextMonthFocus(e.target.value.split('\n'))}
                placeholder="What are your key priorities for next month?"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[100px] resize-none"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-gray-400" />
                <label className="font-medium">Stoic Reflection</label>
              </div>
              <textarea
                value={stoicReflection}
                onChange={(e) => setStoicReflection(e.target.value)}
                placeholder="How did you embody Stoic virtues this month? What challenges tested your character?"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[120px] resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Consider wisdom, justice, courage, and self-control in your reflection
              </p>
            </div>
          </div>

          <div className="p-6 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Save Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MonthlyReviewModal;