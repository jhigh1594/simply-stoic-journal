import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, Quote, BookmarkCheck } from 'lucide-react';
import PromptsModal from './PromptsModal';
import QuotesModal from './QuotesModal';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-100' : ''}`}
      >
        <Quote className="h-4 w-4" />
      </button>
    </div>
  );
};

interface JournalEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onContentBlur: () => void;
  type?: 'morning' | 'evening';
}

function JournalEditor({ content, onContentChange, onContentBlur, type = 'morning' }: JournalEditorProps) {
  const [isPromptsOpen, setIsPromptsOpen] = React.useState(false);
  const [isQuotesOpen, setIsQuotesOpen] = React.useState(false);
  const editorRef = React.useRef<HTMLDivElement>(null);

  const eveningTemplate = `
### 📝 Today's Actions & Character

*"First say to yourself what you would be; then do what you have to do." - Epictetus*

1. What virtues did I practice today?
    - Wisdom: (a moment of good judgment)
    - Courage: (facing something difficult)
    - Justice: (treating others fairly)
    - Temperance: (showing self-control)

2. Where did I fall short?
(Focus on what was in your control)

### 💡 Learning & Growth

*"Every day we should bring some worthy saying to our minds." - Seneca*

1. What unexpected challenge taught me something today?
2. How will I use this lesson tomorrow?

### ⚡️ Tomorrow's Preparation

*"When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly." - Marcus Aurelius*

1. What challenges might I face tomorrow?
2. How will I prepare to meet them with virtue?
`;
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: type === 'evening' && !content ? eveningTemplate : content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-4',
      },
    },
  });

  // Handle blur event for the entire editor container
  React.useEffect(() => {
    const handleBlur = (e: FocusEvent) => {
      if (
        editorRef.current && 
        !editorRef.current.contains(e.relatedTarget as Node) &&
        content.trim()
      ) {
        onContentBlur();
      }
    };

    const editorElement = editorRef.current;
    if (editorElement) {
      editorElement.addEventListener('focusout', handleBlur);
      return () => editorElement.removeEventListener('focusout', handleBlur);
    }
  }, [content, onContentBlur]);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Let's Journal</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsQuotesOpen(true)}
            className="text-sm bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 flex items-center gap-1"
          >
            <BookmarkCheck className="h-4 w-4" />
            Saved Quotes
          </button>
          <button 
            onClick={() => setIsPromptsOpen(true)}
            className="text-sm bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200"
          >
            Browse Prompts
          </button>
        </div>
      </div>
      <div className="border rounded-lg p-4" ref={editorRef}>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      // In the PromptsModal component
      <PromptsModal
        isOpen={isPromptsOpen}
        onClose={() => setIsPromptsOpen(false)}
        onSelectPrompt={(prompt) => {
          editor?.chain()
            .focus()
            .createParagraphNear()
            .insertContent(`\n\n**${prompt}**\n`)  // Add markdown bold syntax
            .run();
        }}
      />
      <QuotesModal
        isOpen={isQuotesOpen}
        onClose={() => setIsQuotesOpen(false)}
        onSelectQuote={(quote) => {
          editor?.commands.focus();
          editor?.commands.createParagraphNear();
          editor?.commands.insertContent(`> "${quote.text}" — ${quote.author}`);
        }}
      />
    </div>
  );
}

export default JournalEditor;