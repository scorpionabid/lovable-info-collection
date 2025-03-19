import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Vahid AuthContext mock
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn().mockReturnValue({
    user: { id: '1', email: 'test@example.com' },
    login: vi.fn().mockResolvedValue(true),
    logout: vi.fn().mockResolvedValue(true),
    isAuthenticated: true
  }),
  AuthProvider: ({ children }) => children
}));

// Servis mock-ları
vi.mock('@/services/api/authService', () => ({
  default: {
    login: vi.fn().mockResolvedValue({ user: { id: '1', email: 'test@example.com' }, token: 'token123' }),
    logout: vi.fn().mockResolvedValue(true),
    getCurrentUser: vi.fn().mockResolvedValue({ id: '1', email: 'test@example.com' })
  }
}));

// Validasiya mock-ları
vi.mock('@/utils/dataValidation', () => ({
  validateData: vi.fn().mockReturnValue(true),
  validateLoginForm: vi.fn().mockReturnValue({ isValid: true, errors: {} })
}));

// Qlobal mock-lar
global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  };
};