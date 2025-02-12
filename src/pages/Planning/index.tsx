import React from 'react';
import { Plus, BookOpen } from 'lucide-react';
import type { CheckpointGoal, BigGoal } from '../../types/planning';  // Add BigGoal type
import BigGoalCard from './components/BigGoalCard';
import { CheckpointGoalCard } from './components/CheckpointGoalCard';
import DailySystemCard from './components/DailySystemCard';
import AntiGoalCard from './components/AntiGoalCard';
import MonthlyReviewCard from './components/MonthlyReviewCard';
import BigGoalModal from './components/BigGoalModal';
import CheckpointGoalModal from './components/CheckpointGoalModal';
import DailySystemModal from './components/DailySystemModal';
import AntiGoalModal from './components/AntiGoalModal';
import MonthlyReviewModal from './components/MonthlyReviewModal';
import ABCTrackingModal from './components/ABCTrackingModal';
import FrameworkGuide from './components/FrameworkGuide';
import { usePlanning } from '../../hooks/usePlanning';
import { useAuth } from '../../hooks/useAuth';

const tabs = [
  { id: 'guide', label: 'Framework Guide', icon: BookOpen },
  { id: 'big-goals', label: 'Big Goals', addLabel: 'Add Big Goal' },
  { id: 'checkpoints', label: 'Checkpoints', addLabel: 'Add Checkpoint' },
  { id: 'systems', label: 'Daily Systems', addLabel: 'Add System' },
  { id: 'anti-goals', label: 'Anti-Goals', addLabel: 'Add Anti-Goal' },
  { id: 'reviews', label: 'Monthly Reviews', addLabel: 'Add Review' }
];

function Planning() {
  const [activeTab, setActiveTab] = React.useState('big-goals');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const { userId } = useAuth();  // Remove navigate declaration

  const {
    bigGoals,
    checkpointGoals,
    dailySystems,
    monthlyReview,
    isLoading,
    loadBigGoals,
    loadCheckpointGoals,
    loadDailySystems,
    loadMonthlyReview,
    createBigGoal,
    createCheckpointGoal,
    createDailySystem,
    createMonthlyReview
  } = usePlanning();

  // Convert checkpointGoals object to array when needed
  const allCheckpointGoals = React.useMemo(() => {
    return Object.values(checkpointGoals).flat();
  }, [checkpointGoals]);

  React.useEffect(() => {
    if (!userId) return;
    
    const loadInitialData = async () => {
      await loadBigGoals();
      const currentMonth = new Date().toISOString().split('T')[0].substring(0, 7);
      await loadMonthlyReview(currentMonth);
      await loadDailySystems();
    };

    loadInitialData();
  }, [userId, loadBigGoals, loadDailySystems, loadMonthlyReview]);

  // Separate useEffect for loading checkpoint goals
  React.useEffect(() => {
    if (!userId || bigGoals.length === 0) return;
    
    Promise.all(bigGoals.map(goal => loadCheckpointGoals(goal.id)));
  }, [userId, bigGoals, loadCheckpointGoals]);

  // Add handleAddItem function
  const handleAddItem = () => {
    setIsAddModalOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'guide':
        return (
          <FrameworkGuide 
            onGetStarted={() => setActiveTab('big-goals')} 
          />
        );

      case 'big-goals':
        return (
          <div className="space-y-12">
            {bigGoals.map(goal => (
              <div key={goal.id} className="space-y-6">
                <BigGoalCard
                  goal={goal}
                  onUpdate={loadBigGoals}
                />
              </div>
            ))}
          </div>
        );

      case 'checkpoints':
        return (
          <div className="space-y-6">
            {allCheckpointGoals.map((goal: CheckpointGoal) => (
              <CheckpointGoalCard
                key={goal.id}
                goal={goal}
                onUpdate={() => loadCheckpointGoals(goal.big_goal_id)}
              />
            ))}
          </div>
        );

      // Remove duplicate anti-goals case and keep only this one
      case 'anti-goals':
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Anti-goals feature coming soon.</p>
          </div>
        );

      case 'systems':
        return (
          <div className="space-y-6">
            {dailySystems.map(system => (
              <DailySystemCard
                key={system.id}
                system={system}
                onUpdate={loadDailySystems}
              />
            ))}
          </div>
        );

      // Remove this duplicate anti-goals case
      // case 'anti-goals': ...

      case 'reviews':
        return monthlyReview ? (
          <MonthlyReviewCard
            review={monthlyReview}
            onUpdate={() => {
              const currentMonth = new Date().toISOString().split('T')[0].substring(0, 7);
              loadMonthlyReview(currentMonth);
            }}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">
            No review for this month yet. Start one by clicking the Add button.
          </div>
        );

      default:
        return null;
    }
  };

  const renderModal = () => {
    if (!isAddModalOpen) return null;

    switch (activeTab) {
      case 'big-goals':
        return (
          <BigGoalModal
            isOpen={true}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={createBigGoal}
          />
        );

      case 'checkpoints':
        return (
          <CheckpointGoalModal
            isOpen={true}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={createCheckpointGoal}
            bigGoalId={bigGoals[0]?.id}
          />
        );

      case 'systems':
        return (
          <DailySystemModal
            isOpen={true}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={createDailySystem}
            checkpointGoalId={allCheckpointGoals[0]?.id}  // Use allCheckpointGoals instead
          />
        );

      case 'anti-goals':
        return (
          <AntiGoalModal
            isOpen={true}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={() => {}}  // Add empty function for now until anti-goals feature is implemented
          />
        );

      case 'reviews':
        return (
          <MonthlyReviewModal
            isOpen={true}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={createMonthlyReview}
            month={new Date().toISOString().split('T')[0].substring(0, 7)}
          />
        );

      default:
        return null;
    }
  };

  const activeTabConfig = tabs.find(tab => tab.id === activeTab);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Planning</h1>
          <p className="text-gray-600">Set and track your goals across different timeframes</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'guide'
                ? 'bg-black text-white'
                : 'border hover:bg-gray-50'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            Framework Guide
          </button>
          {activeTab !== 'guide' && activeTabConfig?.addLabel && (
            <button
              onClick={handleAddItem}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              <Plus className="h-5 w-5" />
              {activeTabConfig.addLabel}
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b">
          <div className="flex gap-8">
            {tabs.filter(tab => tab.id !== 'guide').map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 -mb-px font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto" />
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      ) : (
        renderContent()
      )}

      {renderModal()}
    </div>
  );
}

export default Planning;