import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Search } from 'lucide-react';

import JournalHome from './components/JournalHome';
import MoodSelector from './components/MoodSelector';
import MorningReflection from './components/MorningReflection';
import JournalSearch from './components/JournalSearch';
import JournalEntryView from './components/JournalEntryView';
import PromptsModal from './components/PromptsModal';
import EveningReview from './components/EveningReview';
import DecisionAnalysis from './components/DecisionAnalysis';
import AIInsightsSection from './components/AIInsightsSection';

import { useJournal } from '../../hooks/useJournal';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useAuth } from '../../hooks/useAuth';

import { generateJournalInsights } from '../../lib/gemini';

import type { JournalEntry, EveningReviewContent, AIInsights } from '../../types/journal';

type JournalMode = 'home' | 'search' | 'edit' | 'view';
type JournalType = 'morning' | 'evening' | 'decision';

const Journal: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { entries, createEntry, loadEntries, deleteEntry, getEntry } = useJournal();
  const { userId } = useAuth();
  const { isLoading, error, execute } = useAsyncAction();

  // Core state
  const [mode, setMode] = React.useState<JournalMode>('home');
  const [journalType, setJournalType] = React.useState<JournalType>('morning');
  const [selectedEntry, setSelectedEntry] = React.useState<JournalEntry | null>(null);
  
  // Entry content state
  const [mood, setMood] = React.useState<string | null>(null);
  const [content, setContent] = React.useState('');
  const [tags] = React.useState<string[]>([]);
  const [intention, setIntention] = React.useState('');
  const [gratitudeList, setGratitudeList] = React.useState<string[]>(['']);
  const [priorities, setPriorities] = React.useState<string[]>(['']);

  // UI state
  const [isPromptModalOpen, setIsPromptModalOpen] = React.useState(false);
  
  // AI insights state
  const [aiInsights, setAiInsights] = React.useState<AIInsights | undefined>();
  const [isGeneratingInsights, setIsGeneratingInsights] = React.useState(false);
  const [insightsError, setInsightsError] = React.useState<string | null>(null);

  // Evening review state
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
    },
    priorityReview: {
      completedPriorities: [],
      reflection: ''
    }
  });

  // Decision analysis state
  const [decisionAnalysis, setDecisionAnalysis] = React.useState<JournalEntry['decision_analysis']>({
    question: '',
    factors: [],
    analysis: '',
    conclusion: ''
  });

  // Load entries on mount
  React.useEffect(() => {
    if (!userId) return;
    loadEntries();
  }, [loadEntries, userId]);

  // Handle URL parameters and routing
  React.useEffect(() => {
    if (location.pathname.endsWith('/morning') || location.pathname.endsWith('/evening')) {
      const type = location.pathname.split('/').pop() as JournalType;
      navigate(`/journal?type=${type}`, { replace: true });
      return;
    }

    const typeParam = new URLSearchParams(location.search).get('type');
    if (typeParam && ['morning', 'evening', 'decision'].includes(typeParam)) {
      setMode('edit');
      setJournalType(typeParam as JournalType);
    }
  }, [location, navigate]);

  // Load entry from URL
  React.useEffect(() => {
    const loadEntryFromUrl = async () => {
      if (!params.id) {
        setSelectedEntry(null);
        return;
      }
      
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
    };

    loadEntryFromUrl();
  }, [params.id, getEntry, navigate]);

  // Keyboard shortcuts
  useKeyboardShortcut({
    key: 'k',
    ctrlKey: true,
    handler: () => setMode(mode === 'search' ? 'home' : 'search')
  });

  const handleNewEntry = (type: JournalType) => {
    setJournalType(type);
    setMode('edit');
    navigate(`/journal?type=${type}`);
  };

  const handlePromptSelect = (prompt: string) => {
    if (journalType === 'morning') {
      setContent(prev => prev + `\n\n**${prompt}**\n`);
    } else if (journalType === 'evening') {
      setEveningContent(prev => ({
        ...prev,
        mainContent: prev.mainContent + `\n\n**${prompt}**\n`
      }));
    }
    setIsPromptModalOpen(false);
  };

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

  const handleEveningContentChange = async (newContent: EveningReviewContent) => {
    setEveningContent(newContent);
    
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

  const handleSave = async () => {
    if (!userId) return;
  
    const entry: Omit<JournalEntry, 'id'> = {
      date: new Date().toISOString(),
      user_id: userId,
      tags,
      type: journalType,  // Make sure this matches the database constraint
      mood: mood ?? undefined,
      content: journalType === 'decision' 
        ? JSON.stringify(decisionAnalysis)  // Add this line to store decision analysis as content
        : journalType === 'evening'
        ? JSON.stringify(eveningContent)
        : content,
      intention: journalType === 'morning' ? intention : '',
      gratitudeList: journalType === 'morning' ? gratitudeList.filter(Boolean) : [],
      priorities: journalType === 'morning' ? priorities.filter(Boolean) : [],
      decision_analysis: journalType === 'decision' ? decisionAnalysis : undefined,
      ai_insights: aiInsights
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

  const handleDeleteEntry = async (entry: JournalEntry) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    
    await deleteEntry(entry.id!);
    await loadEntries();
  };

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {mode === 'search' ? 'Journal Entries' :
           mode === 'edit' ? (journalType === 'morning' ? 'Morning Reflection' :
                            journalType === 'evening' ? 'Evening Review' :
                            'Decision Analysis') :
           mode === 'view' ? 'Journal Entry' : 'Journal'}
        </h1>
        
        <button
          onClick={() => setMode(mode === 'search' ? 'home' : 'search')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <Search className="h-5 w-5" />
          {mode === 'search' ? 'Back to Journal' : 'Search Entries'}
        </button>
      </div>

      {mode === 'search' && (
        <JournalSearch
          entries={entries}
          onEntryClick={(entry) => navigate(`/journal/${entry.id}`)}
          onDeleteEntry={handleDeleteEntry}
        />
      )}

      {mode === 'home' && (
        <JournalHome
          entries={entries}
          onNewEntry={handleNewEntry}
          onViewEntry={(entry) => navigate(`/journal/${entry.id}`)}
        />
      )}

      {mode === 'view' && selectedEntry && (
        <JournalEntryView
          entry={selectedEntry}
          onClose={() => {
            setMode('home');
            navigate('/journal');
            setSelectedEntry(null);  // Move this to the end
          }}
          onDelete={() => handleDeleteEntry(selectedEntry)}
        />
      )}

      {mode === 'edit' && (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {journalType === 'decision' 
                ? 'What decision are you analyzing?'
                : `How are you feeling this ${journalType === 'morning' ? 'morning' : 'evening'}?`}
            </h2>
            {journalType !== 'decision' && (
              <MoodSelector selectedMood={mood} onSelectMood={setMood} />
            )}
          </div>

          {journalType === 'morning' && (
            <MorningReflection
              content={content}
              onContentChange={setContent}
              onContentBlur={handleContentBlur}
              intention={intention}
              onIntentionChange={setIntention}
              gratitudeList={gratitudeList}
              onGratitudeListChange={setGratitudeList}
              onOpenPromptLibrary={() => setIsPromptModalOpen(true)}
              onPromptSelect={handlePromptSelect}
              priorities={priorities}
              onPrioritiesChange={setPriorities}
            />
          )}

          {(journalType === 'morning' || journalType === 'evening') && (
            <div className="mt-8">
              <AIInsightsSection
                insights={aiInsights}
                isLoading={isGeneratingInsights}
                error={insightsError}
                onRefresh={journalType === 'morning' ? handleContentBlur : undefined}
              />
            </div>
          )}

          {journalType === 'evening' && (
            <EveningReview
              onContentChange={handleEveningContentChange}
              initialContent={eveningContent}
              onOpenPromptLibrary={() => setIsPromptModalOpen(true)}
              onPromptSelect={handlePromptSelect}
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
            onSelectPrompt={handlePromptSelect}
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
      )}
    </div>
  );
};

export default Journal;