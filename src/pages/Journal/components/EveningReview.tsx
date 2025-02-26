import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { motion } from 'framer-motion';
import { Bold, Italic, List, Quote } from 'lucide-react';
import type { EveningReviewContent } from '../../../types/journal';
import { EditorAIPrompt } from '../../../components/EditorAIPrompt';
import { usePriorities } from '../../../hooks/usePriorities';
import { Editor } from '../../../components/Editor';

interface EveningReviewProps {
  onContentChange?: (content: EveningReviewContent) => void;
  initialContent?: EveningReviewContent;
  onOpenPromptLibrary?: () => void;
  onPromptSelect?: (prompt: string) => void;
}

// Custom hook for managing TipTap editors
const useCustomEditor = (initialContent: string, onUpdate?: () => void) => {
  return useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[100px] focus:outline-none p-4 border rounded-lg'
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
    onUpdate
  });
};

// Separate Priority Review component for better organization
const PriorityReview: React.FC<{
  priorities: string[];
  completedPriorities: string[];
  isLoading: boolean;
  onTogglePriority: (priority: string, completed: boolean) => void;
  reflectionEditor: ReturnType<typeof useEditor>;
}> = ({ priorities, completedPriorities, isLoading, onTogglePriority, reflectionEditor }) => (
  <section className="space-y-6">
    <h2 className="text-xl font-semibold mb-4">🎯 Today's Priorities Review</h2>
    {isLoading ? (
      <p className="text-gray-500">Loading priorities...</p>
    ) : priorities.length ? (
      <div className="space-y-4">
        {priorities.map((priority, index) => {
          const isCompleted = completedPriorities.includes(priority);
          return (
            <div key={index} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => onTogglePriority(priority, !isCompleted)}
                className="h-5 w-5 rounded border-gray-300"
              />
              <span className={`text-gray-700 ${isCompleted ? 'line-through' : ''}`}>
                {priority}
              </span>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-gray-500">No priorities were set for today.</p>
    )}

    <div>
      <h3 className="text-lg font-medium mb-2">Reflection on Priorities</h3>
      <p className="text-gray-600 text-sm mb-2">
        What helped or hindered achieving today's priorities?
      </p>
      <EditorContent editor={reflectionEditor} />
    </div>
  </section>
);

// Main component with improved organization
const EveningReview: React.FC<EveningReviewProps> = ({
  onContentChange,
  initialContent = {
    mainContent: '',
    virtues: { wisdom: '', courage: '', justice: '', temperance: '' },
    shortcomings: '',
    learning: { challenge: '', lesson: '' },
    preparation: { challenges: '', approach: '' },
    priorityReview: { completedPriorities: [], reflection: '' }
  },
  onOpenPromptLibrary,
  onPromptSelect
}) => {
  const { priorities, isLoading, togglePriority } = usePriorities();
  const [completedPriorities, setCompletedPriorities] = React.useState<string[]>(
    initialContent.priorityReview.completedPriorities
  );

  // Editor update callback
  const handleContentUpdate = React.useCallback(() => {
    if (!onContentChange) return;
    
    const content: EveningReviewContent = {
      mainContent: mainEditor?.getHTML() || '',
      virtues: {
        wisdom: wisdomEditor?.getHTML() || '',
        courage: courageEditor?.getHTML() || '',
        justice: justiceEditor?.getHTML() || '',
        temperance: temperanceEditor?.getHTML() || ''
      },
      shortcomings: shortcomingsEditor?.getHTML() || '',
      learning: {
        challenge: learningChallengeEditor?.getHTML() || '',
        lesson: learningLessonEditor?.getHTML() || ''
      },
      preparation: {
        challenges: preparationChallengesEditor?.getHTML() || '',
        approach: preparationApproachEditor?.getHTML() || ''
      },
      priorityReview: {
        completedPriorities,
        reflection: priorityReflectionEditor?.getHTML() || ''
      }
    };
    
    onContentChange(content);
  }, [completedPriorities, onContentChange]);

  // Initialize editors with custom hook
  const mainEditor = useCustomEditor(initialContent.mainContent, handleContentUpdate);
  const wisdomEditor = useCustomEditor(initialContent.virtues.wisdom, handleContentUpdate);
  const courageEditor = useCustomEditor(initialContent.virtues.courage, handleContentUpdate);
  const justiceEditor = useCustomEditor(initialContent.virtues.justice, handleContentUpdate);
  const temperanceEditor = useCustomEditor(initialContent.virtues.temperance, handleContentUpdate);
  const shortcomingsEditor = useCustomEditor(initialContent.shortcomings, handleContentUpdate);
  const learningChallengeEditor = useCustomEditor(initialContent.learning.challenge, handleContentUpdate);
  const learningLessonEditor = useCustomEditor(initialContent.learning.lesson, handleContentUpdate);
  const preparationChallengesEditor = useCustomEditor(initialContent.preparation.challenges, handleContentUpdate);
  const preparationApproachEditor = useCustomEditor(initialContent.preparation.approach, handleContentUpdate);
  const priorityReflectionEditor = useCustomEditor(initialContent.priorityReview.reflection, handleContentUpdate);

  // Handle priority toggle
  const handlePriorityToggle = React.useCallback((priority: string, completed: boolean) => {
    togglePriority(priority, completed);
    setCompletedPriorities(prev => 
      completed ? [...prev, priority] : prev.filter(p => p !== priority)
    );
    handleContentUpdate();
  }, [togglePriority, handleContentUpdate]);

  // Handle prompt selection
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

    onPromptSelect?.(prompt);
  }, [mainEditor, onPromptSelect]);

  return (
    <motion.div className="space-y-8">
      {/* Priority Review section */}
      <section>
        <PriorityReview
          priorities={priorities?.priorities || []}
          completedPriorities={completedPriorities}
          isLoading={isLoading}
          onTogglePriority={handlePriorityToggle}
          reflectionEditor={priorityReflectionEditor}
        />
      </section>
    
      {/* Today's Actions & Character section */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">📝 Today's Actions & Character</h2>
        <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-6">
          "First say to yourself what you would be; then do what you have to do." - Epictetus
        </blockquote>
        
        <h3 className="text-lg font-medium mb-4">What virtues did I practice today?</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium mb-2">Wisdom</h4>
            <p className="text-gray-600 text-sm mb-2">(a moment of good judgment)</p>
            <EditorContent editor={wisdomEditor} />
          </div>
      
          <div>
            <h3 className="text-lg font-medium mb-2">Courage</h3>
            <p className="text-gray-600 text-sm mb-2">(facing something difficult)</p>
            <EditorContent editor={courageEditor} />
          </div>
      
          <div>
            <h3 className="text-lg font-medium mb-2">Justice</h3>
            <p className="text-gray-600 text-sm mb-2">(treating others fairly)</p>
            <EditorContent editor={justiceEditor} />
          </div>
      
          <div>
            <h3 className="text-lg font-medium mb-2">Temperance</h3>
            <p className="text-gray-600 text-sm mb-2">(showing self-control)</p>
            <EditorContent editor={temperanceEditor} />
          </div>
      
          <div>
            <h3 className="text-lg font-medium mb-2">Shortcomings</h3>
            <EditorContent editor={shortcomingsEditor} />
          </div>
        </div>
      </section>
    
      {/* Learning & Growth */}
      <section>
        <h2 className="text-xl font-semibold mb-4">💡 Learning & Growth</h2>
        <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-6">
          "Every day we should bring some worthy saying to our minds." - Seneca
        </blockquote>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">1. What unexpected challenge taught me something today?</h3>
            <EditorContent editor={learningChallengeEditor} />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">2. How will I use this lesson tomorrow?</h3>
            <EditorContent editor={learningLessonEditor} />
          </div>
        </div>
      </section>
    
      {/* Tomorrow's Preparation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">⚡️ Tomorrow's Preparation</h2>
        <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-6">
          "When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly." - Marcus Aurelius
        </blockquote>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">1. What challenges might I face tomorrow?</h3>
            <EditorContent editor={preparationChallengesEditor} />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">2. How will I prepare to meet them with virtue?</h3>
            <EditorContent editor={preparationApproachEditor} />
          </div>
        </div>
      </section>
    
      {/* Space for Your Thoughts */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">✍️ Space for Your Thoughts</h2>
          <button
            onClick={onOpenPromptLibrary}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Browse Prompts
          </button>
        </div>
        <Editor
          content={initialContent.mainContent}
          onContentChange={(content) => handleContentUpdate()}
          onPromptSelect={onPromptSelect}
          onOpenPromptLibrary={onOpenPromptLibrary}
        />
      </section>
    </motion.div>
  );
};

// Reusable editor button component
interface EditorButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
}

const EditorButton: React.FC<EditorButtonProps> = ({ onClick, isActive, icon }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-100' : ''}`}
  >
    {icon}
  </button>
);

export default EveningReview;