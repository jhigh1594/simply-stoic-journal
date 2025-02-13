import React from 'react';
import { format } from 'date-fns';

function DateComponent() {
  const today = new Date();
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const currentDayIndex = today.getDay();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {format(today, 'EEEE, MMM do')}
      </h2>
      <div className="flex gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm
              ${index === currentDayIndex 
                ? 'bg-purple-100 text-purple-600 border border-purple-200' 
                : 'text-gray-400'
              }
            `}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DateComponent;