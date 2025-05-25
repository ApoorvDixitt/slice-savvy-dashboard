import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import mockData from '@/data/mockData.json';
import { Users, LayoutDashboard, PieChart, Search, Loader2 } from 'lucide-react';
import NewsletterTemplate from '@/components/NewsletterTemplate';
import { useDebounce } from '@/hooks/useDebounce';

const CustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Customer List');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [sortByOrders, setSortByOrders] = useState<'none' | 'asc' | 'desc'>('none');
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedModalSearchTerm = useDebounce(modalSearchTerm, 300);
  
  const { customers } = mockData;

  // Effect to prevent body scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isModalOpen]);

  // Simulate loading state when searching
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, debouncedModalSearchTerm]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    customer.phone.includes(debouncedSearchTerm)
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
    customer.name.toLowerCase().includes(debouncedModalSearchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(debouncedModalSearchTerm.toLowerCase())
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
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer relationships and track loyalty</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-[250px]"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
            )}
          </div>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 w-full sm:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            Send Newsletter
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow hover:scale-[1.01] transition-transform duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                    <AvatarFallback className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{customer.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{customer.email}</p>
                  </div>
                </div>
                <Badge className={`${getTierColor(customer.membershipTier)} whitespace-nowrap`}>
                  {customer.membershipTier}
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-600 dark:text-gray-400 text-xs">Phone</span>
                  <span className="font-medium truncate">{customer.phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 dark:text-gray-400 text-xs">Total Orders</span>
                  <span className="font-medium">{customer.totalOrders}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 dark:text-gray-400 text-xs">Revenue</span>
                  <span className="font-medium text-green-600">${customer.totalRevenue}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 dark:text-gray-400 text-xs">Loyalty Points</span>
                  <span className="font-medium text-orange-600">{customer.loyaltyPoints} pts</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 flex flex-col rounded-lg shadow-xl w-full max-w-md max-h-[90vh] sm:max-h-[80vh]">
            <div className="p-4 sm:p-6 pb-2 sm:pb-4">
              <h2 className="text-xl font-bold mb-4">Select Customers for Newsletter</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Input
                  placeholder="Search customers..."
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={sortByOrders}
                  onChange={(e) => setSortByOrders(e.target.value as 'none' | 'asc' | 'desc')}
                  className="border rounded-md p-2 bg-white dark:bg-gray-800"
                >
                  <option value="none">Sort By Orders</option>
                  <option value="asc">Orders: Low to High</option>
                  <option value="desc">Orders: High to Low</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 px-4 sm:px-6 overflow-y-auto flex-grow text-gray-800 dark:text-gray-200">
              {modalFilteredCustomers.map(customer => (
                <div key={customer.id} className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors duration-150 ease-in-out">
                  <label htmlFor={`customer-${customer.id}`} className="flex items-center space-x-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      id={`customer-${customer.id}`}
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleCustomerSelect(customer.id)}
                      className="form-checkbox"
                    />
                    <span className="truncate">{customer.name} ({customer.email}) - Orders: {customer.totalOrders}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 p-4 sm:p-6 pt-2 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">Cancel</Button>
              <Button onClick={handleSendNewsletter} disabled={selectedCustomers.length === 0} className="w-full sm:w-auto">
                Send Newsletter ({selectedCustomers.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
