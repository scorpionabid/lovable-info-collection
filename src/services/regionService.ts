
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Region } from '@/types/supabase';

// Get all regions
export const getRegions = async () => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    // Transform data to ensure description is present
    return data?.map(region => ({
      ...region,
      description: region.description || ''
    })) || [];
  } catch (error) {
    console.error('Error fetching regions:', error);
    toast.error('Regionlar yüklənərkən xəta baş verdi');
    return [];
  }
};

// Get a single region by ID
export const getRegionById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // Transform data to ensure description is present
    return {
      ...data,
      description: data.description || ''
    };
  } catch (error) {
    console.error(`Error fetching region with ID ${id}:`, error);
    toast.error('Region məlumatları yüklənərkən xəta baş verdi');
    return null;
  }
};

// Create a new region
export const createRegion = async (region: Omit<Region, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .insert(region)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Region uğurla əlavə edildi');
    return data;
  } catch (error) {
    console.error('Error creating region:', error);
    toast.error('Region əlavə edilərkən xəta baş verdi');
    return null;
  }
};

// Update an existing region
export const updateRegion = async (id: string, updates: Partial<Region>) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Region uğurla yeniləndi');
    return data;
  } catch (error) {
    console.error(`Error updating region with ID ${id}:`, error);
    toast.error('Region yenilənərkən xəta baş verdi');
    return null;
  }
};

// Delete a region
export const deleteRegion = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast.success('Region uğurla silindi');
    return true;
  } catch (error) {
    console.error(`Error deleting region with ID ${id}:`, error);
    toast.error('Region silinərkən xəta baş verdi');
    return false;
  }
};

// Get sectors by region ID
export const getSectorsByRegionId = async (regionId: string) => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .eq('region_id', regionId)
      .order('name');
      
    if (error) throw error;
    
    // Transform data to ensure description is present
    return data?.map(sector => ({
      ...sector,
      description: sector.description || ''
    })) || [];
  } catch (error) {
    console.error(`Error fetching sectors for region ID ${regionId}:`, error);
    toast.error('Sektorlar yüklənərkən xəta baş verdi');
    return [];
  }
};

// Get schools by region ID
export const getSchoolsByRegionId = async (regionId: string) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('region_id', regionId)
      .order('name');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching schools for region ID ${regionId}:`, error);
    toast.error('Məktəblər yüklənərkən xəta baş verdi');
    return [];
  }
};
