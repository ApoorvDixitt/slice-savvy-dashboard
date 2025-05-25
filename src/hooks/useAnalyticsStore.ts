import { useStore } from '../store/store'
import { selectAnalytics, selectTotalRevenue, selectAverageOrderValue } from '../store/selectors'

export const useAnalyticsStore = () => {
  const analytics = useStore(selectAnalytics)
  const totalRevenue = useStore(selectTotalRevenue)
  const averageOrderValue = useStore(selectAverageOrderValue)
  const setAnalytics = useStore(state => state.setAnalytics)

  return {
    analytics,
    totalRevenue,
    averageOrderValue,
    setAnalytics,
  }
} 