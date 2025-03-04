
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
        .maybeSingle();

      if (roleError || !roleData) {
        // Create the superadmin role
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
          
        if (createRoleError) throw createRoleError;
        roleId = newRole.id;
      } else {
        roleId = roleData.id;
      }

      // Step 2: Check for auth user
      let authUserId: string | undefined;
      
      try {
        // Try sign-in to check if the auth user exists
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'superadmin@edu.az',
          password: 'Admin123!'
        });
        
        if (!signInError && signInData.user) {
          authUserId = signInData.user.id;
          console.log('Auth user exists with ID:', authUserId);
        }
      } catch (e) {
        console.log('Auth user does not exist or invalid credentials');
      }
      
      // Create auth user if needed
      if (!authUserId) {
        console.log('Creating new auth user...');
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
        authUserId = data.user?.id;
        
        // Try to auto-confirm the email
        if (authUserId) {
          try {
            await supabase.auth.admin.updateUserById(
              authUserId,
              { email_confirm: true }
            );
          } catch (confirmError) {
            console.log('Could not auto-confirm email, user may need manual verification');
          }
        }
      }
      
      if (!authUserId) {
        return { 
          success: false, 
          message: 'Failed to get or create auth user' 
        };
      }

      // Step 3: Check for user record in users table
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'superadmin@edu.az')
        .maybeSingle();

      if (!checkError && existingUser) {
        console.log('User record exists, updating...');
        
        // Update the user record
        const { error: updateError } = await supabase
          .from('users')
          .update({
            first_name: 'Super',
            last_name: 'Admin',
            role_id: roleId,
            is_active: true
          })
          .eq('id', existingUser.id);
        
        if (updateError) {
          console.error('Failed to update user record:', updateError);
          return {
            success: false,
            message: 'Failed to update user record: ' + updateError.message
          };
        }
      } else {
        // Insert user record if it doesn't exist
        console.log('Creating user record...');
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
            message: 'Failed to insert user record: ' + insertError.message
          };
        }
      }
      
      return { 
        success: true, 
        message: 'Superadmin created or updated successfully! You can now log in with superadmin@edu.az / Admin123!' 
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
