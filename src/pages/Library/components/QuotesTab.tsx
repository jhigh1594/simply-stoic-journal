import React from 'react';
import { Heart } from 'lucide-react';
import type { Quote } from '../../../types/library';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import { useAuth } from '../../../hooks/useAuth';
import { useQuotes } from '../../../hooks/useQuotes';

interface QuotesTabProps {
  searchQuery: string;
  showLiked?: boolean;
  showCommunity?: boolean;
}

function QuotesTab({ searchQuery, showLiked, showCommunity }: QuotesTabProps) {
  const { userId } = useAuth();
  const { quotes, isLoading, error, toggleLike } = useQuotes();
  const [updatingQuoteId, setUpdatingQuoteId] = React.useState<string | null>(null);

  const filteredQuotes = React.useMemo(() => {
    if (!quotes) return [];
    
    return quotes.filter(quote =>
      // Filter by liked status if showLiked is true
      (showLiked ? quote.liked_by?.includes(userId) : true) &&
      // Filter by community status if specified
      (showCommunity ? quote.is_community : !quote.is_community) &&
      // Filter by search query
      (quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
       quote.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
       quote.source.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [quotes, searchQuery, showLiked, showCommunity, userId]);

  const handleLike = async (quote: Quote) => {
    if (!userId) return;
    setUpdatingQuoteId(quote.id);
    try {
      await toggleLike(quote.id, userId);
    } finally {
      setUpdatingQuoteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load quotes. Please try again."
        action={{
          label: "Retry",
          onClick: () => window.location.reload()
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {filteredQuotes.map((quote) => (
        <div key={quote.id} className="bg-white border rounded-lg p-6 relative group">
          <button
            onClick={() => handleLike(quote)}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
            disabled={updatingQuoteId === quote.id}
          >
            {updatingQuoteId === quote.id ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Heart 
                  className={`h-5 w-5 ${quote.liked_by?.includes(userId) ? 'fill-current text-red-500' : ''}`} 
                />
                <span className="text-sm">{quote.likes}</span>
              </>
            )}
          </button>
          <blockquote className="text-lg mb-4">"{quote.text}"</blockquote>
          <div className="text-gray-600">
            <p>— {quote.author}</p>
            <p className="text-sm">From: {quote.source}</p>
            {quote.is_community && (
              <p className="text-xs text-gray-400 mt-2">Community Contribution</p>
            )}
          </div>
        </div>
      ))}

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No quotes found matching your search criteria
        </div>
      )}
    </div>
  );
}

export default QuotesTab;