import React from 'react';
import { useJournal } from '../../hooks/useJournal';
import { useAuth } from '../../hooks/useAuth';
import StatsBar from './components/StatsBar';
import ContextualQuickAction from './components/ContextualQuickAction';
import LatestInsight from './components/LatestInsight';
import RecentEntries from './components/RecentEntries';
import DailyQuote from './components/DailyQuote';
import PracticesCarousel from './components/PracticesCarousel';
import DateComponent from './components/DateComponent';

function Home() {
  const { entries, loadEntries } = useJournal();
  const { userId } = useAuth();

  React.useEffect(() => {
    if (!userId) return;
    loadEntries();
  }, [loadEntries, userId]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <DateComponent />
        <StatsBar />
      </div>
      <DailyQuote />
      <ContextualQuickAction />
      <PracticesCarousel />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <LatestInsight lastEntry={entries[0]} />
        </div>
        <div>
          <RecentEntries entries={entries} />
        </div>
      </div>
    </div>
  );
}

export default Home;