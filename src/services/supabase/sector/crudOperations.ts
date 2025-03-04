
import { supabase } from './baseClient';
import { Sector } from './types';

/**
 * Create a new sector
 */
export const createSector = async (sector: Pick<Sector, 'name' | 'description' | 'region_id'>) => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .insert([sector])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating sector:', error);
    throw error;
  }
};

/**
 * Update an existing sector
 */
export const updateSector = async (id: string, sector: Partial<Pick<Sector, 'name' | 'description' | 'region_id'>>) => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .update(sector)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating sector:', error);
    throw error;
  }
};

/**
 * Delete a sector
 */
export const deleteSector = async (id: string) => {
  try {
    const { error } = await supabase
      .from('sectors')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting sector:', error);
    throw error;
  }
};

/**
 * Archive a sector (soft delete)
 */
export const archiveSector = async (id: string) => {
  try {
    // For this example, we'll just update an archived flag
    // You may need to add this column to your sectors table
    const { data, error } = await supabase
      .from('sectors')
      .update({ archived: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error archiving sector:', error);
    throw error;
  }
};
