import { describe, it, expect } from 'vitest';
import authService from '@/services/api/authService';

describe('Auth Test Suite', () => {
  it('should login successfully', async () => {
    const loginResult = await authService.login('test@example.com', 'password');
    expect(loginResult.user).toBeDefined();
  });
});