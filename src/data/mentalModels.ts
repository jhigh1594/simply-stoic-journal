import type { MentalModel } from '../types/library';

export const mentalModels: MentalModel[] = [
  {
    id: '1',
    title: 'Circle of Control',
    description: 'A framework for distinguishing between what we can control, what we can influence, and what is beyond our control.',
    category: 'perspective',
    key_principles: [
      'Focus energy only on what you can directly control',
      'Recognize areas of influence vs. complete control',
      'Accept and release what is beyond control',
      'Redirect energy from worry to action'
    ],
    examples: [
      {
        situation: 'A project deadline is approaching with many dependencies',
        application: 'Identify your direct controllables (your effort, communication, contingency planning) vs. external factors (others\' responses, unforeseen events)'
      },
      {
        situation: 'Dealing with a health challenge',
        application: 'Focus on controllables (diet, exercise, medication adherence) while accepting uncertainties in outcomes'
      }
    ],
    stoic_alignment: 'Directly aligns with Epictetus\'s core teaching about focusing solely on what is "up to us" and accepting what isn\'t.',
    likes: 0
  },
  {
    id: '2',
    title: 'Inversion Thinking',
    description: 'Approaching problems backward by focusing on what to avoid rather than what to achieve.',
    category: 'decision-making',
    key_principles: [
      'Consider what would make a situation worse',
      'Identify and eliminate obstacles to success',
      'Think in terms of prevention rather than achievement',
      'Use negative visualization to strengthen appreciation'
    ],
    examples: [
      {
        situation: 'Planning a major life decision',
        application: 'Instead of asking "What will make me happy?", ask "What would make me miserable?" and avoid those factors'
      },
      {
        situation: 'Building good habits',
        application: 'Focus on removing obstacles and friction rather than relying solely on willpower'
      }
    ],
    stoic_alignment: 'Mirrors the Stoic practice of negative visualization (premeditatio malorum) and focusing on character rather than outcomes.',
    likes: 0
  },
  {
    id: '3',
    title: 'Second-Order Thinking',
    description: 'Looking beyond the immediate consequences of decisions to understand their long-term and systemic effects.',
    category: 'systems',
    key_principles: [
      'Consider consequences of consequences',
      'Look for unintended effects',
      'Think in terms of systems and feedback loops',
      'Extend time horizons when evaluating decisions'
    ],
    examples: [
      {
        situation: 'Implementing a new habit',
        application: 'Consider not just the immediate benefit but how it might affect other habits, relationships, and long-term patterns'
      },
      {
        situation: 'Making a career decision',
        application: 'Look beyond salary to consider skill development, future opportunities, and lifestyle implications'
      }
    ],
    stoic_alignment: 'Connects with the Stoic emphasis on understanding the interconnected nature of all things and acting with wisdom.',
    likes: 0
  },
  {
    id: '4',
    title: 'Antifragility',
    description: 'Systems that gain from disorder and become stronger when exposed to stressors.',
    category: 'systems',
    key_principles: [
      'Embrace beneficial stressors',
      'Build systems that improve with challenges',
      'Maintain optionality',
      'Start small and iterate'
    ],
    examples: [
      {
        situation: 'Personal development',
        application: 'Deliberately seek out challenging situations that force growth and adaptation'
      },
      {
        situation: 'Building resilience',
        application: 'Practice voluntary discomfort to strengthen both mind and body'
      }
    ],
    stoic_alignment: 'Reflects the Stoic practice of voluntary discomfort and viewing obstacles as opportunities for growth.',
    likes: 0
  },
  {
    id: '5',
    title: 'Map is Not the Territory',
    description: 'Our mental models and beliefs about reality are not reality itself.',
    category: 'reasoning',
    key_principles: [
      'Distinguish between models and reality',
      'Remain open to updating beliefs',
      'Recognize the limitations of our knowledge',
      'Seek multiple perspectives'
    ],
    examples: [
      {
        situation: 'Holding strong opinions',
        application: 'Maintain intellectual humility by remembering that our understanding is always incomplete'
      },
      {
        situation: 'Interpreting others\' actions',
        application: 'Remember that our interpretation of events is just one possible model of reality'
      }
    ],
    stoic_alignment: 'Aligns with the Stoic emphasis on seeing things as they are and maintaining epistemic humility.',
    likes: 0
  }
];