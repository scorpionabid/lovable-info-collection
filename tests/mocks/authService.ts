// tests/mocks/authService.ts
import { vi } from 'vitest';
import { authScenarios } from '../scenarios/authScenarios';

// Mock authentication service
export const mockAuthService = {
  login: vi.fn(async (credentials) => {
    // Find matching scenario
    const matchingScenario = authScenarios.loginScenarios.find(
      scenario => scenario.email === credentials.email
    );

    if (!matchingScenario) {
      throw new Error('authentication-failed');
    }

    return {
      user: {
        email: credentials.email,
        role: matchingScenario.role
      },
      token: 'mock-token'
    };
  }),

  logout: vi.fn(async () => {
    // Simulate logout process
    return true;
  }),

  getCurrentUser: vi.fn(async () => {
    // Return mock user data
    return {
      id: 'mock-user-id',
      email: 'test@example.com',
      role: 'SuperAdmin'
    };
  }),

  getUserPermissions: vi.fn(async (user) => {
    // Map role to permissions
    const rolePermissions = {
      'SuperAdmin': ['read:all', 'write:all', 'delete:all'],
      'RegionAdmin': ['read:region', 'write:region'],
      'SectorAdmin': ['read:sector', 'write:sector'],
      'SchoolAdmin': ['read:school', 'write:school']
    };

    return rolePermissions[user.role] || [];
  })
};

export default mockAuthService;