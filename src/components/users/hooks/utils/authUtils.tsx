import { supabase } from '@/lib/supabase/client';
import { AuthError } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

/**
 * Checks if a user with the given email exists in the auth database
 */
export const checkExistingAuthUser = async (email: string, password: string): Promise<{ userId?: string; error?: Error }> => {
  try {
    const signInResponse = await supabase.auth
      .signInWithPassword({
        email: email,
        password: password || "dummy-password-for-check"
      });

    const signInError = signInResponse.error;
    const existingAuthUser = signInResponse.data?.user;
      
    if (signInError && !signInError.message.includes('Invalid login credentials')) {
      console.error('Error checking existing auth user:', signInError);
      return { error: signInError };
    } else if (existingAuthUser) {
      return { userId: existingAuthUser.id };
    }

    return {};
  } catch (e) {
    console.log('Error during auth check:', e);
    return { error: e as Error };
  }
};

/**
 * Checks if a user with the given email exists in the users table
 */
export const checkExistingDatabaseUser = async (email: string): Promise<{ userId?: string; error?: Error }> => {
  try {
    const { data: existingUsers, error } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();
        
    if (error) {
      return { error: new Error(error.message) };
    }
        
    if (existingUsers?.id) {
      return { userId: existingUsers.id };
    }
      
    return {};
  } catch (e) {
    return { error: e as Error };
  }
};

/**
 * Register a new user in the auth database
 */
export const registerAuthUser = async (userData: { 
  email: string; 
  password: string; 
  firstName: string; 
  lastName: string; 
  role: string;
}): Promise<{ userId?: string; error?: Error }> => {
  try {
    const authResult = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role
        }
      }
    });
    
    if (authResult.error) {
      return { error: authResult.error };
    }
    
    if (authResult.data?.user?.id) {
      return { userId: authResult.data.user.id };
    }
    
    return { error: new Error('User ID not returned from auth registration') };
  } catch (e) {
    return { error: e as Error };
  }
};

/**
 * Handle auth error including "User already registered" scenarios
 */
export const handleAuthError = async (
  error: AuthError | Error,
  email: string,
  password: string
): Promise<{ userId?: string; error?: Error }> => {
  const errorMsg = 'message' in error ? error.message : String(error);
  
  // If user is already registered, try to fetch their ID
  if (errorMsg.includes('already registered')) {
    try {
      const { userId, error: signInError } = await checkExistingAuthUser(email, password);
      
      if (userId) {
        return { userId };
      }
      
      if (signInError) {
        return { 
          error: new Error(`Autentifikasiya xətası: İstifadəçi mövcuddur, lakin giriş etmək mümkün olmadı`) 
        };
      }
    } catch (signinError) {
      return { 
        error: new Error(`Autentifikasiya xətası: ${(signinError as Error).message}`) 
      };
    }
  }
  
  return { error };
};
