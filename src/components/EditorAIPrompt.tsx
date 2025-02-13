import React from 'react';
import { Editor } from '@tiptap/react';
import { generateReflectionPrompt } from '../lib/gemini';
import { Sparkles } from 'lucide-react';

interface EditorAIPromptProps {
  editor: Editor | null;
  onPromptGenerated?: (prompt: string) => void;
}

export const EditorAIPrompt: React.FC<EditorAIPromptProps> = ({ editor, onPromptGenerated }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGeneratePrompt = async () => {
    if (isGenerating || !editor) return;
    
    try {
      setIsGenerating(true);
      setError(null);
      
      const content = editor.getText();
      if (!content.trim()) {
        throw new Error('Please write something first before generating a prompt');
      }

      const prompt = await generateReflectionPrompt(content);
      
      if (!prompt) {
        throw new Error('Failed to generate prompt. Please try again.');
      }

      // Only call the callback, let the parent handle the insertion
      if (onPromptGenerated) {
        onPromptGenerated(prompt);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate prompt');
      console.error('Prompt generation error:', err);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 1000);
    }
  };

  return (
    <div className="absolute bottom-4 right-4">
      {error && (
        <div className="absolute bottom-full right-0 mb-2 p-2 text-sm text-red-600 bg-white border border-red-200 rounded-lg shadow-sm whitespace-nowrap">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={handleGeneratePrompt}
        disabled={isGenerating}
        title="Generate Reflection Prompt"
        className={`p-2 rounded-full ${
          isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
        }`}
      >
        {isGenerating ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};