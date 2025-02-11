import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcut } from './useKeyboardShortcut';

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
    key: 'c',
    metaOrCtrlKey: true,
    handler: () => navigate('/calendar')
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