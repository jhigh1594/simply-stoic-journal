import React from 'react';
import { X, Clock } from 'lucide-react';
import type { Task } from '../../../types/calendar';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task;
}

function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
  const [title, setTitle] = React.useState(task?.title || '');
  const [description, setDescription] = React.useState(task?.description || '');
  const [duration, setDuration] = React.useState(task?.duration || '30');
  const [date, setDate] = React.useState(task?.date || '');
  const [time, setTime] = React.useState(task?.time || '');

  // Keyboard shortcuts
  useKeyboardShortcut({
    key: 'Enter',
    ctrlKey: true,
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
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: task?.id || Math.random().toString(),
      title,
      description,
      duration: duration as '15' | '30' | '60',
      date,
      time,
      scheduled: Boolean(date && time)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {task ? 'Edit Task' : 'New Task'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[100px]"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t flex justify-end gap-3">
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
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;