import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import React from 'react';

// useAuth hook-u mock et
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }) => children
}));

const mockUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>;

describe('LoginForm Component', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      login: vi.fn(),
      logout: vi.fn(),
      user: null
    });
  });

  it('should render the login form correctly', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    expect(screen.getByLabelText('Email')).toBeDefined();
    expect(screen.getByLabelText('Password')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Login' })).toBeDefined();
  });

  it('should call login function on form submission', () => {
    const loginMock = vi.fn();
    mockUseAuth.mockReturnValue({
      login: loginMock,
      logout: vi.fn(),
      user: null
    });

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    // Form-u doldur
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    
    // Formu təqdim et
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Login funksiyasının çağırıldığını yoxla
    expect(loginMock).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should display validation errors for empty fields', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    // Boş formu təqdim et
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Validation error-ların göstərildiyini yoxla
    expect(screen.getByText('Email is required')).toBeDefined();
    expect(screen.getByText('Password is required')).toBeDefined();
  });
});