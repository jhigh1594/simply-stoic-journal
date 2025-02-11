import React from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useGlobalKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import KeyboardShortcutsHelp from '../components/KeyboardShortcutsHelp';
import { Toaster } from 'react-hot-toast';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = React.useState(false);
  useGlobalKeyboardShortcuts();

  useKeyboardShortcut({
    key: '?',
    shiftKey: true,
    handler: () => setIsShortcutsHelpOpen(prev => !prev)
  });

  return (
    <div className="flex h-screen bg-white">
      <Toaster position="top-right" />
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-30 lg:relative ${
          isSidebarOpen ? 'block' : 'hidden lg:block'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/20 lg:hidden ${
            isSidebarOpen ? 'block' : 'hidden'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto pt-16 lg:pt-8">
        <Outlet />
      </main>
      
      <KeyboardShortcutsHelp
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
      />
    </div>
  );
}

export default MainLayout;