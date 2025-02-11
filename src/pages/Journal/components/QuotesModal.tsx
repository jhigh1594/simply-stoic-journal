import React from 'react';
import { X } from 'lucide-react';
import { quotes } from '../../../data/quotes';
import type { Quote } from '../../../types/library';

interface QuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuote: (quote: Quote) => void;
}

function QuotesModal({ isOpen, onClose, onSelectQuote }: QuotesModalProps) {
  const bookmarkedQuotes = new Set(JSON.parse(localStorage.getItem('bookmarkedQuotes') || '[]'));
  const savedQuotes = quotes.filter(quote => bookmarkedQuotes.has(quote.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-xl max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Saved Quotes</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          {savedQuotes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No saved quotes yet. Save some quotes from the Library to use them in your journal.
            </div>
          ) : (
            <div className="space-y-4">
              {savedQuotes.map((quote) => (
                <button
                  key={quote.id}
                  onClick={() => {
                    onSelectQuote(quote);
                    onClose();
                  }}
                  className="w-full text-left p-4 border rounded-lg hover:border-gray-400 transition-colors"
                >
                  <blockquote className="text-lg mb-2">"{quote.text}"</blockquote>
                  <div className="text-sm text-gray-600">
                    — {quote.author}, {quote.source}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuotesModal;