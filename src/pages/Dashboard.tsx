import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import mockData from '@/data/mockData.json';
import { PieChart, Users, LayoutDashboard, Pizza, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { analytics, orders, customers } = mockData;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Rise and shine";
    if (hour < 18) return "Ready to serve";
    return "Evening service";
  };

  const getMotivation = () => {
    const messages = [
      "Let's make today delicious!",
      "Time to create some magic!",
      "Ready to serve happiness!",
      "Let's make it a great day!",
      "Time to shine!",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const recentOrders = orders.slice(0, 10);
  const totalOrders = orders.length;
  const activeCustomers = customers.length;
  const todayRevenue = orders
    .filter(order => new Date(order.orderDate).toDateString() === new Date().toDateString())
    .reduce((sum, order) => sum + order.total, 0);

  const quickActions = [
    { name: 'View All Orders', icon: PieChart, color: 'bg-blue-500', path: '/orders' },
    { name: 'Manage Menu', icon: Pizza, color: 'bg-green-500', path: '/menu' },
    { name: 'View Analytics', icon: PieChart, color: 'bg-orange-500', path: '/analytics' },
    { name: 'Customer List', icon: Users, color: 'bg-purple-500', path: '/customers' },
  ];

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-300 via-orange-400 to-red-400 rounded-lg p-4 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-2xl">👋</span>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Chef'}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-orange-50">
                  {getGreeting()}
                </p>
                <span className="text-orange-200 hidden sm:inline">•</span>
                <p className="text-sm text-orange-50">
                  {getMotivation()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end space-x-4 text-right">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-50" />
              <span className="text-sm font-medium">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
            <div className="h-8 w-px bg-orange-200/30 hidden sm:block" />
            <div className="text-sm text-orange-50">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalOrders}</p>
                <p className="text-xs text-green-600">+{analytics.ordersGrowth}%</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Customers</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{activeCustomers}</p>
                <p className="text-xs text-green-600">+{analytics.customersGrowth}%</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenue Today</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">${todayRevenue.toFixed(2)}</p>
                <p className="text-xs text-green-600">+{analytics.revenueGrowth}%</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">${analytics.avgOrderValue.toFixed(2)}</p>
                <p className="text-xs text-green-600">+{analytics.avgOrderValueGrowth}%</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              <span>Recent Orders</span>
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/orders')}
              className="hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {recentOrders.map((order) => (
                <motion.div
                  key={order.orderId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors gap-2 sm:gap-0"
                >
                  <div>
                    <p className="font-medium">{order.orderId}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(order.orderDate).toLocaleTimeString()} ago
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-sm font-semibold mt-1">${order.total}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Performance */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-2 sm:space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => handleQuickAction(action.path)}
                      >
                        <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mr-3 transition-transform duration-200 group-hover:scale-110`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm sm:text-base">{action.name}</span>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Today's Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-green-500" />
                <span>Today's Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Orders Completed</span>
                  <span className="font-medium">
                    {orders.filter(o => o.status === 'Delivered').length}/{orders.length}
                  </span>
                </div>
                <Progress 
                  value={(orders.filter(o => o.status === 'Delivered').length / orders.length) * 100} 
                  className="h-2" 
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Customer Satisfaction</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>On-time Delivery</span>
                  <span className="font-medium">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
