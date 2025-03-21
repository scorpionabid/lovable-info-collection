
import { supabase } from '../supabaseClient';
import { Region } from './types';

export const getRegions = async (): Promise<{data: Region[], count: number}> => {
  try {
    const { data, error, count } = await supabase
      .from('regions')
      .select('*', { count: 'exact' })
      .order('name');

    if (error) {
      console.error("Error fetching regions:", error);
      return { data: [], count: 0 };
    }

    // Ensure each region has a description field, even if it's empty
    const regionsWithDescription = data.map(region => ({
      ...region,
      description: region.description || ''
    })) as Region[];

    return { data: regionsWithDescription, count: count || regionsWithDescription.length };
  } catch (error) {
    console.error("Unexpected error fetching regions:", error);
    return { data: [], count: 0 };
  }
};
