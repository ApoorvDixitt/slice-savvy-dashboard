import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock common UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, type, variant }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      type={type}
      className={variant}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ id, value, onChange, type, step, required }: any) => (
    <input
      data-testid="input"
      id={id}
      value={value}
      onChange={onChange}
      type={type}
      step={step}
      required={required}
    />
  ),
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: any) => (
    <label data-testid="label" htmlFor={htmlFor}>
      {children}
    </label>
  ),
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: ({ id, value, onChange, required }: any) => (
    <textarea
      data-testid="textarea"
      id={id}
      value={value}
      onChange={onChange}
      required={required}
    />
  ),
}));

// Simplified Select component mock with proper label association
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select">
      <select
        data-testid="select-input"
        id="category"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        aria-label="Category"
      >
        {children}
      </select>
    </div>
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  ),
}));

// Custom render function that includes common providers
const customRender = (ui: React.ReactElement, options = {}) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    ),
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render }; 