/*
  # Add Library Features

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `text` (text)
      - `author` (text)
      - `source` (text)
      - `tags` (text[])
      - `user_id` (uuid, references auth.users)
      - `is_community` (boolean)
      - `likes` (integer)
      - `liked_by` (uuid[])
      - `created_at` (timestamptz)

    - `practices`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `instructions` (text)
      - `tips` (text[])
      - `category` (text)
      - `user_id` (uuid, references auth.users)
      - `is_community` (boolean)
      - `likes` (integer)
      - `liked_by` (uuid[])
      - `created_at` (timestamptz)

    - `practice_completions`
      - `id` (uuid, primary key)
      - `practice_id` (uuid, references practices)
      - `user_id` (uuid, references auth.users)
      - `notes` (text)
      - `completed_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create quotes table
CREATE TABLE quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  author text NOT NULL,
  source text,
  tags text[] DEFAULT '{}',
  user_id uuid REFERENCES auth.users(id),
  is_community boolean DEFAULT false,
  likes integer DEFAULT 0,
  liked_by uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create practices table
CREATE TABLE practices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  instructions text,
  tips text[] DEFAULT '{}',
  category text CHECK (category IN ('morning', 'evening', 'general')),
  user_id uuid REFERENCES auth.users(id),
  is_community boolean DEFAULT false,
  likes integer DEFAULT 0,
  liked_by uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create practice completions table
CREATE TABLE practice_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id uuid REFERENCES practices(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  notes text,
  completed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_completions ENABLE ROW LEVEL SECURITY;

-- Quotes policies
CREATE POLICY "Anyone can view quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create community quotes"
  ON quotes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND is_community = true);

CREATE POLICY "Users can update their own quotes"
  ON quotes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Practices policies
CREATE POLICY "Anyone can view practices"
  ON practices FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create community practices"
  ON practices FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND is_community = true);

CREATE POLICY "Users can update their own practices"
  ON practices FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Practice completions policies
CREATE POLICY "Users can view their own completions"
  ON practice_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create completions"
  ON practice_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX quotes_tags_idx ON quotes USING GIN (tags);
CREATE INDEX quotes_user_id_idx ON quotes (user_id);
CREATE INDEX quotes_is_community_idx ON quotes (is_community);
CREATE INDEX practices_user_id_idx ON practices (user_id);
CREATE INDEX practices_is_community_idx ON practices (is_community);
CREATE INDEX practice_completions_user_practice_idx ON practice_completions (user_id, practice_id);