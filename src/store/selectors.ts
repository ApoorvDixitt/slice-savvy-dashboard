import { StoreState } from './types'

// Customer Selectors
export const selectCustomers = (state: StoreState) => state.customers
export const selectCustomerById = (id: string) => (state: StoreState) => 
  state.customers.find(customer => customer.id === id)
export const selectCustomerCount = (state: StoreState) => state.customers.length
export const selectCustomersByTier = (tier: string) => (state: StoreState) =>
  state.customers.filter(customer => customer.membershipTier === tier)

// Order Selectors
export const selectOrders = (state: StoreState) => state.orders
export const selectOrdersByCustomer = (customerId: string) => (state: StoreState) =>
  state.orders.filter(order => order.customerId === customerId)
export const selectTotalRevenue = (state: StoreState) => state.analytics.totalRevenue

// Analytics Selectors
export const selectAnalytics = (state: StoreState) => state.analytics
export const selectAverageOrderValue = (state: StoreState) => state.analytics.averageOrderValue

// UI State Selectors
export const selectIsLoading = (state: StoreState) => state.isLoading
export const selectError = (state: StoreState) => state.error
export const selectSelectedCustomer = (state: StoreState) => state.selectedCustomer 