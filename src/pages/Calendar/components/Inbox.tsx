import React from 'react';
import { Inbox as InboxIcon, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useDraggable, useDroppable } from '@dnd-kit/core';

interface Task {
  id: string;
  title: string;
  duration?: '15' | '30' | '60';
  scheduled?: boolean;
}

interface InboxProps {
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
}

function Inbox({ tasks, onAddTask, onEditTask }: InboxProps) {
  const { setNodeRef } = useDroppable({
    id: 'inbox'
  });

  return (
    <div ref={setNodeRef} className="w-full lg:w-80 flex-shrink-0 lg:border-r border-b lg:border-b-0 pb-4 lg:pb-0">
      <div className="p-4">
        <button
          onClick={onAddTask}
          className="w-full pl-4 pr-12 py-2 border rounded-lg text-left text-gray-500 hover:border-gray-400 mb-6"
        >
          Add a task...
        </button>

        <div className="space-y-2">
          <button className="flex items-center gap-3 w-full p-2 rounded-lg bg-gray-50">
            <InboxIcon className="h-4 w-4" />
            Inbox
          </button>
          <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 text-gray-600">
            <CalendarIcon className="h-4 w-4" />
            Scheduled
          </button>
          <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 text-gray-600">
            <Clock className="h-4 w-4" />
            Today
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {tasks.filter(t => !t.scheduled).map((task) => (
            <DraggableTask
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DraggableTask({ task, onEdit }: { task: Task; onEdit: () => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 bg-white border rounded-lg cursor-move hover:border-gray-400 group"
      onClick={onEdit}
    >
      <div className="text-sm">{task.title}</div>
      {task.duration && (
        <div className="text-xs text-gray-500 mt-1">
          Duration: {task.duration} mins
        </div>
      )}
    </div>
  );
}

export default Inbox;