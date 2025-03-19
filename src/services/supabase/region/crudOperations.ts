
import { supabase } from '../supabaseClient';
import { Region, Sector } from './types';

/**
 * Create a new region
 * @param regionData Region data to create
 * @returns Created region or error
 */
export const createRegion = async (regionData: Partial<Region>) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .insert({
        name: regionData.name,
        code: regionData.code,
        description: regionData.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating region:', error);
    throw error;
  }
};

/**
 * Update an existing region
 * @param id Region ID
 * @param regionData Region data to update
 * @returns Updated region or error
 */
export const updateRegion = async (id: string, regionData: Partial<Region>) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .update({
        name: regionData.name,
        code: regionData.code,
        description: regionData.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating region ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a region
 * @param id Region ID
 * @returns Success status or error
 */
export const deleteRegion = async (id: string) => {
  try {
    const { error } = await supabase
      .from('regions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(`Error deleting region ${id}:`, error);
    throw error;
  }
};

/**
 * Archive a region (soft delete)
 * @param id Region ID
 * @returns Success status or error
 */
export const archiveRegion = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .update({
        archived: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error archiving region ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new sector
 * @param sectorData Sector data to create
 * @returns Created sector or error
 */
export const createSector = async (sectorData: Partial<Sector>) => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .insert({
        name: sectorData.name,
        region_id: sectorData.region_id,
        code: sectorData.code,
        description: sectorData.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
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
 * @param id Sector ID
 * @param sectorData Sector data to update
 * @returns Updated sector or error
 */
export const updateSector = async (id: string, sectorData: Partial<Sector>) => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .update({
        name: sectorData.name,
        region_id: sectorData.region_id,
        code: sectorData.code,
        description: sectorData.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating sector ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a sector
 * @param id Sector ID
 * @returns Success status or error
 */
export const deleteSector = async (id: string) => {
  try {
    const { error } = await supabase
      .from('sectors')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(`Error deleting sector ${id}:`, error);
    throw error;
  }
};

/**
 * Archive a sector (soft delete)
 * @param id Sector ID
 * @returns Success status or error
 */
export const archiveSector = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .update({
        archived: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error archiving sector ${id}:`, error);
    throw error;
  }
};
