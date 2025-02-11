import { X, Trash2, Calendar, Clock, Tag, Sparkles, Target, Brain } from 'lucide-react';
import { format } from 'date-fns';
import type { JournalEntry, EveningReviewContent } from '../../../types/journal';
import AIInsightsSection from './AIInsightsSection';

interface JournalEntryViewProps {
  entry: JournalEntry;  // This is non-nullable
  onClose: () => void;
  onDelete: () => void;
}

function JournalEntryView({ entry, onClose, onDelete }: JournalEntryViewProps) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      onDelete();
    }
  };

  const renderEveningReviewContent = (content: EveningReviewContent) => {
    if (entry.type !== 'evening') return null;

    return (
      <div className="space-y-8">
        {/* Today's Actions & Character */}
        <section>
          <h2 className="text-xl font-semibold mb-4">📝 Today's Actions & Character</h2>
          <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-6">
            "First say to yourself what you would be; then do what you have to do." - Epictetus
          </blockquote>
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium">What virtues did I practice today?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Wisdom</h4>
                <div className="text-gray-600">{content.virtues?.wisdom}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Courage</h4>
                <div className="text-gray-600">{content.virtues?.courage}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Justice</h4>
                <div className="text-gray-600">{content.virtues?.justice}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Temperance</h4>
                <div className="text-gray-600">{content.virtues?.temperance}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Where did I fall short?</h3>
              <p className="text-sm text-gray-500 mb-2">(Focus on what was in your control)</p>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-600">
                {content.shortcomings}
              </div>
            </div>
          </div>
        </section>

        {/* Learning & Growth */}
        <section>
          <h2 className="text-xl font-semibold mb-4">💡 Learning & Growth</h2>
          <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-6">
            "Every day we should bring some worthy saying to our minds." - Seneca
          </blockquote>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">What unexpected challenge taught me something today?</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-600">
                {content.learning?.challenge}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">How will I use this lesson tomorrow?</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-600">
                {content.learning?.lesson}
              </div>
            </div>
          </div>
        </section>

        {/* Tomorrow's Preparation */}
        <section>
          <h2 className="text-xl font-semibold mb-4">⚡️ Tomorrow's Preparation</h2>
          <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-6">
            "When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly." - Marcus Aurelius
          </blockquote>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">What challenges might I face tomorrow?</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-600">
                {content.preparation?.challenges}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">How will I prepare to meet them with virtue?</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-600">
                {content.preparation?.approach}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderMetadata = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Intention */}
        {entry.intention && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Target className="h-4 w-4" />
              <h3 className="font-medium">Intention</h3>
            </div>
            <p className="text-gray-600">{entry.intention}</p>
          </div>
        )}

        {/* Gratitude */}
        {entry.gratitudeList?.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Sparkles className="h-4 w-4" />
              <h3 className="font-medium">Gratitude</h3>
            </div>
            <ul className="space-y-1">
              {entry.gratitudeList.map((item: string, index: number) => (
                <li key={index} className="text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Priorities */}
        {entry.priorities?.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Brain className="h-4 w-4" />
              <h3 className="font-medium">Priorities</h3>
            </div>
            <ul className="space-y-1">
              {entry.priorities.map((priority, index) => (
                <li key={index} className="text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {priority}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {entry.tags?.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Tag className="h-4 w-4" />
              <h3 className="font-medium">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white rounded-full text-sm text-gray-600 border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-xl z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                entry.type === 'morning' 
                  ? 'bg-orange-50 text-orange-700'
                  : 'bg-indigo-50 text-indigo-700'
              }`}>
                {entry.type === 'morning' ? 'Morning Reflection' : 'Evening Review'}
              </div>
              {entry.mood && (
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  <span className="capitalize">{entry.mood}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="h-4 w-4" />
              {format(new Date(entry.date), 'MMMM d, yyyy')}
              <span className="mx-1">•</span>
              <Clock className="h-4 w-4" />
              {format(new Date(entry.date), 'h:mm a')}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete entry"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Main Content */}
            {entry.type === 'evening' 
              ? renderEveningReviewContent(JSON.parse(entry.content || '{}') as EveningReviewContent)
              : <div className="prose prose-gray prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: entry.content || '' }} />
                </div>
            }

            {/* Metadata Grid */}
            {renderMetadata()}

            {/* AI Insights */}
            {entry.ai_insights && Object.keys(entry.ai_insights).length > 0 && (
              <AIInsightsSection 
                insights={entry.ai_insights} 
                isLoading={false}
                error={null}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JournalEntryView;