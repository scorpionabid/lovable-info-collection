// Import supabase client
import { supabase } from '../supabaseClient';

/**
 * Get all roles
 */
export const getRoles = async (currentUserId?: string, currentUserRole?: string) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('id, name')
      .order('name');
      
    if (error) throw error;
    
    return data.map(role => ({
      id: role.id,
      name: role.name
    }));
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

/**
 * Get all regions (filtered by user permissions if applicable)
 */
export const getRegions = async (currentUserId?: string, currentUserRole?: string) => {
  try {
    // For super admin, return all regions
    // For region admin, return only their region
    // For others, filter as needed
    
    let query = supabase
      .from('regions')
      .select('id, name')
      .order('name');
    
    // Apply permissions logic here if needed based on currentUserRole
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data.map(region => ({
      id: region.id,
      name: region.name
    }));
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
};

/**
 * Get sectors by region ID (filtered by user permissions if applicable)
 */
export const getSectors = async (regionId?: string, currentUserId?: string, currentUserRole?: string) => {
  try {
    let query = supabase
      .from('sectors')
      .select('id, name')
      .order('name');
    
    if (regionId) {
      query = query.eq('region_id', regionId);
    }
    
    // Apply permissions logic here if needed based on currentUserRole
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data.map(sector => ({
      id: sector.id,
      name: sector.name
    }));
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return [];
  }
};

/**
 * Get schools by sector ID (filtered by user permissions if applicable)
 */
export const getSchools = async (sectorId?: string, currentUserId?: string, currentUserRole?: string) => {
  try {
    let query = supabase
      .from('schools')
      .select('id, name')
      .order('name');
    
    if (sectorId) {
      query = query.eq('sector_id', sectorId);
    }
    
    // Apply permissions logic here if needed based on currentUserRole
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data.map(school => ({
      id: school.id,
      name: school.name
    }));
  } catch (error) {
    console.error('Error fetching schools:', error);
    return [];
  }
};
