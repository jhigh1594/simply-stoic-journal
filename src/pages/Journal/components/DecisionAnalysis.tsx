import React, { useState, useCallback } from 'react';
import { Target, Brain, Scale, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { JournalEntry } from '../../../types/journal';
// Remove the local interface and import it from gemini.ts
import { generateDecisionAnalysis, DecisionAnalysisResult } from '../../../lib/gemini';
import { createDecisionAnalysisPrompt, createImplementationPlanPrompt } from '../../../lib/prompts/journalPrompt';
import { generateActionPlan } from '../../../lib/gemini';  // Add generateActionPlan

interface Factor {
  text: string;
  type: 'controllable' | 'uncontrollable';
  impact: 'high' | 'medium' | 'low';
}

interface DecisionAnalysisProps {
  value?: JournalEntry['decision_analysis'];
  onChange: (value: JournalEntry['decision_analysis']) => void;
}

// Remove the local DecisionAnalysisResult interface since it's imported

function DecisionAnalysis({ value, onChange }: DecisionAnalysisProps) {
  // Add steps definition before state declarations
  const steps = [
    {
      title: 'Define Question',
      description: 'What decision are you analyzing?',
      icon: Target
    },
    {
      title: 'Identify Factors',
      description: 'List controllable and uncontrollable factors',
      icon: Brain
    },
    {
      title: 'Analyze',
      description: 'Apply Stoic principles',
      icon: Scale
    },
    {
      title: 'Conclude',
      description: 'Make a reasoned decision',
      icon: Sparkles
    }
  ];

  // State declarations
  const [step, setStep] = useState(1);
  const [question, setQuestion] = useState(value?.question || '');
  const [factors, setFactors] = useState<Factor[]>(value?.factors || []);
  const [analysis, setAnalysis] = useState(value?.analysis || '');
  const [conclusion, setConclusion] = useState(value?.conclusion || '');
  const [newFactor, setNewFactor] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Handlers
  const handleAddFactor = useCallback((type: Factor['type']) => {
    if (!newFactor.trim()) return;
    
    const factor: Factor = {
      text: newFactor,
      type,
      impact: 'medium'
    };
    
    const updatedFactors = [...factors, factor];
    setFactors(updatedFactors);
    setNewFactor('');
    onChange({ question, factors: updatedFactors, analysis, conclusion });
  }, [newFactor, factors, question, analysis, conclusion, onChange]);

  const handleUpdateFactor = useCallback((index: number, updates: Partial<Factor>) => {
    const updatedFactors = factors.map((factor, i) => 
      i === index ? { ...factor, ...updates } : factor
    );
    setFactors(updatedFactors);
    onChange({ question, factors: updatedFactors, analysis, conclusion });
  }, [factors, question, analysis, conclusion, onChange]);

  const handleRemoveFactor = useCallback((index: number) => {
    const updatedFactors = factors.filter((_, i) => i !== index);
    setFactors(updatedFactors);
    onChange({ question, factors: updatedFactors, analysis, conclusion });
  }, [factors, question, analysis, conclusion, onChange]);

  // Update the generateStoicAnalysis function
  const generateStoicAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const factorsText = factors.map(f => `\n- ${f.text} (${f.type}, ${f.impact} impact)`).join('');
      const result = await generateDecisionAnalysis(
        createDecisionAnalysisPrompt(question, factorsText)
      );
      
      // Only use the direct response sections, not the reflection which might contain duplicates
      const analysisText = [
        '## Within Our Control',
        result.dichotomy_of_control.within_control
          .filter(item => item.trim())
          .map(item => `• ${item.replace(/^\*\*.*?\*\*\s*:?\s*/g, '')}`)
          .join('\n'),
        '\n## Partially in Our Control',
        result.dichotomy_of_control.partial_control
          .filter(item => item.trim())
          .map(item => `• ${item.replace(/^\*\*.*?\*\*\s*:?\s*/g, '')}`)
          .join('\n'),
        '\n## Beyond Our Control',
        result.dichotomy_of_control.outside_control
          .filter(item => item.trim())
          .map(item => `• ${item.replace(/^\*\*.*?\*\*\s*:?\s*/g, '')}`)
          .join('\n'),
        '\n## Stoic Approach',
        result.dichotomy_of_control.reflection
          .replace(/^\*\*.*?\*\*\s*:?\s*/g, '')
          .replace(/\*\*/g, '')
      ].join('\n');
      
      setAnalysis(analysisText);
      onChange({ question, factors, analysis: analysisText, conclusion });
    } catch (error) {
      console.error('Failed to generate analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateImplementationPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const result = await generateActionPlan(question, analysis);
      
      const newConclusion = `## Action Steps\n${result.recommendations.map(step => `• ${step}`).join('\n')}`;
      setConclusion(newConclusion);
      onChange({ 
        question, 
        factors, 
        analysis, 
        conclusion: newConclusion 
      });
    } catch (error) {
      console.error('Failed to generate implementation plan:', error);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Rest of your component remains the same...
  
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Factors</h2>
            </div>
            
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
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={factor.text}
                    onChange={(e) => handleUpdateFactor(index, { text: e.target.value })}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                  />
                  <select
                    value={factor.type}
                    onChange={(e) => handleUpdateFactor(index, { type: e.target.value as Factor['type'] })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                  >
                    <option value="controllable">Controllable</option>
                    <option value="uncontrollable">Uncontrollable</option>
                  </select>
                  <select
                    value={factor.impact}
                    onChange={(e) => handleUpdateFactor(index, { impact: e.target.value as Factor['impact'] })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                  >
                    <option value="high">High Impact</option>
                    <option value="medium">Medium Impact</option>
                    <option value="low">Low Impact</option>
                  </select>
                  <button
                    onClick={() => handleRemoveFactor(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!factors.length}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Stoic Analysis</h2>
            <button
              onClick={generateStoicAnalysis}
              disabled={isAnalyzing || !factors.length}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Get Stoic Perspective
            </button>
          </div>
          <textarea
            value={analysis}
            onChange={(e) => {
              setAnalysis(e.target.value);
              onChange({ question, factors, analysis: e.target.value, conclusion });
            }}
            placeholder="Write your analysis here, or use AI to get a Stoic perspective..."
            className="w-full p-4 border rounded-lg focus:outline-none focus:border-black min-h-[200px] resize-none"
          />
          {/* Navigation buttons */}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Conclusion & Implementation</h2>
            <button
              onClick={generateImplementationPlan}
              disabled={isGeneratingPlan || !analysis.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 disabled:opacity-50"
            >
              {isGeneratingPlan ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate Implementation Plan
            </button>
          </div>
          <textarea
            value={conclusion}
            onChange={(e) => {
              setConclusion(e.target.value);
              onChange({ question, factors, analysis, conclusion: e.target.value });
            }}
            placeholder="Write your conclusion and implementation plan here, or use AI to generate one..."
            className="w-full p-4 border rounded-lg focus:outline-none focus:border-black min-h-[200px] resize-none"
          />
          {/* Navigation buttons */}
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