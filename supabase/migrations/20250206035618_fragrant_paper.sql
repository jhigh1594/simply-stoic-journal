/*
  # Integrate Daily Priorities with Journal Entries

  1. Changes
    - Add daily_priorities_id reference to journal_entries table
    - Add foreign key constraint
    - Add index for performance

  2. Security
    - No changes to RLS policies needed
*/

DO $$ BEGIN
  -- Add daily_priorities_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries'
    AND column_name = 'daily_priorities_id'
  ) THEN
    ALTER TABLE journal_entries
      ADD COLUMN daily_priorities_id uuid REFERENCES daily_priorities(id);

    -- Create index for the foreign key
    CREATE INDEX IF NOT EXISTS journal_entries_daily_priorities_id_idx
      ON journal_entries(daily_priorities_id);
  END IF;
END $$;