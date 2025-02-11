import React from 'react';
import { Search, Filter, Calendar, Tag, Trash2 } from 'lucide-react';
import type { JournalEntry } from '../../../types/journal';

interface JournalSearchProps {
  entries: JournalEntry[];
  onEntryClick: (entry: JournalEntry) => void;
  onDeleteEntry: (entry: JournalEntry) => void;
}

function JournalSearch({ entries, onEntryClick, onDeleteEntry }: JournalSearchProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<'all' | 'morning' | 'evening'>('all');
  const [selectedMood, setSelectedMood] = React.useState<string | 'all'>('all');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);

  // Get unique moods and tags from all entries
  const uniqueMoods = React.useMemo(() => 
    Array.from(new Set(entries.map(entry => entry.mood).filter(Boolean))),
    [entries]
  );

  const uniqueTags = React.useMemo(() => 
    Array.from(new Set(entries.flatMap(entry => entry.tags))),
    [entries]
  );

  const filteredEntries = React.useMemo(() => {
    return entries.filter(entry => {
      // Search query
      const matchesSearch = 
        searchQuery === '' ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.intention.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Type filter
      const matchesType = 
        selectedType === 'all' || 
        entry.type === selectedType;

      // Mood filter
      const matchesMood = 
        selectedMood === 'all' || 
        entry.mood === selectedMood;

      // Tags filter
      const matchesTags = 
        selectedTags.length === 0 || 
        selectedTags.every(tag => entry.tags.includes(tag));

      return matchesSearch && matchesType && matchesMood && matchesTags;
    });
  }, [entries, searchQuery, selectedType, selectedMood, selectedTags]);

  return (
    <div className="space-y-6">
      {/* Search and filter header */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journal entries..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <div className="text-sm text-gray-500">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} found
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            {/* Type filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="w-full p-2 border rounded-lg bg-white"
              >
                <option value="all">All Types</option>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
              </select>
            </div>

            {/* Mood filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white"
              >
                <option value="all">All Moods</option>
                {uniqueMoods.map((mood) => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>

            {/* Tags filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <select
                multiple
                value={selectedTags}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  setSelectedTags(values);
                }}
                className="w-full p-2 border rounded-lg bg-white"
                size={3}
              >
                {uniqueTags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onEntryClick(entry)}
            className="w-full text-left p-4 border rounded-lg hover:border-gray-400 transition-colors relative group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600 capitalize">
                  {entry.type}
                </span>
              </div>
              {entry.mood && (
                <span className="text-sm text-gray-600">{entry.mood}</span>
              )}
            </div>

            <div className="line-clamp-2 text-gray-800 mb-2">
              {entry.content}
            </div>

            {entry.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-3 w-3 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
                  onDeleteEntry(entry);
                }
              }}
              className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete entry"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </button>
        ))}

        {filteredEntries.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No entries found matching your search criteria
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalSearch;