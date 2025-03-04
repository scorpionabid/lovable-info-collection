
import { supabase } from './baseClient';
import { CreateSchoolDto, UpdateSchoolDto } from './types';

/**
 * Create a new school 
 */
export const createSchool = async (schoolData: CreateSchoolDto) => {
  try {
    // Convert from our DTO format to the database schema format
    const dbData = {
      name: schoolData.name,
      type_id: schoolData.type, // This might need adjustment based on how types are stored
      region_id: schoolData.region_id,
      sector_id: schoolData.sector_id,
      student_count: schoolData.studentCount,
      teacher_count: schoolData.teacherCount,
      address: schoolData.address,
      email: schoolData.contactEmail,
      phone: schoolData.contactPhone,
      status: schoolData.status,
      director: schoolData.director
    };

    const { data, error } = await supabase
      .from('schools')
      .insert(dbData)
      .select('id')
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
 */
export const updateSchool = async (id: string, schoolData: UpdateSchoolDto) => {
  try {
    // Convert from our DTO format to the database schema format
    const dbData: any = {};
    
    if (schoolData.name) dbData.name = schoolData.name;
    if (schoolData.type) dbData.type_id = schoolData.type;
    if (schoolData.region_id) dbData.region_id = schoolData.region_id;
    if (schoolData.sector_id) dbData.sector_id = schoolData.sector_id;
    if (schoolData.studentCount !== undefined) dbData.student_count = schoolData.studentCount;
    if (schoolData.teacherCount !== undefined) dbData.teacher_count = schoolData.teacherCount;
    if (schoolData.address !== undefined) dbData.address = schoolData.address;
    if (schoolData.contactEmail) dbData.email = schoolData.contactEmail;
    if (schoolData.contactPhone) dbData.phone = schoolData.contactPhone;
    if (schoolData.status) dbData.status = schoolData.status;
    if (schoolData.director) dbData.director = schoolData.director;

    const { data, error } = await supabase
      .from('schools')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating school:', error);
    throw error;
  }
};

/**
 * Delete a school by ID
 */
export const deleteSchool = async (id: string) => {
  try {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting school:', error);
    throw error;
  }
};

/**
 * Archive a school (set status to inactive)
 */
export const archiveSchool = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update({ status: 'Deaktiv' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error archiving school:', error);
    throw error;
  }
};
