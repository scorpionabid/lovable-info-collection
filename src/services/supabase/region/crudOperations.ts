
import { supabase } from '../baseClient';

// Create a sector belonging to a region
export const createSector = async (regionId: string, sectorData: { name: string; code?: string }) => {
  try {
    if (!regionId) {
      throw new Error('regionId is required');
    }

    const { data, error } = await supabase
      .from('sectors')
      .insert({
        region_id: regionId,
        name: sectorData.name,
        code: sectorData.code || null,
      })
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating sector:', error);
    throw error;
  }
};

// Update a sector by ID
export const updateSector = async (id: string, sectorData: { name?: string; code?: string; region_id?: string }) => {
  try {
    const updateData: any = {};
    
    if (sectorData.name) updateData.name = sectorData.name;
    if (sectorData.code !== undefined) updateData.code = sectorData.code;
    if (sectorData.region_id) updateData.region_id = sectorData.region_id;
    
    const { data, error } = await supabase
      .from('sectors')
      .update(updateData)
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

// Delete a sector by ID 
export const deleteSector = async (id: string) => {
  try {
    // First check if sector has any schools
    const { data: schoolsData, error: schoolsError } = await supabase
      .from('schools')
      .select('id')
      .eq('sector_id', id)
      .limit(1);
      
    if (schoolsError) throw schoolsError;
    
    if (schoolsData && schoolsData.length > 0) {
      throw new Error('Cannot delete sector with associated schools');
    }
    
    // If no schools, proceed with deletion
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

// Archive a sector (safer than deletion)
export const archiveSector = async (id: string) => {
  try {
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
