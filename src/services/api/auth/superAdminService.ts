
import { supabase } from '../../supabase/supabaseClient';

const superAdminService = {
  createSuperAdmin: async () => {
    try {
      // Step 1: Check if superadmin role exists, if not create it
      let roleId: string;
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'superadmin')
        .single();

      if (roleError) {
        // Create the superadmin role
        const { data: newRole, error: createRoleError } = await supabase
          .from('roles')
          .insert([
            { 
              name: 'superadmin', 
              description: 'Super Administrator with full access',
              // Omit permissions field as it causes issues
            }
          ])
          .select('id')
          .single();
          
        if (createRoleError) throw createRoleError;
        roleId = newRole.id;
      } else {
        roleId = roleData.id;
      }

      // Step 2: Check if superadmin user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'superadmin@edu.az')
        .single();

      if (!checkError && existingUser) {
        console.log('Superadmin user already exists');
        
        // Step 3a: Try to update the password if user exists
        const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          {
            password: 'Admin123!',
            email_confirm: true
          }
        );
        
        if (authUpdateError) {
          console.log('Unable to update auth user:', authUpdateError);
          // If we can't update, try to recreate the auth user
          const { data, error } = await supabase.auth.signUp({
            email: 'superadmin@edu.az',
            password: 'Admin123!',
            options: {
              data: {
                first_name: 'Super',
                last_name: 'Admin'
              }
            }
          });
          
          if (error && error.message !== 'User already registered') throw error;
        }
        
        return { 
          success: true, 
          message: 'Superadmin user exists. You can log in with superadmin@edu.az / Admin123!' 
        };
      }

      // Step 3b: If not exists, create the auth account
      console.log('Creating new superadmin user...');
      const { data, error } = await supabase.auth.signUp({
        email: 'superadmin@edu.az',
        password: 'Admin123!',
        options: {
          data: {
            first_name: 'Super',
            last_name: 'Admin'
          }
        }
      });

      if (error) throw error;
      
      if (!data.user?.id) {
        return { 
          success: false, 
          message: 'Failed to get user ID from sign up response' 
        };
      }

      // Step 4: Insert the user record with all required fields
      const { error: userError } = await supabase
        .from('users')
        .insert([
          { 
            id: data.user.id,
            email: 'superadmin@edu.az',
            first_name: 'Super',
            last_name: 'Admin',
            role_id: roleId,
            is_active: true
          }
        ]);
      
      if (userError) throw userError;
      
      // Step 5: Try to auto-confirm the email 
      try {
        const { error: confirmError } = await supabase.auth.admin.updateUserById(
          data.user.id,
          { email_confirm: true }
        );
        
        if (confirmError) {
          console.log('Could not auto-confirm email:', confirmError);
          return { 
            success: true, 
            message: 'Superadmin created! Check your email to verify the account before logging in with superadmin@edu.az / Admin123!' 
          };
        }
      } catch (confirmError) {
        console.log('Could not access admin API, user may need email confirmation');
        return { 
          success: true, 
          message: 'Superadmin created! Check your email to verify the account before logging in with superadmin@edu.az / Admin123!' 
        };
      }
      
      return { 
        success: true, 
        message: 'Superadmin created successfully! You can now log in with superadmin@edu.az / Admin123!' 
      };
    } catch (error) {
      console.error('Failed to create superadmin:', error);
      return { 
        success: false, 
        message: 'Failed to create superadmin: ' + (error instanceof Error ? error.message : 'Unknown error'), 
        error 
      };
    }
  }
};

export default superAdminService;
