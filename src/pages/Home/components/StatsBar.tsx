import React from 'react';
import { useJournal } from '../../../hooks/useJournal';
import { useAuth } from '../../../hooks/useAuth';

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
    const content = typeof entry.content === 'string' 
      ? entry.content 
      : Object.values(entry.content).join(' ');
    return total + content.trim().split(/\s+/).length;
  }, 0);
};

function StatsBar() {
  const { entries, loadEntries } = useJournal();
  const { userId } = useAuth();

  React.useEffect(() => {
    if (!userId) return;
    loadEntries();
  }, [loadEntries, userId]);

  const stats = React.useMemo(() => [
    { label: 'Streak', value: calculateStreak(entries), subtitle: 'days' },
    { label: 'Entries', value: entries.length, subtitle: 'total' },
    { label: 'Words', value: calculateTotalWords(entries), subtitle: 'written' }
  ], [entries]);

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          className="bg-white rounded-lg border p-4"
        >
          <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
          <div className="text-2xl font-semibold mb-1">{stat.value}</div>
          <div className="text-sm text-gray-500">{stat.subtitle}</div>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;