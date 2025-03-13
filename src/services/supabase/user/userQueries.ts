
import { supabase } from '../supabaseClient';
import { User, UserFilters, CreateUserDto } from './types';

export const getUsers = async (filters?: UserFilters) => {
  try {
    let query = supabase
      .from('users')
      .select(`
        *,
        roles (
          id,
          name,
          description,
          permissions
        )
      `);

    if (filters) {
      if (filters.role) {
        const { data: roleData } = await supabase
          .from('roles')
          .select('id')
          .eq('name', filters.role)
          .single();
          
        if (roleData) {
          query = query.eq('role_id', roleData.id);
        }
      }
      
      if (filters.region_id) query = query.eq('region_id', filters.region_id);
      if (filters.sector_id) query = query.eq('sector_id', filters.sector_id);
      if (filters.school_id) query = query.eq('school_id', filters.school_id);
      
      if (filters.status === 'active') query = query.eq('is_active', true);
      if (filters.status === 'inactive') query = query.eq('is_active', false);
      
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as User[];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        roles (
          id,
          name,
          description,
          permissions
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data as User;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

export const checkUtisCodeExists = async (utisCode: string, userId?: string) => {
  try {
    let query = supabase
      .from('users')
      .select('id')
      .eq('utis_code', utisCode);
      
    if (userId) {
      query = query.neq('id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data && data.length > 0);
  } catch (error) {
    console.error('Error checking UTIS code uniqueness:', error);
    throw error;
  }
};

export const createUser = async (userData: Omit<User, 'id' | 'created_at'>) => {
  try {
    // Supabase requires us to use specific field names
    const userDataForInsert = {
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role_id: userData.role_id || '',
      region_id: userData.region_id,
      sector_id: userData.sector_id,
      school_id: userData.school_id,
      phone: userData.phone,
      utis_code: userData.utis_code,
      is_active: userData.is_active !== undefined ? userData.is_active : true
    };
    
    // Insert as array for proper typing and pass userDataForInsert as the array's only element
    const { data, error } = await supabase
      .from('users')
      .insert([userDataForInsert])
      .select(`
        *,
        roles (
          id,
          name,
          description,
          permissions
        )
      `)
      .single();
      
    if (error) throw error;
    
    if (userData.school_id && userData.role_id) {
      const { data: roleData } = await supabase
        .from('roles')
        .select('name')
        .eq('id', userData.role_id)
        .single();
        
      if (roleData?.name === 'school-admin') {
        console.log(`Ensuring user ${data.id} is properly linked as admin for school ${userData.school_id}`);
      }
    }
    
    return data as User;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select(`
        *,
        roles (
          id,
          name,
          description,
          permissions
        )
      `)
      .single();
      
    if (error) throw error;
    
    return data as User;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

export const blockUser = async (id: string) => {
  return updateUser(id, { is_active: false });
};

export const activateUser = async (id: string) => {
  return updateUser(id, { is_active: true });
};

export const resetPassword = async (id: string) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', id)
      .single();
      
    if (userError) throw userError;
    if (!user || !user.email) throw new Error('User not found or has no email');
    
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error resetting password for user with ID ${id}:`, error);
    throw error;
  }
};

export const createUsers = async (users: Array<Omit<CreateUserDto, 'id'>>) => {
  try {
    if (!users || users.length === 0) {
      return { data: [], error: new Error('No users provided') };
    }
    
    // Process each user individually to avoid bulk insert issues
    const results = [];
    const errors = [];
    
    for (const user of users) {
      try {
        // Ensure is_active is defined
        const userWithDefaults = {
          ...user,
          is_active: user.is_active !== undefined ? user.is_active : true
        };
        
        // Insert one record at a time with proper type handling
        // We need to cast this because createUser expects a User type but we have CreateUserDto
        const userData = userWithDefaults as unknown as Omit<User, 'id' | 'created_at'>;
        const result = await createUser(userData);
          
        if (result) {
          results.push(result);
        }
      } catch (err) {
        console.error(`Exception creating user ${user.email}:`, err);
        errors.push({ user, error: err });
      }
    }
    
    return { 
      data: results, 
      error: errors.length > 0 ? new Error(`${errors.length} users failed to create`) : null,
      errorDetails: errors
    };
  } catch (error) {
    console.error('Error creating users:', error);
    return { data: null, error };
  }
};
