import { useStore } from '../store/store'

export const useCustomerStore = () => {
  const {
    customers,
    selectedCustomer,
    isLoading,
    error,
    setCustomers,
    setSelectedCustomer,
    setLoading,
    setError,
    getCustomerById,
    getCustomerOrders,
    updateCustomer,
    deleteCustomer,
  } = useStore()

  return {
    customers,
    selectedCustomer,
    isLoading,
    error,
    setCustomers,
    setSelectedCustomer,
    setLoading,
    setError,
    getCustomerById,
    getCustomerOrders,
    updateCustomer,
    deleteCustomer,
  }
} 