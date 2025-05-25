import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import mockData from '../data/mockData.json'
import { StoreState, Customer, Order, Analytics } from './types'
import { errorHandler } from './middleware/errorHandler'
import { migrate } from './migrations'
import { withLoading } from './utils/loadingState'

// Create Store
export const useStore = create<StoreState>()(
  devtools(
    persist(
      errorHandler((set, get) => ({
        // Initial State
        customers: mockData.customers,
        orders: mockData.orders,
        analytics: {
          totalRevenue: mockData.analytics.totalRevenue,
          totalOrders: mockData.analytics.totalOrders,
          averageOrderValue: mockData.analytics.averageOrderValue,
          customerCount: mockData.analytics.customerCount,
        },
        selectedCustomer: null,
        isLoading: false,
        error: null,

        // Actions
        setCustomers: (customers) => set({ customers }),
        setOrders: (orders) => set({ orders }),
        setAnalytics: (analytics) => set({ analytics }),
        setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),

        // Computed Actions with Loading State
        getCustomerById: async (id) => {
          return withLoading(get(), async () => {
            const state = get()
            return state.customers.find(customer => customer.id === id)
          })
        },

        getCustomerOrders: async (customerId) => {
          return withLoading(get(), async () => {
            const state = get()
            return state.orders.filter(order => order.customerId === customerId)
          })
        },

        updateCustomer: async (updatedCustomer) => {
          return withLoading(get(), async () => {
            const state = get()
            const updatedCustomers = state.customers.map(customer =>
              customer.id === updatedCustomer.id ? updatedCustomer : customer
            )
            set({ customers: updatedCustomers })
          })
        },

        deleteCustomer: async (customerId) => {
          return withLoading(get(), async () => {
            const state = get()
            const updatedCustomers = state.customers.filter(
              customer => customer.id !== customerId
            )
            set({ customers: updatedCustomers })
          })
        },
      })),
      {
        name: 'slice-savvy-store',
        partialize: (state) => ({
          customers: state.customers,
          orders: state.orders,
          analytics: state.analytics,
        }),
        version: 1,
        migrate: (persistedState: any, version: number) => {
          return migrate(persistedState, version)
        },
      }
    )
  )
) 