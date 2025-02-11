import React from 'react';
import { Heart, ChevronDown, ChevronUp, Brain, ArrowRight } from 'lucide-react';
import type { MentalModel } from '../../../types/library';
import { mentalModels } from '../../../data/mentalModels';
import { useAuth } from '../../../hooks/useAuth';

interface MentalModelsTabProps {
  searchQuery: string;
}

function MentalModelsTab({ searchQuery }: MentalModelsTabProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const { userId } = useAuth();

  const filteredModels = React.useMemo(() => {
    return mentalModels.filter(model =>
      model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const getCategoryColor = (category: MentalModel['category']) => {
    switch (category) {
      case 'decision-making':
        return 'bg-blue-50 text-blue-700';
      case 'perspective':
        return 'bg-purple-50 text-purple-700';
      case 'behavior':
        return 'bg-green-50 text-green-700';
      case 'systems':
        return 'bg-orange-50 text-orange-700';
      case 'reasoning':
        return 'bg-red-50 text-red-700';
    }
  };

  return (
    <div className="space-y-6">
      {filteredModels.map((model) => (
        <div key={model.id} className="bg-white border rounded-lg">
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="h-5 w-5 text-gray-400" />
                  <h3 className="font-medium text-lg">{model.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-sm capitalize ${getCategoryColor(model.category)}`}>
                    {model.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{model.description}</p>
                <div className="flex flex-wrap gap-2">
                  {model.key_principles.slice(0, expandedId === model.id ? undefined : 2).map((principle, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 flex-shrink-0" />
                      {principle}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setExpandedId(expandedId === model.id ? null : model.id)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {expandedId === model.id ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {expandedId === model.id && (
            <div className="px-6 pb-6 border-t pt-6">
              <div className="space-y-6">
                {/* Examples */}
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

                {/* Stoic Alignment */}
                <div>
                  <h4 className="font-medium mb-2">Stoic Alignment</h4>
                  <p className="text-sm text-gray-600">{model.stoic_alignment}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MentalModelsTab;