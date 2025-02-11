import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import type { GoalTemplate } from '../../../types/planning';

interface TemplateListProps {
  templates: GoalTemplate[];
  onAddTemplate: () => void;
  onUseTemplate: (template: GoalTemplate) => void;
}

function TemplateList({ templates, onAddTemplate, onUseTemplate }: TemplateListProps) {
  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Templates</h2>
          <button
            onClick={onAddTemplate}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <Plus className="h-4 w-4" />
            New Template
          </button>
        </div>

        {templates.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No templates yet. Create one to get started.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => onUseTemplate(template)}
                className="text-left p-4 border rounded-lg hover:border-gray-400 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{template.title}</h3>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                {template.description && (
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="capitalize">{template.timeframe}</span>
                  <span>•</span>
                  <span className="capitalize">{template.priority} priority</span>
                  <span>•</span>
                  <span>{template.subTasks.length} sub-tasks</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateList;