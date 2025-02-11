/*
  # Goals and Tasks Schema

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text)
      - `timeframe` (text: daily, weekly, quarterly)
      - `priority` (text: low, medium, high)
      - `status` (text: not_started, in_progress, completed)
      - `progress` (integer)
      - `due_date` (date)
      - `created_at` (timestamptz)

    - `sub_tasks`
      - `id` (uuid, primary key)
      - `goal_id` (uuid, references goals)
      - `title` (text)
      - `status` (text: pending, completed)
      - `created_at` (timestamptz)

    - `goal_templates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text)
      - `timeframe` (text)
      - `priority` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text,
  timeframe text NOT NULL CHECK (timeframe IN ('daily', 'weekly', 'quarterly')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  status text NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  due_date date,
  created_at timestamptz DEFAULT now()
);

-- Create sub_tasks table
CREATE TABLE IF NOT EXISTS sub_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- Create goal_templates table
CREATE TABLE IF NOT EXISTS goal_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text,
  timeframe text NOT NULL CHECK (timeframe IN ('daily', 'weekly', 'quarterly')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_templates ENABLE ROW LEVEL SECURITY;

-- Goals policies
CREATE POLICY "Users can create their own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Sub-tasks policies
CREATE POLICY "Users can manage sub-tasks for their goals"
  ON sub_tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM goals
      WHERE goals.id = goal_id
      AND goals.user_id = auth.uid()
    )
  );

-- Goal templates policies
CREATE POLICY "Users can create their own templates"
  ON goal_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own templates"
  ON goal_templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON goal_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON goal_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX goals_user_id_idx ON goals (user_id);
CREATE INDEX goals_timeframe_idx ON goals (timeframe);
CREATE INDEX goals_due_date_idx ON goals (due_date);
CREATE INDEX sub_tasks_goal_id_idx ON sub_tasks (goal_id);
CREATE INDEX goal_templates_user_id_idx ON goal_templates (user_id);