import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  view: 'day' | '3-day' | '5-day' | 'week' | 'month';
  onViewChange: (view: 'day' | '3-day' | '5-day' | 'week' | 'month') => void;
}

const views = [
  { label: '5-day', value: '5-day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
];

function CalendarHeader({ currentDate, onPrevious, onNext, view, onViewChange }: CalendarHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onPrevious}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMM yyyy')}
        </h2>
        <button
          onClick={onNext}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-2">
        {views.map((v) => (
          <button
            key={v.value}
            onClick={() => onViewChange(v.value as any)}
            className={`px-4 py-1.5 rounded-lg text-sm ${
              view === v.value
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CalendarHeader;