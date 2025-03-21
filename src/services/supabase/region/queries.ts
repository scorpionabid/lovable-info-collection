import { supabase } from '../supabaseClient';
import { Region } from './types';

export const getRegions = async (): Promise<Region[]> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .order('name');

    if (error) {
      console.error("Error fetching regions:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching regions:", error);
    return [];
  }
};
