insert into practices (
  title,
  description,
  instructions,
  tips,
  category,
  is_community,
  likes,
  created_at
) values (
  'Fear Setting',
  'Define and analyze your fears to reduce anxiety and make better decisions',
  'Write down a fear or challenge you''re facing. Then, follow these three steps: 1) Define the worst-case scenarios and potential preventive measures, 2) List ways you could repair the damage in each scenario, 3) Consider the cost of inaction and potential benefits of partial success.',
  ARRAY[
    'Be specific about your fears - avoid vague scenarios',
    'Focus on what you can control or influence',
    'Consider both short-term and long-term implications',
    'Write down concrete action steps for prevention and repair',
    'Remember that most fears are less devastating when examined closely'
  ],
  'general',
  false,
  0,
  now()
);