export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalRevenue: number
  membershipTier: string
  loyaltyPoints: number
  joinDate: string
  lastOrderDate: string
}

export interface Order {
  id: string
  customerId: string
  date: string
  total: number
  status: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface Analytics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  customerCount: number
}

export interface StoreState {
  customers: Customer[]
  orders: Order[]
  analytics: Analytics
  selectedCustomer: Customer | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setCustomers: (customers: Customer[]) => void
  setOrders: (orders: Order[]) => void
  setAnalytics: (analytics: Analytics) => void
  setSelectedCustomer: (customer: Customer | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed Actions
  getCustomerById: (id: string) => Customer | undefined
  getCustomerOrders: (customerId: string) => Order[]
  updateCustomer: (customer: Customer) => void
  deleteCustomer: (customerId: string) => void
} 