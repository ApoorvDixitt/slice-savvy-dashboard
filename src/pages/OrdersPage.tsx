
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import mockData from '@/data/mockData.json';
import { Pizza } from 'lucide-react';

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  
  const { orders } = mockData;

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.pizzaType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Preparing': return 'bg-yellow-100 text-yellow-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Out for Delivery': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pizza Orders</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage and track all pizza orders in real-time</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Pizza className="w-5 h-5 text-orange-500" />
              <span>Pizza Orders</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Refresh
              </Button>
              <span className="text-sm text-gray-500">{filteredOrders.length} orders</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search orders, customers, or pizza types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Preparing">Preparing</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Pizza Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Qty</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Order Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.orderId} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 font-medium text-blue-600">{order.orderId}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{order.customer}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{order.pizzaType}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{order.quantity}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">${order.total}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {new Date(order.orderDate).toLocaleDateString()}<br />
                      <span className="text-xs">{new Date(order.orderDate).toLocaleTimeString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
