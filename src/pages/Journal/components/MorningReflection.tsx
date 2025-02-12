// Remove unused imports and interface
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react';
import { usePriorities } from '../../../hooks/usePriorities';
import { debounce } from 'lodash';
import BigGoalCard from '../../../pages/Planning/components/BigGoalCard';
import { CheckpointGoalCard } from '../../../pages/Planning/components/CheckpointGoalCard';
import { usePlanning } from '../../../hooks/usePlanning';
// Add type imports at the top
import { BigGoal, CheckpointGoal } from '../../../types/planning';

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
  const { bigGoals, checkpointGoals, loadBigGoals, loadCheckpointGoals } = usePlanning();
  
  // Update useEffects to properly handle goal loading
  React.useEffect(() => {
    console.log('Loading goals...');
    loadBigGoals();
  }, [loadBigGoals]);

  React.useEffect(() => {
    if (bigGoals.length > 0) {
      const activeGoals = bigGoals.filter(goal => goal.status === 'in_progress');
      Promise.all(activeGoals.map(goal => loadCheckpointGoals(goal.id)));
    }
  }, [bigGoals, loadCheckpointGoals]);

  // Update state declarations with proper types
  const [expandedGoals, setExpandedGoals] = React.useState<string[]>([]);
  const [intention, setIntention] = React.useState(initialIntention);
  const [gratitudeList, setGratitudeList] = React.useState<string[]>(initialGratitudeList);
  const [editPriorities, setEditPriorities] = React.useState<string[]>(initialPriorities);
  const gratitudeRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const priorityRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const { setPriorityList } = usePriorities();
  const today = new Date().toISOString().split('T')[0];

  // Add editor initialization
  const editor = useEditor({
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
      const refs = type === 'gratitude' ? gratitudeRefs : priorityRefs;
      const nextInput = refs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Add handleCheckpointUpdate function
  const handleCheckpointUpdate = async (goalId: string) => {
    await loadCheckpointGoals(goalId);
  };

  // Add MenuBar component
  // Update MenuBar with better styling
  const MenuBar = () => (
    <div className="border-b p-2 flex gap-2 items-center">
      <button 
        onClick={() => editor?.chain().focus().toggleBold().run()}
        className={`p-2 rounded-md hover:bg-gray-100 ${editor?.isActive('bold') ? 'bg-gray-100' : ''}`}
        title="Bold"
      >
        <span className="font-bold text-sm">B</span>
      </button>
      <button 
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md hover:bg-gray-100 ${editor?.isActive('italic') ? 'bg-gray-100' : ''}`}
        title="Italic"
      >
        <span className="italic text-sm">I</span>
      </button>
      <button 
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-md hover:bg-gray-100 ${editor?.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}`}
        title="Heading"
      >
        <span className="font-semibold text-sm">H2</span>
      </button>
      <div className="w-px h-4 bg-gray-200 mx-1"></div>
      <button 
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-md hover:bg-gray-100 ${editor?.isActive('bulletList') ? 'bg-gray-100' : ''}`}
        title="Bullet List"
      >
        <span className="text-sm">•</span>
      </button>
      <button 
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-md hover:bg-gray-100 ${editor?.isActive('orderedList') ? 'bg-gray-100' : ''}`}
        title="Numbered List"
      >
        <span className="text-sm">1.</span>
      </button>
      <button 
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-md hover:bg-gray-100 ${editor?.isActive('blockquote') ? 'bg-gray-100' : ''}`}
        title="Quote"
      >
        <span className="text-sm">"</span>
      </button>
    </div>
  );

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
            <div key={goal.id} className="space-y-2">
              <BigGoalCard 
                key={goal.id} 
                goal={goal} 
                onUpdate={loadBigGoals}
                isExpanded={expandedGoals.includes(goal.id)}
                onToggle={() => toggleGoal(goal.id)}
              />
              {expandedGoals.includes(goal.id) && checkpointGoals[goal.id]?.length > 0 && (
                <div className="ml-8">
                  {checkpointGoals[goal.id].map((checkpoint: CheckpointGoal) => (
                    <CheckpointGoalCard
                      key={checkpoint.id}
                      goal={checkpoint}
                      onUpdate={() => handleCheckpointUpdate(checkpoint.big_goal_id)}
                    />
                  ))}
                </div>
              )}
            </div>
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
          <MenuBar />
          <EditorContent editor={editor} className="p-4" />
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
          {gratitudeList.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                ref={el => gratitudeRefs.current[index] = el}
                type="text"
                value={item}
                onChange={(e) => {
                  const newList = [...gratitudeList];
                  newList[index] = e.target.value;
                  onGratitudeListChange(newList);
                }}
                onKeyDown={(e) => handleKeyDown(e, 'gratitude', index)}
                placeholder="I am grateful for..."
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={() => {
                  const newList = gratitudeList.filter((_, i) => i !== index);
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
              onClick={() => onGratitudeListChange([...gratitudeList, ''])}
              className="text-blue-500 hover:text-blue-700"
            >
              Add Gratitude Item
            </button>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Today's Priorities</h2>
        <div className="space-y-4">
          {editPriorities.map((priority: string, index: number) => (
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
                  setEditPriorities(newPriorities); // Update local state first
                  debouncedPriorityUpdate(newPriorities); // Then trigger debounced update
                }}
                className="flex-shrink-0 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          {editPriorities.length < 3 && (
            <button
              onClick={() => {
                const newPriorities = [...editPriorities, ''];
                setEditPriorities(newPriorities); // Update local state first
                debouncedPriorityUpdate(newPriorities); // Then trigger debounced update
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