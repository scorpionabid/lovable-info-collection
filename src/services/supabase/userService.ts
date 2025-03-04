import { supabase } from './supabaseClient';
import { UserRole } from '@/contexts/AuthContext';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id?: string;
  role?: UserRole;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active?: boolean;
  last_login?: string;
  roles?: {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
  };
}

export interface UserFilters {
  role?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  status?: 'active' | 'inactive' | 'blocked';
  search?: string;
}

const userService = {
  getUsers: async (filters?: UserFilters) => {
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
        if (filters.status === 'inactive' || filters.status === 'blocked') query = query.eq('is_active', false);
        
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
  },
  
  getUserById: async (id: string) => {
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
  },
  
  checkUtisCodeExists: async (utisCode: string, userId?: string) => {
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
  },
  
  createUser: async (userData: Omit<User, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
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
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  updateUser: async (id: string, userData: Partial<User>) => {
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
  },
  
  deleteUser: async (id: string) => {
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
  },
  
  blockUser: async (id: string) => {
    return userService.updateUser(id, { is_active: false });
  },
  
  activateUser: async (id: string) => {
    return userService.updateUser(id, { is_active: true });
  },
  
  getRegions: async (userId?: string, userRole?: string) => {
    try {
      let query = supabase.from('regions').select('*');
      
      if (userRole && userId && !userRole.includes('super')) {
        if (userRole.includes('region')) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('region_id')
            .eq('id', userId)
            .single();
            
          if (userError) throw userError;
          
          if (userData && userData.region_id) {
            query = query.eq('id', userData.region_id);
          }
        }
      }
      
      const { data, error } = await query;
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching regions:', error);
      throw error;
    }
  },
  
  getSectors: async (regionId?: string, userId?: string, userRole?: string) => {
    try {
      let query = supabase.from('sectors').select('*');
        
      if (regionId) {
        query = query.eq('region_id', regionId);
      } 
      else if (userRole && userId && !userRole.includes('super')) {
        if (userRole.includes('region')) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('region_id')
            .eq('id', userId)
            .single();
            
          if (userError) throw userError;
          
          if (userData && userData.region_id) {
            query = query.eq('region_id', userData.region_id);
          }
        } 
        else if (userRole.includes('sector')) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('sector_id')
            .eq('id', userId)
            .single();
            
          if (userError) throw userError;
          
          if (userData && userData.sector_id) {
            query = query.eq('id', userData.sector_id);
          }
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching sectors:', error);
      throw error;
    }
  },
  
  getSchools: async (sectorId?: string, userId?: string, userRole?: string) => {
    try {
      let query = supabase.from('schools').select('*');
        
      if (sectorId) {
        query = query.eq('sector_id', sectorId);
      } 
      else if (userRole && userId && !userRole.includes('super')) {
        if (userRole.includes('region')) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('region_id')
            .eq('id', userId)
            .single();
            
          if (userError) throw userError;
          
          if (userData && userData.region_id) {
            const { data: sectorData, error: sectorError } = await supabase
              .from('sectors')
              .select('id')
              .eq('region_id', userData.region_id);
              
            if (sectorError) throw sectorError;
            
            if (sectorData && sectorData.length > 0) {
              const sectorIds = sectorData.map(s => s.id);
              query = query.in('sector_id', sectorIds);
            }
          }
        } 
        else if (userRole.includes('sector')) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('sector_id')
            .eq('id', userId)
            .single();
            
          if (userError) throw userError;
          
          if (userData && userData.sector_id) {
            query = query.eq('sector_id', userData.sector_id);
          }
        }
        else if (userRole.includes('school')) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('school_id')
            .eq('id', userId)
            .single();
            
          if (userError) throw userError;
          
          if (userData && userData.school_id) {
            query = query.eq('id', userData.school_id);
          }
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching schools:', error);
      throw error;
    }
  },
  
  getRoles: async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*');
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },
  
  resetPassword: async (id: string) => {
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
  }
};

export default userService;
