
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export interface DataEntryFilter {
  categoryId: string;
  schoolId: string;
}

const dataEntryService = {
  getData: async (categoryId: string, schoolId: string) => {
    const { data, error } = await supabase
      .from('data_entries')
      .select('*')
      .eq('category_id', categoryId)
      .eq('school_id', schoolId);
      
    if (error) throw error;
    return data;
  },
  
  submitData: async (categoryId: string, schoolId: string, formData: Record<string, any>) => {
    // Create a new data entry
    const { data, error } = await supabase
      .from('data_entries')
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
      .from('data_entries')
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
    
    // Trigger processing function (can be implemented as Edge Function in Supabase)
    const { error: processError } = await supabase.functions.invoke('process-data-import', {
      body: { filePath: fileName }
    });
    
    if (processError) throw processError;
    
    return { success: true, message: 'File uploaded and processing started' };
  },
  
  getHistory: async (dataId: string) => {
    const { data, error } = await supabase
      .from('data_entry_history')
      .select('*')
      .eq('data_entry_id', dataId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  }
};

export default dataEntryService;
