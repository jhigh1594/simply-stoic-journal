import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function ErrorMessage({ message, action }: ErrorMessageProps) {
  return (
    <div className="rounded-lg bg-red-50 p-4 border border-red-100">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-700">{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;