import mockData from '@/data/mockData.json';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  ingredients: string[];
  isPopular: boolean;
}

// Initialize localStorage with mock data if it doesn't exist
const initializeStorage = () => {
  if (!localStorage.getItem('menuItems')) {
    localStorage.setItem('menuItems', JSON.stringify(mockData.menuItems));
  }
};

// Get menu items from localStorage
export const getMenuItems = (): MenuItem[] => {
  initializeStorage();
  const items = localStorage.getItem('menuItems');
  return items ? JSON.parse(items) : [];
};

// Save menu items to localStorage
export const saveMenuItems = (menuItems: MenuItem[]): boolean => {
  try {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    return true;
  } catch (error) {
    console.error('Error saving menu items:', error);
    return false;
  }
}; 