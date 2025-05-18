import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark');
    localStorage.theme = newMode ? 'dark' : 'light';
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleDarkMode}
        className="rounded-md p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        {isDark ? (
          <SunIcon className="h-5 w-5" />
        ) : (
          <MoonIcon className="h-5 w-5" />
        )}
      </motion.button>
    </div>
  );
} 