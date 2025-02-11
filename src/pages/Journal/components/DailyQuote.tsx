import React from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { quotes } from '../../../data/quotes';

function DailyQuote({ entries }: { entries: any[] }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [quote, setQuote] = React.useState<{ text: string; author: string; source: string } | null>(null);

  const loadQuote = React.useCallback(async () => {
    setIsLoading(true);
    // Get themes from recent entries
    const themes = entries
      .slice(0, 5)
      .flatMap(entry => entry.ai_insights?.themes || []);
    
    // Find quotes matching themes
    const matchingQuotes = quotes.filter(quote =>
      quote.tags.some(tag => themes.includes(tag.toLowerCase()))
    );
    
    // If no matching quotes, pick a random one
    const quotePool = matchingQuotes.length > 0 ? matchingQuotes : quotes;
    const randomQuote = quotePool[Math.floor(Math.random() * quotePool.length)];
    
    setQuote(randomQuote);
    setIsLoading(false);
  }, [entries]);

  React.useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  if (isLoading) {
    return (
      <div className="bg-white border rounded-lg p-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="bg-white border rounded-lg p-6 relative group">
      <div className="flex items-center gap-3 mb-4">
        <Quote className="h-5 w-5 text-gray-400" />
        <h3 className="font-medium">Daily Quote</h3>
        <button
          onClick={loadQuote}
          className="ml-auto p-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Get another quote"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      <blockquote className="text-lg mb-2">"{quote.text}"</blockquote>
      <cite className="text-sm text-gray-600">
        — {quote.author}, {quote.source}
      </cite>
    </div>
  );
}

export default DailyQuote;