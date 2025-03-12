
import { supabase } from '../supabaseClient';
import { Region } from '../supabaseClient';

// Create a new region
export const createRegion = async (regionData: Omit<Region, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .insert({
        name: regionData.name,
        code: regionData.code,
        description: regionData.description
      })
      .select();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating region:', error);
    return { data: null, error };
  }
};

// Get a region by ID
export const getRegionById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching region by ID:', error);
    return { data: null, error };
  }
};

// Update a region
export const updateRegion = async (id: string, updates: Partial<Region>) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .update({
        name: updates.name,
        code: updates.code,
        description: updates.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating region:', error);
    return { data: null, error };
  }
};

// Archive a region (soft delete)
export const archiveRegion = async (id: string) => {
  try {
    // Since 'archived' doesn't exist in regions table, we'll handle this
    // differently. For now, we could just mark all sectors in the region as archived
    const { data, error } = await supabase
      .from('sectors')
      .update({ archived: true })
      .eq('region_id', id)
      .select();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error archiving region:', error);
    return { data: null, error };
  }
};

export default {
  createRegion,
  getRegionById,
  updateRegion,
  archiveRegion
};
