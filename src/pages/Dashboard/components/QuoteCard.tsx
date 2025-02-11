import React from 'react';
import { RefreshCw } from 'lucide-react';
import type { Quote } from '../../../types/library';
import { quotes } from '../../../data/quotes';

const getRandomQuote = (quotes: Quote[]) => {
  if (!quotes.length) return null;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

function QuoteCard() {
  const [currentQuote, setCurrentQuote] = React.useState<Quote | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const loadQuote = React.useCallback(() => {
    try {
      const quote = getRandomQuote(quotes);
      if (!quote) {
        setError('No quotes available');
        return;
      }
      setCurrentQuote(quote);
      setError(null);
    } catch (e) {
      setError('Failed to load quote');
    }
  }, []);

  React.useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  if (error) {
    return (
      <div className="bg-white rounded-lg border p-6 mb-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={loadQuote}
          className="mt-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleRefresh = () => {
    setCurrentQuote(getRandomQuote(quotes));
  };

  return (
    <div className="bg-white rounded-lg border p-6 mb-8 relative">
      {currentQuote ? (
        <div className="max-w-2xl">
          <blockquote className="text-xl font-medium mb-2">
            "{currentQuote.text}"
          </blockquote>
          <cite className="text-gray-500 text-sm">
            — {currentQuote.author}, {currentQuote.source}
          </cite>
        </div>
      ) : (
        <div className="text-gray-500">Loading quote...</div>
      )}
      <button 
        onClick={handleRefresh}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
      >
        <RefreshCw className="h-5 w-5" />
      </button>
    </div>
  );
}

export default QuoteCard;