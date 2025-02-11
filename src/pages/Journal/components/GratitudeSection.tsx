import React from 'react';
import { Plus } from 'lucide-react';

interface GratitudeSectionProps {
  gratitudeList: string[];
  onGratitudeChange: (list: string[]) => void;
}

function GratitudeSection({ gratitudeList, onGratitudeChange }: GratitudeSectionProps) {
  const handleChange = (index: number, value: string) => {
    const newList = [...gratitudeList];
    newList[index] = value;
    onGratitudeChange(newList);
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4">Name three things you are grateful for this morning</h2>
      <div className="space-y-3">
        {gratitudeList.map((item, i) => (
          <div key={i} className="relative">
            <input
              type="text"
              value={item}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder="I am grateful for..."
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

export default GratitudeSection;