
import { mockSupabase } from '../mocks/supabaseMock';
import authService from '@/services/supabase/authService';

// Apply the mock before running tests
jest.mock('@/services/supabase/supabaseClient', () => {
  return {
    supabase: mockSupabase()
  };
});

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Mock a successful login
      const mockUser = { id: 'user-id', email: 'test@example.com' };
      const mockCredentials = { email: 'test@example.com', password: 'password' };
      
      jest.spyOn(mockSupabase.auth, 'signInWithPassword').mockResolvedValueOnce({
        data: { user: mockUser, session: { access_token: 'token' } },
        error: null
      });
      
      const result = await authService.login(mockCredentials);
      
      expect(result).toBeTruthy();
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
    });

    it('should fail login with invalid credentials', async () => {
      // Mock a failed login
      const mockCredentials = { email: 'test@example.com', password: 'wrong-password' };
      
      jest.spyOn(mockSupabase.auth, 'signInWithPassword').mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' }
      });
      
      await expect(authService.login(mockCredentials)).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      // Mock a successful logout
      jest.spyOn(mockSupabase.auth, 'signOut').mockResolvedValueOnce({
        error: null
      });
      
      const result = await authService.logout();
      
      expect(result).toBe(true);
    });

    it('should handle logout errors', async () => {
      // Mock a failed logout
      jest.spyOn(mockSupabase.auth, 'signOut').mockResolvedValueOnce({
        error: { message: 'Logout error' }
      });
      
      await expect(authService.logout()).rejects.toThrow();
    });
  });

  describe('forgotPassword', () => {
    it('should send reset password email', async () => {
      // Mock a successful password reset
      jest.spyOn(mockSupabase.auth, 'resetPasswordForEmail').mockResolvedValueOnce({
        error: null
      });
      
      const result = await authService.forgotPassword('test@example.com');
      
      expect(result).toBe(true);
    });

    it('should handle reset password errors', async () => {
      // Mock a failed password reset
      jest.spyOn(mockSupabase.auth, 'resetPasswordForEmail').mockResolvedValueOnce({
        error: { message: 'Reset error' }
      });
      
      await expect(authService.forgotPassword('invalid@example.com')).rejects.toThrow();
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      // Mock a successful password reset
      jest.spyOn(mockSupabase.auth, 'updateUser').mockResolvedValueOnce({
        data: { user: { id: 'user-id' } },
        error: null
      });
      
      const resetData = {
        token: 'valid-token',
        newPassword: 'new-password'
      };
      
      const result = await authService.resetPassword(resetData);
      
      expect(result).toBe(true);
    });

    it('should handle reset password errors', async () => {
      // Mock a failed password reset
      jest.spyOn(mockSupabase.auth, 'updateUser').mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Update error' }
      });
      
      const resetData = {
        token: 'invalid-token',
        newPassword: 'weak'
      };
      
      await expect(authService.resetPassword(resetData)).rejects.toThrow();
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user', async () => {
      // Mock a current user
      const mockUser = { id: 'user-id', email: 'test@example.com' };
      jest.spyOn(mockSupabase.auth, 'getUser').mockResolvedValueOnce({
        data: { user: mockUser },
        error: null
      });
      
      // Mock the profile fetch
      jest.spyOn(mockSupabase.from('users'), 'select').mockReturnValueOnce({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValueOnce({
            data: { id: 'user-id', email: 'test@example.com', roles: { permissions: ['read'] } },
            error: null
          })
        })
      } as any);
      
      const result = await authService.getCurrentUser();
      
      expect(result).toBeTruthy();
      expect(result.id).toBe('user-id');
    });

    it('should return null if no current user', async () => {
      // Mock no current user
      jest.spyOn(mockSupabase.auth, 'getUser').mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'No user' }
      });
      
      await expect(authService.getCurrentUser()).rejects.toThrow();
    });
  });
});
