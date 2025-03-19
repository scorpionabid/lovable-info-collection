// tests/unit/users.test.ts
import userService from '@/services/api/userService';
import { describe, it, expect } from 'vitest';

describe('Users Test Suite', () => {
  it('should fetch user data', async () => {
    const user = await userService.getUserById('1');
    expect(user).toBeDefined();
  });
});