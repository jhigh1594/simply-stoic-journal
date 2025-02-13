import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      // Special handling for '/' key
      if (shortcut.key === '/' && event.key === '/') {
        // Only trigger if not in an input/textarea/contenteditable
        const target = event.target as HTMLElement;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target.isContentEditable
        ) {
          return;
        }
        
        event.preventDefault();
        shortcut.handler();
        return;
      }

      // Regular shortcut handling
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

export function useGlobalKeyboardShortcuts() {
  const navigate = useNavigate();

  // Navigation shortcuts
  useKeyboardShortcut({
    key: 'd',
    metaOrCtrlKey: true,
    handler: () => navigate('/')
  });

  useKeyboardShortcut({
    key: 'j',
    metaOrCtrlKey: true,
    handler: () => navigate('/journal')
  });

  useKeyboardShortcut({
    key: 'p',
    metaOrCtrlKey: true,
    handler: () => navigate('/planning')
  });

  useKeyboardShortcut({
    key: 'l',
    metaOrCtrlKey: true,
    handler: () => navigate('/library')
  });
}