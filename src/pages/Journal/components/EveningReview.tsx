import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { motion } from 'framer-motion'
import { Bold, Italic, List, Quote } from 'lucide-react'
import type { EveningReviewContent } from '../../../types/journal'

interface EveningReviewProps {
  onContentChange?: (content: EveningReviewContent) => void;
  initialContent?: EveningReviewContent;
  onOpenPromptLibrary?: () => void;
  onPromptSelect?: (prompt: string) => void;  // Add this prop
}

function EveningReview({ onContentChange, initialContent, onOpenPromptLibrary, onPromptSelect }: EveningReviewProps) {
  const updateContent = () => {
    if (!onContentChange) return;
    
    onContentChange({
      mainContent: mainEditor?.getText() || '',
      virtues: {
        wisdom: wisdomEditor?.getText() || '',
        courage: courageEditor?.getText() || '',
        justice: justiceEditor?.getText() || '',
        temperance: temperanceEditor?.getText() || ''
      },
      shortcomings: shortcomingsEditor?.getText() || '',
      learning: {
        challenge: learningChallengeEditor?.getText() || '',
        lesson: learningLessonEditor?.getText() || ''
      },
      preparation: {
        challenges: preparationChallengesEditor?.getText() || '',
        approach: preparationApproachEditor?.getText() || ''
      }
    });
  };

  // Editor declarations
  const wisdomEditor = useEditor({
    extensions: [StarterKit],
    content: initialContent?.virtues.wisdom || '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[100px] focus:outline-none p-4 border rounded-lg'
      }
    },
    onUpdate: updateContent
  })

  const courageEditor = useEditor({
    extensions: [StarterKit],
    content: initialContent?.virtues.courage || '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[100px] focus:outline-none p-4 border rounded-lg'
      }
    },
    onUpdate: updateContent
  })

  const justiceEditor = useEditor({
    extensions: [StarterKit],
    content: initialContent?.virtues.justice || '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[100px] focus:outline-none p-4 border rounded-lg'
      }
    },
    onUpdate: updateContent
  })

  const temperanceEditor = useEditor({
    extensions: [StarterKit],
    content: initialContent?.virtues.temperance || '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[100px] focus:outline-none p-4 border rounded-lg'
      }
    },
    onUpdate: updateContent
  })

  const shortcomingsEditor = useEditor({
    extensions: [StarterKit],
    content: initialContent?.shortcomings || '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[100px] focus:outline-none p-4 border rounded-lg'
      }
    },
    onUpdate: updateContent
  })

  const learningChallengeEditor = useEditor({
    extensions: [StarterKit],
    content: initialContent?.learning.challenge || '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[100px] focus:outline-none p-4 border rounded-lg'
      }
    },
    onUpdate: updateContent
  })

  const learningLessonEditor = useEditor({
    extensions: [StarterKit],
    content: initialContent?.learning.lesson || '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[100px] focus:outline-none p-4 border rounded-lg'
      }
    },
    onUpdate: updateContent
  })

  const preparationChallengesEditor = useEditor({
    extensions: [StarterKit],
    content: initialContent?.preparation.challenges || '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[100px] focus:outline-none p-4 border rounded-lg'
      }
    },
    onUpdate: updateContent
  })

  const preparationApproachEditor = useEditor({
    extensions: [StarterKit],
    content: initialContent?.preparation.approach || '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[100px] focus:outline-none p-4 border rounded-lg'
      }
    },
    onUpdate: updateContent
  })

  // Add a new editor for the main content
  // Update the mainEditor configuration
  // Update the mainEditor configuration to use onPromptSelect
  const mainEditor = useEditor({
    extensions: [StarterKit],
    content: initialContent?.mainContent || '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px]'
      }
    },
    onUpdate: () => {
      if (onContentChange) {
        onContentChange({
          mainContent: mainEditor?.getText() || '',
          virtues: {
            wisdom: wisdomEditor?.getText() || '',
            courage: courageEditor?.getText() || '',
            justice: justiceEditor?.getText() || '',
            temperance: temperanceEditor?.getText() || ''
          },
          shortcomings: shortcomingsEditor?.getText() || '',
          learning: {
            challenge: learningChallengeEditor?.getText() || '',
            lesson: learningLessonEditor?.getText() || ''
          },
          preparation: {
            challenges: preparationChallengesEditor?.getText() || '',
            approach: preparationApproachEditor?.getText() || ''
          }
        });
      }
    }
  });

  // Add effect to handle prompt updates
  React.useEffect(() => {
    if (mainEditor && initialContent?.mainContent) {
      mainEditor.commands.setContent(initialContent.mainContent);
    }
  }, [mainEditor, initialContent?.mainContent]);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <section>
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
                className={`p-2 rounded hover:bg-gray-100 ${mainEditor?.isActive('blockquote') ? 'bg-gray-200' : ''}`}
              >
                <Quote className="h-4 w-4" />
              </button>
            </div>
            <button 
              onClick={onOpenPromptLibrary}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Browse Prompts
            </button>
          </div>
          <div className="p-4">
            <EditorContent 
              editor={mainEditor} 
              className="prose max-w-none focus:outline-none min-h-[200px]"
            />
          </div>
        </div>
      </section>

      {/* Rest of the sections remain unchanged */}
      {/* Today's Actions & Character */}
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
    </motion.div>
  );
}

export default EveningReview
