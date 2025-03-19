
import { supabase } from '../supabaseClient';
import { Region, Sector } from './types';

// Create a new region
export const createRegion = async (regionData: Partial<Region>): Promise<Region | null> => {
  try {
    if (!regionData.name) {
      throw new Error('Region name is required');
    }

    const { data, error } = await supabase
      .from('regions')
      .insert({
        name: regionData.name,
        code: regionData.code,
        description: regionData.description
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating region:', error);
    return null;
  }
};

// Update an existing region
export const updateRegion = async (id: string, regionData: Partial<Region>): Promise<Region | null> => {
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
    console.error('Error updating region:', error);
    return null;
  }
};

// Delete a region by ID
export const deleteRegion = async (id: string): Promise<boolean> => {
  try {
    // First check if this region has any sectors
    const { count, error: countError } = await supabase
      .from('sectors')
      .select('id', { count: 'exact', head: true })
      .eq('region_id', id);

    if (countError) throw countError;

    if (count && count > 0) {
      throw new Error(`Cannot delete region with ${count} sectors. Delete the sectors first.`);
    }

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
export const archiveRegion = async (id: string): Promise<Region | null> => {
  try {
    // Update with archived field
    const updateData: any = {
      updated_at: new Date().toISOString(),
      archived: true
    };

    const { data, error } = await supabase
      .from('regions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error archiving region:', error);
    return null;
  }
};

// Create a new sector
export const createSector = async (sectorData: Partial<Sector>): Promise<Sector | null> => {
  try {
    if (!sectorData.name) {
      throw new Error('Sector name is required');
    }
    
    if (!sectorData.region_id) {
      throw new Error('Region ID is required');
    }

    const { data, error } = await supabase
      .from('sectors')
      .insert({
        name: sectorData.name,
        code: sectorData.code,
        description: sectorData.description,
        region_id: sectorData.region_id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating sector:', error);
    return null;
  }
};

// Update an existing sector
export const updateSector = async (id: string, sectorData: Partial<Sector>): Promise<Sector | null> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .update({
        name: sectorData.name,
        code: sectorData.code,
        description: sectorData.description,
        region_id: sectorData.region_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating sector:', error);
    return null;
  }
};

// Delete a sector by ID
export const deleteSector = async (id: string): Promise<boolean> => {
  try {
    // First check if this sector has any schools
    const { count, error: countError } = await supabase
      .from('schools')
      .select('id', { count: 'exact', head: true })
      .eq('sector_id', id);

    if (countError) throw countError;

    if (count && count > 0) {
      throw new Error(`Cannot delete sector with ${count} schools. Delete the schools first.`);
    }

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

// Archive a sector (soft delete)
export const archiveSector = async (id: string): Promise<Sector | null> => {
  try {
    // Update with archived field
    const updateData: any = {
      updated_at: new Date().toISOString(),
      archived: true
    };

    const { data, error } = await supabase
      .from('sectors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error archiving sector:', error);
    return null;
  }
};
