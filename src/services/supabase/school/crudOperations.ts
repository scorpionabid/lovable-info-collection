
import { supabase } from '../supabaseClient';

/**
 * Creates a new school
 */
export const createSchool = async (schoolData) => {
  try {
    // Ensure the school has an archived field set to false by default
    const dataToInsert = {
      ...schoolData,
      archived: false
    };

    const { data, error } = await supabase
      .from('schools')
      .insert([dataToInsert])
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating school:', error);
    return null;
  }
};

/**
 * Updates an existing school
 */
export const updateSchool = async (id, schoolData) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update(schoolData)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating school with ID ${id}:`, error);
    return null;
  }
};

/**
 * Deletes a school by setting its archived flag to true (soft delete)
 */
export const deleteSchool = async (id) => {
  try {
    // Update the archived field, which is allowed in the update operation
    const { error } = await supabase
      .from('schools')
      .update({ archived: true })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting school with ID ${id}:`, error);
    return false;
  }
};

/**
 * Hard deletes a school from the database
 */
export const hardDeleteSchool = async (id) => {
  try {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error hard deleting school with ID ${id}:`, error);
    return false;
  }
};
