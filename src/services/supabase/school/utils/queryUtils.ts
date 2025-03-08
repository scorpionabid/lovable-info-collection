
import { supabase } from '../baseClient';
import { School } from '../types';

/**
 * Calculate the completion rate of a school based on data entries in categories
 * (Placeholder for a more complex calculation)
 */
export const calculateCompletionRate = async (schoolId: string): Promise<number> => {
  try {
    // This is a placeholder for a more complex calculation
    // In a real app, you would calculate this based on data entries
    // For now, returning a random number between 60 and 100
    return Math.floor(Math.random() * 40) + 60;
  } catch (error) {
    console.error('Error calculating completion rate:', error);
    return 0;
  }
};

/**
 * Transform school data from database schema to application schema
 */
export const transformSchoolData = (item: any, schoolAdmins?: Map<string, any>): School => {
  // For completion rate, use a calculation or default value
  const completionRate = Math.floor(Math.random() * 40) + 60; // Placeholder
  
  // Get admin information from our map if provided
  const admin = schoolAdmins?.get(item.id);

  // Fix: Properly access the nested objects' properties
  const schoolType = item.school_types ? item.school_types.name : 'N/A';
  const regionName = item.regions ? item.regions.name : 'N/A';
  const sectorName = item.sectors ? item.sectors.name : 'N/A';

  return {
    id: item.id,
    name: item.name,
    type: schoolType,
    region: regionName,
    region_id: item.region_id,
    sector: sectorName,
    sector_id: item.sector_id,
    studentCount: item.student_count || 0,
    teacherCount: item.teacher_count || 0,
    completionRate,
    status: item.status || 'Aktiv',
    director: item.director || 'N/A',
    contactEmail: item.email || 'N/A',
    contactPhone: item.phone || 'N/A',
    createdAt: item.created_at,
    address: item.address,
    adminName: admin?.name || null,
    adminId: admin?.id || null
  };
};
