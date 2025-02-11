import React from 'react';
import { X, ChevronRight } from 'lucide-react';

interface PromptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

const prompts = {
  Morning: [
    "What virtues do I want to embody today?",
    "What potential challenges might I face today, and how can I prepare for them?",
    "What would make today a good day?",
  ],
  Evening: [
    "What went well today? What didn't?",
    "Did I act according to my principles today?",
    "What could I have done better?",
  ],
  Virtue: [
    "How can I practice wisdom today?",
    "In what ways can I show courage?",
    "How can I be more just in my actions?",
  ],
  Adversity: [
    "What obstacles am I currently facing?",
    "How can I reframe my challenges as opportunities?",
    "What is within my control in this situation?",
  ],
  Gratitude: [
    "What advantages have I been given in life?",
    "Who has helped me become who I am?",
    "What simple pleasures am I grateful for?",
  ],
};

function PromptsModal({ isOpen, onClose, onSelectPrompt }: PromptsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-xl max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Select a Prompt</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          <input
            type="text"
            placeholder="Search prompts..."
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:border-black"
          />
          
          <div className="space-y-4">
            {Object.entries(prompts).map(([category, categoryPrompts]) => (
              <div key={category}>
                <h3 className="font-medium mb-2">{category}</h3>
                <div className="space-y-1">
                  {categoryPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onSelectPrompt(prompt);
                        onClose();
                      }}
                      className="flex items-center justify-between w-full p-2 text-left rounded-lg hover:bg-gray-50 group"
                    >
                      <span className="text-sm text-gray-600">{prompt}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromptsModal;