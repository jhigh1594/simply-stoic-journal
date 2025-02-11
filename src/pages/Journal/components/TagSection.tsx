import React from 'react';
import TagInput from '../../../components/TagInput';

const commonTags = [
  'reflection', 'gratitude', 'goals', 'challenges',
  'growth', 'relationships', 'work', 'health',
  'mindfulness', 'learning', 'productivity', 'emotions'
];

interface TagSectionProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

function TagSection({ tags, onTagsChange }: TagSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4">Tags</h2>
      <TagInput
        tags={tags}
        onChange={onTagsChange}
        suggestions={commonTags}
        maxTags={10}
      />
      <p className="text-sm text-gray-500 mt-2">
        Add up to 10 tags to help organize your entries
      </p>
    </div>
  );
}

export default TagSection;