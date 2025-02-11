import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

const moods = [
  { icon: Smile, label: 'Positive' },
  { icon: Meh, label: 'Neutral' },
  { icon: Frown, label: 'Challenging' },
];

interface MoodSelectorProps {
  selectedMood: string | null;
  onSelectMood: (mood: string) => void;
}

function MoodSelector({ selectedMood, onSelectMood }: MoodSelectorProps) {
  return (
    <div className="mb-8">
      <div className="flex gap-4">
        {moods.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => onSelectMood(label)}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
              selectedMood === label
                ? 'border-black bg-gray-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Icon className={`h-6 w-6 ${selectedMood === label ? 'text-black' : 'text-gray-400'}`} />
            <span className={`text-sm ${selectedMood === label ? 'text-black' : 'text-gray-500'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MoodSelector;