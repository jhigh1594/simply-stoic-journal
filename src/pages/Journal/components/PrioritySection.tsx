import React from 'react';
import { Plus } from 'lucide-react';

interface PrioritySectionProps {
  priorities: string[];
  onPrioritiesChange: (priorities: string[]) => void;
}

function PrioritySection({ priorities, onPrioritiesChange }: PrioritySectionProps) {
  const handleChange = (index: number, value: string) => {
    const newPriorities = [...priorities];
    newPriorities[index] = value;
    onPrioritiesChange(newPriorities);
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4">Set your top priorities for today (maximum 3)</h2>
      <div className="space-y-3">
        {priorities.map((priority, i) => (
          <div key={i} className="relative">
            <input
              type="text"
              value={priority}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder="Add a priority..."
              className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:border-black"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100">
              <Plus className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrioritySection;