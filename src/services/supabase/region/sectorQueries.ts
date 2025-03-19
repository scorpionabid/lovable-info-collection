
import { supabase } from '../supabaseClient';
import { Sector } from './types';

/**
 * Get all sectors for a region
 */
export const getRegionSectors = async (regionId: string): Promise<Sector[]> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .eq('region_id', regionId)
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching sectors for region ${regionId}:`, error);
    return [];
  }
};

/**
 * Get sector by ID
 */
export const getSectorById = async (sectorId: string): Promise<Sector | null> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .eq('id', sectorId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching sector ${sectorId}:`, error);
    return null;
  }
};

/**
 * Get sectors with school counts
 */
export const getSectorsWithSchoolCounts = async (regionId: string): Promise<any[]> => {
  try {
    const { data: sectors, error: sectorsError } = await supabase
      .from('sectors')
      .select(`
        id,
        name,
        code,
        region_id,
        created_at,
        updated_at,
        archived
      `)
      .eq('region_id', regionId)
      .order('name');
      
    if (sectorsError) throw sectorsError;
    
    // Get school count for each sector
    const sectorsWithCounts = await Promise.all((sectors || []).map(async (sector) => {
      const { count, error: countError } = await supabase
        .from('schools')
        .select('*', { count: 'exact' })
        .eq('sector_id', sector.id);
        
      if (countError) {
        console.warn(`Error getting school count for sector ${sector.id}:`, countError);
        return { ...sector, schoolCount: 0 };
      }
      
      return { ...sector, schoolCount: count || 0 };
    }));
    
    return sectorsWithCounts;
  } catch (error) {
    console.error(`Error fetching sectors with counts for region ${regionId}:`, error);
    return [];
  }
};
