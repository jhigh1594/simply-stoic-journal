import React from 'react';
import { useJournal } from '../../hooks/useJournal';
import { useAuth } from '../../hooks/useAuth';
import StatsBar from './components/StatsBar';
import ContextualQuickAction from './components/ContextualQuickAction';
import LatestInsight from './components/LatestInsight';
import RecentEntries from './components/RecentEntries';
import DailyQuote from './components/DailyQuote';

function Home() {
  const { entries, loadEntries } = useJournal();
  const { userId } = useAuth();

  React.useEffect(() => {
    if (!userId) return;
    loadEntries();
  }, [loadEntries, userId]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <StatsBar />
      <ContextualQuickAction />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <LatestInsight lastEntry={entries[0]} />
          <DailyQuote />
        </div>
        <div>
          <RecentEntries entries={entries} />
        </div>
      </div>
    </div>
  );
}

export default Home;