// Create a shared Editor component to reduce duplication between MorningReflection and EveningReview
import React from 'react';
import { EditorContent } from '@tiptap/react';
import { Bold, Italic, List, Quote } from 'lucide-react';
import { EditorAIPrompt } from '../EditorAIPrompt';
import { useEditor } from '../../hooks/useEditor';

interface SharedEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onContentBlur?: () => void;
  onPromptSelect?: (prompt: string) => void;
  onOpenPromptLibrary?: () => void;
  placeholder?: string;
  minHeight?: string;
}

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

export const Editor: React.FC<SharedEditorProps> = ({
  content,
  onContentChange,
  onContentBlur,
  onPromptSelect,
  onOpenPromptLibrary,
  minHeight = '200px',
}) => {
  const editor = useEditor(content, onContentChange);

  const handlePromptSelect = React.useCallback((prompt: string) => {
    if (!editor) return;
    
    editor.chain()
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
  }, [editor, onPromptSelect]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b p-2 flex gap-2">
        <EditorButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          isActive={editor?.isActive('bold')}
          icon={<Bold className="h-4 w-4" />}
          label="Toggle bold"
        />
        <EditorButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          isActive={editor?.isActive('italic')}
          icon={<Italic className="h-4 w-4" />}
          label="Toggle italic"
        />
        <EditorButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          isActive={editor?.isActive('bulletList')}
          icon={<List className="h-4 w-4" />}
          label="Toggle bullet list"
        />
        <EditorButton
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          isActive={editor?.isActive('blockquote')}
          icon={<Quote className="h-4 w-4" />}
          label="Toggle blockquote"
        />
      </div>
      <div className="p-4 relative">
        <EditorContent editor={editor} />
        <EditorAIPrompt 
          editor={editor}
          onPromptGenerated={handlePromptSelect}
          model="gemini-2.0-pro-exp-02-05"
          key="mainEditorPrompt"
        />
      </div>
    </div>
  );
};