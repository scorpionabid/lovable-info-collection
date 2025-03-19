
import { supabase } from '../supabaseClient';
import { Region, Sector } from './types';

// Create a region 
export const createRegion = async (regionData: { name: string; code?: string; description?: string }): Promise<Region> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .insert({
        name: regionData.name,
        code: regionData.code || null,
        description: regionData.description || null
      })
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating region:', error);
    throw error;
  }
};

// Update a region by ID
export const updateRegion = async (id: string, regionData: { name?: string; code?: string; description?: string }): Promise<Region> => {
  try {
    const updateData: Partial<Region> = {};
    
    if (regionData.name) updateData.name = regionData.name;
    if (regionData.code !== undefined) updateData.code = regionData.code;
    if (regionData.description !== undefined) updateData.description = regionData.description;
    
    const { data, error } = await supabase
      .from('regions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating region:', error);
    throw error;
  }
};

// Delete a region by ID
export const deleteRegion = async (id: string): Promise<boolean> => {
  try {
    // First check if region has any sectors
    const { data: sectorsData, error: sectorsError } = await supabase
      .from('sectors')
      .select('id')
      .eq('region_id', id)
      .limit(1);
      
    if (sectorsError) throw sectorsError;
    
    if (sectorsData && sectorsData.length > 0) {
      throw new Error('Cannot delete region with associated sectors');
    }
    
    // If no sectors, proceed with deletion
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

// Archive a region (safer than deletion)
export const archiveRegion = async (id: string): Promise<Region> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .update({ archived: true })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error archiving region:', error);
    throw error;
  }
};

// Create a sector belonging to a region
export const createSector = async (regionId: string, sectorData: { name: string; code?: string; description?: string }): Promise<Sector> => {
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
        description: sectorData.description || null
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
export const updateSector = async (id: string, sectorData: { name?: string; code?: string; description?: string; region_id?: string }): Promise<Sector> => {
  try {
    const updateData: Partial<Sector> = {};
    
    if (sectorData.name) updateData.name = sectorData.name;
    if (sectorData.code !== undefined) updateData.code = sectorData.code;
    if (sectorData.description !== undefined) updateData.description = sectorData.description;
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
export const deleteSector = async (id: string): Promise<boolean> => {
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
export const archiveSector = async (id: string): Promise<Sector> => {
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
