import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Brain, BookOpen, ArrowRight } from 'lucide-react';
import { mentalModels } from '../../../data/mentalModels';
import { principles } from '../../../data/principles';
import { usePractices } from '../../../hooks/usePractices';
// Remove this line
// import { practices } from '../../../data/practices';
import type { Practice, MentalModel, Principle } from '../../../types/library';

type CarouselItem = {
  id: string;
  type: 'practice' | 'mental_model' | 'principle';
  title: string;
  description: string;
  details: Practice | MentalModel | Principle;
};

function PracticesCarousel() {
  // Move all hooks to the top level
  const { practices, isLoading, loadPractices } = usePractices();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    loadPractices();
  }, [loadPractices]);

  // Create memoized items after all hooks
  const carouselItems = React.useMemo(() => {
    const practiceItems = (practices || []).map(practice => ({
      id: practice.id,
      type: 'practice' as const,
      title: practice.title,
      description: practice.description,
      details: practice
    }));

    const modelItems = (mentalModels || []).map(model => ({
      id: model.id,
      type: 'mental_model' as const,
      title: model.title,
      description: model.description,
      details: model
    }));

    const principleItems = (principles || []).map(principle => ({
      id: principle.id,
      type: 'principle' as const,
      title: principle.title,
      description: principle.description,
      details: principle
    }));

    const allItems = [...practiceItems, ...modelItems, ...principleItems];
    return allItems.sort(() => Math.random() - 0.5);
  }, [practices]);

  // Handle loading state
  if (isLoading) {
    return <div className="bg-white rounded-xl border p-6">Loading...</div>;
  }

  // Only return null if there are no items after loading
  if (!carouselItems.length) {
    return null;
  }

  const currentItem = carouselItems[currentIndex];

  const renderExpandedContent = (item: CarouselItem) => {
    if (item.type === 'practice') {
      const practice = item.details as Practice;
      return (
        <div className="px-6 pb-6 space-y-4 border-t pt-4">
          <div>
            <h4 className="font-medium mb-2">Instructions</h4>
            <p className="text-gray-600">{practice.instructions}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Tips</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {practice.tips.map((tip: string, index: number) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    } else if (item.type === 'mental_model') {
      const model = item.details as MentalModel;
      return (
        <div className="px-6 pb-6 border-t pt-4">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Key Principles</h4>
              <div className="flex flex-wrap gap-2">
                {model.key_principles.map((principle, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <ArrowRight className="h-4 w-4 flex-shrink-0" />
                    {principle}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Examples</h4>
              <div className="space-y-4">
                {model.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="font-medium mb-2">{example.situation}</div>
                    <p className="text-sm text-gray-600">{example.application}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Stoic Alignment</h4>
              <p className="text-sm text-gray-600">{model.stoic_alignment}</p>
            </div>
          </div>
        </div>
      );
    } else {
      const principle = item.details as Principle;
      return (
        <div className="px-6 pb-6 border-t pt-4">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Key Points</h4>
              <div className="space-y-2">
                {principle.key_points.map((point: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <ArrowRight className="h-4 w-4 flex-shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Application</h4>
              <p className="text-sm text-gray-600">{principle.application}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Historical Context</h4>
              <p className="text-sm text-gray-600">{principle.historical_context}</p>
            </div>
          </div>
        </div>
      );
    }
  };

  if (!currentItem) return null;

  const getTypeIcon = (type: CarouselItem['type']) => {
    switch (type) {
      case 'practice':
        return <BookOpen className="h-5 w-5 text-gray-400" />;
      case 'mental_model':
        return <Brain className="h-5 w-5 text-gray-400" />;
      case 'principle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {getTypeIcon(currentItem.type)}
          <span className="text-sm font-medium capitalize">
            {currentItem.type.replace('_', ' ')}
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentIndex(i => i === 0 ? carouselItems.length - 1 : i - 1)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setCurrentIndex(i => i === carouselItems.length - 1 ? 0 : i + 1)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{currentItem.title}</h3>
            <p className="text-gray-600">{currentItem.description}</p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded-lg flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {isExpanded && renderExpandedContent(currentItem)}
      </div>
    </div>
  );
}

export default PracticesCarousel;