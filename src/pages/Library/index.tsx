import React from 'react';
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

function Library() {
  const [activeTab, setActiveTab] = React.useState('quotes');
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Learning</h1>
        <p className="text-gray-600">Explore Stoic wisdom, practices, and mental models</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-black"
        />
      </div>

      <div className="border-b mb-6">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 -mb-px font-medium ${
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

      {activeTab === 'quotes' && (
        <QuotesTab
          searchQuery={searchQuery}
          showLiked={false}
          showCommunity={false}
        />
      )}

      {activeTab === 'practices' && (
        <PracticesTab
          searchQuery={searchQuery}
          showCommunity={false}
        />
      )}

      {activeTab === 'mental-models' && (
        <MentalModelsTab searchQuery={searchQuery} />
      )}

      {activeTab === 'liked' && (
        <QuotesTab
          searchQuery={searchQuery}
          showLiked={true}
          showCommunity={false}
        />
      )}

      {activeTab === 'community' && (
        <QuotesTab
          searchQuery={searchQuery}
          showLiked={false}
          showCommunity={true}
        />
      )}
    </div>
  );
}

export default Library;