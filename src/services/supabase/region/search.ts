
import { supabase } from '../supabaseClient';
import { Region } from './types';

/**
 * Search regions by name
 * @param searchTerm The term to search for in region names
 * @returns List of regions matching the search term
 */
export const searchRegionsByName = async (searchTerm: string): Promise<Region[]> => {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name')
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching regions:', error);
    return [];
  }
};
