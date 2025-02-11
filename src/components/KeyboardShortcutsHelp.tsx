import React from 'react';
import { Keyboard } from 'lucide-react';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { isMac } from '../utils/platform';

const shortcuts = [
  {
    category: 'General',
    items: [
      { keys: ['Shift', '?'], description: 'Show/hide keyboard shortcuts' },
    ]
  },
  {
    category: 'Navigation',
    items: [
      { keys: [isMac ? '⌘' : 'Ctrl', 'D'], description: 'Go to Dashboard' },
      { keys: [isMac ? '⌘' : 'Ctrl', 'J'], description: 'Go to Journal' },
      { keys: [isMac ? '⌘' : 'Ctrl', 'C'], description: 'Go to Calendar' },
      { keys: [isMac ? '⌘' : 'Ctrl', 'P'], description: 'Go to Planning' },
      { keys: [isMac ? '⌘' : 'Ctrl', 'L'], description: 'Go to Library' },
    ]
  },
  {
    category: 'Journal',
    items: [
      { keys: [isMac ? '⌘' : 'Ctrl', 'S'], description: 'Save entry' },
      { keys: ['Esc'], description: 'Cancel and return to Dashboard' },
    ]
  },
  {
    category: 'Tasks & Goals',
    items: [
      { keys: [isMac ? '⌘' : 'Ctrl', 'Enter'], description: 'Save task/goal' },
      { keys: ['Esc'], description: 'Close modal' },
    ]
  }
];

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  useKeyboardShortcut({
    key: 'Escape',
    handler: () => {
      if (isOpen) onClose();
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            {shortcuts.map((category) => (
              <div key={category.category}>
                <h3 className="font-medium text-gray-900 mb-3">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.items.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-gray-400">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsHelp;