import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import PageTransition from './PageTransition';
import { motion } from 'framer-motion';

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('pizzaDashboardTheme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pizzaDashboardTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pizzaDashboardTheme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
      />
      <motion.div
        className="flex-1 flex flex-col min-h-screen"
        initial={false}
        animate={{
          marginLeft: isCollapsed ? "4rem" : "16rem"
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <main className="flex-1 p-6">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <Footer />
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
