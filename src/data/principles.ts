import type { Principle } from '../types/library';

export const principles: Principle[] = [
  {
    id: 'dichotomy-of-control',
    title: 'Dichotomy of Control',
    description: 'Focus on what you can control, accept what you cannot.',
    key_points: [
      'Distinguish between what is in our power and what is not',
      'Direct energy only towards what we can influence',
      'Find peace in accepting what is beyond our control'
    ],
    application: 'When facing challenges, first identify what aspects are within your control. Focus your efforts there, while practicing acceptance of external circumstances.',
    historical_context: 'This principle was central to Epictetus\'s teachings, featured prominently in his Enchiridion.'
  },
  {
    id: 'amor-fati',
    title: 'Amor Fati',
    description: 'Love of fate - embracing whatever happens as necessary and beneficial.',
    key_points: [
      'Accept events as they unfold',
      'Find opportunity in adversity',
      'Transform obstacles into advantages'
    ],
    application: 'Instead of resisting unwanted circumstances, look for ways to use them for growth and development.',
    historical_context: 'A concept embraced by Nietzsche and the Stoics, particularly Marcus Aurelius in his reflections.'
  },
  {
    id: 'negative-visualization',
    title: 'Negative Visualization',
    description: 'Premeditatio malorum - contemplating potential adversities to build resilience.',
    key_points: [
      'Regularly imagine losing what you value',
      'Prepare mentally for challenges',
      'Cultivate gratitude through contrast'
    ],
    application: 'Spend a few moments each day imagining life without something you value, then experience renewed appreciation for having it.',
    historical_context: 'A practice advocated by Seneca and other Stoics as a way to maintain perspective and prepare for life\'s challenges.'
  },
  {
    id: 'self-discipline',
    title: 'Self-Discipline',
    description: 'Cultivating mastery over desires and impulses through voluntary discomfort.',
    key_points: [
      'Practice voluntary hardship',
      'Delay gratification intentionally',
      'Build resilience through small challenges'
    ],
    application: 'Regularly undertake small acts of self-denial to strengthen your will and reduce dependence on comfort.',
    historical_context: 'Musonius Rufus particularly emphasized this practice, teaching that self-discipline was essential for philosophical progress.'
  },
  {
    id: 'living-according-to-nature',
    title: 'Living According to Nature',
    description: 'Aligning our actions with the natural order and reason.',
    key_points: [
      'Understand and accept natural laws',
      'Act in harmony with reason',
      'Fulfill our roles with excellence'
    ],
    application: 'Examine your actions and choices to ensure they align with rational principles and natural laws rather than artificial desires.',
    historical_context: 'A foundational principle in Stoic philosophy, emphasized by Zeno and developed by later Stoics as a guide for ethical living.'
  }
];