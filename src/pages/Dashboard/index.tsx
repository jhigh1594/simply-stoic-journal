import React from 'react';
import QuoteCard from './components/QuoteCard';
import StatsGrid from './components/StatsGrid';
import JournalSections from '../Journal/components/JournalSections';
import GoalsSections from './components/GoalsSections';
import DailyPriorities from './components/DailyPriorities';

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <QuoteCard />
      <StatsGrid />

      <div className="mb-8">
        <JournalSections />
      </div>

      {/* Daily Priorities and Goals in a stack */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg border p-6">
          <DailyPriorities />
        </div>
        <div className="space-y-4">
          <GoalsSections />
        </div>
      </div>
    </div>
  );
}