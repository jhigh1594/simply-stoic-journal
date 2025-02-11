import React from 'react';
import { X, Plus } from 'lucide-react';
import type { GoalTemplate } from '../../../types/planning';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (template: Omit<GoalTemplate, 'id' | 'createdAt'>) => void;
}

function TemplateModal({ isOpen, onClose, onSubmit }: TemplateModalProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [timeframe, setTimeframe] = React.useState<GoalTemplate['timeframe']>('daily');
  const [priority, setPriority] = React.useState<GoalTemplate['priority']>('medium');
  const [subTasks, setSubTasks] = React.useState<string[]>([]);
  const [newSubTask, setNewSubTask] = React.useState('');

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
      timeframe,
      priority,
      subTasks: subTasks.map(title => ({ title, status: 'pending' }))
    });
    onClose();
  };

  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks([...subTasks, newSubTask.trim()]);
      setNewSubTask('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-xl">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Create Goal Template</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-900 mb-2">Template Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter template name"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <label className="block text-gray-900 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter template description"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-900 mb-2">Timeframe</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as GoalTemplate['timeframe'])}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-900 mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as GoalTemplate['priority'])}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-900 mb-2">Sub-tasks</label>
              <div className="space-y-2">
                {subTasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 text-sm">{task}</span>
                    <button
                      type="button"
                      onClick={() => setSubTasks(subTasks.filter((_, i) => i !== index))}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubTask}
                    onChange={(e) => setNewSubTask(e.target.value)}
                    placeholder="Add a sub-task"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubTask();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSubTask}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t flex justify-end gap-3">
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
                Create Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TemplateModal;