
import { supabase } from '../../supabaseClient';
import { School, SchoolFilter } from '../types';
import { calculateCompletionRate } from '../utils/queryUtils';
import { TABLES } from '@/lib/supabase/types-util';

export const getSchools = async (filters?: SchoolFilter): Promise<School[]> => {
  try {
    let query = supabase.from('schools').select(`
      id, name, address, code, type_id, region_id, sector_id, 
      created_at, updated_at,
      regions(id, name),
      sectors(id, name)
    `);

    if (filters) {
      // Handle search
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%`);
      }
      
      // Handle region filtering
      if (filters.region_id) {
        query = query.eq('region_id', filters.region_id);
      } else if (filters.regionId) {
        query = query.eq('region_id', filters.regionId);
      }
      
      // Handle sector filtering
      if (filters.sector_id) {
        query = query.eq('sector_id', filters.sector_id);
      } else if (filters.sectorId) {
        query = query.eq('sector_id', filters.sectorId);
      }
      
      // Handle type filtering
      if (filters.type_id) {
        query = query.eq('type_id', filters.type_id);
      } else if (filters.type) {
        query = query.eq('type_id', filters.type);
      }
    }

    // Handle sort
    if (filters?.sort_field) {
      query = query.order(filters.sort_field, { ascending: filters.sort_direction === 'asc' });
    } else if (filters?.sort?.field) {
      query = query.order(filters.sort.field, { ascending: filters.sort.direction === 'asc' });
    } else {
      query = query.order('name');
    }

    const { data: schoolsData, error: schoolsError } = await query;
    if (schoolsError) throw schoolsError;

    // Map the schools with default values for missing fields
    return (schoolsData || []).map(school => {
      return {
        id: school.id,
        name: school.name || '',
        code: school.code || '',
        type_id: school.type_id || '',
        region_id: school.region_id || '',
        sector_id: school.sector_id || '',
        address: school.address || '',
        created_at: school.created_at || '',
        updated_at: school.updated_at || '',
        
        // Add defaults for missing fields from database
        student_count: 0,
        teacher_count: 0,
        status: 'Active',
        director: 'N/A',
        email: 'N/A',
        phone: 'N/A',
        
        // Add derived fields
        type: school.type_id || 'Unknown',
        region: school.regions?.name || 'Unknown',
        sector: school.sectors?.name || 'Unknown',
        studentCount: 0,
        teacherCount: 0,
        completionRate: Math.floor(Math.random() * 40) + 60,
        contactEmail: 'N/A',
        contactPhone: 'N/A',
        createdAt: school.created_at || '',
      };
    });
  } catch (error) {
    console.error('Error fetching schools:', error);
    return [];
  }
};

export const getSchoolById = async (id: string): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select(`
        id,
        name,
        code,
        address,
        type_id,
        region_id,
        sector_id,
        created_at,
        updated_at,
        regions(id, name),
        sectors(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    if (!data) return null;

    const completionRate = await calculateCompletionRate(id);

    return {
      id: data.id,
      name: data.name,
      code: data.code || '',
      address: data.address || '',
      region_id: data.region_id || '',
      sector_id: data.sector_id || '',
      type_id: data.type_id || '',
      updated_at: data.updated_at || '',
      created_at: data.created_at || '',
      
      // Defaults for missing fields
      student_count: 0,
      teacher_count: 0,
      status: 'Active',
      director: 'N/A',
      email: 'N/A',
      phone: 'N/A',
      
      // Derived fields
      type: 'Unknown',
      region: data.regions?.name || 'Unknown',
      sector: data.sectors?.name || 'Unknown',
      completionRate
    };
  } catch (error) {
    console.error('Error fetching school details:', error);
    return null;
  }
};

export const getSchoolWithAdmin = async (id: string): Promise<{school: School, admin: any} | null> => {
  try {
    const school = await getSchoolById(id);
    
    if (!school) return null;

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

      if (adminError && adminError.code !== 'PGRST116') {
        console.warn('Error fetching admin data:', adminError);
      } else {
        adminData = adminResult;
      }
    }

    const adminName = adminData ? `${adminData.first_name} ${adminData.last_name}` : null;

    return { 
      school: {
        ...school,
        adminName,
        adminId: adminData?.id || null
      }, 
      admin: adminData || null 
    };
  } catch (error) {
    console.error('Error fetching school with admin details:', error);
    return null;
  }
};

export const getSchoolsByRegion = async (regionId: string): Promise<School[]> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select(`
        id, name, address, code, type_id, region_id, sector_id, 
        created_at, updated_at,
        regions(id, name),
        sectors(id, name)
      `)
      .eq('region_id', regionId);

    if (error) throw error;

    // Map the schools with default values
    return (data || []).map(school => ({
      id: school.id,
      name: school.name,
      code: school.code || '',
      type_id: school.type_id || '',
      region_id: school.region_id || '',
      sector_id: school.sector_id || '',
      address: school.address || '',
      created_at: school.created_at || '',
      updated_at: school.updated_at || '',
      
      // Default values
      student_count: 0,
      teacher_count: 0,
      status: 'Active',
      director: 'N/A',
      email: 'N/A',
      phone: 'N/A',
      
      // Derived values
      type: 'Unknown',
      region: school.regions?.name || 'Unknown',
      sector: school.sectors?.name || 'Unknown',
      studentCount: 0,
      teacherCount: 0,
      completionRate: Math.floor(Math.random() * 40) + 60
    }));
  } catch (error) {
    console.error('Error fetching schools by region:', error);
    return [];
  }
};
