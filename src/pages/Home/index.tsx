import React from 'react';
import { useJournal } from '../../hooks/useJournal';
import { useAuth } from '../../hooks/useAuth';
import { usePlanning } from '../../hooks/usePlanning';
import { usePractices } from '../../hooks/usePractices';
import StatsBar from './components/StatsBar';
import ContextualQuickAction from './components/ContextualQuickAction';
import LatestInsight from './components/LatestInsight';
import RecentEntries from './components/RecentEntries';
import DailyQuote from './components/DailyQuote';
import PracticesCarousel from './components/PracticesCarousel';
import DateComponent from './components/DateComponent';
import DailyPriorities from '../Dashboard/components/DailyPriorities';
import DailySystemCard from '../Planning/components/DailySystemCard';

function Home() {
  const { entries, loadEntries } = useJournal();
  const { userId } = useAuth();
  const { dailySystems, loadDailySystems } = usePlanning();
  const { loadPractices } = usePractices();

  React.useEffect(() => {
    if (!userId) return;
    loadEntries();
    loadDailySystems();
    loadPractices();
  }, [loadEntries, loadDailySystems, loadPractices, userId]);

  const activeSystems = dailySystems?.filter(system => system.active) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <DateComponent />
        <StatsBar />
      </div>
      <DailyQuote />
      <ContextualQuickAction />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <DailyPriorities />
        </div>
        <div className="bg-white rounded-xl border p-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">⚡️ Daily Systems</h2>
            <div className="space-y-4">
              {activeSystems.map((system) => (
                <DailySystemCard 
                  key={system.id}
                  system={system}
                  onUpdate={loadDailySystems}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

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