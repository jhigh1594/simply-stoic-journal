import React from 'react';
import { Target, BarChart3, ChevronRight, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlanning } from '../../../hooks/usePlanning';
import { useAuth } from '../../../hooks/useAuth';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ABCTrackingModal from '../../Planning/components/ABCTrackingModal';
import { planningService } from '../../../services/planning';

function GoalsSections() {
  const navigate = useNavigate();
  const [isABCModalOpen, setIsABCModalOpen] = React.useState(false);
  const initialLoadRef = React.useRef(false);
  const { 
    bigGoals,
    checkpointGoals,
    dailySystems,
    abcTracking,
    monthlyReview,
    isLoading,
    loadBigGoals,
    loadCheckpointGoals,
    loadDailySystems,
    loadABCTracking,
    loadMonthlyReview,
    trackABC
  } = usePlanning();
  const { userId } = useAuth();

  React.useEffect(() => {
    if (!userId || initialLoadRef.current) return;
    
    const loadInitialData = async () => {
      try {
        await Promise.all([
          loadBigGoals(),
          loadDailySystems(),
          loadABCTracking(new Date().toISOString().split('T')[0]),
          loadMonthlyReview(new Date().toISOString().substring(0, 7))
        ]);

        // Load checkpoints after big goals are loaded
        bigGoals
          .filter(goal => goal.status === 'in_progress')
          .forEach(goal => loadCheckpointGoals(goal.id));

        initialLoadRef.current = true;
      } catch (error) {
        console.error('Error loading planning data:', error);
      }
    };

    loadInitialData();
  }, [userId, loadBigGoals, loadCheckpointGoals, loadDailySystems, loadABCTracking, loadMonthlyReview]);

  const activeBigGoals = bigGoals.filter(goal => goal.status === 'in_progress');
  const upcomingCheckpoints = Object.values(checkpointGoals)
    .flat()
    .filter(goal => goal.status !== 'completed')
    .sort((a, b) => new Date(a.target_date).getTime() - new Date(b.target_date).getTime())
    .slice(0, 3);

  const activeSystems = dailySystems.filter(system => system.active);
  const today = new Date().toISOString().split('T')[0];
  const todaysTracking = abcTracking.filter(t => t.date === today);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Big Goals Overview */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <h2 className="font-semibold">Active Big Goals</h2>
          </div>
          <button
            onClick={() => navigate('/planning')}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        {activeBigGoals.length > 0 ? (
          <div className="space-y-4">
            {activeBigGoals.slice(0, 3).map(goal => (
              <div key={goal.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-medium mb-1">{goal.title}</div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${goal.status === 'completed' ? 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No active big goals. Add some in Planning.</p>
        )}
      </div>

      {/* Daily Systems Tracker */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <h2 className="font-semibold">Today's Systems</h2>
          </div>
          <button
            onClick={() => setIsABCModalOpen(true)}
            className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Track Progress
          </button>
        </div>
        {activeSystems.length > 0 ? (
          <div className="space-y-4">
            {activeSystems.map(system => {
              const tracking = todaysTracking.find(t => t.system_id === system.id);
              return (
                <div key={system.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-medium mb-1">{system.title}</div>
                    {tracking ? (
                      <div className={`text-sm ${
                        tracking.category === 'A' ? 'text-green-600' :
                        tracking.category === 'B' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>
                        Level {tracking.category} completed
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Not tracked yet today</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No active systems. Set up your daily systems in Planning.</p>
        )}
      </div>

      {/* Upcoming Checkpoints */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h2 className="font-semibold">Upcoming Checkpoints</h2>
          </div>
          <button
            onClick={() => navigate('/planning')}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        {upcomingCheckpoints.length > 0 ? (
          <div className="space-y-4">
            {upcomingCheckpoints.map(checkpoint => (
              <div key={checkpoint.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-medium mb-1">{checkpoint.title}</div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${checkpoint.progress}%` }}
                        />
                      </div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={checkpoint.progress}
                      onChange={async (e) => {
                        const progress = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                        await planningService.updateCheckpointGoal(checkpoint.id, { progress });
                        loadCheckpointGoals(checkpoint.big_goal_id);
                      }}
                      className="w-16 text-sm border rounded-lg px-2 py-1 text-center"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Due {new Date(checkpoint.target_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No upcoming checkpoints. Add some in Planning.</p>
        )}
      </div>

      {/* Monthly Progress */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="font-semibold">Monthly Progress</h2>
          </div>
          <button
            onClick={() => navigate('/planning')}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            View Review
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        {monthlyReview ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Key Wins</h3>
              <ul className="space-y-1">
                {monthlyReview.wins.slice(0, 3).map((win, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    {win}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No monthly review yet. Start one in Planning.</p>
        )}
      </div>

      <ABCTrackingModal
        isOpen={isABCModalOpen}
        onClose={() => setIsABCModalOpen(false)}
        onSubmit={trackABC}
        date={today}
      />
    </div>
  );
}

export default GoalsSections;