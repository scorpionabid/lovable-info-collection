
import { supabase } from '../supabaseClient';
import { School, CreateSchoolDto, UpdateSchoolDto } from './types';

/**
 * Create a new school
 * @param schoolData School data to create
 * @returns Created school data
 */
export const createSchool = async (schoolData: CreateSchoolDto): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .insert({
        name: schoolData.name,
        region_id: schoolData.region_id,
        sector_id: schoolData.sector_id,
        code: schoolData.code,
        address: schoolData.address,
        type_id: schoolData.type_id,
        student_count: schoolData.student_count,
        teacher_count: schoolData.teacher_count,
        status: schoolData.status || 'active',
        director: schoolData.director,
        email: schoolData.email,
        phone: schoolData.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating school:', error);
    throw error;
  }
};

/**
 * Update an existing school
 * @param id School ID
 * @param schoolData School data to update
 * @returns Updated school data
 */
export const updateSchool = async (id: string, schoolData: UpdateSchoolDto): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update({
        name: schoolData.name,
        region_id: schoolData.region_id,
        sector_id: schoolData.sector_id,
        code: schoolData.code,
        address: schoolData.address,
        type_id: schoolData.type_id,
        student_count: schoolData.student_count,
        teacher_count: schoolData.teacher_count,
        status: schoolData.status,
        director: schoolData.director,
        email: schoolData.email,
        phone: schoolData.phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating school ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a school
 * @param id School ID
 * @returns Success status
 */
export const deleteSchool = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting school ${id}:`, error);
    throw error;
  }
};

/**
 * Archive a school (soft delete)
 * @param id School ID
 * @returns Success status and updated school data
 */
export const archiveSchool = async (id: string): Promise<{ success: boolean; data?: School }> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update({
        status: 'archived',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error(`Error archiving school ${id}:`, error);
    throw error;
  }
};
