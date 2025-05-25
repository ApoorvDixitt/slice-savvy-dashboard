import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import mockData from '@/data/mockData.json';
import { Users, LayoutDashboard, PieChart } from 'lucide-react';
import NewsletterTemplate from '@/components/NewsletterTemplate';

const CustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Customer List');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [modalSearchTerm, setModalSearchTerm] = useState(''); // State for search within modal
  const [sortByOrders, setSortByOrders] = useState<'none' | 'asc' | 'desc'>('none'); // State for sorting
  
  const { customers } = mockData;

  // Effect to prevent body scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isModalOpen]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-purple-100 text-purple-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate summary stats
  const totalCustomers = customers.length;
  const avgOrderValue = customers.reduce((sum, c) => sum + (c.totalRevenue / c.totalOrders), 0) / customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalRevenue, 0);
  const loyaltyMembers = customers.filter(c => c.membershipTier !== 'Bronze').length;
  
  // Calculate new customers this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newCustomersThisMonth = customers.filter(customer => {
    const joinDate = new Date(customer.joinDate);
    return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
  }).length;

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId) 
        : [...prev, customerId]
    );
  };

  const handleSendNewsletter = () => {
    // Logic to send newsletter to selectedCustomers
    console.log('Sending newsletter to:', selectedCustomers);
    // Here you would integrate with your email sending service
    setIsModalOpen(false);
    setSelectedCustomers([]); // Clear selection after sending
    setModalSearchTerm(''); // Clear modal search term
    setSortByOrders('none'); // Reset sort
  };

  // Filter and sort customers for the modal
  const modalFilteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(modalSearchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortByOrders === 'asc') {
      return a.totalOrders - b.totalOrders;
    } else if (sortByOrders === 'desc') {
      return b.totalOrders - a.totalOrders;
    } else {
      return 0; // No sorting
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer relationships and track loyalty</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          onClick={() => setIsModalOpen(true)}
        >
          Send Newsletter
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 hover:shadow-lg transition-shadow hover:scale-[1.01] transition-transform duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCustomers}</p>
                <p className="text-xs text-blue-600">{newCustomersThisMonth} new this month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 hover:shadow-lg transition-shadow hover:scale-[1.01] transition-transform duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${avgOrderValue.toFixed(2)}</p>
                <p className="text-xs text-green-600">Per customer order</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 hover:shadow-lg transition-shadow hover:scale-[1.01] transition-transform duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Customer Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-orange-600">Total lifetime value</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 hover:shadow-lg transition-shadow hover:scale-[1.01] transition-transform duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Loyalty Members</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{loyaltyMembers}</p>
                <p className="text-xs text-purple-600">Silver+ tier customers</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow hover:scale-[1.01] transition-transform duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{customer.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</p>
                  </div>
                </div>
                <Badge className={getTierColor(customer.membershipTier)}>
                  {customer.membershipTier}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                  <span className="font-medium">{customer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Orders:</span>
                  <span className="font-medium">{customer.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                  <span className="font-medium text-green-600">${customer.totalRevenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Loyalty Points:</span>
                  <span className="font-medium text-orange-600">{customer.loyaltyPoints} pts</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500">
                  Last order: {new Date(customer.lastOrderDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 flex flex-col rounded-lg shadow-xl w-full max-w-md max-h-[80vh]">
            <div className="p-6 pb-4">
              <h2 className="text-xl font-bold mb-4">Select Customers for Newsletter</h2>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search customers..."
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={sortByOrders}
                  onChange={(e) => setSortByOrders(e.target.value as 'none' | 'asc' | 'desc')}
                  className="border rounded-md p-2"
                >
                  <option value="none">Sort By Orders</option>
                  <option value="asc">Orders: Low to High</option>
                  <option value="desc">Orders: High to Low</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 px-6 overflow-y-auto flex-grow text-gray-800 dark:text-gray-200">
              {modalFilteredCustomers.map(customer => (
                <div key={customer.id} className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors duration-150 ease-in-out">
                  <label htmlFor={`customer-${customer.id}`} className="flex items-center space-x-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      id={`customer-${customer.id}`}
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleCustomerSelect(customer.id)}
                      className="form-checkbox"
                    />
                    <span>{customer.name} ({customer.email}) - Orders: {customer.totalOrders}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4 p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSendNewsletter} disabled={selectedCustomers.length === 0}>Send Newsletter ({selectedCustomers.length})</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
