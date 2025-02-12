import React from 'react';
import { X, Target, Scale } from 'lucide-react';
import type { BigGoal, GoalCategory, ControlAnalysis, VirtueAlignment } from '../../../types/planning';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut';
import { enhanceGoalDescription } from '../../../lib/gemini';
import { useAuth } from '../../../hooks/useAuth';

interface BigGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: Omit<BigGoal, 'id' | 'created_at' | 'updated_at'>) => void;
}

function BigGoalModal({ isOpen, onClose, onSubmit }: BigGoalModalProps) {
  const { userId } = useAuth();
  
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<GoalCategory>('professional');
  const [targetDate, setTargetDate] = React.useState('');
  const [showStoicAnalysis, setShowStoicAnalysis] = React.useState(false);
  
  // Add enhancement state
  const [isEnhancing, setIsEnhancing] = React.useState(false);
  const [enhancedDescription, setEnhancedDescription] = React.useState<string | null>(null);

  // Add enhance handler
  const handleEnhance = async () => {
    if (!description) return;
    
    try {
      setIsEnhancing(true);
      const enhanced = await enhanceGoalDescription(description);
      setEnhancedDescription(enhanced);
    } catch (error) {
      console.error('Failed to enhance description:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Stoic Analysis state
  const [controlAnalysis, setControlAnalysis] = React.useState<ControlAnalysis>({
    within_control: [],
    partial_control: [],
    outside_control: [],
    reflections: ''
  });
  
  const [virtueAlignment, setVirtueAlignment] = React.useState<VirtueAlignment>({
    wisdom: 0,
    justice: 0,
    courage: 0,
    temperance: 0,
    notes: ''
  });
  
  const [obstacles, setObstacles] = React.useState<string[]>(['']);
  const [strategies, setStrategies] = React.useState<string[]>(['']);

  // Keyboard shortcuts
  useKeyboardShortcut({
    key: 'Enter',
    metaOrCtrlKey: true,
    handler: () => {
      if (isOpen && title) handleSubmit(new Event('submit') as any);
    }
  });

  useKeyboardShortcut({
    key: 'Escape',
    handler: () => {
      if (isOpen) onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      category,
      target_date: targetDate || undefined,
      status: 'in_progress',
      user_id: userId!,
      stoic_analysis: {
        control: showStoicAnalysis ? controlAnalysis : undefined,
        virtues: showStoicAnalysis ? virtueAlignment : undefined,
        obstacles: showStoicAnalysis ? obstacles.filter(Boolean) : undefined,
        strategies: showStoicAnalysis ? strategies.filter(Boolean) : undefined
      }
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Add Big Goal</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your goal"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Description</label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your goal in detail..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[100px] resize-none"
                />
                {description && !isEnhancing && !enhancedDescription && (
                  <button
                    type="button"
                    onClick={handleEnhance}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    title="Enhance Goal Description"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                    </svg>
                  </button>
                )}
                {isEnhancing && (
                  <div className="absolute top-2 right-2 p-1.5">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                  </div>
                )}
                {enhancedDescription && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-gray-600 mb-3">Enhanced Description:</p>
                    <p className="text-sm mb-3">{enhancedDescription}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDescription(enhancedDescription);
                          setEnhancedDescription(null);
                        }}
                        className="text-sm px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => setEnhancedDescription(null)}
                        className="text-sm px-3 py-1 text-gray-600 hover:text-gray-800"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GoalCategory)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="professional">Professional</option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowStoicAnalysis(!showStoicAnalysis)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <Scale className="h-4 w-4" />
                {showStoicAnalysis ? 'Hide' : 'Show'} Stoic Analysis
              </button>
            </div>

            {showStoicAnalysis && (
              <div className="space-y-6 border-t pt-6">
                <div>
                  <h3 className="font-medium mb-4">Dichotomy of Control</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Within Your Control
                      </label>
                      <textarea
                        value={controlAnalysis.within_control.join('\n')}
                        onChange={(e) => setControlAnalysis({
                          ...controlAnalysis,
                          within_control: e.target.value.split('\n').filter(Boolean)
                        })}
                        placeholder="One item per line..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[80px] resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Partial Control
                      </label>
                      <textarea
                        value={controlAnalysis.partial_control.join('\n')}
                        onChange={(e) => setControlAnalysis({
                          ...controlAnalysis,
                          partial_control: e.target.value.split('\n').filter(Boolean)
                        })}
                        placeholder="One item per line..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[80px] resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Outside Your Control
                      </label>
                      <textarea
                        value={controlAnalysis.outside_control.join('\n')}
                        onChange={(e) => setControlAnalysis({
                          ...controlAnalysis,
                          outside_control: e.target.value.split('\n').filter(Boolean)
                        })}
                        placeholder="One item per line..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[80px] resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Reflections
                      </label>
                      <textarea
                        value={controlAnalysis.reflections}
                        onChange={(e) => setControlAnalysis({
                          ...controlAnalysis,
                          reflections: e.target.value
                        })}
                        placeholder="What insights can you draw from this analysis?"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[80px] resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Virtue Alignment</h3>
                  <div className="space-y-4">
                    {Object.entries(virtueAlignment).map(([virtue, value]) => (
                      virtue !== 'notes' && (
                        <div key={virtue}>
                          <label className="block text-sm text-gray-600 mb-2 capitalize">
                            {virtue}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={value}
                            onChange={(e) => setVirtueAlignment({
                              ...virtueAlignment,
                              [virtue]: parseInt(e.target.value)
                            })}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Low</span>
                            <span>{value}/10</span>
                            <span>High</span>
                          </div>
                        </div>
                      )
                    ))}
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Notes on Virtue Alignment
                      </label>
                      <textarea
                        value={virtueAlignment.notes}
                        onChange={(e) => setVirtueAlignment({
                          ...virtueAlignment,
                          notes: e.target.value
                        })}
                        placeholder="Reflect on how this goal aligns with Stoic virtues..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[80px] resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Obstacles & Strategies</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Potential Obstacles
                      </label>
                      <textarea
                        value={obstacles.join('\n')}
                        onChange={(e) => setObstacles(e.target.value.split('\n'))}
                        placeholder="One obstacle per line..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[80px] resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Mitigation Strategies
                      </label>
                      <textarea
                        value={strategies.join('\n')}
                        onChange={(e) => setStrategies(e.target.value.split('\n'))}
                        placeholder="One strategy per line..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black min-h-[80px] resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BigGoalModal;