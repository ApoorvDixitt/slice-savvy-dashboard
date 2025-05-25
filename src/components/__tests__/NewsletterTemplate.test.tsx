import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import NewsletterTemplate from '../NewsletterTemplate';
import { render } from '@/test/test-utils';

describe('NewsletterTemplate', () => {
  it('renders with customer name', () => {
    render(<NewsletterTemplate customerName="John Doe" />);
    
    expect(screen.getByText('Hello, John Doe!')).toBeInTheDocument();
    expect(screen.getByText('This is a sample newsletter. More content will go here.')).toBeInTheDocument();
    expect(screen.getByText('Best regards,')).toBeInTheDocument();
    expect(screen.getByText('Your Company')).toBeInTheDocument();
  });

  it('renders with empty customer name', () => {
    render(<NewsletterTemplate customerName="" />);
    
    expect(screen.getByText('Hello, !')).toBeInTheDocument();
  });
}); 