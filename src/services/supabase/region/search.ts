
import { supabase } from '../supabaseClient';
import { Region } from './types';

/**
 * Search regions by name
 */
export const searchRegions = async (searchTerm: string): Promise<Region[]> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name');

    if (error) throw error;
    return data as Region[];
  } catch (error) {
    console.error('Error searching regions:', error);
    return [];
  }
};
