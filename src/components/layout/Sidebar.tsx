
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  PieChart,
  Pizza,
  Users,
  Menu,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggle, 
  isDarkMode, 
  onThemeToggle 
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Pizza Orders', href: '/orders', icon: PieChart },
    { name: 'Analytics', href: '/analytics', icon: PieChart },
    { name: 'Menu Management', href: '/menu', icon: Pizza },
    { name: 'Customers', href: '/customers', icon: Users },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user display name and avatar from Supabase user metadata
  const displayName = user?.user_metadata?.full_name || user?.email || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userEmail = user?.email || '';

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 z-40",
          isCollapsed ? "w-0 p-0 overflow-hidden" : "w-64"
        )}
        style={isCollapsed ? { minWidth: 0, width: 0 } : {}}
      >
        {/* Only render sidebar content if not collapsed */}
        {!isCollapsed && (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                    <Pizza className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-gray-800 dark:text-white">
                    Pizza Dashboard
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="p-2"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-gradient-to-r from-orange-400 to-red-500 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer - stick to bottom */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
                    {displayName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {userEmail}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onThemeToggle}
                  className="w-full justify-start"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="ml-2">
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 justify-start"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="ml-2">Sign Out</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Floating toggle button when collapsed */}
      {isCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
        >
          <Menu className="w-6 h-6" />
        </Button>
      )}
    </>
  );
};

export default Sidebar;
