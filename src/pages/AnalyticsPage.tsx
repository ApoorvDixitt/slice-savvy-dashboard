import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, BarChart, Bar } from 'recharts';
import mockData from '@/data/mockData.json';
import { PieChart as PieChartIcon, Users, LayoutDashboard, Pizza, Calendar, Download } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isWithinInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DateRange } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFViewerComponent } from '@/utils/pdfTemplate';
import ReactDOM from 'react-dom/client';

interface Order {
  orderId: string;
  customer: string;
  customerEmail: string;
  pizzaType: string;
  quantity: number;
  total: number;
  orderDate: string;
  status: string;
  productName: string;
}

// Helper function to filter data by date range
function filterDataByDateRange<T extends Order>(
  data: T[],
  dateRange: DateRange | undefined
): T[] {
  if (!dateRange?.from || !dateRange?.to) return data;
  
  return data.filter(item => {
    const itemDate = new Date(item.orderDate);
    return isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to });
  });
}

interface OverviewTabProps {
  analytics: {
    revenueGrowth: number;
    ordersGrowth: number;
    avgOrderValueGrowth: number;
    customersGrowth: number;
    monthlyRevenue: number[];
    pizzaSalesDistribution: Record<string, number>;
  };
  orders: Order[];
  customers: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalRevenue: number;
    membershipTier: string;
    loyaltyPoints: number;
    joinDate: string;
    lastOrderDate: string;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
  }>;
  pieData: Array<{
    name: string;
    value: number;
  }>;
  COLORS: string[];
  avgOrderValue: number;
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
}

// Add animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

const tabVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

// Update the Card components to use motion
const MotionCard = motion(Card);
const MotionCardContent = motion(CardContent);
const MotionCardHeader = motion(CardHeader);
const MotionCardTitle = motion(CardTitle);

function OverviewTab({ analytics, orders, customers, monthlyData, pieData, COLORS, avgOrderValue, totalRevenue, totalOrders, activeCustomers }: OverviewTabProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MotionCard 
          className="border-green-200"
          variants={cardVariants}
          whileHover="hover"
        >
          <MotionCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-green-600 flex items-center">
                  <span className="mr-1">↗</span> +{analytics.revenueGrowth}% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </MotionCardContent>
        </MotionCard>
        <MotionCard 
          className="border-blue-200"
          variants={cardVariants}
          whileHover="hover"
        >
          <MotionCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
                <p className="text-xs text-green-600 flex items-center">
                  <span className="mr-1">↗</span> +{analytics.ordersGrowth}% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <PieChartIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </MotionCardContent>
        </MotionCard>
        <MotionCard 
          className="border-purple-200"
          variants={cardVariants}
          whileHover="hover"
        >
          <MotionCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeCustomers}</p>
                <p className="text-xs text-red-600 flex items-center">
                  <span className="mr-1">↘</span> {analytics.customersGrowth}% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </MotionCardContent>
        </MotionCard>
        <MotionCard 
          className="border-orange-200"
          variants={cardVariants}
          whileHover="hover"
        >
          <MotionCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${avgOrderValue.toFixed(2)}</p>
                <p className="text-xs text-green-600 flex items-center">
                  <span className="mr-1">↗</span> +{analytics.avgOrderValueGrowth}% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <PieChartIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </MotionCardContent>
        </MotionCard>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Revenue Trend */}
        <MotionCard>
          <MotionCardHeader>
            <MotionCardTitle className="flex items-center space-x-2">
              <PieChartIcon className="w-5 h-5 text-orange-500" />
              <span>Revenue Trend</span>
            </MotionCardTitle>
            <p className="text-sm text-gray-600">Monthly revenue over the last 6 months</p>
          </MotionCardHeader>
          <MotionCardContent>
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
          </MotionCardContent>
        </MotionCard>
        {/* Pizza Sales Distribution */}
        <MotionCard>
          <MotionCardHeader>
            <MotionCardTitle className="flex items-center space-x-2">
              <Pizza className="w-5 h-5 text-orange-500" />
              <span>Pizza Sales Distribution</span>
            </MotionCardTitle>
            <p className="text-sm text-gray-600">Most popular pizza types</p>
          </MotionCardHeader>
          <MotionCardContent>
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
          </MotionCardContent>
        </MotionCard>
      </div>
    </motion.div>
  );
}

interface SalesTabProps {
  orders: Order[];
  dateRange: DateRange | undefined;
}

function SalesTab({ orders, dateRange }: SalesTabProps) {
  const [trendType, setTrendType] = React.useState<'revenue' | 'orders'>('revenue');
  
  // Filter orders by date range
  const filteredOrders = filterDataByDateRange(orders, dateRange);

  // Always use last 7 days
  function getDateNDaysAgo(n: number) {
    const d = new Date();
    d.setDate(d.getDate() - n + 1);
    return d;
  }
  function formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
  }
  const today = new Date();
  const startDate = getDateNDaysAgo(6); // last 7 days: today and 6 days before
  const dateList: string[] = [];
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    dateList.push(formatDate(new Date(d)));
  }

  // Group orders by date
  const salesByDate: Record<string, { sales: number; orders: number }> = {};
  filteredOrders.forEach(order => {
    const date = order.orderDate.slice(0, 10);
    if (!salesByDate[date]) salesByDate[date] = { sales: 0, orders: 0 };
    salesByDate[date].sales += Number(order.total);
    salesByDate[date].orders += 1;
  });
  // Fill in missing days with zeroes
  const salesTrend = dateList.map(date => ({
    date,
    sales: salesByDate[date]?.sales || 0,
    orders: salesByDate[date]?.orders || 0
  }));

  // Find max/min for highlighting
  const maxVal = Math.max(...salesTrend.map(d => d[trendType === 'revenue' ? 'sales' : 'orders']));
  const minVal = Math.min(...salesTrend.map(d => d[trendType === 'revenue' ? 'sales' : 'orders']));

  // Top-selling pizzas
  const pizzaSales: Record<string, number> = {};
  filteredOrders.forEach(order => {
    pizzaSales[order.pizzaType] = (pizzaSales[order.pizzaType] || 0) + order.quantity;
  });
  const topPizzas = Object.entries(pizzaSales)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 5)
    .map(([pizza, qty]) => ({ pizza, qty }));

  // Key sales stats
  const totalSales = filteredOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders && typeof totalSales === 'number' ? (totalSales / totalOrders) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MotionCard
          variants={cardVariants}
          whileHover="hover"
        >
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Sales</p>
            <p className="text-2xl font-bold text-green-600">${totalSales.toFixed(2)}</p>
          </CardContent>
        </MotionCard>
        <MotionCard
          variants={cardVariants}
          whileHover="hover"
        >
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
          </CardContent>
        </MotionCard>
        <MotionCard
          variants={cardVariants}
          whileHover="hover"
        >
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
            <p className="text-2xl font-bold text-orange-600">${avgOrderValue.toFixed(2)}</p>
          </CardContent>
        </MotionCard>
      </div>
      <div className="flex items-center gap-4 mb-2">
        <div className="flex gap-2">
          <button onClick={() => setTrendType('revenue')} className={`px-3 py-1 rounded-md text-sm font-medium ${trendType === 'revenue' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>Revenue</button>
          <button onClick={() => setTrendType('orders')} className={`px-3 py-1 rounded-md text-sm font-medium ${trendType === 'orders' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>Order Count</button>
        </div>
        {/* Removed range buttons */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MotionCard
          variants={cardVariants}
          whileHover="hover"
        >
          <CardHeader>
            <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={salesTrend} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-30} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 12 }} width={50} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-gray-900 p-2 rounded shadow text-xs">
                        <div><b>{label}</b></div>
                        <div>Revenue: <span className="text-orange-600">${d.sales.toFixed(2)}</span></div>
                        <div>Orders: <span className="text-blue-600">{d.orders}</span></div>
                      </div>
                    );
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey={trendType === 'revenue' ? 'sales' : 'orders'} 
                  stroke="#FF8C00" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#FF8C00', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#FF8C00', stroke: '#222', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex gap-4 mt-2 justify-center text-xs">
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
                <span>{trendType === 'revenue' ? 'Revenue' : 'Order Count'}</span>
              </div>
            </div>
          </CardContent>
        </MotionCard>
        <MotionCard
          variants={cardVariants}
          whileHover="hover"
        >
          <CardHeader>
            <CardTitle>Top-Selling Pizzas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {topPizzas.map((item, idx) => (
                <li key={item.pizza} className="flex items-center justify-between py-2">
                  <span className="font-medium text-gray-900 dark:text-white">{idx + 1}. {item.pizza}</span>
                  <span className="text-gray-600 dark:text-gray-300">{item.qty} sold</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </MotionCard>
      </div>
    </div>
  );
}

interface ProductsTabProps {
  orders: Order[];
  menuItems: any[];
  dateRange: DateRange | undefined;
}

function ProductsTab({ orders, menuItems, dateRange }: ProductsTabProps) {
  const [sortBy, setSortBy] = React.useState<'name' | 'category' | 'price' | 'sales' | 'revenue'>('sales');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc');

  // Filter orders by date range
  const filteredOrders = filterDataByDateRange(orders, dateRange);

  // Aggregate sales and revenue by productName
  const productStats: Record<string, { name: string; sales: number; revenue: number; category: string; price: number }> = {};
  menuItems.forEach(item => {
    productStats[item.name] = { name: item.name, sales: 0, revenue: 0, category: item.category, price: item.price };
  });
  filteredOrders.forEach(order => {
    if (productStats[order.productName]) {
      productStats[order.productName].sales += order.quantity;
      productStats[order.productName].revenue += Number(order.total);
    }
  });
  let allProducts = Object.values(productStats);
  allProducts = allProducts.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name' || sortBy === 'category') {
      cmp = a[sortBy].localeCompare(b[sortBy]);
    } else {
      cmp = a[sortBy] - b[sortBy];
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  function handleSort(col) {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('desc');
    }
  }

  function sortArrow(col) {
    if (sortBy !== col) return <span className="text-gray-400">⇅</span>;
    return sortDir === 'asc' ? <span className="text-orange-500">↑</span> : <span className="text-orange-500">↓</span>;
  }

  return (
    <div className="space-y-8">
      <MotionCard>
        <CardHeader>
          <CardTitle>All Products Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto" style={{ maxHeight: 360 }}>
            <table className="min-w-full text-sm sticky-header" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left sticky left-0 bg-gray-100 dark:bg-gray-800 cursor-pointer select-none" onClick={() => handleSort('name')}>
                    Product {sortArrow('name')}
                  </th>
                  <th className="px-4 py-2 text-left cursor-pointer select-none" onClick={() => handleSort('category')}>
                    Category {sortArrow('category')}
                  </th>
                  <th className="px-4 py-2 text-right cursor-pointer select-none" onClick={() => handleSort('price')}>
                    Price {sortArrow('price')}
                  </th>
                  <th className="px-4 py-2 text-right cursor-pointer select-none" onClick={() => handleSort('sales')}>
                    Sales {sortArrow('sales')}
                  </th>
                  <th className="px-4 py-2 text-right cursor-pointer select-none" onClick={() => handleSort('revenue')}>
                    Revenue {sortArrow('revenue')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((prod) => (
                  <tr key={prod.name} className="border-b border-gray-200 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-900/30 transition-colors">
                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-900">{prod.name}</td>
                    <td className="px-4 py-2 text-left">{prod.category}</td>
                    <td className="px-4 py-2 text-right">${prod.price.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">{prod.sales}</td>
                    <td className="px-4 py-2 text-right">${prod.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </MotionCard>
    </div>
  );
}

interface CustomersTabProps {
  customers: any[];
  orders: Order[];
  dateRange: DateRange | undefined;
}

function CustomersTab({ customers, orders, dateRange }: CustomersTabProps) {
  const [sortBy, setSortBy] = React.useState<'name' | 'email' | 'totalOrders' | 'totalRevenue' | 'membershipTier' | 'joinDate'>('totalRevenue');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc');

  // Filter orders by date range
  const filteredOrders = filterDataByDateRange(orders, dateRange);

  // Calculate customer stats based on filtered orders
  const customerStats = customers.map(customer => {
    const customerOrders = filteredOrders.filter(order => order.customer === customer.name);
    return {
      ...customer,
      totalOrders: customerOrders.length,
      totalRevenue: customerOrders.reduce((sum, order) => sum + Number(order.total), 0)
    };
  });

  // Key metrics
  const totalCustomers = customers.length;
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const newCustomersThisMonth = customers.filter(c => {
    const d = new Date(c.joinDate);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;
  const avgOrderValue = customers.length ? (customers.reduce((sum, c) => sum + (c.totalRevenue / (c.totalOrders || 1)), 0) / customers.length) : 0;
  const loyaltyBreakdown = customers.reduce((acc: Record<string, number>, c) => {
    acc[c.membershipTier] = (acc[c.membershipTier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sortable table
  let sortedCustomers = [...customerStats];
  sortedCustomers = sortedCustomers.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name' || sortBy === 'email' || sortBy === 'membershipTier' || sortBy === 'joinDate') {
      cmp = String(a[sortBy]).localeCompare(String(b[sortBy]));
    } else {
      cmp = a[sortBy] - b[sortBy];
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });
  function handleSort(col) {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('desc');
    }
  }
  function sortArrow(col) {
    if (sortBy !== col) return <span className="text-gray-400">⇅</span>;
    return sortDir === 'asc' ? <span className="text-orange-500">↑</span> : <span className="text-orange-500">↓</span>;
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MotionCard
          variants={cardVariants}
          whileHover="hover"
        ><CardContent className="p-6"><p className="text-sm text-gray-600 mb-1">Total Customers</p><p className="text-2xl font-bold text-blue-600">{totalCustomers}</p></CardContent></MotionCard>
        <MotionCard
          variants={cardVariants}
          whileHover="hover"
        ><CardContent className="p-6"><p className="text-sm text-gray-600 mb-1">New This Month</p><p className="text-2xl font-bold text-green-600">{newCustomersThisMonth}</p></CardContent></MotionCard>
        <MotionCard
          variants={cardVariants}
          whileHover="hover"
        ><CardContent className="p-6"><p className="text-sm text-gray-600 mb-1">Avg Order Value</p><p className="text-2xl font-bold text-orange-600">${avgOrderValue.toFixed(2)}</p></CardContent></MotionCard>
        <MotionCard
          variants={cardVariants}
          whileHover="hover"
        ><CardContent className="p-6"><p className="text-sm text-gray-600 mb-1">Loyalty Breakdown</p><div className="flex flex-wrap gap-2 mt-2">{(Object.entries(loyaltyBreakdown) as [string, number][]).map(([tier, count]) => (<span key={tier} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs font-medium">{tier}: {count}</span>))}</div></CardContent></MotionCard>
      </div>
      {/* Top Customers Table */}
      <MotionCard
        variants={cardVariants}
        whileHover="hover"
      >
        <CardHeader><CardTitle>Top Customers</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto" style={{ maxHeight: 360 }}>
            <table className="min-w-full text-sm sticky-header" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left cursor-pointer select-none" onClick={() => handleSort('name')}>Name {sortArrow('name')}</th>
                  <th className="px-4 py-2 text-left cursor-pointer select-none" onClick={() => handleSort('email')}>Email {sortArrow('email')}</th>
                  <th className="px-4 py-2 text-right cursor-pointer select-none" onClick={() => handleSort('totalOrders')}>Total Orders {sortArrow('totalOrders')}</th>
                  <th className="px-4 py-2 text-right cursor-pointer select-none" onClick={() => handleSort('totalRevenue')}>Total Revenue {sortArrow('totalRevenue')}</th>
                  <th className="px-4 py-2 text-center cursor-pointer select-none" onClick={() => handleSort('membershipTier')}>Membership {sortArrow('membershipTier')}</th>
                  <th className="px-4 py-2 text-center cursor-pointer select-none" onClick={() => handleSort('joinDate')}>Join Date {sortArrow('joinDate')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedCustomers.map((c) => (
                  <tr key={c.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-900/30 transition-colors">
                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{c.name}</td>
                    <td className="px-4 py-2">{c.email}</td>
                    <td className="px-4 py-2 text-right">{c.totalOrders}</td>
                    <td className="px-4 py-2 text-right">${c.totalRevenue.toFixed(2)}</td>
                    <td className="px-4 py-2 text-center">{c.membershipTier}</td>
                    <td className="px-4 py-2 text-center">{c.joinDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </MotionCard>
    </div>
  );
}

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const { analytics, orders, customers, menuItems } = mockData;
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Filter data based on date range
  const filteredOrders = filterDataByDateRange(orders as Order[], dateRange);
  
  // Calculate metrics based on filtered data
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const totalOrders = filteredOrders.length;
  const activeCustomers = new Set(filteredOrders.map(order => order.customer)).size;
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  // Filter monthly data based on date range
  const monthlyData = analytics.monthlyRevenue
    .map((revenue, index) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index],
      revenue
    }))
    .filter(item => {
      if (!dateRange?.from || !dateRange?.to) return true;
      const itemDate = new Date(2024, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].indexOf(item.month));
      return isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to });
    });

  // Filter pie data based on date range
  const pieData = Object.entries(analytics.pizzaSalesDistribution)
    .map(([name, value]) => ({
      name,
      value: filteredOrders
        .filter(order => order.pizzaType === name)
        .reduce((sum, order) => sum + order.quantity, 0)
    }))
    .filter(item => item.value > 0);

  const COLORS = ['#FF8C00', '#FFB347', '#FF7F50', '#FF6347', '#CD853F'];

  const tabs = ['Overview', 'Sales', 'Products', 'Customers'];

  const renderTabContent = (): React.ReactNode => {
    switch (activeTab) {
      case 'Overview':
        return (
          <OverviewTab
            analytics={analytics}
            orders={filteredOrders}
            customers={customers}
            monthlyData={monthlyData}
            pieData={pieData}
            COLORS={COLORS}
            avgOrderValue={avgOrderValue}
            totalRevenue={totalRevenue}
            totalOrders={totalOrders}
            activeCustomers={activeCustomers}
          />
        );
      case 'Sales':
        return <SalesTab orders={filteredOrders} dateRange={dateRange} />;
      case 'Products':
        return <ProductsTab orders={filteredOrders} menuItems={menuItems} dateRange={dateRange} />;
      case 'Customers':
        return <CustomersTab customers={customers} orders={filteredOrders} dateRange={dateRange} />;
      default:
        return <div style={{ color: 'red' }}>Error: Unknown tab selected</div>;
    }
  };

  const handleExportPDF = () => {
    try {
      const pdfData = {
        totalRevenue,
        totalOrders,
        activeCustomers,
        avgOrderValue,
        analytics,
        menuItems,
        customers,
        filteredOrders
      };

      // Create a modal to display the PDF
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      modal.style.zIndex = '1000';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';

      // Create close button
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '20px';
      closeButton.style.right = '20px';
      closeButton.style.padding = '10px 20px';
      closeButton.style.backgroundColor = '#FF8C00';
      closeButton.style.color = 'white';
      closeButton.style.border = 'none';
      closeButton.style.borderRadius = '5px';
      closeButton.style.cursor = 'pointer';
      closeButton.onclick = () => {
        document.body.removeChild(modal);
      };

      // Create PDF container
      const pdfContainer = document.createElement('div');
      pdfContainer.style.width = '90%';
      pdfContainer.style.height = '90%';
      pdfContainer.style.backgroundColor = 'white';
      pdfContainer.style.borderRadius = '10px';
      pdfContainer.style.overflow = 'hidden';

      modal.appendChild(closeButton);
      modal.appendChild(pdfContainer);
      document.body.appendChild(modal);

      // Render PDF
      const root = ReactDOM.createRoot(pdfContainer);
      root.render(React.createElement(PDFViewerComponent, { data: pdfData, dateRange }));
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into your pizza business performance</p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Pick a date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleExportPDF}
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </motion.div>
      
      {/* Tabs */}
      <motion.div 
        className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-xl w-fit shadow-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              `px-6 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none
              ${activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow border border-gray-200 dark:border-gray-700'
                : 'bg-transparent text-gray-900 dark:text-gray-100 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400'}`
            }
            style={{ minWidth: 120 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab}
          </motion.button>
        ))}
      </motion.div>
      
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AnalyticsPage;
