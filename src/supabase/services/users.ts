
import { supabase } from '../client';
import { handleSupabaseError, withRetry } from '../client';
import { UserRoleClaims, UserWithRole, UserFilters, CreateUserDto, UpdateUserDto } from '../types';

// Get all users
export const getUsers = async (filters?: UserFilters): Promise<UserWithRole[]> => {
  try {
    let query = supabase
      .from('users')
      .select(`
        *,
        roles:role_id(id, name)
      `);

    // Apply filters
    if (filters?.search) {
      query = query.or(`
        first_name.ilike.%${filters.search}%,
        last_name.ilike.%${filters.search}%,
        email.ilike.%${filters.search}%
      `);
    }

    if (filters?.role_id) {
      query = query.eq('role_id', filters.role_id);
    }

    if (filters?.region_id) {
      query = query.eq('region_id', filters.region_id);
    }

    if (filters?.sector_id) {
      query = query.eq('sector_id', filters.sector_id);
    }

    if (filters?.school_id) {
      query = query.eq('school_id', filters.school_id);
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('is_active', filters.status === 'active');
    }

    // Apply pagination
    if (filters?.page && filters?.page_size) {
      const from = (filters.page - 1) * filters.page_size;
      const to = from + filters.page_size - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw handleSupabaseError(error, 'Get users');

    // Process data to add role properties
    return (data || []).map(user => ({
      ...user,
      role: user.roles?.name || 'unknown',
      roleName: user.roles?.name || 'Unknown'
    }));
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Get user by ID
export const getUserById = async (id: string): Promise<UserWithRole | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        roles:role_id(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw handleSupabaseError(error, 'Get user by ID');
    }

    if (!data) return null;

    return {
      ...data,
      role: data.roles?.name || 'unknown',
      roleName: data.roles?.name || 'Unknown'
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

// Create user
export const createUser = async (userData: CreateUserDto): Promise<UserWithRole> => {
  try {
    // Create auth user if password is provided
    let authUserId = null;
    if (userData.password) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name
          }
        }
      });

      if (authError) throw handleSupabaseError(authError, 'Create auth user');
      authUserId = authData.user?.id;
    }

    // Create user record in users table
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authUserId, // Use the auth user ID if available
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        role_id: userData.role_id,
        region_id: userData.region_id,
        sector_id: userData.sector_id,
        school_id: userData.school_id,
        utis_code: userData.utis_code,
        is_active: userData.is_active ?? true
      })
      .select(`
        *,
        roles:role_id(id, name)
      `)
      .single();

    if (error) throw handleSupabaseError(error, 'Create user');

    return {
      ...data,
      role: data.roles?.name || 'unknown',
      roleName: data.roles?.name || 'Unknown'
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user
export const updateUser = async (id: string, userData: UpdateUserDto): Promise<UserWithRole> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        role_id: userData.role_id,
        region_id: userData.region_id,
        sector_id: userData.sector_id,
        school_id: userData.school_id,
        utis_code: userData.utis_code,
        is_active: userData.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        roles:role_id(id, name)
      `)
      .single();

    if (error) throw handleSupabaseError(error, 'Update user');

    return {
      ...data,
      role: data.roles?.name || 'unknown',
      roleName: data.roles?.name || 'Unknown'
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw handleSupabaseError(error, 'Delete user');

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Block user
export const blockUser = async (id: string): Promise<UserWithRole> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        roles:role_id(id, name)
      `)
      .single();

    if (error) throw handleSupabaseError(error, 'Block user');

    return {
      ...data,
      role: data.roles?.name || 'unknown',
      roleName: data.roles?.name || 'Unknown'
    };
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

// Activate user
export const activateUser = async (id: string): Promise<UserWithRole> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        roles:role_id(id, name)
      `)
      .single();

    if (error) throw handleSupabaseError(error, 'Activate user');

    return {
      ...data,
      role: data.roles?.name || 'unknown',
      roleName: data.roles?.name || 'Unknown'
    };
  } catch (error) {
    console.error('Error activating user:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (id: string): Promise<boolean> => {
  try {
    // Get user email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', id)
      .single();

    if (userError) throw handleSupabaseError(userError, 'Get user email');

    if (!userData?.email) {
      throw new Error('User email not found');
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(userData.email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw handleSupabaseError(error, 'Reset password');

    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Get roles for dropdown
export const getRoles = async (currentUserId?: string, currentUserRole?: string): Promise<{ id: string; name: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('id, name')
      .order('name');

    if (error) throw handleSupabaseError(error, 'Get roles');

    // Filter roles based on current user's role if needed
    let filteredRoles = data || [];
    if (currentUserRole && currentUserRole !== 'super-admin') {
      // Regular admins can't create super admins
      filteredRoles = filteredRoles.filter(role => role.name !== 'super-admin');
    }

    return filteredRoles;
  } catch (error) {
    console.error('Error getting roles:', error);
    return [];
  }
};

// Get regions for dropdown
export const getRegions = async (currentUserId?: string, currentUserRole?: string): Promise<{ id: string; name: string }[]> => {
  try {
    // If current user is a region admin, only return their region
    if (currentUserRole === 'region-admin' && currentUserId) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('region_id')
        .eq('id', currentUserId)
        .single();

      if (userError) throw handleSupabaseError(userError, 'Get user region');

      if (userData?.region_id) {
        const { data, error } = await supabase
          .from('regions')
          .select('id, name')
          .eq('id', userData.region_id)
          .order('name');

        if (error) throw handleSupabaseError(error, 'Get specific region');

        return data || [];
      }
    }

    // For super admins or if above conditions aren't met
    const { data, error } = await supabase
      .from('regions')
      .select('id, name')
      .order('name');

    if (error) throw handleSupabaseError(error, 'Get regions');

    return data || [];
  } catch (error) {
    console.error('Error getting regions:', error);
    return [];
  }
};

// Get sectors for dropdown
export const getSectors = async (regionId?: string, currentUserId?: string, currentUserRole?: string): Promise<{ id: string; name: string }[]> => {
  try {
    // If region ID is provided, filter by it
    if (regionId) {
      const { data, error } = await supabase
        .from('sectors')
        .select('id, name')
        .eq('region_id', regionId)
        .order('name');

      if (error) throw handleSupabaseError(error, 'Get sectors by region');

      return data || [];
    }

    // If current user is a sector admin, only return their sector
    if (currentUserRole === 'sector-admin' && currentUserId) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('sector_id')
        .eq('id', currentUserId)
        .single();

      if (userError) throw handleSupabaseError(userError, 'Get user sector');

      if (userData?.sector_id) {
        const { data, error } = await supabase
          .from('sectors')
          .select('id, name')
          .eq('id', userData.sector_id)
          .order('name');

        if (error) throw handleSupabaseError(error, 'Get specific sector');

        return data || [];
      }
    }

    // For other cases, return all sectors
    const { data, error } = await supabase
      .from('sectors')
      .select('id, name')
      .order('name');

    if (error) throw handleSupabaseError(error, 'Get all sectors');

    return data || [];
  } catch (error) {
    console.error('Error getting sectors:', error);
    return [];
  }
};

// Get schools for dropdown
export const getSchools = async (sectorId?: string, currentUserId?: string, currentUserRole?: string): Promise<{ id: string; name: string }[]> => {
  try {
    // If sector ID is provided, filter by it
    if (sectorId) {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name')
        .eq('sector_id', sectorId)
        .order('name');

      if (error) throw handleSupabaseError(error, 'Get schools by sector');

      return data || [];
    }

    // If current user is a school admin, only return their school
    if (currentUserRole === 'school-admin' && currentUserId) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('school_id')
        .eq('id', currentUserId)
        .single();

      if (userError) throw handleSupabaseError(userError, 'Get user school');

      if (userData?.school_id) {
        const { data, error } = await supabase
          .from('schools')
          .select('id, name')
          .eq('id', userData.school_id)
          .order('name');

        if (error) throw handleSupabaseError(error, 'Get specific school');

        return data || [];
      }
    }

    // For other cases, return all schools
    const { data, error } = await supabase
      .from('schools')
      .select('id, name')
      .order('name');

    if (error) throw handleSupabaseError(error, 'Get all schools');

    return data || [];
  } catch (error) {
    console.error('Error getting schools:', error);
    return [];
  }
};
