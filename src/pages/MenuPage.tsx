import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MenuItemDialog } from '@/components/MenuItemDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { getMenuItems, saveMenuItems } from '@/utils/menuUtils';
import { Pizza } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  ingredients: string[];
  isPopular: boolean;
}

const MenuPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>();
  const { toast } = useToast();

  // Load menu items from localStorage on component mount
  useEffect(() => {
    const items = getMenuItems();
    setMenuItems(items);
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All Categories', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const handleAddItem = () => {
    setSelectedItem(undefined);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveItem = (itemData: Omit<MenuItem, 'id'>) => {
    let updatedItems: MenuItem[];
    
    if (selectedItem) {
      // Edit existing item
      updatedItems = menuItems.map(item => 
        item.id === selectedItem.id ? { ...itemData, id: item.id } : item
      );
    } else {
      // Add new item
      const newItem: MenuItem = {
        ...itemData,
        id: `ITEM${Date.now()}`,
      };
      updatedItems = [...menuItems, newItem];
    }

    // Update state
    setMenuItems(updatedItems);

    // Save to localStorage
    const success = saveMenuItems(updatedItems);
    
    if (success) {
      toast({
        title: selectedItem ? "Menu Item Updated" : "Menu Item Added",
        description: selectedItem 
          ? "The menu item has been successfully updated."
          : "The new menu item has been successfully added.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = () => {
    if (selectedItem) {
      const updatedItems = menuItems.filter(item => item.id !== selectedItem.id);
      
      // Update state
      setMenuItems(updatedItems);

      // Save to localStorage
      const success = saveMenuItems(updatedItems);
      
      if (success) {
        toast({
          title: "Menu Item Deleted",
          description: "The menu item has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the item. Please try again.",
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menu Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your pizza menu, pricing, and ingredients</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          onClick={handleAddItem}
        >
          + Add Menu Item
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader className="flex-none">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg truncate">{item.name}</CardTitle>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="whitespace-nowrap">{item.category}</Badge>
                    {item.isPopular && (
                      <Badge className="bg-orange-100 text-orange-800 whitespace-nowrap">Popular</Badge>
                    )}
                  </div>
                </div>
                <p className="text-2xl font-bold text-orange-600 whitespace-nowrap">${item.price}</p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{item.description}</p>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">INGREDIENTS</p>
                <div className="flex flex-wrap gap-1">
                  {item.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="text-xs whitespace-nowrap">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2 mt-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditItem(item)}
                >
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteItem(item)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <MenuItemDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        menuItem={selectedItem}
        onSave={handleSaveItem}
        categories={categories.filter(cat => cat !== 'All Categories')}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the menu item
              {selectedItem && ` "${selectedItem.name}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MenuPage;
