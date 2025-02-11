/*
  # Update journal entries schema

  1. Changes
    - Add default values for content and intention
    - Add array constraints for priorities and tags
    - Add default empty JSON for ai_insights
*/

-- Set default values for text columns
ALTER TABLE journal_entries
  ALTER COLUMN content SET DEFAULT '',
  ALTER COLUMN intention SET DEFAULT '';

-- Set default values for array columns
ALTER TABLE journal_entries
  ALTER COLUMN priorities SET DEFAULT '{}',
  ALTER COLUMN tags SET DEFAULT '{}';

-- Add ai_insights column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' 
    AND column_name = 'ai_insights'
  ) THEN
    ALTER TABLE journal_entries 
      ADD COLUMN ai_insights jsonb DEFAULT '{}';
  END IF;
END $$;

-- Drop existing constraints if they exist
DO $$ BEGIN
  ALTER TABLE journal_entries DROP CONSTRAINT IF EXISTS valid_priorities;
  ALTER TABLE journal_entries DROP CONSTRAINT IF EXISTS valid_tags;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add array length constraints
ALTER TABLE journal_entries
  ADD CONSTRAINT valid_priorities CHECK (array_length(priorities, 1) <= 3),
  ADD CONSTRAINT valid_tags CHECK (array_length(tags, 1) <= 10);