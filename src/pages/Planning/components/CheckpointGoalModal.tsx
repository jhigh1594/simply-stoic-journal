import React from 'react';
import { X, Target, AlertTriangle } from 'lucide-react';
import type { CheckpointGoal } from '../../../types/planning';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut';
import { usePlanning } from '../../../hooks/usePlanning';
import { useAuth } from '../../../hooks/useAuth';

interface CheckpointGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: Omit<CheckpointGoal, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
  bigGoalId: string;
}

function CheckpointGoalModal({ isOpen, onClose, onSubmit, bigGoalId }: CheckpointGoalModalProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [targetDate, setTargetDate] = React.useState('');
  const [blockers, setBlockers] = React.useState<string[]>(['']);
  const { bigGoals, loadBigGoals } = usePlanning();
  const [selectedBigGoalId, setSelectedBigGoalId] = React.useState(bigGoalId);
  const { userId } = useAuth();

  React.useEffect(() => {
    if (!userId) return;
    loadBigGoals();
  }, [loadBigGoals, userId]);

  // Update selectedBigGoalId when bigGoalId prop changes
  React.useEffect(() => {
    setSelectedBigGoalId(bigGoalId);
  }, [bigGoalId]);

  // Keyboard shortcuts
  useKeyboardShortcut({
    key: 'Enter',
    metaOrCtrlKey: true,
    handler: () => {
      if (isOpen && title && targetDate) handleSubmit(new Event('submit') as any);
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
      big_goal_id: selectedBigGoalId,
      title,
      description,
      target_date: targetDate,
      progress: 0,
      status: 'not_started',
      blockers: blockers.filter(Boolean)
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-xl">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Add Checkpoint Goal</h2>
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
              <label className="block font-medium mb-2">Related to Big Goal</label>
              <select
                value={selectedBigGoalId}
                onChange={(e) => setSelectedBigGoalId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
              >
                {bigGoals.map(goal => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter milestone title"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this milestone..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[100px] resize-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  Potential Blockers
                </div>
              </label>
              <textarea
                value={blockers.join('\n')}
                onChange={(e) => setBlockers(e.target.value.split('\n'))}
                placeholder="List potential blockers (one per line)..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[80px] resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Identifying potential blockers helps with premeditatio malorum
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
              Create Checkpoint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckpointGoalModal;