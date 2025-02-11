import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TemplateList from './components/TemplateList';
import TemplateModal from './components/TemplateModal';
import { addTemplate, getTemplates, createGoalFromTemplate, subscribeToGoals } from '../../data/goals';
import type { GoalTemplate } from '../../types/planning';

function Templates() {
  const navigate = useNavigate();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);
  const [templates, setTemplates] = React.useState(getTemplates());

  React.useEffect(() => {
    const updateTemplates = () => {
      setTemplates(getTemplates());
    };
    
    updateTemplates();
    return subscribeToGoals(updateTemplates);
  }, []);

  const handleAddTemplate = (template: Omit<GoalTemplate, 'id' | 'createdAt'>) => {
    addTemplate(template);
  };

  const handleUseTemplate = (template: GoalTemplate) => {
    createGoalFromTemplate(template.id);
    navigate('/planning');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Goal Templates</h1>
          <p className="text-gray-600">Create and manage reusable goal templates</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/planning')}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Back to Planning
          </button>
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            <Plus className="h-5 w-5" />
            New Template
          </button>
        </div>
      </div>

      <TemplateList
        templates={templates}
        onAddTemplate={() => setIsTemplateModalOpen(true)}
        onUseTemplate={handleUseTemplate}
      />

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSubmit={handleAddTemplate}
      />
    </div>
  );
}

export default Templates;