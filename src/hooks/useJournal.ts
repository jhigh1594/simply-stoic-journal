import { useState, useCallback } from 'react';
import { journalService } from '../services/journal';
import type { JournalEntry } from '../types/journal';
import { useAsyncAction } from './useAsyncAction';
import { useAuth } from './useAuth';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const { userId } = useAuth();
  const { isLoading, error, execute } = useAsyncAction();

  const loadEntries = useCallback(async () => {
    const data = await execute(() => journalService.getEntries());
    if (data && Array.isArray(data)) {
      setEntries(data);
    }
  }, [execute]);

  const getEntry = useCallback(async (id: string) => {
    const data = await execute(() => journalService.getEntry(id));
    return data;
  }, [execute]);

  const createEntry = useCallback(async (entry: Omit<JournalEntry, 'id'>) => {
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const data = await execute(() => journalService.createEntry({
      ...entry,
      user_id: userId,
      date: new Date().toISOString()
    }));

    if (data && typeof data === 'object' && 'id' in data) {
      setEntries(prev => [data as JournalEntry, ...prev]);
      return data as JournalEntry;
    }
  }, [execute, userId]);

  const updateEntry = useCallback(async (id: string, updates: Partial<Omit<JournalEntry, 'id'>>) => {
    const data = await execute(() => journalService.updateEntry(id, updates));
    if (data) {
      setEntries(prev => prev.map(entry => 
        entry.id === id ? { ...entry, ...data } : entry
      ));
      return data;
    }
  }, [execute]);

  const deleteEntry = useCallback(async (id: string) => {
    await execute(() => journalService.deleteEntry(id));
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, [execute]);

  const searchEntries = useCallback(async (query: string) => {
    const data = await execute(() => journalService.searchEntries(query));
    if (data && Array.isArray(data)) {
      setEntries(data as JournalEntry[]);
    }
  }, [execute]);

  return {
    entries,
    isLoading,
    error,
    loadEntries,
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry,
    searchEntries
  };
}