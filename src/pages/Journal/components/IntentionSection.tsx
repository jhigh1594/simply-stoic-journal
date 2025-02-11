import React from 'react';

interface IntentionSectionProps {
  intention: string;
  onIntentionChange: (intention: string) => void;
}

function IntentionSection({ intention, onIntentionChange }: IntentionSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4">What is your primary intention for today?</h2>
      <textarea
        value={intention}
        onChange={(e) => onIntentionChange(e.target.value)}
        placeholder="Set your intention..."
        className="w-full p-4 border rounded-lg focus:outline-none focus:border-black min-h-[100px] resize-none"
      />
    </div>
  );
}

export default IntentionSection;