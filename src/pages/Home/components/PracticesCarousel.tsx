import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Practice {
  type: 'practice' | 'principle' | 'mental_model';
  title: string;
  description: string;
}

const practices: Practice[] = [
  {
    type: 'practice',
    title: 'Morning Preparation',
    description: 'Begin your day by preparing for potential challenges. What obstacles might you face today?'
  },
  {
    type: 'principle',
    title: 'Dichotomy of Control',
    description: 'Focus on what you can control, accept what you cannot. How are you applying this today?'
  },
  {
    type: 'mental_model',
    title: 'Premeditatio Malorum',
    description: 'Visualize potential setbacks to prepare your mind. What could go wrong, and how will you respond?'
  }
];

const getTypeIcon = (type: Practice['type']) => {
  switch (type) {
    case 'practice':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      );
    case 'principle':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      );
    case 'mental_model':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      );
  }
};

function PracticesCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const currentPractice = practices[currentIndex];

  return (
    <div className="bg-white rounded-xl border p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {getTypeIcon(currentPractice.type)}
          <span className="text-sm font-medium capitalize">
            {currentPractice.type.replace('_', ' ')}
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentIndex(i => i === 0 ? practices.length - 1 : i - 1)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setCurrentIndex(i => i === practices.length - 1 ? 0 : i + 1)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {currentPractice.title}
        </h3>
        <p className="text-gray-600">
          {currentPractice.description}
        </p>
      </div>
    </div>
  );
}

export default PracticesCarousel;