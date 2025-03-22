import { supabase } from '@/lib/supabase/client';

export const createSuperAdmin = async () => {
  try {
    // Check if superadmin role exists, create if not
    let roleId: string;
    const { data: existingRole, error: roleCheckError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'superadmin')
      .maybeSingle();
    
    if (roleCheckError || !existingRole) {
      console.log('Creating superadmin role...');
      // Create the role
      const { data: newRole, error: createRoleError } = await supabase
        .from('roles')
        .insert([
          { 
            name: 'superadmin', 
            description: 'Super Administrator with full access',
            permissions: ['all']
          }
        ])
        .select('id')
        .single();
      
      if (createRoleError) {
        console.log('Error creating role, using string identifier:', createRoleError);
        // If we can't create the role, just use the string as identifier
        roleId = 'superadmin';
      } else {
        roleId = newRole.id;
      }
    } else {
      roleId = existingRole.id;
    }
    
    // Check if superadmin auth user exists
    let authUserId: string | undefined;
    
    try {
      // Try to sign in with superadmin credentials to check if auth user exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'superadmin@edu.az',
        password: 'Admin123!'
      });
      
      if (!signInError && signInData.user) {
        authUserId = signInData.user.id;
        console.log('Superadmin auth user exists with id:', authUserId);
      }
    } catch (signInError) {
      console.log('Superadmin auth user does not exist or invalid credentials');
    }
    
    // Create auth user if it doesn't exist
    if (!authUserId) {
      console.log('Creating superadmin auth user...');
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
      
      authUserId = signUpData?.user?.id;
      
      // Try to auto-confirm email
      if (authUserId) {
        try {
          const { error: confirmError } = await supabase.auth.admin.updateUserById(
            authUserId,
            { email_confirm: true }
          );
          
          if (confirmError) {
            console.warn('Could not auto-confirm email:', confirmError);
          } else {
            console.log('Email confirmed automatically');
          }
        } catch (confirmError) {
          console.warn('Could not access admin API for email confirmation');
        }
      }
    }
    
    if (!authUserId) {
      return {
        success: false,
        message: "Failed to get or create auth user"
      };
    }
    
    // Check if user record exists in users table
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'superadmin@edu.az')
      .maybeSingle();
    
    if (!userCheckError && existingUser) {
      console.log('Superadmin user record exists, updating...');
      
      // Update the user record to ensure information is correct
      const { error: updateError } = await supabase
        .from('users')
        .update({
          is_active: true,
          role_id: roleId,
          first_name: 'Super',
          last_name: 'Admin'
        })
        .eq('id', existingUser.id);
        
      if (updateError) {
        console.error('Failed to update user record:', updateError);
        return {
          success: false,
          message: "Failed to update user record: " + updateError.message
        };
      }
    } else {
      // Create user record if it doesn't exist
      console.log('Creating superadmin user record...');
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: authUserId,
          email: 'superadmin@edu.az',
          first_name: 'Super',
          last_name: 'Admin',
          role_id: roleId,
          is_active: true
        }]);
      
      if (insertError) {
        console.error('Failed to insert user record:', insertError);
        return { 
          success: false, 
          message: "Failed to insert user record: " + insertError.message
        };
      }
    }
    
    return { 
      success: true, 
      message: 'Superadmin created or updated successfully! You should now be able to log in with superadmin@edu.az / Admin123!'
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
