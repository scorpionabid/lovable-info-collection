
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export interface SchoolData {
  id?: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  region_id: string;
  sector_id: string;
  type_id: string;
  status: 'active' | 'inactive';
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
    modifiedQuery = modifiedQuery.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
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
    
    // Trigger processing function (can be implemented as Edge Function in Supabase)
    const { error: processError } = await supabase.functions.invoke('process-school-import', {
      body: { filePath: fileName }
    });
    
    if (processError) throw processError;
    
    return { success: true, message: 'File uploaded and processing started' };
  },
  
  exportSchools: async (filters: SchoolFilter = {}) => {
    // This would typically generate a file with school data
    // For now, we'll just fetch the data that would be exported
    let query = supabase
      .from('schools')
      .select('*');
    
    query = buildQuery(query, filters);
    query = query.order('name');
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // In a real implementation, this might return a file or trigger a download
    return data;
  }
};

export default schoolService;
