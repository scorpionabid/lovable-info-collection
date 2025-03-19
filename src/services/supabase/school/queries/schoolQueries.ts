
import { supabase } from '../../supabaseClient';
import { School, SchoolFilter } from '../types';
import { calculateCompletionRate } from '../utils/queryUtils';

/**
 * Get all schools with optional filtering
 */
export const getSchools = async (filters?: SchoolFilter): Promise<School[]> => {
  try {
    // Define the base query to fetch schools with their related data
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
        regions(id, name),
        sectors(id, name),
        school_types:type_id(id, name)
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
    }

    // Execute the query and order by name
    const { data: schoolsData, error: schoolsError } = await query.order('name');

    if (schoolsError) throw schoolsError;

    // Now let's get the admin information for each school in a separate query
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select(`
        id,
        first_name,
        last_name,
        school_id,
        role_id
      `)
      .eq('role_id', (await supabase.from('roles').select('id').eq('name', 'school-admin').single()).data?.id);

    if (adminError) {
      console.warn('Error fetching admin data:', adminError);
      // Continue without admin data rather than failing completely
    }

    // Create a map of school_id to admin
    const schoolAdmins = new Map();
    if (adminData) {
      adminData.forEach(admin => {
        if (admin.school_id) {
          schoolAdmins.set(admin.school_id, {
            id: admin.id,
            name: `${admin.first_name} ${admin.last_name}`
          });
        }
      });
    }

    // Transform the data to match our expected School interface
    // Handle the possibility of null data with default values
    const schools = (schoolsData || []).map((school) => {
      // Handle null response error case
      if ('error' in school) {
        console.error("Error in school data:", school.error);
        return null;
      }
      
      const admin = schoolAdmins.get(school.id);
      
      // Safely extract values from nested objects
      const schoolType = school.school_types?.name || 'N/A';
      const regionName = school.regions?.name || 'N/A';
      const sectorName = school.sectors?.name || 'N/A';

      return {
        id: school.id || '',
        name: school.name || '',
        type: schoolType,
        region: regionName,
        region_id: school.region_id || '',
        sector: sectorName,
        sector_id: school.sector_id || '',
        studentCount: school.student_count || 0,
        teacherCount: school.teacher_count || 0,
        completionRate: Math.floor(Math.random() * 40) + 60, // Placeholder
        status: school.status || 'Aktiv',
        director: school.director || 'N/A',
        contactEmail: school.email || 'N/A',
        contactPhone: school.phone || 'N/A',
        createdAt: school.created_at || '',
        address: school.address || '',
        adminName: admin?.name || null,
        adminId: admin?.id || null
      };
    }).filter(Boolean) as School[]; // Remove any null items

    return schools;
  } catch (error) {
    console.error('Error fetching schools:', error);
    return [];
  }
};

/**
 * Get a single school by ID with all details
 */
export const getSchoolById = async (id: string): Promise<School | null> => {
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
        regions(id, name),
        sectors(id, name),
        school_types:type_id(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // If no data returned, return null
    if (!data) return null;

    // Calculate completion rate - in a real app, this would be based on actual data
    const completionRate = await calculateCompletionRate(id);

    // Handle nested objects safely
    const schoolType = data.school_types?.name || 'N/A';
    const regionName = data.regions?.name || 'N/A';
    const sectorName = data.sectors?.name || 'N/A';

    return {
      id: data.id,
      name: data.name,
      type: schoolType,
      region: regionName,
      region_id: data.region_id || '',
      sector: sectorName,
      sector_id: data.sector_id || '',
      studentCount: data.student_count || 0,
      teacherCount: data.teacher_count || 0,
      completionRate,
      status: data.status || 'Aktiv',
      director: data.director || 'N/A',
      contactEmail: data.email || 'N/A',
      contactPhone: data.phone || 'N/A',
      createdAt: data.created_at || '',
      address: data.address || ''
    };
  } catch (error) {
    console.error('Error fetching school details:', error);
    return null;
  }
};

/**
 * Get school by ID with admin details
 */
export const getSchoolWithAdmin = async (id: string): Promise<{school: School, admin: any} | null> => {
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
        regions(id, name),
        sectors(id, name),
        school_types:type_id(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    if (!data) return null;

    // Get the admin information separately
    const roleResult = await supabase.from('roles').select('id').eq('name', 'school-admin').single();
    
    let adminData = null;
    if (!roleResult.error && roleResult.data) {
      const { data: adminResult, error: adminError } = await supabase
        .from('users')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          role_id,
          roles(name)
        `)
        .eq('school_id', id)
        .eq('role_id', roleResult.data.id)
        .maybeSingle();

      if (adminError && adminError.code !== 'PGRST116') { // PGRST116 is "No rows returned" which is OK
        console.warn('Error fetching admin data:', adminError);
      } else {
        adminData = adminResult;
      }
    }

    // Calculate completion rate
    const completionRate = await calculateCompletionRate(id);
    
    const adminName = adminData ? `${adminData.first_name} ${adminData.last_name}` : null;

    // Handle nested objects safely
    const schoolType = data.school_types?.name || 'N/A';
    const regionName = data.regions?.name || 'N/A';
    const sectorName = data.sectors?.name || 'N/A';

    const school = {
      id: data.id,
      name: data.name,
      type: schoolType,
      region: regionName,
      region_id: data.region_id || '',
      sector: sectorName,
      sector_id: data.sector_id || '',
      studentCount: data.student_count || 0,
      teacherCount: data.teacher_count || 0,
      completionRate,
      status: data.status || 'Aktiv',
      director: data.director || 'N/A',
      contactEmail: data.email || 'N/A',
      contactPhone: data.phone || 'N/A',
      createdAt: data.created_at || '',
      address: data.address || '',
      adminName: adminName,
      adminId: adminData?.id || null
    };

    return { school, admin: adminData || null };
  } catch (error) {
    console.error('Error fetching school with admin details:', error);
    return null;
  }
};
