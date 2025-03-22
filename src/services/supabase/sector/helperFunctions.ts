
import { supabase } from '@/supabase/client';
import { Sector } from '@/lib/supabase/types';

// Get sectors by region ID
export const getSectorsByRegionId = async (regionId: string): Promise<Sector[]> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('*, regions:region_id(name)')
      .eq('region_id', regionId)
      .order('name');

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error getting sectors by region:', error);
    return [];
  }
};

// Get regions for dropdown selects
export const getRegionsForDropdown = async (): Promise<{ id: string; name: string; }[]> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('id, name')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching regions for dropdown:', error);
    return [];
  }
};

// Get region name by ID
export const getRegionNameById = async (regionId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('name')
      .eq('id', regionId)
      .single();

    if (error) throw error;
    return data?.name || '';
  } catch (error) {
    console.error('Error fetching region name:', error);
    return '';
  }
};
