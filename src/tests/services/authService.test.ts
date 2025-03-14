
import { mockSupabase } from '../mocks/supabaseMock';
import authService from '@/services/supabase/authService';

// Apply the mock before running tests
mockSupabase();

describe('authService', () => {
  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Mock a successful login
      const mockUser = { id: 'user-id', email: 'test@example.com' };
      jest.spyOn(mockSupabase().supabase.auth, 'signInWithPassword').mockResolvedValueOnce({
        data: { user: mockUser, session: { access_token: 'token' } },
        error: null
      });
      
      const result = await authService.login('test@example.com', 'password');
      
      expect(result).toBeTruthy();
      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
    });

    it('should fail login with invalid credentials', async () => {
      // Mock a failed login
      jest.spyOn(mockSupabase().supabase.auth, 'signInWithPassword').mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' }
      });
      
      const result = await authService.login('test@example.com', 'wrong-password');
      
      expect(result).toBeTruthy();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      // Mock a successful logout
      jest.spyOn(mockSupabase().supabase.auth, 'signOut').mockResolvedValueOnce({
        error: null
      });
      
      const result = await authService.logout();
      
      expect(result).toBeTruthy();
      expect(result.success).toBe(true);
    });

    it('should handle logout errors', async () => {
      // Mock a failed logout
      jest.spyOn(mockSupabase().supabase.auth, 'signOut').mockResolvedValueOnce({
        error: { message: 'Logout error' }
      });
      
      const result = await authService.logout();
      
      expect(result).toBeTruthy();
      expect(result.success).toBe(false);
    });
  });

  describe('resetPassword', () => {
    it('should send reset password email', async () => {
      // Mock a successful password reset
      jest.spyOn(mockSupabase().supabase.auth, 'resetPasswordForEmail').mockResolvedValueOnce({
        data: {}, 
        error: null
      });
      
      const result = await authService.resetPassword('test@example.com');
      
      expect(result).toBeTruthy();
      expect(result.success).toBe(true);
    });

    it('should handle reset password errors', async () => {
      // Mock a failed password reset
      jest.spyOn(mockSupabase().supabase.auth, 'resetPasswordForEmail').mockResolvedValueOnce({
        data: null,
        error: { message: 'Reset error' }
      });
      
      const result = await authService.resetPassword('invalid@example.com');
      
      expect(result).toBeTruthy();
      expect(result.success).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user', async () => {
      // Mock a current user
      const mockUser = { id: 'user-id', email: 'test@example.com' };
      jest.spyOn(mockSupabase().supabase.auth, 'getUser').mockResolvedValueOnce({
        data: { user: mockUser },
        error: null
      });
      
      const result = await authService.getCurrentUser();
      
      expect(result).toBeTruthy();
      expect(result.id).toBe(mockUser.id);
    });

    it('should return null if no current user', async () => {
      // Mock no current user
      jest.spyOn(mockSupabase().supabase.auth, 'getUser').mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'No user' }
      });
      
      const result = await authService.getCurrentUser();
      
      expect(result).toBeNull();
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      // Mock a successful password update
      jest.spyOn(mockSupabase().supabase.auth, 'updateUser').mockResolvedValueOnce({
        data: { user: { id: 'user-id' } },
        error: null
      });
      
      const result = await authService.updatePassword('new-password');
      
      expect(result).toBeTruthy();
      expect(result.success).toBe(true);
    });

    it('should handle password update errors', async () => {
      // Mock a failed password update
      jest.spyOn(mockSupabase().supabase.auth, 'updateUser').mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Update error' }
      });
      
      const result = await authService.updatePassword('weak');
      
      expect(result).toBeTruthy();
      expect(result.success).toBe(false);
    });
  });
});
