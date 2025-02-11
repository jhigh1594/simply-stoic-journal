import React from 'react';
import { Target, Brain, Scale, Sparkles, ArrowRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { JournalEntry } from '../../../types/journal';

interface Factor {
  text: string;
  type: 'controllable' | 'uncontrollable';
  impact: 'high' | 'medium' | 'low';
}

interface DecisionAnalysisProps {
  value?: JournalEntry['decision_analysis'];
  onChange: (value: JournalEntry['decision_analysis']) => void;
}

function DecisionAnalysis({ value, onChange }: DecisionAnalysisProps) {
  const [step, setStep] = React.useState(1);
  const [question, setQuestion] = React.useState(value?.question || '');
  const [factors, setFactors] = React.useState<Factor[]>(value?.factors || []);
  const [newFactor, setNewFactor] = React.useState('');
  const [analysis, setAnalysis] = React.useState(value?.analysis || '');
  const [conclusion, setConclusion] = React.useState(value?.conclusion || '');

  const handleAddFactor = (type: Factor['type']) => {
    if (!newFactor.trim()) return;
    
    const factor: Factor = {
      text: newFactor.trim(),
      type,
      impact: 'medium'
    };
    
    const updatedFactors = [...factors, factor];
    setFactors(updatedFactors);
    setNewFactor('');
    
    onChange({
      question,
      factors: updatedFactors,
      analysis,
      conclusion
    });
  };

  const handleUpdateFactor = (index: number, updates: Partial<Factor>) => {
    const updatedFactors = factors.map((factor, i) =>
      i === index ? { ...factor, ...updates } : factor
    );
    setFactors(updatedFactors);
    onChange({
      question,
      factors: updatedFactors,
      analysis,
      conclusion
    });
  };

  const handleRemoveFactor = (index: number) => {
    const updatedFactors = factors.filter((_, i) => i !== index);
    setFactors(updatedFactors);
    onChange({
      question,
      factors: updatedFactors,
      analysis,
      conclusion
    });
  };

  const steps = [
    {
      title: 'Define the Decision',
      description: 'What specific decision are you trying to make?',
      icon: Target
    },
    {
      title: 'Identify Factors',
      description: 'List all relevant factors, both within and outside your control',
      icon: Brain
    },
    {
      title: 'Analyze',
      description: 'Examine each factor through Stoic principles',
      icon: Scale
    },
    {
      title: 'Conclude',
      description: 'Determine your path forward based on virtue and reason',
      icon: Sparkles
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 relative">
            <button
              onClick={() => setStep(i + 1)}
              className={`flex flex-col items-center ${
                step === i + 1 ? 'opacity-100' : 'opacity-50 hover:opacity-75'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step === i + 1 ? 'bg-black text-white' : 'bg-gray-100'
              }`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-medium text-center">{s.title}</div>
              <div className="text-xs text-gray-500 text-center max-w-[120px]">
                {s.description}
              </div>
            </button>
            {i < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-[2px] bg-gray-200">
                <div
                  className="h-full bg-black transition-all"
                  style={{ width: step > i + 1 ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-medium mb-4">What decision are you analyzing?</h2>
          <textarea
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              onChange({ question: e.target.value, factors, analysis, conclusion });
            }}
            placeholder="Enter your decision question..."
            className="w-full p-4 border rounded-lg focus:outline-none focus:border-black min-h-[100px] resize-none"
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setStep(2)}
              disabled={!question.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              Next Step
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-medium mb-4">Identify Relevant Factors</h2>
          <p className="text-gray-600 mb-4">
            List all factors that influence this decision. Categorize them as either within your control
            (controllable) or outside your control (uncontrollable).
          </p>
          
          {/* Add new factor */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newFactor}
              onChange={(e) => setNewFactor(e.target.value)}
              placeholder="Add a factor..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFactor('controllable');
                }
              }}
            />
            <button
              onClick={() => handleAddFactor('controllable')}
              className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
            >
              Controllable
            </button>
            <button
              onClick={() => handleAddFactor('uncontrollable')}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
            >
              Uncontrollable
            </button>
          </div>

          {/* Factors list */}
          <div className="space-y-4 mb-6">
            {factors.map((factor, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  factor.type === 'controllable'
                    ? 'bg-green-50 border-green-100'
                    : 'bg-blue-50 border-blue-100'
                } border`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium mb-2">{factor.text}</div>
                    <div className="flex items-center gap-4">
                      <select
                        value={factor.type}
                        onChange={(e) => handleUpdateFactor(index, {
                          type: e.target.value as Factor['type']
                        })}
                        className="text-sm px-2 py-1 rounded border bg-white"
                      >
                        <option value="controllable">Controllable</option>
                        <option value="uncontrollable">Uncontrollable</option>
                      </select>
                      <select
                        value={factor.impact}
                        onChange={(e) => handleUpdateFactor(index, {
                          impact: e.target.value as Factor['impact']
                        })}
                        className="text-sm px-2 py-1 rounded border bg-white"
                      >
                        <option value="high">High Impact</option>
                        <option value="medium">Medium Impact</option>
                        <option value="low">Low Impact</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFactor(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={factors.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              Next Step
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-lg font-medium mb-4">Stoic Analysis</h2>
          <p className="text-gray-600 mb-4">
            Analyze your decision through Stoic principles. Consider virtue, wisdom, justice, and self-control.
          </p>
          <textarea
            value={analysis}
            onChange={(e) => {
              setAnalysis(e.target.value);
              onChange({ question, factors, analysis: e.target.value, conclusion });
            }}
            placeholder="Write your analysis here..."
            className="w-full p-4 border rounded-lg focus:outline-none focus:border-black min-h-[200px] resize-none"
          />
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!analysis.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              Next Step
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-lg font-medium mb-4">Conclusion</h2>
          <p className="text-gray-600 mb-4">
            Based on your analysis and Stoic principles, what is your reasoned decision?
          </p>
          <textarea
            value={conclusion}
            onChange={(e) => {
              setConclusion(e.target.value);
              onChange({ question, factors, analysis, conclusion: e.target.value });
            }}
            placeholder="Write your conclusion here..."
            className="w-full p-4 border rounded-lg focus:outline-none focus:border-black min-h-[200px] resize-none"
          />
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default DecisionAnalysis;