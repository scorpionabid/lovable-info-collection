
import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Users } from 'lucide-react';

describe('StatCard Component', () => {
  it('renders the title and value correctly', () => {
    render(
      <StatCard 
        title="Users" 
        value="1,234" 
        icon={<Users data-testid="users-icon" />} 
      />
    );
    
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
  });

  it('shows positive change with up arrow', () => {
    render(
      <StatCard 
        title="Users" 
        value="1,234" 
        icon={<Users />} 
        change={5}
      />
    );
    
    expect(screen.getByText('5%')).toBeInTheDocument();
    // Check for the presence of an up arrow (usually a class or SVG)
    // This would need to be adapted based on your actual implementation
    const changeElement = screen.getByText('5%').closest('div');
    expect(changeElement).toHaveClass('text-green-500');
  });

  it('shows negative change with down arrow', () => {
    render(
      <StatCard 
        title="Users" 
        value="1,234" 
        icon={<Users />} 
        change={-10}
      />
    );
    
    expect(screen.getByText('-10%')).toBeInTheDocument();
    // Check for the presence of a down arrow
    const changeElement = screen.getByText('-10%').closest('div');
    expect(changeElement).toHaveClass('text-red-500');
  });

  it('applies custom color class when provided', () => {
    render(
      <StatCard 
        title="Users" 
        value="1,234" 
        icon={<Users />} 
        color="purple"
      />
    );
    
    // Find the card element and check for the custom color class
    const cardElement = screen.getByText('Users').closest('div');
    expect(cardElement).toHaveClass('bg-purple-50');
  });

  it('handles undefined change value', () => {
    render(
      <StatCard 
        title="Users" 
        value="1,234" 
        icon={<Users />} 
      />
    );
    
    // Change indicator should not be present
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });
});
