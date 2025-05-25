import React from 'react';
import { motion } from 'framer-motion';
import { Pizza } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center justify-center space-y-4 p-4">
        {/* Rotating pizza container */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Pizza className="w-full h-full text-orange-600" />
          </motion.div>
        </div>
        
        {/* Loading text */}
        <motion.div
          className="text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <p className="text-orange-600 font-medium text-base sm:text-lg md:text-xl">
            Loading your slice...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 