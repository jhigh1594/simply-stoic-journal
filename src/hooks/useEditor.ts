// Consolidate editor logic into a custom hook
import { useEditor as useTiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Editor } from '@tiptap/core';

export const useEditor = (
  initialContent: string, 
  onChange?: (content: string) => void
): Editor | null => {
  return useTiptapEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px]'
      }
    }
  });
};