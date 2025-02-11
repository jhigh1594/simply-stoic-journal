/*
  # Update journal entries RLS policies

  1. Security
    - Enable RLS on journal_entries table
    - Add policies for CRUD operations
    - Ensure users can only access their own entries
*/

-- Enable RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create their own entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can view their own entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can update their own entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can delete their own entries" ON journal_entries;

-- Create policies
CREATE POLICY "Users can create their own entries"
ON journal_entries FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own entries"
ON journal_entries FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
ON journal_entries FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
ON journal_entries FOR DELETE
TO authenticated
USING (auth.uid() = user_id);