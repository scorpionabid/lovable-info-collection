
import authService from '../services/api/authService';
import { supabase } from '../services/supabase/supabaseClient';

export const createSuperAdmin = async () => {
  try {
    // First check if superadmin role exists
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'superadmin')
      .single();

    let roleId;
    
    // If role doesn't exist, create it
    if (roleError) {
      console.log('Creating superadmin role...');
      const { data: newRole, error: createRoleError } = await supabase
        .from('roles')
        .insert([{
          name: 'superadmin',
          description: 'Super Administrator with full access',
          permissions: ['*']
        }])
        .select('id')
        .single();
        
      if (createRoleError) {
        console.error('Failed to create superadmin role:', createRoleError);
        return { 
          success: false, 
          message: "Failed to create superadmin role: " + createRoleError.message
        };
      }
      roleId = newRole.id;
    } else {
      roleId = roleData.id;
    }

    // Check if superadmin user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'superadmin@edu.az')
      .single();

    // If user exists, make sure it's properly configured in auth
    if (!checkError && existingUser) {
      console.log('Superadmin user exists, updating...');
      
      // First, try to sign in to check if the account is valid
      try {
        await authService.login({
          email: 'superadmin@edu.az',
          password: 'Admin123!'
        });
        
        // If login succeeds, the credentials are correct
        return { 
          success: true, 
          message: 'Superadmin account exists and is working! You can log in with superadmin@edu.az / Admin123!'
        };
      } catch (loginError) {
        console.log('Login failed, recreating auth user...');
        
        // Try to recreate the auth user with the correct password
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'superadmin@edu.az',
          password: 'Admin123!',
          options: {
            data: {
              first_name: 'Super',
              last_name: 'Admin'
            }
          }
        });
        
        if (signUpError && signUpError.message !== 'User already registered') {
          return { 
            success: false, 
            message: "Failed to recreate superadmin auth account: " + signUpError.message 
          };
        }
        
        // Force email confirmation regardless of settings
        const { error: adminUpdateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { email_confirm: true }
        );
        
        if (adminUpdateError) {
          console.warn('Could not force email confirmation. User may need to verify email:', adminUpdateError);
        }
        
        return { 
          success: true, 
          message: 'Superadmin account recreated! You should now be able to log in with superadmin@edu.az / Admin123!'
        };
      }
    }

    // Create new user if it doesn't exist
    console.log('Creating new superadmin user...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'superadmin@edu.az',
      password: 'Admin123!',
      options: {
        data: {
          first_name: 'Super',
          last_name: 'Admin'
        }
      }
    });

    if (signUpError && signUpError.message !== 'User already registered') {
      return { 
        success: false, 
        message: "Failed to create superadmin auth account: " + signUpError.message
      };
    }

    const userId = signUpData?.user?.id;
    
    if (!userId) {
      return {
        success: false,
        message: "Failed to get user ID after signup."
      };
    }

    // Insert user record into users table
    const { error: userError } = await supabase
      .from('users')
      .insert([{
        id: userId,
        email: 'superadmin@edu.az',
        first_name: 'Super',
        last_name: 'Admin',
        role_id: roleId,
        is_active: true
      }]);
    
    if (userError) {
      console.error('Failed to insert user record:', userError);
      return { 
        success: false, 
        message: "Failed to insert user record: " + userError.message
      };
    }

    // Try to auto-confirm the email
    try {
      const { error: adminUpdateError } = await supabase.auth.admin.updateUserById(
        userId,
        { email_confirm: true }
      );
      
      if (adminUpdateError) {
        console.warn('Could not force email confirmation. User may need to verify email:', adminUpdateError);
        return { 
          success: true, 
          message: 'Superadmin created! Please check your email to confirm the account before logging in. Email: superadmin@edu.az, Password: Admin123!'
        };
      }
    } catch (confirmError) {
      console.warn('Could not auto-confirm email, user may need to confirm via email:', confirmError);
      return {
        success: true,
        message: 'Superadmin created! Please check your email to confirm the account before logging in. Email: superadmin@edu.az, Password: Admin123!'
      };
    }
    
    return { 
      success: true, 
      message: 'Superadmin created successfully! You should now be able to log in with superadmin@edu.az / Admin123!'
    };
  } catch (error) {
    console.error('Failed to create superadmin:', error);
    return { 
      success: false, 
      message: "Failed to create superadmin: " + (error instanceof Error ? error.message : "Unknown error"),
      error 
    };
  }
};
