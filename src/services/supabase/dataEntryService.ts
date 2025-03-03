
import { supabase, DataEntry, DataHistory } from './supabaseClient';

const dataEntryService = {
  getData: async (categoryId: string, schoolId: string) => {
    const { data, error } = await supabase
      .from('data_entries')
      .select('*')
      .eq('category_id', categoryId)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    return data?.[0] as DataEntry | undefined;
  },
  
  submitData: async (dataEntry: Omit<DataEntry, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('data_entries')
      .insert([{ 
        ...dataEntry, 
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString() 
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as DataEntry;
  },
  
  saveDraft: async (dataEntry: Omit<DataEntry, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('data_entries')
      .insert([{ 
        ...dataEntry, 
        status: 'draft',
        created_at: new Date().toISOString() 
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as DataEntry;
  },
  
  updateData: async (id: string, dataEntry: Partial<Omit<DataEntry, 'id' | 'created_at'>>) => {
    // First get the existing data for history
    const { data: existingData, error: fetchError } = await supabase
      .from('data_entries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Update the data
    const { data, error } = await supabase
      .from('data_entries')
      .update({ 
        ...dataEntry,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Create history record
    if (existingData && existingData.data !== dataEntry.data) {
      await supabase
        .from('data_history')
        .insert([{
          data_id: id,
          user_id: dataEntry.user_id || existingData.user_id,
          previous_data: existingData.data,
          new_data: dataEntry.data || existingData.data,
          created_at: new Date().toISOString()
        }]);
    }
    
    return data as DataEntry;
  },
  
  getDataHistory: async (dataId: string) => {
    const { data, error } = await supabase
      .from('data_history')
      .select('*, users(first_name, last_name)')
      .eq('data_id', dataId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (DataHistory & { users: { first_name: string, last_name: string } })[];
  },
  
  getPendingDataByCategory: async (categoryId: string) => {
    const { data, error } = await supabase
      .from('data_entries')
      .select('*, schools(name), users(first_name, last_name)')
      .eq('category_id', categoryId)
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};

export default dataEntryService;
