// Remove unused imports and interface
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react';
import { EditorAIPrompt } from '../../../components/EditorAIPrompt';
import { Bold, Italic, List, Quote } from 'lucide-react';
import { usePriorities } from '../../../hooks/usePriorities';
import { usePlanning } from '../../../hooks/usePlanning';
import BigGoalCard from '../../../pages/Planning/components/BigGoalCard';
import { CheckpointGoalCard } from '../../../pages/Planning/components/CheckpointGoalCard';
import { BigGoal, CheckpointGoal } from '../../../types/planning';

interface MorningReflectionProps {
  content: string;
  onContentChange: (content: string) => void;
  onContentBlur: () => void;
  onOpenPromptLibrary?: () => void;
  onPromptSelect?: (prompt: string) => void;  // Add this prop
  intention: string;
  onIntentionChange: (intention: string) => void;
  gratitudeList: string[];
  onGratitudeListChange: (list: string[]) => void;
  priorities: string[];
  onPrioritiesChange: (priorities: string[]) => void;
  mood?: 'challenging' | 'neutral' | 'positive';
  onMoodChange?: (mood: 'challenging' | 'neutral' | 'positive') => void;
}

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
  // Add usePlanning hook and state
  const { bigGoals, checkpointGoals, loadBigGoals, loadCheckpointGoals } = usePlanning();
  const [expandedGoals, setExpandedGoals] = React.useState<string[]>([]);

  // Add useEffects for loading goals
  React.useEffect(() => {
    loadBigGoals();
  }, [loadBigGoals]);

  React.useEffect(() => {
    if (bigGoals.length > 0) {
      const activeGoals = bigGoals.filter(goal => goal.status === 'in_progress');
      Promise.all(activeGoals.map(goal => loadCheckpointGoals(goal.id)));
    }
  }, [bigGoals, loadCheckpointGoals]);

  // Add toggle function
  const toggleGoal = (goalId: string) => {
    setExpandedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleCheckpointUpdate = async (goalId: string) => {
    await loadCheckpointGoals(goalId);
  };

  const mainEditor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px]'
      },
      handleDrop: (view, event, slice, moved) => {
        if (moved) return false;
        return true;
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData('text/plain');
        if (text) {
          view.dispatch(view.state.tr.insertText(text));
          return true;
        }
        return false;
      }
    },
    autofocus: 'end'
  });

  // Add effect to handle content updates
  React.useEffect(() => {
    if (mainEditor && content) {
      mainEditor.commands.setContent(content);
    }
  }, [mainEditor, content]);

  // Add handler for prompt selection
  // Update the handlePromptSelect function
  // Update the handlePromptSelect function to use the provided prop
  const handlePromptSelect = React.useCallback((prompt: string) => {
    if (onPromptSelect) {
      onPromptSelect(prompt);
    } else {
      mainEditor?.chain()
        .focus()
        .createParagraphNear()
        .insertContent({
          type: 'paragraph',
          content: [{
            type: 'text',
            marks: [{ type: 'bold' }],
            text: prompt
          }]
        })
        .insertContent({
          type: 'paragraph',
          content: [{ type: 'text', text: '' }]
        })
        .run();
    }
  }, [mainEditor, onPromptSelect]);

  // Update EditorAIPrompt usage
  <EditorAIPrompt 
    editor={mainEditor}
    onPromptGenerated={handlePromptSelect}
    model="gemini-2.0-pro-exp-02-05"
    key="mainEditorPrompt"
  />
  return (
    <div className="space-y-8">
      {/* Main Editor Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Morning Reflection</h2>
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
          <div className="p-4 relative">
            <EditorContent editor={mainEditor} />
            <EditorAIPrompt 
              editor={mainEditor}
              onPromptGenerated={handlePromptSelect}
            />
          </div>
        </div>
      </section>

      {/* Review Your Goals Section - Moved up */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🎯 Review Your Goals</h2>
        <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-6">
          "The soul becomes dyed with the color of its thoughts." - Marcus Aurelius
        </blockquote>
        <div className="space-y-4">
          {bigGoals
            .filter(goal => goal.status === 'in_progress')
            .map(goal => (
              <BigGoalCard
                key={goal.id}
                goal={goal}
                isExpanded={expandedGoals.includes(goal.id)}
                onToggle={() => toggleGoal(goal.id)}
                checkpoints={expandedGoals.includes(goal.id) ? checkpointGoals[goal.id] : []}
                onCheckpointUpdate={() => handleCheckpointUpdate(goal.id)}
                onUpdate={() => loadBigGoals()}
              />
            ))}
          {bigGoals.filter(goal => goal.status === 'in_progress').length === 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                No active goals found. Visit the Planning section to set your goals.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Intention Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🎯 Today's Intention</h2>
        <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-6">
          "First say to yourself what you would be; then do what you have to do." - Epictetus
        </blockquote>
        <div className="space-y-4">
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
        </div>
      </section>

      {/* Gratitude Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🙏 Gratitude</h2>
        <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-6">
          "Do not indulge in dreams of having what you have not..." - Marcus Aurelius
        </blockquote>
        <div className="space-y-4">
          {gratitudeList.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newList = [...gratitudeList];
                  newList[index] = e.target.value;
                  onGratitudeListChange(newList);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.shiftKey && gratitudeList.length < 3) {
                    e.preventDefault();
                    const newList = [...gratitudeList, ''];
                    onGratitudeListChange(newList);
                    // Focus the new input on the next render
                    setTimeout(() => {
                      const inputs = document.querySelectorAll('input[placeholder="I am grateful for..."]');
                      (inputs[inputs.length - 1] as HTMLInputElement)?.focus();
                    }, 0);
                  }
                }}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="I am grateful for..."
              />
              <button
                onClick={() => {
                  const newList = gratitudeList.filter((_, i) => i !== index);
                  onGratitudeListChange(newList);
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                ×
              </button>
            </div>
          ))}
          {gratitudeList.length < 3 && (
            <button
              onClick={() => onGratitudeListChange([...gratitudeList, ''])}
              className="w-full p-2 border border-dashed rounded-lg text-gray-500 hover:bg-gray-50"
            >
              + Add gratitude
            </button>
          )}
        </div>
      </section>

      {/* Priorities Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">📋 Today's Priorities</h2>
        <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-6">
          "If a man knows not to which port he sails..." - Seneca
        </blockquote>
        <div className="space-y-4">
          {priorities.map((priority, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={priority}
                onChange={(e) => {
                  const newPriorities = [...priorities];
                  newPriorities[index] = e.target.value;
                  onPrioritiesChange(newPriorities);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.shiftKey && priorities.length < 3) {
                    e.preventDefault();
                    const newPriorities = [...priorities, ''];
                    onPrioritiesChange(newPriorities);
                    // Focus the new input on the next render
                    setTimeout(() => {
                      const inputs = document.querySelectorAll('input[placeholder="Priority..."]');
                      (inputs[inputs.length - 1] as HTMLInputElement)?.focus();
                    }, 0);
                  }
                }}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Priority..."
              />
              <button
                onClick={() => {
                  const newPriorities = priorities.filter((_, i) => i !== index);
                  onPrioritiesChange(newPriorities);
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                ×
              </button>
            </div>
          ))}
          {priorities.length < 3 && (
            <button
              onClick={() => onPrioritiesChange([...priorities, ''])}
              className="w-full p-2 border border-dashed rounded-lg text-gray-500 hover:bg-gray-50"
            >
              + Add priority
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default MorningReflection;