DO $$ BEGIN
  -- Create daily priorities table if it doesn't exist
  CREATE TABLE IF NOT EXISTS daily_priorities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    date date NOT NULL,
    priorities text[] NOT NULL DEFAULT '{}',
    completed_priorities text[] NOT NULL DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Add constraint to limit priorities array length
    CONSTRAINT valid_priorities_length CHECK (array_length(priorities, 1) <= 3),
    
    -- Add unique constraint for user_id + date combination
    UNIQUE(user_id, date)
  );

  -- Create indexes if they don't exist
  CREATE INDEX IF NOT EXISTS daily_priorities_user_id_idx ON daily_priorities(user_id);
  CREATE INDEX IF NOT EXISTS daily_priorities_date_idx ON daily_priorities(date);

  -- Enable RLS
  ALTER TABLE daily_priorities ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can manage their own daily priorities" ON daily_priorities;

  -- Create policies
  CREATE POLICY "Users can manage their own daily priorities"
    ON daily_priorities FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;