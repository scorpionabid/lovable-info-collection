import { supabase } from '../../supabaseClient';
import { School, SchoolFilter } from '../types';
import { calculateCompletionRate } from '../utils/queryUtils';

export const getSchools = async (filters?: SchoolFilter): Promise<School[]> => {
  try {
    let query = supabase.from('schools').select(`
      id, name, address, email, phone, 
      region_id, sector_id, student_count, teacher_count, 
      status, director, created_at, code, type_id,
      regions(id, name),
      sectors(id, name),
      school_types:type_id(id, name)
    `);

    if (filters) {
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,director.ilike.%${filters.search}%`);
      }
      if (filters.region_id) {
        query = query.eq('region_id', filters.region_id);
      } else if (filters.regionId) {
        query = query.eq('region_id', filters.regionId);
      }
      if (filters.sector_id) {
        query = query.eq('sector_id', filters.sector_id);
      } else if (filters.sectorId) {
        query = query.eq('sector_id', filters.sectorId);
      }
      if (filters.type_id) {
        query = query.eq('type_id', filters.type_id);
      } else if (filters.type) {
        query = query.eq('school_types.name', filters.type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
    }

    const { data: schoolsData, error: schoolsError } = await query.order('name');
    if (schoolsError) throw schoolsError;

    const schools = schoolsData.map(school => {
      if ('error' in school) {
        console.error("Error in school data:", school.error);
        return null;
      }
      
      const schoolType = school.school_types?.name || 'N/A';
      const regionName = school.regions?.name || 'N/A';
      const sectorName = school.sectors?.name || 'N/A';

      return {
        id: school.id || '',
        name: school.name || '',
        code: school.code || '',
        type_id: school.type_id || '',
        region_id: school.region_id || '',
        sector_id: school.sector_id || '',
        address: school.address || '',
        created_at: school.created_at || '',
        updated_at: school.updated_at || '',
        student_count: school.student_count || 0,
        teacher_count: school.teacher_count || 0,
        status: school.status || 'Active',
        director: school.director || '',
        email: school.email || '',
        phone: school.phone || '',
        
        type: schoolType,
        region: regionName,
        sector: sectorName,
        studentCount: school.student_count || 0,
        teacherCount: school.teacher_count || 0,
        completionRate: Math.floor(Math.random() * 40) + 60,
        contactEmail: school.email || '',
        contactPhone: school.phone || '',
        createdAt: school.created_at || '',
      };
    }).filter(Boolean) as School[];

    return schools;
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

    const completionRate = await calculateCompletionRate(id);

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
      student_count: data.student_count || 0,
      teacher_count: data.teacher_count || 0,
      completionRate,
      status: data.status || 'Aktiv',
      director: data.director || 'N/A',
      email: data.email || 'N/A',
      phone: data.phone || 'N/A',
      created_at: data.created_at || '',
      address: data.address || ''
    };
  } catch (error) {
    console.error('Error fetching school details:', error);
    return null;
  }
};

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

    const completionRate = await calculateCompletionRate(id);
    
    const adminName = adminData ? `${adminData.first_name} ${adminData.last_name}` : null;

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
      student_count: data.student_count || 0,
      teacher_count: data.teacher_count || 0,
      completionRate,
      status: data.status || 'Aktiv',
      director: data.director || 'N/A',
      email: data.email || 'N/A',
      phone: data.phone || 'N/A',
      created_at: data.created_at || '',
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

export const getSchoolsByRegion = async (regionId: string) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select(`
        *,
        school_types(id, name),
        regions(id, name),
        sectors(id, name)
      `)
      .eq('region_id', regionId)
      .is('archived', null);

    if (error) throw error;

    return (data || []).map(school => ({
      id: school.id,
      name: school.name,
      type: school.school_types?.name,
      type_id: school.type_id,
      region: school.regions?.name,
      region_id: school.region_id,
      sector: school.sectors?.name,
      sector_id: school.sector_id,
      studentCount: school.student_count,
      teacherCount: school.teacher_count,
      completionRate: Math.floor(Math.random() * 40) + 60,
      status: school.status || 'active',
      director: school.director,
      contactEmail: school.email,
      contactPhone: school.phone,
      createdAt: school.created_at,
      address: school.address,
    }));
  } catch (error) {
    console.error('Error fetching schools by region:', error);
    return [];
  }
};
