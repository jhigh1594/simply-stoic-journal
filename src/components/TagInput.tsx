import React from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  maxTags?: number;
}

function TagInput({ tags, onChange, suggestions = [], maxTags = 10 }: TagInputProps) {
  const [input, setInput] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      if (tags.length < maxTags && !tags.includes(input.toLowerCase())) {
        onChange([...tags, input.toLowerCase()]);
        setInput('');
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const filteredSuggestions = suggestions.filter(
    suggestion => 
      !tags.includes(suggestion.toLowerCase()) &&
      suggestion.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[42px]">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm"
          >
            {tag}
            <button
              onClick={() => onChange(tags.filter((_, i) => i !== index))}
              className="p-0.5 hover:bg-gray-200 rounded-full"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <div className="relative flex-1 min-w-[120px]">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={tags.length < maxTags ? "Add tags..." : "Max tags reached"}
            className="w-full py-1 bg-transparent focus:outline-none"
            disabled={tags.length >= maxTags}
          />
          {showSuggestions && input && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onChange([...tags, suggestion.toLowerCase()]);
                    setInput('');
                    inputRef.current?.focus();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                >
                  <Plus className="h-3 w-3" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TagInput;