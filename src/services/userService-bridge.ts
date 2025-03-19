import { supabase } from '@/integrations/supabase/client';
import { User, UserFilter, UserResponse, CreateUserDto, UpdateUserDto } from './userService/types';

const userService = {
  getUsers: async (filters?: UserFilter): Promise<UserResponse> => {
    try {
      let query = supabase
        .from('users')
        .select(`
          *,
          roles:role_id (id, name, permissions),
          regions:region_id (id, name),
          sectors:sector_id (id, name),
          schools:school_id (id, name)
        `, { count: 'exact' });
      
      if (filters) {
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
        
        if (filters.sortField && filters.sortOrder) {
          query = query.order(filters.sortField, { ascending: filters.sortOrder === 'asc' });
        } else {
          query = query.order('created_at', { ascending: false });
        }
        
        if (filters.page !== undefined && filters.pageSize) {
          const from = (filters.page - 1) * filters.pageSize;
          const to = from + filters.pageSize - 1;
          query = query.range(from, to);
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error fetching users:', error);
        return { data: null, count: 0, error };
      }
      
      return { 
        data: data as User[], 
        count: count || 0, 
        error: null 
      };
    } catch (error) {
      console.error('Error in getUsers:', error);
      return { data: null, count: 0, error };
    }
  },

  getUserById: async (id: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          roles:role_id (id, name, permissions),
          regions:region_id (id, name),
          sectors:sector_id (id, name),
          schools:school_id (id, name)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching user by ID:', error);
        return null;
      }
      
      return data as User;
    } catch (error) {
      console.error('Error in getUserById:', error);
      return null;
    }
  },

  createUser: async (userData: CreateUserDto): Promise<User | null> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password || 'TemporaryPassword123!',
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role_id: userData.roleId,
          }
        }
      });
      
      if (authError || !authData.user) {
        console.error('Error creating auth user:', authError);
        return null;
      }
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role_id: userData.roleId,
          region_id: userData.regionId || null,
          sector_id: userData.sectorId || null,
          school_id: userData.schoolId || null,
          phone: userData.phone || null,
          utis_code: userData.utisCode || null,
          is_active: true
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user profile:', error);
        return null;
      }
      
      return data as User;
    } catch (error) {
      console.error('Error in createUser:', error);
      return null;
    }
  },

  updateUser: async (id: string, userData: UpdateUserDto): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          role_id: userData.roleId,
          region_id: userData.regionId || null,
          sector_id: userData.sectorId || null,
          school_id: userData.schoolId || null,
          phone: userData.phone || null,
          utis_code: userData.utisCode || null,
          is_active: userData.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user:', error);
        return null;
      }
      
      return data as User;
    } catch (error) {
      console.error('Error in updateUser:', error);
      return null;
    }
  },

  resetUserPassword: async (id: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        id,
        { password: newPassword }
      );
      
      if (error) {
        console.error('Error resetting password:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in resetUserPassword:', error);
      return false;
    }
  },

  deactivateUser: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) {
        console.error('Error deactivating user:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deactivateUser:', error);
      return false;
    }
  },

  activateUser: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: true })
        .eq('id', id);
      
      if (error) {
        console.error('Error activating user:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in activateUser:', error);
      return false;
    }
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Error changing password:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in changePassword:', error);
      return false;
    }
  },

  getRoles: async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  },
  
  getRegions: async () => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching regions:', error);
      return [];
    }
  },
  
  getSectors: async (regionId: string) => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .eq('region_id', regionId)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching sectors:', error);
      return [];
    }
  },
  
  getSchools: async (sectorId: string) => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('sector_id', sectorId)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching schools:', error);
      return [];
    }
  },
  
  deleteUser: async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  },
  
  blockUser: async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error blocking user:', error);
      return false;
    }
  },
  
  resetPassword: async (userId: string): Promise<boolean> => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single();
      
      if (userError || !userData) {
        console.error('Error getting user email:', userError);
        return false;
      }
      
      console.log(`Password reset initiated for user email: ${userData.email}`);
      
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  }
};

export default userService;
