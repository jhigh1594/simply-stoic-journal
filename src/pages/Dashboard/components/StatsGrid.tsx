import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJournal } from '../../../hooks/useJournal';
import { useAuth } from '../../../hooks/useAuth';
import type { JournalEntry, EveningReviewContent } from '../../../types/journal';

const calculateStats = (entries: JournalEntry[]) => [
  { 
    label: 'Streak', 
    value: calculateStreak(entries).toString(),
    subtitle: 'days' 
  },
  { 
    label: 'Entries', 
    value: entries.length.toString(),
    subtitle: 'total' 
  },
  { 
    label: 'Words', 
    value: calculateTotalWords(entries).toString(),
    subtitle: 'written' 
  },
];

const calculateStreak = (entries: JournalEntry[]) => {
  if (!entries.length) return 0;
  
  const today = new Date().setHours(0, 0, 0, 0);
  let streak = 0;
  let currentDate = today;
  
  while (true) {
    const hasEntry = entries.some(entry => {
      const entryDate = new Date(entry.date).setHours(0, 0, 0, 0);
      return entryDate === currentDate;
    });
    
    if (!hasEntry) break;
    
    streak++;
    currentDate = new Date(currentDate - 86400000).getTime();
  }
  
  return streak;
};

const calculateTotalWords = (entries: JournalEntry[]) => {
  return entries.reduce((total, entry) => {
    if (typeof entry.content === 'string') {
      return total + entry.content.trim().split(/\s+/).length;
    }
    
    // Handle EveningReviewContent
    const content = entry.content as EveningReviewContent;
    const sections = [
      content.virtues?.wisdom || '',
      content.virtues?.courage || '',
      content.virtues?.justice || '',
      content.virtues?.temperance || '',
      content.shortcomings || '',
      content.learning?.challenge || '',
      content.learning?.lesson || '',
      content.preparation?.challenges || '',
      content.preparation?.approach || ''
    ];
    
    return total + sections.reduce((words, section) => 
      words + (section.trim().split(/\s+/).length), 0);
  }, 0);
};

// Memoize the stats calculation
function StatsGrid() {
  const navigate = useNavigate();
  const { entries, loadEntries } = useJournal();
  const { userId } = useAuth();
  
  const stats = React.useMemo(() => calculateStats(entries), [entries]);

  React.useEffect(() => {
    if (!userId) return;
    loadEntries();
  }, [loadEntries, userId]);

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          onClick={() => navigate('/journal')}
          className="bg-white rounded-lg border p-6 cursor-pointer hover:border-gray-400 transition-colors relative group"
        >
          <div className="text-sm font-medium text-gray-600 mb-2">{stat.label}</div>
          <div className="text-3xl font-semibold mb-1">{stat.value}</div>
          <div className="text-sm text-gray-500">{stat.subtitle}</div>
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;