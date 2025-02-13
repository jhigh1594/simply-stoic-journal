// Remove unused imports and interface
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react';
import { usePriorities } from '../../../hooks/usePriorities';
import { debounce } from 'lodash';
import BigGoalCard from '../../../pages/Planning/components/BigGoalCard';
import { usePlanning } from '../../../hooks/usePlanning';
import { Bold, Italic, List, Quote } from 'lucide-react';

// Keep only the MorningReflectionProps interface
interface MorningReflectionProps {
  onOpenPromptLibrary?: () => void;
  onIntentionChange: (intention: string) => void;
  onGratitudeListChange: (list: string[]) => void;
  initialIntention?: string;
  initialGratitudeList?: string[];
  initialPriorities?: string[];
}

export const MorningReflection: React.FC<MorningReflectionProps> = ({
  onOpenPromptLibrary,
  onIntentionChange,
  onGratitudeListChange,
  initialIntention = '',
  initialGratitudeList = [],
  initialPriorities = []
}) => {
  const { bigGoals, loadBigGoals, loadCheckpointGoals } = usePlanning();
  
  // Update useEffects to properly handle goal loading
  React.useEffect(() => {
    console.log('Loading goals...');
    loadBigGoals();
  }, [loadBigGoals]);

  // Remove this duplicate destructuring
  // const { bigGoals, loadBigGoals, loadCheckpointGoals } = usePlanning();
  
  // Continue with state declarations
  const [expandedGoals, setExpandedGoals] = React.useState<string[]>([]);
  const [intention, setIntention] = React.useState(initialIntention);
  const [gratitudeList, setGratitudeList] = React.useState<string[]>(initialGratitudeList);
  const [editPriorities, setEditPriorities] = React.useState<string[]>(initialPriorities);
  const gratitudeRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const priorityRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const { setPriorityList } = usePriorities();
  const today = new Date().toISOString().split('T')[0];

  // Add editor initialization
  // Remove MenuBar component and update the editor section
  // Remove the MenuBar component and its references
  const mainEditor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px]'
      }
    }
  });

  // Add debouncedPriorityUpdate after state declarations
  const debouncedPriorityUpdate = React.useMemo(
    () => debounce((priorities: string[]) => {
      const filteredPriorities = priorities.filter(p => p.trim() !== '');
      setPriorityList(filteredPriorities, today);
    }, 500),
    [setPriorityList, today]
  );

  // Add handleKeyDown function
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: 'gratitude' | 'priority',
    index: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const list = type === 'gratitude' ? gratitudeList : editPriorities;
      const setList = type === 'gratitude' ? setGratitudeList : setEditPriorities;
      const maxItems = 3;

      if (e.shiftKey && list.length < maxItems) {
        // Add new item and focus it
        const newList = [...list.slice(0, index + 1), '', ...list.slice(index + 1)];
        setList(newList);
        if (type === 'gratitude') {
          onGratitudeListChange(newList);
        } else {
          debouncedPriorityUpdate(newList);
        }
        // Use setTimeout to ensure the new input is rendered
        setTimeout(() => {
          const refs = type === 'gratitude' ? gratitudeRefs : priorityRefs;
          refs.current[index + 1]?.focus();
        }, 0);
      } else {
        // Regular Enter - move to next field
        const refs = type === 'gratitude' ? gratitudeRefs : priorityRefs;
        const nextInput = refs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  // Add handleCheckpointUpdate function
  const handleCheckpointUpdate = async (goalId: string) => {
    await loadCheckpointGoals(goalId);
  };

  // Remove the entire MenuBar component and its definition
  
  // Add toggle handler
  const toggleGoal = (goalId: string) => {
    setExpandedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };
  
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">🎯 Review Your Goals</h2>
        <div className="space-y-4">
          {bigGoals.filter(goal => goal.status === 'in_progress').map((goal) => (
            <BigGoalCard 
              key={goal.id} 
              goal={goal} 
              onUpdate={loadBigGoals}
              isExpanded={expandedGoals.includes(goal.id)}
              onToggle={() => toggleGoal(goal.id)}
            />
          ))}
          
          {bigGoals.filter(goal => goal.status === 'in_progress').length === 0 && (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-500">No active goals found.</p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                Set Your First Goal
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Existing Today's Priorities section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Morning Reflection</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Saved Quotes
            </button>
            <button 
              onClick={onOpenPromptLibrary}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Browse Prompts
            </button>
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="border-b p-2 flex justify-between">
            <div className="flex gap-2">
              <button 
                onClick={() => mainEditor?.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-100 ${mainEditor?.isActive('bold') ? 'bg-gray-100' : ''}`}
              >
                <Bold className="h-4 w-4" />
              </button>
              <button 
                onClick={() => mainEditor?.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-100 ${mainEditor?.isActive('italic') ? 'bg-gray-100' : ''}`}
              >
                <Italic className="h-4 w-4" />
              </button>
              <button 
                onClick={() => mainEditor?.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-100 ${mainEditor?.isActive('bulletList') ? 'bg-gray-100' : ''}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button 
                onClick={() => mainEditor?.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-100 ${mainEditor?.isActive('blockquote') ? 'bg-gray-100' : ''}`}
              >
                <Quote className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <EditorContent editor={mainEditor} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Today's Intention</h2>
        <input
          type="text"
          value={intention}
          onChange={(e) => onIntentionChange(e.target.value)}
          placeholder="What is your intention for today?"
          className="w-full p-2 border rounded" // Updated padding to match gratitude inputs
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Gratitude</h2>
        <div className="space-y-4">
          {gratitudeList.length === 0 ? (
            <input
              type="text"
              placeholder="I am grateful for..."
              className="w-full p-2 border rounded"
              onFocus={() => {
                setGratitudeList(['']);
                onGratitudeListChange(['']);
              }}
              onChange={(e) => {
                setGratitudeList([e.target.value]);
                onGratitudeListChange([e.target.value]);
              }}
            />
          ) : (
            <>
              {gratitudeList.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    ref={el => gratitudeRefs.current[index] = el}
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newList = [...gratitudeList];
                      newList[index] = e.target.value;
                      setGratitudeList(newList);
                      onGratitudeListChange(newList);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, 'gratitude', index)}
                    placeholder="I am grateful for..."
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    onClick={() => {
                      const newList = gratitudeList.filter((_, i) => i !== index);
                      setGratitudeList(newList);
                      onGratitudeListChange(newList);
                    }}
                    className="flex-shrink-0 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {gratitudeList.length < 3 && (
                <button
                  onClick={() => {
                    const newList = [...gratitudeList, ''];
                    setGratitudeList(newList);
                    onGratitudeListChange(newList);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Add Gratitude Item
                </button>
              )}
            </>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Today's Priorities</h2>
        <div className="space-y-4">
          {editPriorities.length > 0 ? (
            editPriorities.map((priority: string, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  ref={el => priorityRefs.current[index] = el}
                  type="text"
                  value={priority}
                  onChange={(e) => {
                    const newPriorities = [...editPriorities];
                    newPriorities[index] = e.target.value;
                    setEditPriorities(newPriorities);
                    debouncedPriorityUpdate(newPriorities);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, 'priority', index)}
                  placeholder="Enter a priority..."
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={() => {
                    const newPriorities = editPriorities.filter((_, i) => i !== index);
                    setEditPriorities(newPriorities);
                    debouncedPriorityUpdate(newPriorities);
                  }}
                  className="flex-shrink-0 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <input
              type="text"
              placeholder="Enter a priority..."
              className="w-full p-2 border rounded"
              onFocus={() => {
                setEditPriorities(['']);
                debouncedPriorityUpdate(['']);
              }}
            />
          )}
          {editPriorities.length > 0 && editPriorities.length < 3 && (
            <button
              onClick={() => {
                const newPriorities = [...editPriorities, ''];
                setEditPriorities(newPriorities);
                debouncedPriorityUpdate(newPriorities);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              Add Priority
            </button>
          )}
        </div>
      </section>
    </div>
  );
};


// Remove local debounce implementation
export default MorningReflection