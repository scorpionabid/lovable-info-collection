import { supabase } from '../supabaseClient';
import { Sector } from './types';

/**
 * Get a sector by its ID
 */
export const getSectorById = async (id: string): Promise<Sector | null> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select(`
        *,
        region:regions(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Sector;
  } catch (error) {
    console.error('Error fetching sector by ID:', error);
    return null;
  }
};

/**
 * Get all sectors for a specific region
 */
export const getSectorsByRegion = async (regionId: string): Promise<Sector[]> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select(`
        *,
        schools(id),
        region:regions(id, name)
      `)
      .eq('region_id', regionId)
      .eq('archived', false);

    if (error) throw error;

    return (data || []).map(sector => {
      // Calculate completion rate and school count
      const schoolCount = sector.schools ? sector.schools.length : 0;
      // Random completion rate for now (replace with actual logic)
      const completionRate = Math.floor(Math.random() * 40) + 60; // 60-100%
      
      return {
        ...sector,
        schools_count: schoolCount,
        completion_rate: completionRate,
      } as Sector;
    });
  } catch (error) {
    console.error('Error fetching sectors by region:', error);
    return [];
  }
};

// Other sector-related query functions would go here
