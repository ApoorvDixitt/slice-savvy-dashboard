import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { MenuItemDialog } from '../MenuItemDialog';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/test-utils';

// Mock the Dialog component from shadcn/ui
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => 
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => 
    <h2 data-testid="dialog-title">{children}</h2>,
}));

describe('MenuItemDialog', () => {
  const mockCategories = ['Appetizers', 'Main Course', 'Desserts'];
  const mockOnSave = vi.fn();
  const mockOnOpenChange = vi.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onSave: mockOnSave,
    categories: mockCategories,
  };

  it('renders add new item dialog correctly', () => {
    render(<MenuItemDialog {...defaultProps} />);
    
    expect(screen.getByText('Add Menu Item')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Ingredients (comma-separated)')).toBeInTheDocument();
    expect(screen.getByLabelText('Mark as Popular')).toBeInTheDocument();
  });

  it('renders edit item dialog correctly with existing data', () => {
    const existingItem = {
      id: '1',
      name: 'Test Item',
      category: 'Main Course',
      price: 15.99,
      description: 'Test description',
      ingredients: ['ingredient1', 'ingredient2'],
      isPopular: true,
    };

    render(<MenuItemDialog {...defaultProps} menuItem={existingItem} />);
    
    expect(screen.getByText('Edit Menu Item')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Test Item');
    expect(screen.getByLabelText('Price')).toHaveValue(15.99);
    expect(screen.getByLabelText('Description')).toHaveValue('Test description');
    expect(screen.getByLabelText('Ingredients (comma-separated)')).toHaveValue('ingredient1, ingredient2');
    expect(screen.getByLabelText('Mark as Popular')).toBeChecked();
  });

  it('handles form submission correctly', async () => {
    render(<MenuItemDialog {...defaultProps} />);
    
    await userEvent.type(screen.getByLabelText('Name'), 'New Item');
    await userEvent.type(screen.getByLabelText('Price'), '19.99');
    await userEvent.type(screen.getByLabelText('Description'), 'New description');
    await userEvent.type(screen.getByLabelText('Ingredients (comma-separated)'), 'ing1, ing2');
    
    // Select a category using the aria-label
    const select = screen.getByLabelText('Category');
    fireEvent.change(select, { target: { value: 'Main Course' } });
    
    fireEvent.click(screen.getByText('Add Item'));

    expect(mockOnSave).toHaveBeenCalledWith({
      name: 'New Item',
      category: 'Main Course',
      price: 19.99,
      description: 'New description',
      ingredients: ['ing1', 'ing2'],
      isPopular: false,
    });
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('handles cancel button correctly', () => {
    render(<MenuItemDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('handles ingredients input correctly', async () => {
    render(<MenuItemDialog {...defaultProps} />);
    
    const ingredientsInput = screen.getByLabelText('Ingredients (comma-separated)');
    await userEvent.type(ingredientsInput, 'ingredient1, ingredient2, ingredient3');
    
    expect(ingredientsInput).toHaveValue('ingredient1, ingredient2, ingredient3');
  });

  it('handles popular checkbox correctly', async () => {
    render(<MenuItemDialog {...defaultProps} />);
    
    const popularCheckbox = screen.getByLabelText('Mark as Popular');
    expect(popularCheckbox).not.toBeChecked();
    
    await userEvent.click(popularCheckbox);
    expect(popularCheckbox).toBeChecked();
  });
}); 