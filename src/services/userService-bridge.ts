
import { User, UserFilter, UserResponse, CreateUserDto, UpdateUserDto, EntityOption } from './userService/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for managing users
 */
const userService = {
  /**
   * Get users with optional filtering
   */
  getUsers: async (filters: UserFilter = {}): Promise<UserResponse> => {
    try {
      let query = supabase.from('users').select('*');

      // Apply filters
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters.roleId) {
        query = query.eq('role_id', filters.roleId);
      }

      if (filters.regionId) {
        query = query.eq('region_id', filters.regionId);
      }

      if (filters.sectorId) {
        query = query.eq('sector_id', filters.sectorId);
      }

      if (filters.schoolId) {
        query = query.eq('school_id', filters.schoolId);
      }

      if (filters.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      // Get total count
      const { count, error: countError } = await query.select('id', { count: 'exact', head: true });
      
      if (countError) {
        throw countError;
      }

      // Apply pagination
      if (filters.page && filters.pageSize) {
        const from = (filters.page - 1) * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      }

      // Apply sorting
      if (filters.sortField) {
        query = query.order(filters.sortField, { ascending: filters.sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Execute query
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return { data, count: count || 0, error: null };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { data: null, count: 0, error };
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*, roles(*)')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as User;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  },

  /**
   * Create a new user
   */
  createUser: async (user: CreateUserDto): Promise<User | null> => {
    try {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          first_name: user.firstName,
          last_name: user.lastName
        }
      });

      if (authError) {
        throw authError;
      }

      // Then create user profile
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          role_id: user.roleId,
          region_id: user.regionId || null,
          sector_id: user.sectorId || null,
          school_id: user.schoolId || null,
          phone: user.phone || null,
          utis_code: user.utisCode || null,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as User;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  },

  /**
   * Update an existing user
   */
  updateUser: async (id: string, user: UpdateUserDto): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          first_name: user.firstName,
          last_name: user.lastName,
          role_id: user.roleId,
          region_id: user.regionId || null,
          sector_id: user.sectorId || null,
          school_id: user.schoolId || null,
          phone: user.phone || null,
          utis_code: user.utisCode || null,
          is_active: user.isActive
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as User;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  },

  /**
   * Delete a user
   */
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      // Delete from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      
      if (authError) {
        throw authError;
      }

      // Delete from users table
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  },

  /**
   * Block a user
   */
  blockUser: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error blocking user:', error);
      return false;
    }
  },

  /**
   * Activate a user
   */
  activateUser: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: true })
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error activating user:', error);
      return false;
    }
  },

  /**
   * Reset user password
   */
  resetPassword: async (id: string): Promise<boolean> => {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('email')
        .eq('id', id)
        .single();
      
      if (!userData) {
        throw new Error('User not found');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(userData.email);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  },

  /**
   * Change user's password
   */
  changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  },

  /**
   * Get all roles
   */
  getRoles: async (): Promise<EntityOption[]> => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('id, name')
        .order('name');

      if (error) {
        throw error;
      }

      return data.map(role => ({
        id: role.id,
        name: role.name
      }));
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  },

  /**
   * Get all regions
   */
  getRegions: async (): Promise<EntityOption[]> => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('id, name')
        .order('name');

      if (error) {
        throw error;
      }

      return data.map(region => ({
        id: region.id,
        name: region.name
      }));
    } catch (error) {
      console.error('Error fetching regions:', error);
      return [];
    }
  },

  /**
   * Get sectors for a region
   */
  getSectors: async (regionId: string): Promise<EntityOption[]> => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('id, name')
        .eq('region_id', regionId)
        .order('name');

      if (error) {
        throw error;
      }

      return data.map(sector => ({
        id: sector.id,
        name: sector.name
      }));
    } catch (error) {
      console.error('Error fetching sectors:', error);
      return [];
    }
  },

  /**
   * Get schools for a sector
   */
  getSchools: async (sectorId: string): Promise<EntityOption[]> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name')
        .eq('sector_id', sectorId)
        .order('name');

      if (error) {
        throw error;
      }

      return data.map(school => ({
        id: school.id,
        name: school.name
      }));
    } catch (error) {
      console.error('Error fetching schools:', error);
      return [];
    }
  },

  /**
   * Alias for resetPassword to match existing API calls
   */
  resetUserPassword: async (id: string): Promise<boolean> => {
    return userService.resetPassword(id);
  },
};

export default userService;
