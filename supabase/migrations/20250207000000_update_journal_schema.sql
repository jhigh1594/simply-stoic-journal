-- Update journal_entries table to handle all entry types
ALTER TABLE journal_entries
  -- Update type check to include decision type
  DROP CONSTRAINT IF EXISTS journal_entries_type_check;

ALTER TABLE journal_entries
  ADD CONSTRAINT journal_entries_type_check 
  CHECK (type IN ('morning', 'evening', 'decision'));

-- Add decision analysis column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' 
    AND column_name = 'decision_analysis'
  ) THEN
    ALTER TABLE journal_entries 
      ADD COLUMN decision_analysis jsonb DEFAULT '{}';
  END IF;
END $$;

-- Rename gratitudeList back to gratitude_list for consistency
ALTER TABLE journal_entries 
  RENAME COLUMN "gratitudeList" TO gratitude_list;

-- Update constraints
ALTER TABLE journal_entries
  ALTER COLUMN content SET DEFAULT '',
  ALTER COLUMN intention SET DEFAULT '',
  ALTER COLUMN gratitude_list SET DEFAULT '{}',
  ALTER COLUMN priorities SET DEFAULT '{}',
  ALTER COLUMN tags SET DEFAULT '{}',
  ALTER COLUMN ai_insights SET DEFAULT '{}',
  ALTER COLUMN decision_analysis SET DEFAULT '{}';

-- Add array length constraints
ALTER TABLE journal_entries
  ADD CONSTRAINT valid_gratitude_list CHECK (array_length(gratitude_list, 1) <= 3),
  ADD CONSTRAINT valid_priorities CHECK (array_length(priorities, 1) <= 3),
  ADD CONSTRAINT valid_tags CHECK (array_length(tags, 1) <= 10);