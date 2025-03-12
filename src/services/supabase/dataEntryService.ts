
import { supabase } from '@/integrations/supabase/client';
import { DataEntry, DataHistory } from './supabaseClient';

// Get data entries for a category
export const getDataEntries = async (categoryId: string) => {
  try {
    const { data, error } = await supabase
      .from('data')
      .select(`
        *,
        schools:schools(id, name),
        created_by_user:users!created_by(id, first_name, last_name)
      `)
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching data entries:', error);
    return { data: null, error };
  }
};

// Get a specific data entry
export const getDataEntry = async (entryId: string) => {
  try {
    const { data, error } = await supabase
      .from('data')
      .select(`
        *,
        schools:schools(id, name),
        categories:categories(id, name, description),
        created_by_user:users!created_by(id, first_name, last_name),
        approved_by_user:users!approved_by(id, first_name, last_name)
      `)
      .eq('id', entryId)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching data entry:', error);
    return { data: null, error };
  }
};

// Create a new data entry
export const createDataEntry = async (entry: Partial<DataEntry>) => {
  try {
    const { data, error } = await supabase
      .from('data')
      .insert(entry)
      .select();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating data entry:', error);
    return { data: null, error };
  }
};

// Update a data entry
export const updateDataEntry = async (entryId: string, updates: Partial<DataEntry>, userId: string) => {
  try {
    // First get the current entry
    const { data: currentEntry, error: fetchError } = await supabase
      .from('data')
      .select('*')
      .eq('id', entryId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Update the entry
    const { data, error } = await supabase
      .from('data')
      .update(updates)
      .eq('id', entryId)
      .select();
    
    if (error) throw error;
    
    // Create a history record if we have the current entry
    if (currentEntry && data && data.length > 0) {
      await supabase
        .from('data_history')
        .insert({
          data_id: entryId,
          changed_by: userId,
          data: updates.data || currentEntry.data,
          status: updates.status || currentEntry.status
        });
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating data entry:', error);
    return { data: null, error };
  }
};

// Get history for a data entry
export const getDataEntryHistory = async (dataId: string) => {
  try {
    const { data, error } = await supabase
      .from('data_history')
      .select(`
        *,
        users:changed_by(id, first_name, last_name)
      `)
      .eq('data_id', dataId)
      .order('changed_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching data entry history:', error);
    return { data: null, error };
  }
};
