import { supabase } from '../supabaseClient';
import { Region, CreateRegionDto, UpdateRegionDto } from './types';

/**
 * Creates a new region
 */
export const createRegion = async (regionData: CreateRegionDto): Promise<Region | null> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .insert([regionData])
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating region:', error);
    return null;
  }
};

/**
 * Updates an existing region
 */
export const updateRegion = async (id: string, regionData: UpdateRegionDto): Promise<Region | null> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .update(regionData)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating region with ID ${id}:`, error);
    return null;
  }
};

/**
 * Deletes a region
 */
export const deleteRegion = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('regions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting region with ID ${id}:`, error);
    return false;
  }
};
