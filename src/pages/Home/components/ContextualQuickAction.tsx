import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sunrise, Sun, Sunset } from 'lucide-react';

function ContextualQuickAction() {
  const navigate = useNavigate();
  const [timeContext, setTimeContext] = React.useState<'morning' | 'afternoon' | 'evening'>('morning');

  React.useEffect(() => {
    const updateTimeContext = () => {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 11) {
        setTimeContext('morning');
      } else if (hour >= 11 && hour < 17) {
        setTimeContext('afternoon');
      } else {
        setTimeContext('evening');
      }
    };

    updateTimeContext();
    const interval = setInterval(updateTimeContext, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const contextConfig = {
    morning: {
      icon: Sunrise,
      text: 'Morning Reflection',
      color: 'bg-yellow-200 hover:bg-yellow-300 text-yellow-900'
    },
    afternoon: {
      icon: Sun,
      text: 'Afternoon Reflection',
      color: 'bg-blue-500 hover:bg-blue-600 text-white'
    },
    evening: {
      icon: Sunset,
      text: 'Evening Reflection',
      color: 'bg-indigo-500 hover:bg-indigo-600 text-white'
    }
  };

  const { icon: Icon, text, color } = contextConfig[timeContext];

  return (
    <button
      onClick={() => navigate(`/journal?type=${timeContext}`)}
      className={`w-full ${color} rounded-xl p-6 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Icon className="h-8 w-8" />
          <div className="text-left">
            <h2 className="text-2xl font-semibold">{text}</h2>
            <p className="opacity-80">Start your {timeContext} practice</p>
          </div>
        </div>
        <div className="text-5xl font-light">→</div>
      </div>
    </button>
  );
}

export default ContextualQuickAction;