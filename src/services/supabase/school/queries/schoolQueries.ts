
import { supabase } from '../baseClient';
import { School, SchoolFilter } from '../types';
import { calculateCompletionRate, transformSchoolData } from '../utils/queryUtils';

/**
 * Get all schools with optional filtering
 */
export const getSchools = async (filters?: SchoolFilter): Promise<School[]> => {
  try {
    // Use a better approach to fetch schools with their admins
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
        school_types:type_id (id, name),
        regions:region_id (id, name),
        sectors:sector_id (id, name)
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

    const { data: schoolsData, error: schoolsError } = await query.order('name');

    if (schoolsError) throw schoolsError;

    // Now let's get the admin information for each school in a separate query
    // This avoids the foreign key relationship issue
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select(`
        id,
        first_name,
        last_name,
        school_id,
        roles:role_id (name)
      `)
      .eq('roles.name', 'school-admin');

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
    const schools = schoolsData.map((item: any) => transformSchoolData(item, schoolAdmins));

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
    const completionRate = await calculateCompletionRate(id);

    // Handle nested objects correctly
    const schoolType = data.school_types && data.school_types[0] ? data.school_types[0].name : 'N/A';
    const regionName = data.regions && data.regions[0] ? data.regions[0].name : 'N/A';
    const sectorName = data.sectors && data.sectors[0] ? data.sectors[0].name : 'N/A';

    return {
      id: data.id,
      name: data.name,
      type: schoolType,
      region: regionName,
      region_id: data.region_id,
      sector: sectorName,
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
 * Get school by ID with admin details
 */
export const getSchoolWithAdmin = async (id: string): Promise<{school: School, admin: any}> => {
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
        school_types:type_id (id, name),
        regions:region_id (id, name),
        sectors:sector_id (id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Get the admin information separately
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        role_id
      `)
      .eq('school_id', id)
      .eq('roles.name', 'school-admin')
      .single();

    if (adminError && adminError.code !== 'PGRST116') { // PGRST116 is "No rows returned" which is OK
      console.warn('Error fetching admin data:', adminError);
    }

    // Calculate completion rate - in a real app, this would be based on data
    const completionRate = await calculateCompletionRate(id);
    
    const adminName = adminData ? `${adminData.first_name} ${adminData.last_name}` : null;

    // Fix: Properly access the nested objects' properties
    const schoolType = data.school_types ? data.school_types.name : 'N/A';
    const regionName = data.regions ? data.regions.name : 'N/A';
    const sectorName = data.sectors ? data.sectors.name : 'N/A';

    const school = {
      id: data.id,
      name: data.name,
      type: schoolType,
      region: regionName,
      region_id: data.region_id,
      sector: sectorName,
      sector_id: data.sector_id,
      studentCount: data.student_count || 0,
      teacherCount: data.teacher_count || 0,
      completionRate,
      status: data.status || 'Aktiv',
      director: data.director || 'N/A',
      contactEmail: data.email || 'N/A',
      contactPhone: data.phone || 'N/A',
      createdAt: data.created_at,
      address: data.address,
      adminName: adminName,
      adminId: adminData?.id || null
    };

    return { school, admin: adminData || null };
  } catch (error) {
    console.error('Error fetching school with admin details:', error);
    throw error;
  }
};
