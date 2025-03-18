
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export interface SchoolData {
  id?: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  status?: 'active' | 'inactive';
  director?: string;
  student_count?: number;
  teacher_count?: number;
}

export interface SchoolFilter {
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

const buildQuery = (query: any, filters: SchoolFilter) => {
  let modifiedQuery = query;
  
  if (filters.region_id) {
    modifiedQuery = modifiedQuery.eq('region_id', filters.region_id);
  }
  
  if (filters.sector_id) {
    modifiedQuery = modifiedQuery.eq('sector_id', filters.sector_id);
  }
  
  if (filters.type_id) {
    modifiedQuery = modifiedQuery.eq('type_id', filters.type_id);
  }
  
  if (filters.status) {
    modifiedQuery = modifiedQuery.eq('status', filters.status);
  }
  
  if (filters.search) {
    modifiedQuery = modifiedQuery.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }
  
  return modifiedQuery;
};

const schoolService = {
  getSchools: async (filters: SchoolFilter = {}) => {
    let query = supabase
      .from('schools')
      .select('*');
    
    query = buildQuery(query, filters);
    
    // Handle pagination
    if (filters.page !== undefined && filters.limit !== undefined) {
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }
    
    query = query.order('name');
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },
  
  createSchool: async (schoolData: SchoolData) => {
    const { data, error } = await supabase
      .from('schools')
      .insert(schoolData)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  getSchool: async (id: string) => {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  updateSchool: async (id: string, schoolData: Partial<SchoolData>) => {
    const { data, error } = await supabase
      .from('schools')
      .update(schoolData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  deleteSchool: async (id: string) => {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },
  
  importSchools: async (fileData: FormData) => {
    // Extract file from FormData
    const file = fileData.get('file') as File;
    if (!file) throw new Error('No file provided');
    
    // Use Supabase storage to upload file
    const fileName = `imports/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('school_imports')
      .upload(fileName, file);
      
    if (uploadError) throw uploadError;
    
    // Instead of using edge functions which we can't access directly,
    // return the file path for further processing
    return { 
      success: true, 
      message: 'File uploaded successfully', 
      filePath: fileName 
    };
  },
  
  exportSchools: async (filters: SchoolFilter = {}) => {
    // Fetch the data directly for export
    let query = supabase
      .from('schools')
      .select('*');
    
    query = buildQuery(query, filters);
    query = query.order('name');
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data;
  }
};

export default schoolService;
