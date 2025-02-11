import React from 'react';
import { X, BarChart2, Battery, Clock } from 'lucide-react';
import type { ABCTracking, ABCCategory } from '../../../types/planning';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut';
import { usePlanning } from '../../../hooks/usePlanning';
import { useAuth } from '../../../hooks/useAuth';

interface ABCTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tracking: Omit<ABCTracking, 'id' | 'created_at' | 'user_id'>) => void;
  systemId?: string;
  date: string;
}

function ABCTrackingModal({ isOpen, onClose, onSubmit, systemId, date }: ABCTrackingModalProps) {
  const [category, setCategory] = React.useState<ABCCategory>('A');
  const [description, setDescription] = React.useState('');
  const [energyLevel, setEnergyLevel] = React.useState<number>(7);
  const [notes, setNotes] = React.useState('');
  const [selectedSystemId, setSelectedSystemId] = React.useState<string>(systemId || '');
  const { dailySystems, loadDailySystems } = usePlanning();
  const { userId } = useAuth();

  React.useEffect(() => {
    if (!userId) return;
    loadDailySystems();
  }, [loadDailySystems, userId]);

  React.useEffect(() => {
    setSelectedSystemId(systemId || '');
  }, [systemId]);

  // Keyboard shortcuts
  useKeyboardShortcut({
    key: 'Enter',
    metaOrCtrlKey: true,
    handler: () => {
      if (isOpen && description) handleSubmit(new Event('submit') as any);
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
      date,
      category,
      description,
      system_id: selectedSystemId || undefined,
      energy_level: energyLevel,
      notes: notes || undefined
    });
    onClose();
  };

  const getCategoryDescription = (cat: ABCCategory) => {
    switch (cat) {
      case 'A':
        return 'Most ambitious, perfect case execution';
      case 'B':
        return 'Middle ground, base case execution';
      case 'C':
        return 'Minimum viable level execution';
    }
  };

  const getCategoryExample = (cat: ABCCategory) => {
    switch (cat) {
      case 'A':
        return 'e.g., Full workout + stretching + meditation';
      case 'B':
        return 'e.g., Complete workout, basic stretching';
      case 'C':
        return 'e.g., Quick 10-minute workout';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-xl my-8">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b sticky top-0 bg-white rounded-t-xl z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Track System Progress</h2>
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
              <label className="block font-medium mb-4">How did you execute today?</label>
              <div className="grid grid-cols-1 gap-4">
                {(['A', 'B', 'C'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      category === cat
                        ? 'border-black bg-black text-white'
                        : 'hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-lg font-bold">Level {cat}</div>
                      <span className="text-sm">
                        ({getCategoryDescription(cat)})
                      </span>
                    </div>
                    <div className="text-sm opacity-75">
                      {getCategoryExample(cat)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you accomplish? Be specific about what you did..."
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[100px] resize-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Related System</label>
              <select
                value={selectedSystemId}
                onChange={(e) => setSelectedSystemId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
              >
                <option value="">None</option>
                {dailySystems.map(system => (
                  <option key={system.id} value={system.id}>
                    {system.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-gray-400" />
                  Energy Level
                </div>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low Energy</span>
                <span>{energyLevel}/10</span>
                <span>High Energy</span>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any reflections on why you chose this level? What factors influenced your execution?"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[80px] resize-none"
              />
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
                Save Entry
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ABCTrackingModal;