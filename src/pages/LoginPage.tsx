import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Pizza, ChefHat, Utensils, LogIn, Loader2, AlertCircle, Chrome } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isLoading: loading, user } = useAuth();
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const floatingPizzaVariants = {
    float: (i: number) => ({
      y: [0, -10, 0, 10, 0],
      x: [0, Math.random() * 10 - 5, 0, Math.random() * 10 - 5, 0],
      rotate: [0, i % 2 === 0 ? 5 : -5, 0],
      transition: {
        duration: Math.random() * 2 + 3, // 3-5 seconds
        repeat: Infinity,
        ease: 'easeInOut',
        delay: i * 0.3,
      },
    }),
  };

  const spinningElementVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 15,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  const mainPizzaIconVariants = {
    animate: {
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const googleButtonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0px 0px 15px rgba(255, 165, 0, 0.7)',
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  // Use React.useMemo to prevent recalculation on every render
  const floatingPizzas = React.useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      size: Math.random() * 30 + 20, // 20px to 50px
      top: `${Math.random() * 80 + 10}%`, // 10% to 90% from top
      left: `${Math.random() * 80 + 10}%`, // 10% to 90% from left
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center justify-center p-4 overflow-hidden relative"
      aria-label="Login page container"
      role="main"
    >
      {/* Floating Pizzas Background */}
      {floatingPizzas.map((pizza, i) => (
        <motion.div
          key={pizza.id}
          custom={i}
          variants={floatingPizzaVariants}
          animate="float"
          className="absolute text-orange-500 opacity-20"
          style={{
            top: pizza.top,
            left: pizza.left,
            fontSize: `${pizza.size}px`,
          }}
        >
          <Pizza size={pizza.size} />
        </motion.div>
      ))}

      {/* Spinning Decorative Elements */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`spin-${i}`}
          variants={spinningElementVariants}
          animate="spin"
          className="absolute border-2 border-orange-400 border-dashed rounded-full opacity-10"
          style={{
            width: `${100 + i * 100}px`,
            height: `${100 + i * 100}px`,
            top: `${20 + i * 10}%`,
            left: `${20 + i * 10}%`,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 bg-white/80 backdrop-blur-md shadow-2xl rounded-xl p-8 md:p-12 w-full max-w-md text-center transform transition-all duration-500 hover:scale-105"
      >
        <motion.div
          variants={mainPizzaIconVariants}
          animate="animate"
          className="relative mx-auto mb-6 w-32 h-32 md:w-40 md:h-40 flex items-center justify-center"
        >
          <Pizza
            className="absolute text-orange-500 filter drop-shadow-lg"
            size={100}
          />
          <ChefHat
            className="absolute text-gray-700 transform -rotate-12 -translate-x-8 -translate-y-4 filter drop-shadow-md"
            size={40}
          />
          <Utensils
            className="absolute text-gray-700 transform rotate-12 translate-x-8 -translate-y-4 filter drop-shadow-md"
            size={40}
          />
          {/* Pulsing Glow */}
          <div className="absolute w-full h-full bg-orange-400 rounded-full opacity-30 animate-pulse filter blur-xl"></div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 tracking-tight"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        >
          WELCOME <span className="text-orange-500">ADMIN</span>
        </motion.h1>
        <motion.p
          className="text-gray-600 mb-8 text-sm md:text-base"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
        >
          Sign in to manage your Slice Savvy Dashboard.
        </motion.p>

        {showError && error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center shadow-md"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 mr-3" />
            <p className="font-medium">{error}</p>
          </motion.div>
        )}

        <motion.div variants={googleButtonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 text-lg flex items-center justify-center space-x-2"
            aria-label="Sign in with Google"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Chrome className="h-5 w-5" />
                <span>Sign In with Google</span>
                <LogIn className="h-5 w-5" />
              </>
            )}
          </Button>
        </motion.div>

        <motion.p
          className="mt-8 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          &copy; {new Date().getFullYear()} Slice Savvy. All rights reserved.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
