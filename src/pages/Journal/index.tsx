import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import JournalHome from './components/JournalHome';
import MoodSelector from './components/MoodSelector';
import MorningReflection from './components/MorningReflection';
import JournalSearch from './components/JournalSearch';
import { useJournal } from '../../hooks/useJournal';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import type { JournalEntry } from '../../types/journal';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { generateJournalInsights } from '../../lib/gemini';
import { useAuth } from '../../hooks/useAuth';
import JournalEntryView from './components/JournalEntryView';
import { useEffect } from 'react';
import PromptsModal from './components/PromptsModal';  // Replace PromptLibrary import
import EveningReview from './components/EveningReview';
import type { EveningReviewContent } from '../../types/journal';
import DecisionAnalysis from './components/DecisionAnalysis';  // Update import path

function Journal() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { entries, createEntry, loadEntries, deleteEntry, getEntry } = useJournal();
  const [mode, setMode] = React.useState<'home' | 'search' | 'edit' | 'view'>('home');
  const { isLoading, error, execute } = useAsyncAction();
  const [mood, setMood] = React.useState<string | null>(null);
  const [content, setContent] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  const [aiInsights, setAiInsights] = React.useState<JournalEntry['ai_insights']>();
  const [isGeneratingInsights, setIsGeneratingInsights] = React.useState(false);
  const [insightsError, setInsightsError] = React.useState<string | null>(null);
  const [journalType, setJournalType] = React.useState<'morning' | 'evening' | 'decision'>('morning');
  const [isPromptModalOpen, setIsPromptModalOpen] = React.useState(false);
  const [decisionAnalysis, setDecisionAnalysis] = React.useState<JournalEntry['decision_analysis']>({
    question: '',
    factors: [] as {
      text: string;
      type: 'controllable' | 'uncontrollable';
      impact: 'high' | 'medium' | 'low';
    }[],
    analysis: '',
    conclusion: ''
  });

  const handleNewEntry = (type: 'morning' | 'evening' | 'decision') => {
    setJournalType(type);
    setMode('edit');
    navigate(`/journal?type=${type}`);
  };

  const [selectedEntry, setSelectedEntry] = React.useState<JournalEntry | null>(null);
  const { userId } = useAuth();

  // Add keyboard shortcut for search
  useKeyboardShortcut({
    key: 'k',
    ctrlKey: true,
    handler: () => setMode(mode === 'search' ? 'home' : 'search')
  });

  useEffect(() => {
    if (!userId) return;
    loadEntries();
  }, [loadEntries, userId]);

  useEffect(() => {
    const loadEntryFromUrl = async () => {
      if (params.id) {
        try {
          const entry = await getEntry(params.id);
          if (entry) {
            setSelectedEntry(entry);
            setMode('view');
          } else {
            setSelectedEntry(null);
            navigate('/journal');
          }
        } catch (error) {
          console.error('Failed to load entry:', error);
          setSelectedEntry(null);
          navigate('/journal');
        }
      }
    };

    loadEntryFromUrl();
  }, [params.id, getEntry, navigate]);

  // Handle URL query parameters and path parameters
  React.useEffect(() => {
    // Handle old-style routes (/journal/morning and /journal/evening)
    if (location.pathname.endsWith('/morning') || location.pathname.endsWith('/evening')) {
      const type = location.pathname.split('/').pop() as 'morning' | 'evening';
      navigate(`/journal?type=${type}`, { replace: true });
      return;
    }

    // Handle new-style routes with query parameters
    const type = new URLSearchParams(location.search).get('type');
    if (type === 'morning' || type === 'evening' || type === 'decision') {  // Added decision type
      setMode('edit');
      setJournalType(type as 'morning' | 'evening' | 'decision');  // Updated type assertion
    }
  }, [location, navigate]);

  // Update handleContentBlur for morning reflections
  const handleContentBlur = React.useCallback(async () => {
    if (!content.trim()) return;
    
    setIsGeneratingInsights(true);
    setInsightsError(null);

    try {
      const insights = await generateJournalInsights(content, 'morning');
      setAiInsights(insights);
    } catch (error) {
      setInsightsError('Failed to generate insights. Please try again.');
    } finally {
      setIsGeneratingInsights(false);
    }
  }, [content]);

  // Add evening content insights generation
  const handleEveningContentChange = async (newContent: EveningReviewContent) => {
    setEveningContent(newContent);
    
    // Only generate insights if main content is not empty
    if (!newContent.mainContent.trim()) return;

    setIsGeneratingInsights(true);
    setInsightsError(null);

    try {
      const insights = await generateJournalInsights(newContent, 'evening');
      setAiInsights(insights);
    } catch (error) {
      setInsightsError('Failed to generate insights. Please try again.');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // Update EveningReview component usage
  {journalType === 'evening' && (
    <EveningReview
      onContentChange={handleEveningContentChange}
      initialContent={eveningContent}
      onOpenPromptLibrary={() => setIsPromptModalOpen(true)}
      onPromptSelect={(prompt) => {
        setEveningContent(prev => ({
          ...prev,
          mainContent: prompt
        }));
      }}
    />
  )}
  const [intention, setIntention] = React.useState('');
  const [gratitudeList, setGratitudeList] = React.useState<string[]>(['']);
  const [priorities, setPriorities] = React.useState<string[]>(['']);

  const [eveningContent, setEveningContent] = React.useState<EveningReviewContent>({
    mainContent: '',
    virtues: {
      wisdom: '',
      courage: '',
      justice: '',
      temperance: ''
    },
    shortcomings: '',
    learning: {
      challenge: '',
      lesson: ''
    },
    preparation: {
      challenges: '',
      approach: ''
    }
  });

  // Update handleSave to handle evening content
  // Update handleSave to use consistent property names
  const handleSave = async () => {
    if (!userId) return;
  
    const entry: Omit<JournalEntry, 'id'> = {
      date: new Date().toISOString(),
      user_id: userId,
      tags,
      type: journalType,
      mood: mood ?? undefined,
      content: journalType === 'evening' 
        ? JSON.stringify(eveningContent)
        : content,
      intention: journalType === 'morning' ? intention : '',
      gratitudeList: journalType === 'morning' ? gratitudeList.filter(Boolean) : [], // Changed from gratitude_list to gratitudeList
      priorities: journalType === 'morning' ? priorities.filter(Boolean) : [],
      decision_analysis: journalType === 'decision' ? decisionAnalysis : undefined,
      ai_insights: aiInsights || {}
    };

    try {
      await execute(async () => {
        const savedEntry = await createEntry(entry);
        setMode('home');
        return savedEntry;
      });
    } catch (error) {
      console.error('Failed to save entry:', error);
    }
  };

  // Add handleDeleteEntry function
  // Update handleDeleteEntry function to accept JournalEntry
  const handleDeleteEntry = async (entry: JournalEntry) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await deleteEntry(entry.id!);
      await loadEntries();
    }
  };

  // Fix the render section
  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {mode === 'search'
            ? 'Journal Entries'
            : mode === 'edit'
            ? journalType === 'morning'
              ? 'Morning Reflection'
              : journalType === 'evening'
              ? 'Evening Review'
              : 'Decision Analysis'
            : mode === 'view'
            ? 'Journal Entry'
            : 'Journal'
          }
        </h1>
        <button
          onClick={() => setMode(mode === 'search' ? 'home' : 'search')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <Search className="h-5 w-5" />
          {mode === 'search' ? 'Back to Journal' : 'Search Entries'}
        </button>
      </div>

      {mode === 'search' ? (
        <JournalSearch
          entries={entries}
          onEntryClick={(entry) => navigate(`/journal/${entry.id}`)}
          onDeleteEntry={handleDeleteEntry}
        />
      ) : mode === 'home' ? (
        <JournalHome
          entries={entries}
          onNewEntry={handleNewEntry}
          onViewEntry={(entry) => navigate(`/journal/${entry.id}`)}
        />
      ) : mode === 'view' && selectedEntry ? (
        <JournalEntryView
          entry={selectedEntry}
          onClose={() => {
            setSelectedEntry(null);
            setMode('home');
            navigate('/journal');
          }}
          onDelete={() => handleDeleteEntry(selectedEntry)}
        />
      ) : mode === 'edit' ? (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {journalType === 'decision' ? (
                'What decision are you analyzing?'
              ) : (
                `How are you feeling this ${journalType === 'morning' ? 'morning' : 'evening'}?`
              )}
            </h2>
            {journalType !== 'decision' && (
              <MoodSelector selectedMood={mood} onSelectMood={setMood} />
            )}
          </div>
          
          {journalType === 'morning' && (
            <MorningReflection
              content={content}
              onContentChange={setContent}
              intention={intention}
              onIntentionChange={setIntention}
              gratitudeList={gratitudeList}
              onGratitudeListChange={setGratitudeList}
              onOpenPromptLibrary={() => setIsPromptModalOpen(true)}
              priorities={priorities}
              onPrioritiesChange={setPriorities}
            />
          )}
          
          {journalType === 'evening' && (
            <EveningReview
              onContentChange={setEveningContent}
              initialContent={eveningContent}
              onOpenPromptLibrary={() => setIsPromptModalOpen(true)}
              onPromptSelect={(prompt) => {
                setEveningContent(prev => ({
                  ...prev,
                  mainContent: prompt
                }));
              }}
            />
          )}
          
          {journalType === 'decision' && (
            <DecisionAnalysis
              value={decisionAnalysis}
              onChange={setDecisionAnalysis}
            />
          )}

          <PromptsModal
            isOpen={isPromptModalOpen}
            onClose={() => setIsPromptModalOpen(false)}
            onSelectPrompt={(prompt) => {
              if (journalType === 'morning') {
                setContent(prompt);
              } else {
                setEveningContent(prev => ({
                  ...prev,
                  mainContent: prompt
                }));
              }
              setIsPromptModalOpen(false);
            }}
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>

          {error && (
            <div className="mt-4 text-red-600">
              Failed to save entry. Please try again.
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

export default Journal;