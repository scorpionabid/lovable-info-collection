import { supabase } from '../supabaseClient';
import { Region } from './types';

/**
 * Get all regions
 */
export const getRegions = async (): Promise<Region[]> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Region[];
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
};
