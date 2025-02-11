/*
  # Update journal entries columns

  1. Changes
    - Rename gratitude_list to gratitudeList
    - Add NOT NULL constraints and default values
    - Update array length constraints

  2. Security
    - No changes to RLS policies
*/

DO $$ BEGIN
  -- Rename gratitude_list to gratitudeList if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' 
    AND column_name = 'gratitude_list'
  ) THEN
    ALTER TABLE journal_entries 
      RENAME COLUMN gratitude_list TO "gratitudeList";
  END IF;
END $$;

-- Add NOT NULL constraints and default values
ALTER TABLE journal_entries
  ALTER COLUMN content SET NOT NULL,
  ALTER COLUMN content SET DEFAULT '',
  ALTER COLUMN intention SET NOT NULL,
  ALTER COLUMN intention SET DEFAULT '',
  ALTER COLUMN "gratitudeList" SET NOT NULL,
  ALTER COLUMN "gratitudeList" SET DEFAULT '{}',
  ALTER COLUMN priorities SET NOT NULL,
  ALTER COLUMN priorities SET DEFAULT '{}',
  ALTER COLUMN tags SET NOT NULL,
  ALTER COLUMN tags SET DEFAULT '{}',
  ALTER COLUMN ai_insights SET NOT NULL,
  ALTER COLUMN ai_insights SET DEFAULT '{}';

-- Drop existing constraints if they exist
DO $$ BEGIN
  ALTER TABLE journal_entries DROP CONSTRAINT IF EXISTS valid_gratitude_list;
  ALTER TABLE journal_entries DROP CONSTRAINT IF EXISTS valid_priorities;
  ALTER TABLE journal_entries DROP CONSTRAINT IF EXISTS valid_tags;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add array length constraints
ALTER TABLE journal_entries
  ADD CONSTRAINT valid_gratitude_list CHECK (array_length("gratitudeList", 1) <= 3),
  ADD CONSTRAINT valid_priorities CHECK (array_length(priorities, 1) <= 3),
  ADD CONSTRAINT valid_tags CHECK (array_length(tags, 1) <= 10);