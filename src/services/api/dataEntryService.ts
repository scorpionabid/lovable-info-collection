
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export interface DataEntryFilter {
  categoryId: string;
  schoolId: string;
}

const dataEntryService = {
  getData: async (categoryId: string, schoolId: string) => {
    const { data, error } = await supabase
      .from('data')
      .select('*')
      .eq('category_id', categoryId)
      .eq('school_id', schoolId);
      
    if (error) throw error;
    return data;
  },
  
  submitData: async (categoryId: string, schoolId: string, formData: Record<string, any>) => {
    // Create a new data entry
    const { data, error } = await supabase
      .from('data')
      .insert({
        category_id: categoryId,
        school_id: schoolId,
        data: formData,
        status: 'pending'
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  updateData: async (dataId: string, formData: Record<string, any>) => {
    const { data, error } = await supabase
      .from('data')
      .update({ data: formData })
      .eq('id', dataId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  getTemplate: async (categoryId: string) => {
    // Get category columns to create template
    const { data: columns, error } = await supabase
      .from('columns')
      .select('*')
      .eq('category_id', categoryId);
      
    if (error) throw error;
    
    // Return columns data to be used for template generation
    return columns;
  },
  
  importData: async (fileData: FormData) => {
    // Extract file from FormData
    const file = fileData.get('file') as File;
    if (!file) throw new Error('No file provided');
    
    // Use Supabase storage to upload file
    const fileName = `imports/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('data_imports')
      .upload(fileName, file);
      
    if (uploadError) throw uploadError;
    
    // We can't directly call an Edge Function as in the original code
    // Instead, return the file path for further processing
    return { 
      success: true, 
      message: 'File uploaded successfully', 
      filePath: fileName 
    };
  },
  
  getHistory: async (dataId: string) => {
    const { data, error } = await supabase
      .from('data_history')
      .select('*')
      .eq('data_id', dataId)
      .order('changed_at', { ascending: false });
      
    if (error) throw error;
    return data;
  }
};

export default dataEntryService;
