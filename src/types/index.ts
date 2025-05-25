
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalRevenue: number;
  membershipTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  loyaltyPoints: number;
  joinDate: string;
  lastOrderDate: string;
}

export interface Order {
  orderId: string;
  customer: string;
  customerEmail: string;
  pizzaType: string;
  quantity: number;
  total: number;
  orderDate: string;
  status: 'Preparing' | 'Pending' | 'Cancelled' | 'Out for Delivery' | 'Delivered';
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  ingredients: string[];
  isPopular: boolean;
}

export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  avgOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  avgOrderValueGrowth: number;
  monthlyRevenue: number[];
  pizzaSalesDistribution: Record<string, number>;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}
