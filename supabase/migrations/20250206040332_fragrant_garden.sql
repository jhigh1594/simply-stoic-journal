/*
  # Seed Library Data

  1. New Data
    - Initial quotes from Stoic philosophers
    - Initial Stoic practices and exercises
  
  2. Changes
    - Add seed data for quotes table
    - Add seed data for practices table
*/

-- Seed quotes table with initial data
INSERT INTO quotes (text, author, source, tags, likes, created_at)
VALUES
  ('The happiness of your life depends upon the quality of your thoughts.', 'Marcus Aurelius', 'Meditations', ARRAY['happiness', 'mindset'], 0, now()),
  ('We suffer more often in imagination than in reality.', 'Seneca', 'Letters from a Stoic', ARRAY['anxiety', 'perspective'], 0, now()),
  ('The chief task in life is simply this: to identify and separate matters so that I can say clearly to myself which are externals not under my control, and which have to do with the choices I actually control.', 'Epictetus', 'Discourses', ARRAY['control', 'choice'], 0, now()),
  ('Waste no more time arguing about what a good man should be. Be one.', 'Marcus Aurelius', 'Meditations', ARRAY['action', 'virtue'], 0, now()),
  ('Don''t explain your philosophy. Embody it.', 'Epictetus', 'Discourses', ARRAY['action', 'example'], 0, now()),
  ('The impediment to action advances action. What stands in the way becomes the way.', 'Marcus Aurelius', 'Meditations', ARRAY['obstacles', 'perspective'], 0, now()),
  ('How long are you going to wait before you demand the best for yourself?', 'Epictetus', 'Discourses', ARRAY['self-improvement', 'motivation'], 0, now()),
  ('You have power over your mind - not outside events. Realize this, and you will find strength.', 'Marcus Aurelius', 'Meditations', ARRAY['control', 'mindset'], 0, now()),
  ('First say to yourself what you would be; then do what you have to do.', 'Epictetus', 'Discourses', ARRAY['action', 'self-improvement'], 0, now()),
  ('The best revenge is not to be like your enemy.', 'Marcus Aurelius', 'Meditations', ARRAY['virtue', 'wisdom'], 0, now())
ON CONFLICT DO NOTHING;

-- Seed practices table with initial data
INSERT INTO practices (title, description, instructions, tips, category, likes, created_at)
VALUES
  (
    'Morning Premeditatio Malorum',
    'Prepare for potential challenges by visualizing them in advance',
    'Each morning, take a few minutes to consider what challenges or difficulties you might face during the day. Visualize yourself responding to these challenges with wisdom, patience, and virtue. This practice helps reduce anxiety and prepares you to handle difficulties with grace.',
    ARRAY[
      'Start with small, likely challenges',
      'Focus on your response rather than the challenge itself',
      'Remember that this is a preparation, not a prediction'
    ],
    'morning',
    0,
    now()
  ),
  (
    'Evening Review',
    'Reflect on your actions and decisions at the end of each day',
    'Before bed, review your day''s actions and choices. Consider what you did well, where you could improve, and what lessons you can take forward.',
    ARRAY[
      'Be honest but not judgmental',
      'Focus on what you can learn',
      'Consider how to apply these lessons tomorrow'
    ],
    'evening',
    0,
    now()
  ),
  (
    'View From Above',
    'Gain perspective by imagining events from a cosmic viewpoint',
    'Imagine yourself rising above your current situation, seeing it from increasingly higher vantage points. Consider how your concerns might appear from these broader perspectives.',
    ARRAY[
      'Start with your immediate surroundings',
      'Gradually expand your view',
      'Notice how your perspective changes'
    ],
    'general',
    0,
    now()
  ),
  (
    'Negative Visualization',
    'Practice appreciating what you have by imagining its loss',
    'Select something or someone you value. Spend a few minutes imagining what life would be like without them. Then, return to the present moment with renewed appreciation.',
    ARRAY[
      'Start with simple material possessions',
      'Progress to more meaningful aspects of life',
      'Use this to cultivate genuine gratitude'
    ],
    'general',
    0,
    now()
  ),
  (
    'Voluntary Discomfort',
    'Build resilience through intentional challenges',
    'Choose a minor comfort to temporarily forgo. This might be taking a cold shower, skipping a meal, or sleeping on the floor. Observe your reactions and strengthen your ability to handle discomfort.',
    ARRAY[
      'Start with small challenges',
      'Focus on your mental response',
      'Gradually increase difficulty'
    ],
    'general',
    0,
    now()
  )
ON CONFLICT DO NOTHING;