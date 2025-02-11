/*
  # Create journal entries table with tags and AI insights

  1. New Tables
    - `journal_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `type` (text) - 'morning' or 'evening'
      - `mood` (text)
      - `content` (text)
      - `intention` (text)
      - `gratitude_list` (text[])
      - `priorities` (text[])
      - `tags` (text[])
      - `ai_insights` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `journal_entries` table
    - Add policies for authenticated users to manage their own entries
*/

CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL CHECK (type IN ('morning', 'evening')),
  mood text,
  content text,
  intention text,
  gratitude_list text[],
  priorities text[],
  tags text[] DEFAULT '{}',
  ai_insights jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  
  -- Add a GIN index for fast tag searching
  CONSTRAINT valid_tags CHECK (array_length(tags, 1) <= 10)
);

CREATE INDEX IF NOT EXISTS journal_entries_tags_idx ON journal_entries USING GIN (tags);
CREATE INDEX IF NOT EXISTS journal_entries_created_at_idx ON journal_entries (created_at DESC);
CREATE INDEX IF NOT EXISTS journal_entries_user_id_idx ON journal_entries (user_id);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create their own entries"
  ON journal_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own entries"
  ON journal_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
  ON journal_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
  ON journal_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);