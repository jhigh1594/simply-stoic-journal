import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, Quote } from 'lucide-react'
import React, { type FC } from 'react';
import { usePriorities } from '../../../hooks/usePriorities';

interface MorningReflectionProps {
  content: string;
  onContentChange: (content: string) => void;
  onContentBlur: () => void;
  intention: string;
  onIntentionChange: (intention: string) => void;
  gratitudeList: string[];
  onGratitudeListChange: (list: string[]) => void;
  onOpenPromptLibrary: () => void;
}

const MorningReflection: FC<MorningReflectionProps> = ({
  content,
  onContentChange,
  intention,
  onIntentionChange,
  gratitudeList,
  onGratitudeListChange,
  onOpenPromptLibrary,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px]',
      },
    },
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  }, []);

  const MenuBar = () => {
    if (!editor) {
      return null;
    }

    return (
      <div className="border-b p-2 flex gap-2">
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

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Add usePriorities hook
  const { priorities: dailyPriorities, setPriorityList } = usePriorities();
  const [editPriorities, setEditPriorities] = React.useState<string[]>([]);

  // Load priorities when component mounts
  React.useEffect(() => {
    if (dailyPriorities?.priorities) {
      setEditPriorities(dailyPriorities.priorities);
    }
  }, [dailyPriorities]);

  // Handle priority updates
  const handlePrioritiesChange = async (newPriorities: string[]) => {
    setEditPriorities(newPriorities);
    const today = new Date().toISOString().split('T')[0];
    await setPriorityList(newPriorities, today);
  };

  return (
    <div className="space-y-8">
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
        <textarea
          value={intention}
          onChange={(e) => onIntentionChange(e.target.value)}
          placeholder="What is your intention for today?"
          className="w-full p-4 border rounded-lg min-h-[100px]"
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Gratitude</h2>
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
                placeholder="I am grateful for..."
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={() => {
                  const newList = gratitudeList.filter((_, i) => i !== index);
                  onGratitudeListChange(newList);
                }}
                className="text-red-500 hover:text-red-700"
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
                type="text"
                value={priority}
                onChange={(e) => {
                  const newPriorities = [...editPriorities];
                  newPriorities[index] = e.target.value;
                  handlePrioritiesChange(newPriorities);
                }}
                placeholder="Enter a priority..."
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={() => {
                  const newPriorities = editPriorities.filter((_, i) => i !== index);
                  handlePrioritiesChange(newPriorities);
                }}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          {editPriorities.length < 3 && (
            <button
              onClick={() => handlePrioritiesChange([...editPriorities, ''])}
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

export default MorningReflection