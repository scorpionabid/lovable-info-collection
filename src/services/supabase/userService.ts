
import { supabase, User } from './supabaseClient';

const userService = {
  getUsers: async (filters?: { roleId?: string; regionId?: string; sectorId?: string; schoolId?: string; isActive?: boolean }) => {
    let query = supabase
      .from('users')
      .select('*, roles(name)') // Join with roles to get role name
      .order('last_name');
    
    if (filters?.roleId) {
      query = query.eq('role_id', filters.roleId);
    }
    
    if (filters?.regionId) {
      query = query.eq('region_id', filters.regionId);
    }
    
    if (filters?.sectorId) {
      query = query.eq('sector_id', filters.sectorId);
    }
    
    if (filters?.schoolId) {
      query = query.eq('school_id', filters.schoolId);
    }
    
    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },
  
  getUserById: async (id: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*, roles(name)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  createUser: async (user: Omit<User, 'id' | 'created_at'>) => {
    // First create Supabase auth user with email and random password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: tempPassword,
      email_confirm: true
    });
    
    if (authError) throw authError;
    
    // Then create the user profile
    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        ...user, 
        id: authData.user?.id, // Use the Supabase auth user id
        created_at: new Date().toISOString() 
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Generate password reset link for the user to set their password
    await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/password-reset`,
    });
    
    return data;
  },
  
  updateUser: async (id: string, user: Partial<Omit<User, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase
      .from('users')
      .update({ ...user, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  deleteUser: async (id: string) => {
    // In a real app, consider deactivating instead of deleting
    const { error } = await supabase
      .from('users')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  importUsers: async (users: Omit<User, 'id' | 'created_at'>[]) => {
    // This would be a more complex operation requiring batch processing
    // and handling of Supabase Auth operations for each user
    // For simplicity, this is a placeholder
    const importedUsers = [];
    for (const user of users) {
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: tempPassword,
        email_confirm: true
      });
      
      if (authError) continue; // Skip this user if there's an error
      
      // Create user profile
      const { data, error } = await supabase
        .from('users')
        .insert([{ 
          ...user, 
          id: authData.user?.id,
          created_at: new Date().toISOString() 
        }])
        .select()
        .single();
      
      if (!error && data) {
        importedUsers.push(data);
        
        // Send password reset email
        await supabase.auth.resetPasswordForEmail(user.email, {
          redirectTo: `${window.location.origin}/password-reset`,
        });
      }
    }
    
    return importedUsers;
  }
};

export default userService;
