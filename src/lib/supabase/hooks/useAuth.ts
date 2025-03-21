
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Session, User, AuthError } from '@supabase/supabase-js';

export type UserRole = 'super-admin' | 'region-admin' | 'sector-admin' | 'school-admin';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error);
          console.error('Session error:', error);
          return;
        }
        
        setSession(data.session);
        
        if (data.session?.user) {
          setUser(data.session.user);
          // Fetch user role from database
          await fetchUserRole(data.session.user.id);
        }
      } catch (err) {
        console.error('Error initializing session:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        setSession(newSession);
        
        if (event === 'SIGNED_IN' && newSession?.user) {
          console.log('User signed in:', newSession.user);
          setUser(newSession.user);
          await fetchUserRole(newSession.user.id);
          
          // Invalidate queries on sign in
          queryClient.invalidateQueries();
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setUserRole(undefined);
          
          // Clear all queries on sign out
          queryClient.clear();
        } else if (event === 'TOKEN_REFRESHED' && newSession?.user) {
          console.log('Token refreshed');
          setUser(newSession.user);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);
  
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role_id, roles:roles(name)')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }
      
      if (data?.roles?.name) {
        setUserRole(data.roles.name as UserRole);
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
    }
  };
  
  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error);
        throw error;
      }
      
      if (data.user) {
        setUser(data.user);
        await fetchUserRole(data.user.id);
        toast.success('Uğurla daxil oldunuz');
      }
      
      return data;
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Daxil ola bilmədik. E-poçt və ya şifrəni yoxlayın.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error);
        throw error;
      }
      
      setUser(null);
      setUserRole(undefined);
      
      // Clear all queries
      queryClient.clear();
      
      toast.success('Uğurla çıxış edildi');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Çıxış edərkən xəta baş verdi');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [queryClient]);
  
  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        setError(error);
        throw error;
      }
      
      toast.success('Şifrə sıfırlama linki e-poçtunuza göndərildi');
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error('Şifrə sıfırlama xətası');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        setError(error);
        throw error;
      }
      
      toast.success('Şifrəniz uğurla yeniləndi');
    } catch (err) {
      console.error('Update password error:', err);
      toast.error('Şifrə yeniləmə xətası');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { 
    user, 
    userRole, 
    session, 
    loading, 
    error, 
    login, 
    logout, 
    resetPassword, 
    updatePassword 
  };
};
