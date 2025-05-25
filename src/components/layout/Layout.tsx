import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const Layout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
      />
      <main 
        className={cn(
          "transition-all duration-300 min-h-screen",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 