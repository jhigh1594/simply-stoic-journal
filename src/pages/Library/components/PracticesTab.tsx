import React from 'react';
import { ChevronDown, ChevronUp, Plus, Heart, CheckCircle } from 'lucide-react';
import type { Practice } from '../../../types/library';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { usePractices } from '../../../hooks/usePractices';
import { useAuth } from '../../../hooks/useAuth';

interface PracticesTabProps {
  searchQuery: string;
  showCommunity?: boolean;
}


function PracticesTab({ searchQuery, showCommunity }: PracticesTabProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const { practices, isLoading, error, loadPractices, completePractice } = usePractices();
  const [showAddPractice, setShowAddPractice] = React.useState(false);
  const { userId } = useAuth();

  React.useEffect(() => {
    if (!userId) return;
    loadPractices();
  }, [loadPractices, userId]);
  
  const filteredPractices = practices.filter(practice =>
    (showCommunity ? practice.is_community : !practice.is_community) &&
    practice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    practice.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {error && (
        <ErrorMessage 
          message="Failed to load practices. Please try again."
          action={{
            label: "Retry",
            onClick: loadPractices
          }}
        />
      )}

      {showCommunity && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddPractice(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Add Practice
          </button>
        </div>
      )}

      {filteredPractices.map((practice) => (
        <div key={practice.id} className="border rounded-lg">
          <button
            onClick={() => setExpandedId(expandedId === practice.id ? null : practice.id)}
            className="w-full p-6 text-left flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg">{practice.title}</h3>
              <p className="text-gray-600">{practice.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-500">
                <Heart className="h-4 w-4" />
                <span className="text-sm">{practice.likes}</span>
              </div>
              {practice.completions && (
                <div className="flex items-center gap-1 text-gray-500">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">{practice.completions.length}</span>
                </div>
              )}
              {expandedId === practice.id ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </button>
          
          {expandedId === practice.id && (
            <div className="px-6 pb-6 space-y-4 border-t pt-4">
              <div>
                <h4 className="font-medium mb-2">Instructions</h4>
                <p className="text-gray-600">{practice.instructions}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Tips</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {practice.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => completePractice(practice.id, userId)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" className="text-white" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Mark as Complete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PracticesTab;