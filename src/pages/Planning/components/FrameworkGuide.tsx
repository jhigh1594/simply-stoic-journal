import React from 'react';
import { Target, Flag, Repeat, AlertTriangle, ArrowRight } from 'lucide-react';

interface FrameworkGuideProps {
  onGetStarted: () => void;
}

function FrameworkGuide({ onGetStarted }: FrameworkGuideProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Introduction */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Goal Setting Framework</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A comprehensive approach to setting and achieving meaningful goals while maintaining balance
          and staying true to your principles.
        </p>
      </div>

      {/* Framework Components */}
      <div className="space-y-16">
        {/* Big Goals Section */}
        <div className="bg-white rounded-xl border p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-black rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">Big Goals</h2>
              <p className="text-gray-600 mb-6">
                These are your year-long, ambitious goals that should stretch your limits and inspire growth.
                Think of them as the summit of your mountain—motivating on a macro scale, but too far off
                to be actionable day-to-day.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium mb-3">Example Big Goal</h3>
                <p className="text-gray-600">
                  Create a movement of 1 million people around the world who have read "The 5 Types of Wealth"
                  and taken actions to build their lives around the priorities that matter to them.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Checkpoint Goals Section */}
        <div className="bg-white rounded-xl border p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Flag className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">Checkpoint Goals</h2>
              <p className="text-gray-600 mb-6">
                Work backwards from your Big Goals to create tangible milestones. If Big Goals are the summit,
                Checkpoint Goals are your mid-climb campsites—essential waypoints on your journey to the top.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium mb-3">Example Checkpoint Goal</h3>
                <p className="text-gray-600">
                  Sell 50,000+ copies of the book in the initial preorder campaign and launch week.
                  Reach 250,000+ copies sold by June 2025.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Systems Section */}
        <div className="bg-white rounded-xl border p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <Repeat className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">Daily Systems</h2>
              <p className="text-gray-600 mb-6">
                "You do not rise to the level of your goals. You fall to the level of your systems."
                - James Clear
              </p>
              <p className="text-gray-600 mb-6">
                These are the 2-3 daily actions that create tangible, compounding progress. If Big Goals
                and Checkpoint Goals are your compass, Daily Systems are your feet, moving you forward.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-medium">The ABC System</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="font-medium text-green-700 mb-1">Level A</div>
                    <p className="text-sm text-gray-600">Most ambitious, perfect case execution</p>
                  </div>
                  <div>
                    <div className="font-medium text-blue-700 mb-1">Level B</div>
                    <p className="text-sm text-gray-600">Middle ground, base case execution</p>
                  </div>
                  <div>
                    <div className="font-medium text-yellow-700 mb-1">Level C</div>
                    <p className="text-sm text-gray-600">Minimum viable level execution</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-4">
                  The ABC System removes guilt: As long as you hit your C, you're making forward progress.
                  Anything above zero compounds.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Anti-Goals Section */}
        <div className="bg-white rounded-xl border p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">Anti-Goals</h2>
              <p className="text-gray-600 mb-2">
                "All I want to know is where I'm going to die, so I'll never go there."
                - Charlie Munger
              </p>
              <p className="text-gray-600 mb-6">
                Anti-Goals are the things you don't want to sacrifice while pursuing your Big Goals.
                They help maintain balance and protect what's truly important.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium mb-3">Example Anti-Goals</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 flex-shrink-0" />
                    Traveling for more than 10 nights out of the month
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 flex-shrink-0" />
                    Sacrificing health and family non-negotiables
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="mt-16 text-center">
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Start Setting Goals
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default FrameworkGuide;