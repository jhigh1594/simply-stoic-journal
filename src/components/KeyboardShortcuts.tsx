import React from 'react';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = React.useState(false);

  useKeyboardShortcut({
    key: '/',
    handler: () => {
      setIsOpen(prev => !prev);
    }
  });

  return (
    <KeyboardShortcutsHelp
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}