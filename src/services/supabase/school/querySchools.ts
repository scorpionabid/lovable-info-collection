
import { supabase } from '../supabaseClient';
import { School } from './types';

/**
 * Get all schools
 */
export const getSchools = async (): Promise<School[]> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching schools:", error);
    return [];
  }
};

/**
 * Get a school by its ID
 */
export const getSchoolById = async (id: string): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching school with ID ${id}:`, error);
    return null;
  }
};

/**
 * Get schools by region ID
 */
export const getSchoolsByRegion = async (regionId: string): Promise<School[]> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('region_id', regionId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching schools for region ${regionId}:`, error);
    return [];
  }
};
