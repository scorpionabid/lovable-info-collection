
import { supabase } from '../supabaseClient';
import { Region, Sector } from './types';

/**
 * Create a new region
 * @param data Region data
 * @returns The created region
 */
export const createRegion = async (data: Partial<Region>) => {
  try {
    const { data: regionData, error } = await supabase
      .from('regions')
      .insert({
        name: data.name,
        code: data.code,
        description: data.description, // Now accepts description
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return regionData;
  } catch (error) {
    console.error('Error creating region:', error);
    throw error;
  }
};

/**
 * Update a region
 * @param id Region ID
 * @param data Region data
 * @returns The updated region
 */
export const updateRegion = async (id: string, data: Partial<Region>) => {
  try {
    const { data: regionData, error } = await supabase
      .from('regions')
      .update({
        name: data.name,
        code: data.code,
        description: data.description, // Now accepts description
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return regionData;
  } catch (error) {
    console.error('Error updating region:', error);
    throw error;
  }
};

/**
 * Delete a region
 * @param id Region ID
 * @returns Boolean success value
 */
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

/**
 * Archive a region
 * @param id Region ID
 * @returns Boolean success value
 */
export const archiveRegion = async (id: string) => {
  try {
    const { error } = await supabase
      .from('regions')
      .update({ archived: true })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error archiving region:', error);
    throw error;
  }
};

/**
 * Create a new sector
 * @param data Sector data
 * @returns The created sector
 */
export const createSector = async (data: Partial<Sector>) => {
  try {
    const { data: sectorData, error } = await supabase
      .from('sectors')
      .insert({
        name: data.name,
        region_id: data.region_id,
        code: data.code,
        description: data.description, // Now accepts description
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return sectorData;
  } catch (error) {
    console.error('Error creating sector:', error);
    throw error;
  }
};

/**
 * Update a sector
 * @param id Sector ID
 * @param data Sector data
 * @returns The updated sector
 */
export const updateSector = async (id: string, data: Partial<Sector>) => {
  try {
    const { data: sectorData, error } = await supabase
      .from('sectors')
      .update({
        name: data.name,
        region_id: data.region_id,
        code: data.code,
        description: data.description, // Now accepts description
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return sectorData;
  } catch (error) {
    console.error('Error updating sector:', error);
    throw error;
  }
};

/**
 * Delete a sector
 * @param id Sector ID
 * @returns Boolean success value
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
 * Archive a sector
 * @param id Sector ID
 * @returns Boolean success value
 */
export const archiveSector = async (id: string) => {
  try {
    const { error } = await supabase
      .from('sectors')
      .update({ archived: true })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error archiving sector:', error);
    throw error;
  }
};
