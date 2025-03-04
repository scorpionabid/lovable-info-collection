
import { supabase } from './baseClient';
import { School, SchoolFilter, SchoolStats } from './types';

/**
 * Get all schools with optional filtering
 */
export const getSchools = async (filters?: SchoolFilter): Promise<School[]> => {
  try {
    let query = supabase
      .from('schools')
      .select(`
        id,
        name,
        address,
        email,
        phone,
        region_id,
        sector_id,
        student_count,
        teacher_count,
        status,
        director,
        created_at,
        school_types (id, name),
        regions (id, name),
        sectors (id, name)
      `);

    // Apply filters if provided
    if (filters) {
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,director.ilike.%${filters.search}%`);
      }
      if (filters.regionId) {
        query = query.eq('region_id', filters.regionId);
      }
      if (filters.sectorId) {
        query = query.eq('sector_id', filters.sectorId);
      }
      if (filters.type) {
        query = query.eq('school_types.name', filters.type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.minCompletionRate !== undefined) {
        query = query.gte('completion_rate', filters.minCompletionRate);
      }
      if (filters.maxCompletionRate !== undefined) {
        query = query.lte('completion_rate', filters.maxCompletionRate);
      }
    }

    const { data, error } = await query.order('name');

    if (error) throw error;

    // Transform the data to match our expected School interface
    const schools = data.map((item: any) => {
      // For completion rate, use a calculation or default value
      const completionRate = Math.floor(Math.random() * 40) + 60; // Placeholder

      return {
        id: item.id,
        name: item.name,
        type: item.school_types?.name || 'N/A',
        region: item.regions?.name || 'N/A',
        region_id: item.region_id,
        sector: item.sectors?.name || 'N/A',
        sector_id: item.sector_id,
        studentCount: item.student_count || 0,
        teacherCount: item.teacher_count || 0,
        completionRate,
        status: item.status || 'Aktiv',
        director: item.director || 'N/A',
        contactEmail: item.email || 'N/A',
        contactPhone: item.phone || 'N/A',
        createdAt: item.created_at,
        address: item.address
      };
    });

    return schools;
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
};

/**
 * Get a single school by ID with all details
 */
export const getSchoolById = async (id: string): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select(`
        id,
        name,
        address,
        email,
        phone,
        region_id,
        sector_id,
        student_count,
        teacher_count,
        status,
        director,
        created_at,
        school_types (id, name),
        regions (id, name),
        sectors (id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Calculate completion rate - in a real app, this would be based on data
    const completionRate = Math.floor(Math.random() * 40) + 60; // Random value 60-100

    return {
      id: data.id,
      name: data.name,
      type: data.school_types?.name || 'N/A',
      region: data.regions?.name || 'N/A',
      region_id: data.region_id,
      sector: data.sectors?.name || 'N/A',
      sector_id: data.sector_id,
      studentCount: data.student_count || 0,
      teacherCount: data.teacher_count || 0,
      completionRate,
      status: data.status || 'Aktiv',
      director: data.director || 'N/A',
      contactEmail: data.email || 'N/A',
      contactPhone: data.phone || 'N/A',
      createdAt: data.created_at,
      address: data.address
    };
  } catch (error) {
    console.error('Error fetching school details:', error);
    throw error;
  }
};

/**
 * Calculate the completion rate of a school based on data entries in categories
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
 * Get school completion statistics for charts
 */
export const getSchoolStats = async (schoolId: string): Promise<SchoolStats> => {
  try {
    // Mock data for completion history (6 months)
    const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn'];
    const completionHistory = months.map(month => ({
      name: month,
      value: Math.floor(Math.random() * 40) + 60 // Random values between 60-100%
    }));

    // Mock data for categories
    const categoryNames = ['Müəllimlər', 'Maddi Texniki Baza', 'Maliyyə', 'Tədris Planı', 'Şagirdlər'];
    const categories = categoryNames.map(name => ({
      name,
      value: Math.floor(Math.random() * 40) + 60 // Random values between 60-100%
    }));

    return {
      completionHistory,
      categories
    };
  } catch (error) {
    console.error('Error fetching school stats:', error);
    throw error;
  }
};

/**
 * Get recent activities for a school
 */
export const getSchoolActivities = async (schoolId: string) => {
  try {
    // This would normally query an activities or audit log table
    // For now, returning mock data
    return [
      { id: 1, action: 'Müəllimlər kateqoriyası doldurulub', user: 'Əliyev Vüqar', time: '14:25, 12 May 2024' },
      { id: 2, action: 'Maddi Texniki Baza yenilənib', user: 'Əliyev Vüqar', time: '10:15, 10 May 2024' },
      { id: 3, action: 'Maliyyə hesabatı təsdiqlənib', user: 'Məmmədov Elnur', time: '16:40, 5 May 2024' },
      { id: 4, action: 'Şagird siyahısı yenilənib', user: 'Hüseynova Aysel', time: '09:30, 3 May 2024' }
    ];
  } catch (error) {
    console.error('Error fetching school activities:', error);
    throw error;
  }
};
