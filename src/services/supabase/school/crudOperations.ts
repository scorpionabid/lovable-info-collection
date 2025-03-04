
import { supabase } from './baseClient';
import { School } from './types';

/**
 * Create a new school
 */
export const createSchool = async (schoolData: Omit<School, 'id' | 'createdAt' | 'completionRate'>) => {
  try {
    // Transform the school data to match the database schema
    const dbSchool = {
      name: schoolData.name,
      address: schoolData.address,
      region_id: schoolData.region_id,
      sector_id: schoolData.sector_id,
      school_type_id: getSchoolTypeId(schoolData.type), // This would be a lookup function
      student_count: schoolData.studentCount,
      teacher_count: schoolData.teacherCount,
      status: schoolData.status,
      director: schoolData.director,
      email: schoolData.contactEmail,
      phone: schoolData.contactPhone
    };

    const { data, error } = await supabase
      .from('schools')
      .insert([dbSchool])
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
 */
export const updateSchool = async (
  id: string, 
  schoolData: Partial<Omit<School, 'id' | 'createdAt' | 'completionRate'>>
) => {
  try {
    // Transform the school data to match the database schema
    const dbSchool: any = {};
    
    if (schoolData.name) dbSchool.name = schoolData.name;
    if (schoolData.address) dbSchool.address = schoolData.address;
    if (schoolData.region_id) dbSchool.region_id = schoolData.region_id;
    if (schoolData.sector_id) dbSchool.sector_id = schoolData.sector_id;
    if (schoolData.type) dbSchool.school_type_id = getSchoolTypeId(schoolData.type);
    if (schoolData.studentCount !== undefined) dbSchool.student_count = schoolData.studentCount;
    if (schoolData.teacherCount !== undefined) dbSchool.teacher_count = schoolData.teacherCount;
    if (schoolData.status) dbSchool.status = schoolData.status;
    if (schoolData.director) dbSchool.director = schoolData.director;
    if (schoolData.contactEmail) dbSchool.email = schoolData.contactEmail;
    if (schoolData.contactPhone) dbSchool.phone = schoolData.contactPhone;

    const { data, error } = await supabase
      .from('schools')
      .update(dbSchool)
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
 * Archive a school (soft delete)
 */
export const archiveSchool = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update({ status: 'Arxivləşdirilmiş' })
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

/**
 * Assign an admin to a school
 */
export const assignSchoolAdmin = async (schoolId: string, userId: string) => {
  try {
    // This would update the user record in the users table
    const { data, error } = await supabase
      .from('users')
      .update({ 
        school_id: schoolId,
        role_id: getRoleIdByName('school-admin') // This would be a lookup function
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error assigning school admin:', error);
    throw error;
  }
};

/**
 * Get school type ID from name (helper function)
 */
const getSchoolTypeId = (typeName: string): string => {
  // This would normally query the database to get the ID
  // For now, returning a placeholder
  const typeMap: {[key: string]: string} = {
    'Orta məktəb': '1',
    'Tam orta məktəb': '2',
    'İbtidai məktəb': '3'
  };
  
  return typeMap[typeName] || '1';
};

/**
 * Get role ID from name (helper function)
 */
const getRoleIdByName = (roleName: string): string => {
  // This would normally query the database to get the ID
  // For now, returning a placeholder
  const roleMap: {[key: string]: string} = {
    'super-admin': '1',
    'region-admin': '2',
    'sector-admin': '3',
    'school-admin': '4'
  };
  
  return roleMap[roleName] || '4';
};
