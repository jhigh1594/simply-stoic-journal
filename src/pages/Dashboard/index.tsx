import React from 'react';
import QuoteCard from './components/QuoteCard';
import StatsGrid from './components/StatsGrid';
import JournalSections from './components/JournalSections';
import GoalsSections from './components/GoalsSections';
import DailyPriorities from './components/DailyPriorities';

function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <StatsGrid />
      <QuoteCard />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <JournalSections />
        </div>
        <div>
          <DailyPriorities />
        </div>
      </div>
      <GoalsSections />
    </div>
  );
}

export default Dashboard;