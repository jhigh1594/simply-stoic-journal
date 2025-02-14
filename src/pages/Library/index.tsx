import React, { useState } from 'react';
import { Search, Bookmark } from 'lucide-react';
import QuotesTab from './components/QuotesTab';
import PracticesTab from './components/PracticesTab';
import MentalModelsTab from './components/MentalModelsTab';

const tabs = [
  { id: 'quotes', label: 'Quotes' },
  { id: 'practices', label: 'Practices' },
  { id: 'mental-models', label: 'Mental Models' },
  { id: 'liked', label: 'Liked' },
  { id: 'community', label: 'Community' },
];

export default function Library() {
  const [activeTab, setActiveTab] = useState('quotes');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Stoic Library</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-black"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="border-b mb-8">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 text-sm font-medium relative ${
                activeTab === tab.id
                  ? 'text-black'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="min-h-[400px]">
        {activeTab === 'quotes' && <QuotesTab searchQuery={searchQuery} />}
        {activeTab === 'practices' && <PracticesTab searchQuery={searchQuery} />}
        {activeTab === 'mental-models' && <MentalModelsTab searchQuery={searchQuery} />}
        {activeTab === 'liked' && <QuotesTab searchQuery={searchQuery} showLiked />}
        {activeTab === 'community' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QuotesTab searchQuery={searchQuery} showCommunity />
            <PracticesTab searchQuery={searchQuery} showCommunity />
          </div>
        )}
      </div>
    </div>
  );
}