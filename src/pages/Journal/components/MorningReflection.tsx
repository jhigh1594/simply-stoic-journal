import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import { EditorAIPrompt } from '../../../components/EditorAIPrompt';
import { Bold, Italic, List, Quote } from 'lucide-react';
import { usePriorities } from '../../../hooks/usePriorities';
import { usePlanning } from '../../../hooks/usePlanning';
import BigGoalCard from '../../../pages/Planning/components/BigGoalCard';
import { BigGoal } from '../../../types/planning';

type MoodType = 'challenging' | 'neutral' | 'positive';

interface MorningReflectionProps {
  content: string;
  onContentChange: (content: string) => void;
  onContentBlur: () => void;
  onOpenPromptLibrary?: () => void;
  onPromptSelect?: (prompt: string) => void;
  intention: string;
  onIntentionChange: (intention: string) => void;
  gratitudeList: string[];
  onGratitudeListChange: (list: string[]) => void;
  priorities: string[];
  onPrioritiesChange: (priorities: string[]) => void;
  mood?: MoodType;
  onMoodChange?: (mood: MoodType) => void;
}

// Reusable input list component
interface InputListProps {
  items: string[];
  onChange: (items: string[]) => void;
  maxItems: number;
  placeholder: string;
}

const InputList: React.FC<InputListProps> = ({
  items,
  onChange,
  maxItems,
  placeholder
}) => {
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.shiftKey && items.length < maxItems) {
      e.preventDefault();
      const newItems = [...items, ''];
      onChange(newItems);
      setTimeout(() => {
        const inputs = document.querySelectorAll(`input[placeholder="${placeholder}"]`);
        (inputs[inputs.length - 1] as HTMLInputElement)?.focus();
      }, 0);
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const newItems = [...items];
              newItems[index] = e.target.value;
              onChange(newItems);
            }}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
          />
          <button
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            aria-label="Remove item"
          >
            ×
          </button>
        </div>
      ))}
      {items.length < maxItems && (
        <button
          onClick={() => onChange([...items, ''])}
          className="w-full p-2 border border-dashed rounded-lg text-gray-500 hover:bg-gray-50"
        >
          + Add {placeholder.toLowerCase()}
        </button>
      )}
    </div>
  );
};

// Goals section component
// Update the GoalsSectionProps interface
interface GoalsSectionProps {
  bigGoals: BigGoal[];
  expandedGoals: string[];
  onToggleGoal: (goalId: string) => void;
  onCheckpointUpdate: (goalId: string) => Promise<void>;
  onGoalsUpdate: () => Promise<void>;  // Update return type
}

const GoalsSection: React.FC<GoalsSectionProps> = ({
  bigGoals,
  expandedGoals,
  onToggleGoal,
  onCheckpointUpdate,
  onGoalsUpdate
}) => {
  const activeGoals = bigGoals.filter(goal => goal.status === 'in_progress');

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">🎯 Review Your Goals</h2>
      <div className="space-y-4">
        {activeGoals.length > 0 ? (
          activeGoals.map(goal => (
            <BigGoalCard
              key={goal.id}
              goal={goal}
              isExpanded={expandedGoals.includes(goal.id)}
              onToggle={() => onToggleGoal(goal.id)}
              onCheckpointUpdate={() => onCheckpointUpdate(goal.id)}
              onUpdate={onGoalsUpdate}
            />
          ))
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No active goals found. Visit the Planning section to set your goals.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

// Editor toolbar button component
interface EditorButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
  label: string;
}

const EditorButton: React.FC<EditorButtonProps> = ({ onClick, isActive, icon, label }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-100' : ''}`}
    aria-label={label}
  >
    {icon}
  </button>
);

export const MorningReflection: React.FC<MorningReflectionProps> = ({
  content,
  onContentChange,
  onContentBlur,
  onOpenPromptLibrary,
  onPromptSelect,
  intention,
  onIntentionChange,
  gratitudeList,
  onGratitudeListChange,
  priorities,
  onPrioritiesChange,
  mood,
  onMoodChange,
}) => {
  const { bigGoals, loadBigGoals, loadCheckpointGoals } = usePlanning();
  const [expandedGoals, setExpandedGoals] = React.useState<string[]>([]);

  const mainEditor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    onBlur: onContentBlur,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px]'
      }
    }
  });

  // Update handlePromptSelect to match EveningReview implementation
  const handlePromptSelect = React.useCallback((prompt: string) => {
    if (!mainEditor) return;
    
    mainEditor.chain()
      .focus()
      .createParagraphNear()
      .insertContent([
        {
          type: 'paragraph',
          content: [{
            type: 'text',
            marks: [{ type: 'bold' }],
            text: prompt
          }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '' }]
        }
      ])
      .run();

    onPromptSelect?.(prompt);  // This line is already correct
  }, [mainEditor, onPromptSelect]);

  const toggleGoal = React.useCallback((goalId: string) => {
    setExpandedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  }, []);

  const handleCheckpointUpdate = React.useCallback(async (goalId: string) => {
    await loadCheckpointGoals(goalId);
  }, [loadCheckpointGoals]);

  React.useEffect(() => {
    const loadGoalsData = async () => {
      try {
        await loadBigGoals();
      } catch (error) {
        console.error('Error loading big goals:', error);
      }
    };
    
    loadGoalsData();
  }, [loadBigGoals]);

  // In the MorningReflection component's return statement
  return (
    <div className="space-y-8">
      <GoalsSection
        bigGoals={bigGoals}
        expandedGoals={expandedGoals}
        onToggleGoal={toggleGoal}
        onCheckpointUpdate={handleCheckpointUpdate}
        onGoalsUpdate={loadBigGoals}  // loadBigGoals already returns a Promise
      />

      {/* Intention Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🎯 Today's Intention</h2>
        <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-6">
          "First say to yourself what you would be; then do what you have to do." - Epictetus
        </blockquote>
        <div>
          <label htmlFor="intention" className="block text-sm font-medium text-gray-700 mb-1">
            What is your intention for today?
          </label>
          <input
            type="text"
            id="intention"
            value={intention}
            onChange={(e) => onIntentionChange(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="I intend to..."
          />
        </div>
      </section>

      {/* Gratitude Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🙏 Gratitude</h2>
        <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-6">
          "Do not indulge in dreams of having what you have not..." - Marcus Aurelius
        </blockquote>
        <InputList
          items={gratitudeList}
          onChange={onGratitudeListChange}
          maxItems={3}
          placeholder="I am grateful for..."
        />
      </section>

      {/* Priorities Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">📋 Today's Priorities</h2>
        <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-6">
          "If a man knows not to which port he sails..." - Seneca
        </blockquote>
        <InputList
          items={priorities}
          onChange={onPrioritiesChange}
          maxItems={3}
          placeholder="Priority..."
        />
      </section>

      {/* Main Editor Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">✍️ Space for Your Thoughts</h2>
          <div className="flex gap-2">
            <button
              onClick={onOpenPromptLibrary}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Browse Prompts
            </button>
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="border-b p-2 flex gap-2">
            <EditorButton
              onClick={() => mainEditor?.chain().focus().toggleBold().run()}
              isActive={mainEditor?.isActive('bold')}
              icon={<Bold className="h-4 w-4" />}
              label="Toggle bold"
            />
            <EditorButton
              onClick={() => mainEditor?.chain().focus().toggleItalic().run()}
              isActive={mainEditor?.isActive('italic')}
              icon={<Italic className="h-4 w-4" />}
              label="Toggle italic"
            />
            <EditorButton
              onClick={() => mainEditor?.chain().focus().toggleBulletList().run()}
              isActive={mainEditor?.isActive('bulletList')}
              icon={<List className="h-4 w-4" />}
              label="Toggle bullet list"
            />
            <EditorButton
              onClick={() => mainEditor?.chain().focus().toggleBlockquote().run()}
              isActive={mainEditor?.isActive('blockquote')}
              icon={<Quote className="h-4 w-4" />}
              label="Toggle blockquote"
            />
          </div>
          <div className="p-4 relative">
            <EditorContent editor={mainEditor} />
            <EditorAIPrompt 
              editor={mainEditor}
              onPromptGenerated={handlePromptSelect}
              model="gemini-2.0-pro-exp-02-05"
              key="mainEditorPrompt"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MorningReflection;