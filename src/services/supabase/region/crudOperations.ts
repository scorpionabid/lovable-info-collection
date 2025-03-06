
import { supabase, Region } from '../supabaseClient';

// Create a new region
export const createRegion = async (region: Omit<Region, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .insert([region])
      .select()
      .single();
    
    if (error) throw error;
    return data as Region;
  } catch (error) {
    console.error('Error creating region:', error);
    throw error;
  }
};

// Update an existing region
export const updateRegion = async (id: string, region: Partial<Omit<Region, 'id' | 'created_at'>>) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .update(region)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Region;
  } catch (error) {
    console.error('Error updating region:', error);
    throw error;
  }
};

// Delete a region
export const deleteRegion = async (id: string) => {
  try {
    const { error } = await supabase
      .from('regions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting region:', error);
    throw error;
  }
};

// Archive a region (soft delete)
export const archiveRegion = async (id: string) => {
  try {
    // This is just a placeholder implementation since we don't have an 'is_archived' field
    // In a real application, you might add this field or implement proper archiving
    const { data, error } = await supabase
      .from('regions')
      .update({ archived: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Region;
  } catch (error) {
    console.error('Error archiving region:', error);
    throw error;
  }
};
