import type { Practice } from '../types/library';

export const practices: Practice[] = [
  {
    id: '1',
    title: 'Morning Premeditatio Malorum',
    description: 'Prepare for potential challenges by visualizing them in advance',
    instructions: 'Each morning, take a few minutes to consider what challenges or difficulties you might face during the day. Visualize yourself responding to these challenges with wisdom, patience, and virtue. This practice helps reduce anxiety and prepares you to handle difficulties with grace.',
    tips: [
      'Start with small, likely challenges',
      'Focus on your response rather than the challenge itself',
      'Remember that this is a preparation, not a prediction'
    ],
    category: 'morning',
    is_community: false,
    likes: 0
  },
  {
    id: '2',
    title: 'Evening Review',
    description: 'Reflect on your actions and decisions at the end of each day',
    instructions: 'Before bed, review your day\'s actions and choices. Consider what you did well, where you could improve, and what lessons you can take forward.',
    tips: [
      'Be honest but not judgmental',
      'Focus on what you can learn',
      'Consider how to apply these lessons tomorrow'
    ],
    category: 'evening'
  },
  {
    id: '3',
    title: 'View From Above',
    description: 'Gain perspective by imagining events from a cosmic viewpoint',
    instructions: 'Imagine yourself rising above your current situation, seeing it from increasingly higher vantage points. Consider how your concerns might appear from these broader perspectives.',
    tips: [
      'Start with your immediate surroundings',
      'Gradually expand your view',
      'Notice how your perspective changes'
    ],
    category: 'general',
    is_community: false,
    likes: 0
  },
  {
    id: '4',
    title: 'Morning Gratitude',
    description: 'Begin your day by acknowledging what you are grateful for',
    instructions: 'Take a moment to reflect on three things you are truly grateful for. These can be simple everyday things or profound aspects of your life.',
    tips: [
      'Be specific in your gratitude',
      'Include both small and large things',
      'Consider why each thing matters to you'
    ],
    category: 'morning'
  },
  {
    id: '5',
    title: 'Evening Gratitude',
    description: 'End your day by acknowledging what you are grateful for',
    instructions: 'Reflect on three things that happened today that you are grateful for. This helps train your mind to notice the good in each day.',
    tips: [
      'Include unexpected positive moments',
      'Consider challenges that taught you something',
      'Acknowledge people who helped you'
    ],
    category: 'evening'
  },
  {
    id: '6',
    title: 'Negative Visualization',
    description: 'Practice appreciating what you have by imagining its loss',
    instructions: 'Select something or someone you value. Spend a few minutes imagining what life would be like without them. Then, return to the present moment with renewed appreciation.',
    tips: [
      'Start with simple material possessions',
      'Progress to more meaningful aspects of life',
      'Use this to cultivate genuine gratitude'
    ],
    category: 'general'
  },
  {
    id: '7',
    title: 'Voluntary Discomfort',
    description: 'Build resilience through intentional challenges',
    instructions: 'Choose a minor comfort to temporarily forgo. This might be taking a cold shower, skipping a meal, or sleeping on the floor. Observe your reactions and strengthen your ability to handle discomfort.',
    tips: [
      'Start with small challenges',
      'Focus on your mental response',
      'Gradually increase difficulty'
    ],
    category: 'general'
  },
  {
    id: '8',
    title: 'Role Model Reflection',
    description: 'Embody the virtues of those you admire',
    instructions: 'Think of someone whose character you admire. Identify their virtues and consider how you can incorporate these qualities into your own life.',
    tips: [
      'Choose both historical and personal role models',
      'Focus on specific virtues',
      'Consider how they would handle your situations'
    ],
    category: 'general'
  },
  {
    id: '9',
    title: 'Dichotomy of Control Analysis',
    description: 'Identify what is and isn\'t within your control',
    instructions: 'List your current concerns. For each item, clearly distinguish between what aspects you can control and what you cannot. Focus your energy only on what is within your control.',
    tips: [
      'Be honest about your sphere of influence',
      'Accept what you cannot change',
      'Create action plans for what you can control'
    ],
    category: 'general'
  },
  {
    id: '10',
    title: 'Fear Setting',
    description: 'Define and analyze your fears to reduce anxiety and make better decisions',
    instructions: 'Write down a fear or challenge you\'re facing. Then, follow these three steps: 1) Define the worst-case scenarios and potential preventive measures, 2) List ways you could repair the damage in each scenario, 3) Consider the cost of inaction and potential benefits of partial success.',
    tips: [
      'Be specific about your fears - avoid vague scenarios',
      'Focus on what you can control or influence',
      'Consider both short-term and long-term implications',
      'Write down concrete action steps for prevention and repair',
      'Remember that most fears are less devastating when examined closely'
    ],
    category: 'general'
  },
  {
    id: '11', // Fixed duplicate ID
    title: 'Self-Dialogue Writing',
    description: 'Examine your thoughts through written dialogue',
    instructions: 'Write a dialogue between yourself and your wiser self. Present your concerns and challenges, then respond with reason and wisdom.',
    tips: [
      'Write as if counseling a friend',
      'Challenge your assumptions',
      'Look for logical inconsistencies'
    ],
    category: 'general'
  }
];