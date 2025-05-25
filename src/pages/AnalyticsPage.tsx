import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import mockData from '@/data/mockData.json';
import { PieChart as PieChartIcon, Users, LayoutDashboard, Pizza } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const { analytics } = mockData;

  const monthlyData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 5500 },
    { month: 'Mar', revenue: 7200 },
    { month: 'Apr', revenue: 6800 },
    { month: 'May', revenue: 8900 },
    { month: 'Jun', revenue: 9200 },
  ];

  const pieData = Object.entries(analytics.pizzaSalesDistribution).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#FF8C00', '#FFB347', '#FF7F50', '#FF6347', '#CD853F'];

  const tabs = ['Overview', 'Sales', 'Products', 'Customers'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into your pizza business performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Pick a date range
          </Button>
          <Button variant="outline" size="sm">
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$42,350</p>
                <p className="text-xs text-green-600 flex items-center">
                  <span className="mr-1">↗</span> +12.5% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,445</p>
                <p className="text-xs text-green-600 flex items-center">
                  <span className="mr-1">↗</span> +8.2% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <PieChartIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">892</p>
                <p className="text-xs text-red-600 flex items-center">
                  <span className="mr-1">↘</span> -2.1% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$29.31</p>
                <p className="text-xs text-green-600 flex items-center">
                  <span className="mr-1">↗</span> +5.7% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <PieChartIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "bg-white dark:bg-gray-700 shadow-sm" : ""}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="w-5 h-5 text-orange-500" />
              <span>Revenue Trend</span>
            </CardTitle>
            <p className="text-sm text-gray-600">Monthly revenue over the last 6 months</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#FF8C00" 
                  strokeWidth={3}
                  dot={{ fill: '#FF8C00', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pizza Sales Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Pizza className="w-5 h-5 text-orange-500" />
              <span>Pizza Sales Distribution</span>
            </CardTitle>
            <p className="text-sm text-gray-600">Most popular pizza types</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Sales']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {pieData.map((entry, index) => (
                <Badge
                  key={entry.name}
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{entry.name}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
