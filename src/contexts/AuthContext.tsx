
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { User, UserRole } from '@/lib/supabase/types/user';
import { useToast } from '@/hooks/use-toast';

// Define the auth context shape
interface AuthContextProps {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isUserReady: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  error: any;
  // Add these properties for compatibility
  permissions: string[];
  authInitialized: boolean;
  sessionExists: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextProps>({
  user: null,
  userRole: UserRole.Unknown,
  loading: true,
  isAuthenticated: false,
  isLoading: true,
  isUserReady: false,
  login: async () => ({}),
  logout: async () => {},
  resetPassword: async () => ({}),
  signUp: async () => ({}),
  error: null,
  // Default values for compatibility properties
  permissions: [],
  authInitialized: false,
  sessionExists: false
});

// Export the context hook
export const useAuth = () => useContext(AuthContext);

// Provide the context component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.Unknown);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isUserReady, setIsUserReady] = useState(false);
  const { toast } = useToast();
  
  // Add compatibility states
  const [permissions, setPermissions] = useState<string[]>([]);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [sessionExists, setSessionExists] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Get session
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        
        if (session?.user) {
          // We have a user, now get their profile data
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*, roles:role_id(name, permissions)')
              .eq('id', session.user.id)
              .single();
              
            if (userError) throw userError;
            
            if (userData) {
              setUser(userData);
              
              // Set user role
              const roleValue = userData.role || userData.roles;
              let userRoleValue = UserRole.Unknown;
              
              if (typeof roleValue === 'object' && roleValue) {
                const roleName = roleValue.name || '';
                userRoleValue = mapStringToUserRole(roleName);
                
                // Set permissions
                setPermissions(roleValue.permissions || []);
              } else if (typeof roleValue === 'string') {
                userRoleValue = mapStringToUserRole(roleValue);
              }
              
              setUserRole(userRoleValue);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setError(error);
          }
        }
        
        // Update session status
        setSessionExists(!!session);
        setAuthInitialized(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError(error);
      } finally {
        setLoading(false);
        setIsUserReady(true);
      }
    };
    
    initAuth();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Update user on sign in
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*, roles:role_id(name, permissions)')
            .eq('id', session.user.id)
            .single();
            
          if (userError) throw userError;
          
          if (userData) {
            setUser(userData);
            
            // Set user role
            const roleValue = userData.role || userData.roles;
            let userRoleValue = UserRole.Unknown;
            
            if (typeof roleValue === 'object' && roleValue) {
              const roleName = roleValue.name || '';
              userRoleValue = mapStringToUserRole(roleName);
              
              // Set permissions
              setPermissions(roleValue.permissions || []);
            } else if (typeof roleValue === 'string') {
              userRoleValue = mapStringToUserRole(roleValue);
            }
            
            setUserRole(userRoleValue);
          }
          
          setSessionExists(true);
        } catch (error) {
          console.error('Error fetching user data on auth change:', error);
          setError(error);
        }
      } else if (event === 'SIGNED_OUT') {
        // Clear user on sign out
        setUser(null);
        setUserRole(UserRole.Unknown);
        setPermissions([]);
        setSessionExists(false);
      }
    });
    
    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Helper to map role string to UserRole enum
  const mapStringToUserRole = (role: string): UserRole => {
    switch (role) {
      case 'super-admin':
      case 'superadmin':
        return UserRole.SuperAdmin;
      case 'region-admin':
        return UserRole.RegionAdmin;
      case 'sector-admin':
        return UserRole.SectorAdmin;
      case 'school-admin':
        return UserRole.SchoolAdmin;
      default:
        return UserRole.Unknown;
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      setError(error);
      toast({
        title: "Login failed",
        description: error.message || 'An error occurred during login',
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user state
      setUser(null);
      setUserRole(UserRole.Unknown);
      setPermissions([]);
      setSessionExists(false);
    } catch (error: any) {
      setError(error);
      toast({
        title: "Logout failed",
        description: error.message || 'An error occurred during logout',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for the reset link",
      });
      
      return data;
    } catch (error: any) {
      setError(error);
      toast({
        title: "Reset password failed",
        description: error.message || 'An error occurred',
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign up
  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account",
      });
      
      return data;
    } catch (error: any) {
      setError(error);
      toast({
        title: "Registration failed",
        description: error.message || 'An error occurred',
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userRole,
    loading,
    isAuthenticated: !!user,
    isLoading: loading,
    isUserReady,
    login,
    logout,
    resetPassword,
    signUp,
    error,
    // Add compatibility properties
    permissions,
    authInitialized,
    sessionExists
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
