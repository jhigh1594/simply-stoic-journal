import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://lecszzzhqewdrpsbiihq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlY3N6enpocWV3ZHJwc2JpaWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMTc1NTUsImV4cCI6MjA1MTc5MzU1NX0.lVCbhxKddY-OC8G67DUdPI312nbLEvnm0O8yuLg3Dr0';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});