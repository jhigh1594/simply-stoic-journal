import React from 'react';
import { Quote, RefreshCw, Share2 } from 'lucide-react';
import { useQuotes } from '../../../hooks/useQuotes';
import LoadingSpinner from '../../../components/LoadingSpinner';

function DailyQuote() {
  const { getDailyQuote, isLoading } = useQuotes();
  const [quote, setQuote] = React.useState<{ text: string; author: string; source: string } | null>(null);

  const loadQuote = React.useCallback(async () => {
    const dailyQuote = await getDailyQuote();
    if (dailyQuote) setQuote(dailyQuote);
  }, [getDailyQuote]);

  React.useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  const handleShare = async () => {
    if (!quote) return;
    
    const text = `"${quote.text}"\n\n— ${quote.author}, ${quote.source}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          text
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(text);
      // You could show a toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border p-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-500">
          <Quote className="h-5 w-5" />
          <h3 className="font-medium">Daily Wisdom</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadQuote}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
            title="Get another quote"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
            title="Share quote"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <blockquote className="text-xl mb-4 line-clamp-3">
        "{quote.text}"
      </blockquote>

      <cite className="text-sm text-gray-500 not-italic">
        — {quote.author}, {quote.source}
      </cite>
    </div>
  );
}

export default DailyQuote;