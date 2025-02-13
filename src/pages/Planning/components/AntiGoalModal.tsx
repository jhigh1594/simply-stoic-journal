import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import type { AntiGoal, GoalCategory, ImpactLevel } from '../../../types/planning';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut';

interface AntiGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: Omit<AntiGoal, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
}

function AntiGoalModal({ isOpen, onClose, onSubmit }: AntiGoalModalProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<GoalCategory | 'habit'>('habit');
  const [impactLevel, setImpactLevel] = React.useState<ImpactLevel>('medium');
  const [mitigationStrategy, setMitigationStrategy] = React.useState('');

  // Keyboard shortcuts
  useKeyboardShortcut({
    key: 'Enter',
    metaOrCtrlKey: true,
    handler: () => {
      if (isOpen && title) handleSubmit(new Event('submit') as any);
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
      title,
      description,
      category,
      impact_level: impactLevel,
      mitigation_strategy: mitigationStrategy || undefined
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-xl my-8">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b sticky top-0 bg-white rounded-t-xl z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Add Anti-Goal</h2>
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

          <div className="p-6 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
            <div>
              <label className="block font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to avoid?"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this anti-goal in detail..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AntiGoal['category'])}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="habit">Habit</option>
                  <option value="professional">Professional</option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">Impact Level</label>
                <select
                  value={impactLevel}
                  onChange={(e) => setImpactLevel(e.target.value as ImpactLevel)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Mitigation Strategy</label>
              <textarea
                value={mitigationStrategy}
                onChange={(e) => setMitigationStrategy(e.target.value)}
                placeholder="How will you prevent or handle this when it occurs?"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[100px] resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Consider using Stoic practices like negative visualization or premeditatio malorum
              </p>
            </div>
          </div>

          <div className="p-6 border-t sticky bottom-0 bg-white rounded-b-xl">
            <div className="flex justify-end gap-3">
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
                Create Anti-Goal
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AntiGoalModal;