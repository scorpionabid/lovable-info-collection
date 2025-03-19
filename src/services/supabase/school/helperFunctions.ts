
import { supabase } from '../supabaseClient';
import { School } from './types';

/**
 * Calculate completion rate for a school based on data submission
 */
export const calculateCompletionRate = async (schoolId: string): Promise<number> => {
  try {
    // This is a placeholder implementation
    // In a real application, you would check how many required data entries
    // have been submitted by the school
    return Math.floor(Math.random() * 40) + 60; // Random between 60-100
  } catch (error) {
    console.error(`Error calculating completion rate for school ${schoolId}:`, error);
    return 0;
  }
};

/**
 * Get regions for school selection
 */
export const getRegions = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('id, name')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
};

/**
 * Get sectors for a specific region
 */
export const getSectorsByRegion = async (regionId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('id, name')
      .eq('region_id', regionId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching sectors for region ${regionId}:`, error);
    return [];
  }
};

/**
 * Get school types for selection
 */
export const getSchoolTypes = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('school_types')
      .select('id, name')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching school types:', error);
    return [];
  }
};

/**
 * Transform raw school data from the database to the frontend format
 */
export const transformSchoolData = (schoolData: any): School => {
  return {
    id: schoolData.id,
    name: schoolData.name,
    code: schoolData.code,
    region_id: schoolData.region_id,
    sector_id: schoolData.sector_id,
    type_id: schoolData.type_id,
    address: schoolData.address,
    director: schoolData.director || '',
    email: schoolData.email || '',
    phone: schoolData.phone || '',
    status: schoolData.status || 'active',
    student_count: schoolData.student_count || 0,
    teacher_count: schoolData.teacher_count || 0,
    created_at: schoolData.created_at,
    updated_at: schoolData.updated_at,
    archived: schoolData.archived || false,
    
    // Add relations if available
    region: schoolData.regions?.name || '',
    sector: schoolData.sectors?.name || '',
    type: schoolData.school_types?.name || '',
    
    // Add computed fields
    completionRate: 0, // This will be calculated separately
    studentCount: schoolData.student_count || 0,
    teacherCount: schoolData.teacher_count || 0,
    contactEmail: schoolData.email || '',
    contactPhone: schoolData.phone || '',
    createdAt: schoolData.created_at
  };
};
