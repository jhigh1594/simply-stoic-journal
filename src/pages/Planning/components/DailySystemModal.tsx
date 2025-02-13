import React from 'react';
import { X, Clock, Calendar } from 'lucide-react';
import type { DailySystem, Frequency, TimeOfDay } from '../../../types/planning';
import { usePlanning } from '../../../hooks/usePlanning';
import { useAuth } from '../../../hooks/useAuth';
import { planningService } from '../../../services/planning';
import ABCLevelBadge from '../../../components/ABCLevelBadge';

interface DailySystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (system: Omit<DailySystem, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
  checkpointGoalId?: string;
}

function DailySystemModal({ isOpen, onClose, onSubmit, checkpointGoalId }: DailySystemModalProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [frequency, setFrequency] = React.useState<Frequency>('daily');
  const [timeOfDay, setTimeOfDay] = React.useState<TimeOfDay | ''>('');
  const [selectedCheckpointId, setSelectedCheckpointId] = React.useState(checkpointGoalId);
  const [levelA, setLevelA] = React.useState('');
  const [levelB, setLevelB] = React.useState('');
  const [levelC, setLevelC] = React.useState('');
  
  const { checkpointGoals, loadCheckpointGoals } = usePlanning();
  const { userId } = useAuth();

  React.useEffect(() => {
    if (!userId || !checkpointGoalId) return;
    // Get the big goal ID from the checkpoint goal ID
    const loadData = async () => {
      const bigGoals = await planningService.getBigGoals();
      for (const goal of bigGoals) {
        await loadCheckpointGoals(goal.id);
      }
    };
    loadData();
  }, [loadCheckpointGoals, userId, checkpointGoalId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      checkpoint_goal_id: selectedCheckpointId,
      frequency,
      time_of_day: timeOfDay || undefined,
      active: true
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-2xl my-8">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b sticky top-0 bg-white rounded-t-xl z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Add Daily System</h2>
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
              <label className="block font-medium mb-2">Supports Checkpoint</label>
              <select
                value={selectedCheckpointId || ''}
                onChange={(e) => setSelectedCheckpointId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
              >
                <option value="">None</option>
                {Object.values(checkpointGoals)
                  .flat()
                  .map(goal => (
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
                placeholder="Name your daily system"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this system..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    Frequency
                  </div>
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as Frequency)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="daily">Daily</option>
                  <option value="weekday">Weekdays Only</option>
                  <option value="weekend">Weekends Only</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    Time of Day
                  </div>
                </label>
                <select
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="">Any Time</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Define Execution Levels</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <ABCLevelBadge level="A" size="sm" showLabel={false} />
                    <label className="font-medium">Perfect Execution</label>
                  </div>
                  <textarea
                    value={levelA}
                    onChange={(e) => setLevelA(e.target.value)}
                    placeholder="Describe what Level A execution looks like..."
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[80px] resize-none"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <ABCLevelBadge level="B" size="sm" showLabel={false} />
                    <label className="font-medium">Base Case Execution</label>
                  </div>
                  <textarea
                    value={levelB}
                    onChange={(e) => setLevelB(e.target.value)}
                    placeholder="Describe what Level B execution looks like..."
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[80px] resize-none"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <ABCLevelBadge level="C" size="sm" showLabel={false} />
                    <label className="font-medium">Minimum Viable Execution</label>
                  </div>
                  <textarea
                    value={levelC}
                    onChange={(e) => setLevelC(e.target.value)}
                    placeholder="Describe what Level C execution looks like..."
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[80px] resize-none"
                  />
                </div>
              </div>
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
                Create System
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DailySystemModal;