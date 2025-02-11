import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  metaOrCtrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  handler: () => void;
}

export function useKeyboardShortcut(shortcut: KeyboardShortcut) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        (!shortcut.ctrlKey || event.ctrlKey) && 
        (!shortcut.metaKey || event.metaKey) &&
        (!shortcut.metaOrCtrlKey || (event.metaKey || event.ctrlKey)) &&
        (!shortcut.altKey || event.altKey) &&
        (!shortcut.shiftKey || event.shiftKey)
      ) {
        event.preventDefault();
        shortcut.handler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcut]);
}