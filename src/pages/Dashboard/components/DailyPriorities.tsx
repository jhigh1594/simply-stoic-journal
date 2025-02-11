import React from 'react';
import { Target, Plus, X } from 'lucide-react';
import { usePriorities } from '../../../hooks/usePriorities';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

function DailyPriorities() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [newPriority, setNewPriority] = React.useState('');
  const [editPriorities, setEditPriorities] = React.useState<string[]>([]);
  const { priorities, isLoading, loadPriorities, setPriorityList, togglePriority } = usePriorities();

  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    loadPriorities(today);
  }, [loadPriorities]);

  const handleStartEdit = () => {
    setEditPriorities(priorities?.priorities || []);
    setIsEditing(true);
  };

  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const today = new Date().toISOString().split('T')[0];
      await setPriorityList(editPriorities, today);
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save priorities');
    } finally {
      setIsSaving(false);
    }
  };

  // Update the save button to show loading state
  <button
    onClick={handleSave}
    disabled={isSaving}
    className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
  >
    {isSaving ? 'Saving...' : 'Save Priorities'}
  </button>

  const handleAddPriority = () => {
    if (newPriority.trim() && editPriorities.length < 3) {
      setEditPriorities([...editPriorities, newPriority.trim()]);
      setNewPriority('');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border p-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          <h2 className="font-semibold">Today's Priorities</h2>
        </div>
        {!isEditing && (
          <button
            onClick={handleStartEdit}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            {priorities?.priorities.length ? 'Edit' : 'Set Priorities'}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            {editPriorities.map((priority, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-1 text-gray-600">{priority}</span>
                <button
                  onClick={() => setEditPriorities(editPriorities.filter((_, i) => i !== index))}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {editPriorities.length < 3 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  placeholder="Add a priority..."
                  className="flex-1 px-3 py-1 border rounded-lg focus:outline-none focus:border-black"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPriority();
                    }
                  }}
                />
                <button
                  onClick={handleAddPriority}
                  className="p-1 text-gray-600 hover:text-gray-800"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Save Priorities
            </button>
          </div>
        </div>
      ) : priorities?.priorities.length ? (
        <div className="space-y-2">
          {priorities.priorities.map((priority, index) => {
            const isCompleted = priorities.completedPriorities.includes(priority);
            return (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => togglePriority(priority, !isCompleted)}
                  className="rounded border-gray-300"
                />
                <span className={`text-gray-600 ${isCompleted ? 'line-through' : ''}`}>
                  {priority}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          No priorities set for today. Click "Set Priorities" to add up to 3 priorities.
        </p>
      )}
    </div>
  );
}

export default DailyPriorities;