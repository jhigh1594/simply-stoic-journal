import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sunrise, Sunset, ArrowRight } from 'lucide-react';

type JournalType = 'morning' | 'evening';

interface JournalSection {
  title: string;
  description: string;
  action: string;
  type: JournalType;
  icon: React.ElementType;
  preview: string[];
}

const sections: JournalSection[] = [
  {
    title: 'Morning Reflection',
    description: 'Start your day with focus, intention, and gratitude',
    action: 'Begin Morning Journal',
    type: 'morning',
    icon: Sunrise,
    preview: [
      'Set your intentions for the day',
      'Practice gratitude',
      'Prepare for challenges'
    ]
  },
  {
    title: 'Evening Review',
    description: 'Reflect on your day through the lens of Stoic virtues',
    action: 'Begin Evening Journal',
    type: 'evening',
    icon: Sunset,
    preview: [
      "Today's Actions & Character",
      'Learning & Growth',
      "Tomorrow's Preparation"
    ]
  }
];

function JournalSections() {
  const navigate = useNavigate();

  const handleJournalStart = (type: JournalType) => {
    navigate(`/journal/${type}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <div 
            key={section.title} 
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Icon className="w-6 h-6 text-gray-700" />
              </div>
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>
            
            <p className="text-gray-600 mb-6">{section.description}</p>
            
            <div className="space-y-2 mb-6">
              {section.preview.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-500"
                >
                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleJournalStart(section.type)}
              className="w-full bg-black text-white rounded-lg py-3 px-4 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
            >
              <span>{section.action}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default JournalSections;