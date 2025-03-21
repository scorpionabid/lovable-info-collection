
import { supabase } from '../../supabaseClient';
import { User, UserFilters } from '../types';
import { TableName } from '../../constants';

export const getUsers = async (filters?: UserFilters) => {
  try {
    let query = supabase
      .from(TableName.USERS)
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
          .from(TableName.ROLES)
          .select('id')
          .eq('name', filters.role)
          .single();
          
        if (roleData) {
          query = query.eq('role_id', roleData.id);
        }
      }
      
      if (filters.role_id) query = query.eq('role_id', filters.role_id);
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
};

export const getUserById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from(TableName.USERS)
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
