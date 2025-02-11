import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Home,
  LayoutDashboard, 
  BookOpen, 
  Library, 
  Settings,
  ClipboardList,
  X
} from 'lucide-react';

const navigation = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Journal', path: '/journal' },
  { icon: ClipboardList, label: 'Planning', path: '/planning' },
  { icon: Library, label: 'Library', path: '/library' },
];

interface SidebarProps {
  onClose?: () => void;
}

function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <nav className="w-[280px] max-w-full h-full bg-gray-50 p-6 space-y-8 relative">
      <div className="flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Stoic Journal
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-2">
        {navigation.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center gap-3 w-full p-2 rounded-lg text-sm ${
              location.pathname === item.path
                ? 'bg-white shadow-sm'
                : 'hover:bg-white/60 text-gray-600'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <button className="flex items-center gap-3 w-full p-2 rounded-lg text-sm hover:bg-white/60 text-gray-600">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;