-- Check and update existing tables
DO $$ 
BEGIN
  -- Add missing columns and constraints to big_goals if they don't exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'big_goals') THEN
    -- Add stoic_analysis if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'big_goals' AND column_name = 'stoic_analysis') THEN
      ALTER TABLE big_goals ADD COLUMN stoic_analysis jsonb DEFAULT '{}';
    END IF;
    
    -- Add updated_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'big_goals' AND column_name = 'updated_at') THEN
      ALTER TABLE big_goals ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;
  END IF;

  -- Add missing columns and constraints to checkpoint_goals if they don't exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'checkpoint_goals') THEN
    -- Add blockers if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'checkpoint_goals' AND column_name = 'blockers') THEN
      ALTER TABLE checkpoint_goals ADD COLUMN blockers text[] DEFAULT '{}';
    END IF;
    
    -- Add updated_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'checkpoint_goals' AND column_name = 'updated_at') THEN
      ALTER TABLE checkpoint_goals ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;
  END IF;

  -- Add missing columns and constraints to daily_systems if they don't exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'daily_systems') THEN
    -- Add time_of_day if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_systems' AND column_name = 'time_of_day') THEN
      ALTER TABLE daily_systems ADD COLUMN time_of_day text CHECK (time_of_day IN ('morning', 'afternoon', 'evening'));
    END IF;
    
    -- Add updated_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_systems' AND column_name = 'updated_at') THEN
      ALTER TABLE daily_systems ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;
  END IF;

  -- Add missing columns and constraints to anti_goals if they don't exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'anti_goals') THEN
    -- Add impact_level if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'anti_goals' AND column_name = 'impact_level') THEN
      ALTER TABLE anti_goals ADD COLUMN impact_level text NOT NULL DEFAULT 'medium' CHECK (impact_level IN ('low', 'medium', 'high'));
    END IF;
    
    -- Add updated_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'anti_goals' AND column_name = 'updated_at') THEN
      ALTER TABLE anti_goals ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;
  END IF;

  -- Add missing columns and constraints to monthly_reviews if they don't exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'monthly_reviews') THEN
    -- Add stoic_reflection if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_reviews' AND column_name = 'stoic_reflection') THEN
      ALTER TABLE monthly_reviews ADD COLUMN stoic_reflection text;
    END IF;
    
    -- Add updated_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_reviews' AND column_name = 'updated_at') THEN
      ALTER TABLE monthly_reviews ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;
  END IF;

  -- Add missing columns and constraints to goal_reflections if they don't exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'goal_reflections') THEN
    -- Add control_analysis if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'goal_reflections' AND column_name = 'control_analysis') THEN
      ALTER TABLE goal_reflections ADD COLUMN control_analysis jsonb NOT NULL DEFAULT '{}';
    END IF;
    
    -- Add virtue_alignment if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'goal_reflections' AND column_name = 'virtue_alignment') THEN
      ALTER TABLE goal_reflections ADD COLUMN virtue_alignment jsonb NOT NULL DEFAULT '{}';
    END IF;
  END IF;

  -- Ensure RLS is enabled on all tables
  ALTER TABLE IF EXISTS big_goals ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS checkpoint_goals ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS daily_systems ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS anti_goals ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS abc_tracking ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS monthly_reviews ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS goal_reflections ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist (to avoid conflicts)
  DROP POLICY IF EXISTS "Users can manage their own big goals" ON big_goals;
  DROP POLICY IF EXISTS "Users can manage their own checkpoint goals" ON checkpoint_goals;
  DROP POLICY IF EXISTS "Users can manage their own daily systems" ON daily_systems;
  DROP POLICY IF EXISTS "Users can manage their own anti goals" ON anti_goals;
  DROP POLICY IF EXISTS "Users can manage their own ABC tracking" ON abc_tracking;
  DROP POLICY IF EXISTS "Users can manage their own monthly reviews" ON monthly_reviews;
  DROP POLICY IF EXISTS "Users can manage their own goal reflections" ON goal_reflections;

  -- Create or update policies
  CREATE POLICY "Users can manage their own big goals"
    ON big_goals FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can manage their own checkpoint goals"
    ON checkpoint_goals FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can manage their own daily systems"
    ON daily_systems FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can manage their own anti goals"
    ON anti_goals FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can manage their own ABC tracking"
    ON abc_tracking FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can manage their own monthly reviews"
    ON monthly_reviews FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can manage their own goal reflections"
    ON goal_reflections FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  -- Create or update indexes
  DROP INDEX IF EXISTS big_goals_user_id_idx;
  DROP INDEX IF EXISTS checkpoint_goals_user_id_idx;
  DROP INDEX IF EXISTS checkpoint_goals_big_goal_id_idx;
  DROP INDEX IF EXISTS daily_systems_user_id_idx;
  DROP INDEX IF EXISTS daily_systems_checkpoint_goal_id_idx;
  DROP INDEX IF EXISTS anti_goals_user_id_idx;
  DROP INDEX IF EXISTS abc_tracking_user_date_idx;
  DROP INDEX IF EXISTS abc_tracking_system_id_idx;
  DROP INDEX IF EXISTS monthly_reviews_user_month_idx;
  DROP INDEX IF EXISTS goal_reflections_user_id_idx;
  DROP INDEX IF EXISTS goal_reflections_goal_id_idx;

  CREATE INDEX IF NOT EXISTS big_goals_user_id_idx ON big_goals (user_id);
  CREATE INDEX IF NOT EXISTS checkpoint_goals_user_id_idx ON checkpoint_goals (user_id);
  CREATE INDEX IF NOT EXISTS checkpoint_goals_big_goal_id_idx ON checkpoint_goals (big_goal_id);
  CREATE INDEX IF NOT EXISTS daily_systems_user_id_idx ON daily_systems (user_id);
  CREATE INDEX IF NOT EXISTS daily_systems_checkpoint_goal_id_idx ON daily_systems (checkpoint_goal_id);
  CREATE INDEX IF NOT EXISTS anti_goals_user_id_idx ON anti_goals (user_id);
  CREATE INDEX IF NOT EXISTS abc_tracking_user_date_idx ON abc_tracking (user_id, date);
  CREATE INDEX IF NOT EXISTS abc_tracking_system_id_idx ON abc_tracking (system_id);
  CREATE INDEX IF NOT EXISTS monthly_reviews_user_month_idx ON monthly_reviews (user_id, month);
  CREATE INDEX IF NOT EXISTS goal_reflections_user_id_idx ON goal_reflections (user_id);
  CREATE INDEX IF NOT EXISTS goal_reflections_goal_id_idx ON goal_reflections (goal_id);

END $$;