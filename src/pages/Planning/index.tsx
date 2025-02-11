import React from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BigGoalCard from './components/BigGoalCard';
import CheckpointGoalCard from './components/CheckpointGoalCard';
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
  const navigate = useNavigate();
  const { userId } = useAuth();
  const {
    bigGoals,
    checkpointGoals,
    dailySystems,
    antiGoals,
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

  React.useEffect(() => {
    if (!userId) return;
    
    loadBigGoals();
    loadCheckpointGoals();
    loadDailySystems();
    
    // Load current month's review
    const currentMonth = new Date().toISOString().split('T')[0].substring(0, 7);
    loadMonthlyReview(currentMonth);
  }, [userId, loadBigGoals, loadCheckpointGoals, loadDailySystems, loadMonthlyReview]);

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
                
                {/* Show related checkpoint goals */}
                {checkpointGoals.filter(cp => cp.big_goal_id === goal.id).length > 0 && (
                  <div className="pl-8 space-y-4">
                    <h3 className="text-sm font-medium text-gray-500">Related Checkpoints</h3>
                    {checkpointGoals
                      .filter(cp => cp.big_goal_id === goal.id)
                      .map(checkpoint => (
                        <CheckpointGoalCard
                          key={checkpoint.id}
                          goal={checkpoint}
                          onUpdate={loadCheckpointGoals}
                        />
                      ))
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'checkpoints':
        return (
          <div className="space-y-6">
            {checkpointGoals.map(goal => (
              <CheckpointGoalCard
                key={goal.id}
                goal={goal}
                onUpdate={loadCheckpointGoals}
              />
            ))}
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

      case 'anti-goals':
        return (
          <div className="space-y-6">
            {antiGoals.map(goal => (
              <AntiGoalCard
                key={goal.id}
                goal={goal}
              />
            ))}
          </div>
        );

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
            checkpointGoalId={checkpointGoals[0]?.id}
          />
        );

      case 'anti-goals':
        return (
          <AntiGoalModal
            isOpen={true}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={createBigGoal}
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