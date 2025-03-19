// tests/mocks/supabase.ts
import { vi } from 'vitest';
import seed from '../supabase/seed';

export const mockSupabase = {
  auth: {
    signInWithPassword: vi.fn(async ({ email, password }) => {
      // Find user in seed data
      const user = seed.users.find(u => u.email === email);
      
      if (!user || password !== 'password') {
        return { 
          data: null, 
          error: { message: 'Invalid credentials' } 
        };
      }

      return {
        data: {
          user: { 
            id: user.id, 
            email: user.email 
          },
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token'
          }
        },
        error: null
      };
    }),

    signOut: vi.fn(async () => ({
      error: null
    })),

    onAuthStateChange: vi.fn((callback) => {
      // Simulate auth state change listener
      return {
        data: {
          subscription: {
            unsubscribe: vi.fn()
          }
        }
      };
    }),

    refreshSession: vi.fn(async () => ({
      data: {
        session: {
          access_token: 'refreshed-token',
          refresh_token: 'refreshed-refresh-token'
        }
      },
      error: null
    }))
  },

  from: vi.fn((tableName) => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: null,
      error: null
    })
  }))
};

export default mockSupabase;