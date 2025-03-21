
import { supabase } from '../client';

export interface DataEntry {
  id: string;
  category_id: string;
  column_id: string;
  school_id: string;
  value: any;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  created_by: string;
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
}

export interface CreateDataDto {
  category_id: string;
  column_id: string;
  school_id: string;
  value: any;
}

export interface UpdateDataDto {
  value?: any;
  status?: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
}

/**
 * Get all data entries
 */
export const getData = async () => {
  try {
    const { data, error } = await supabase
      .from('data')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching data entries:', error);
    throw error;
  }
};

/**
 * Get a data entry by ID
 */
export const getDataById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('data')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching data entry with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new data entry
 */
export const createData = async (dataEntry: CreateDataDto) => {
  try {
    const { data, error } = await supabase
      .from('data')
      .insert(dataEntry)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating data entry:', error);
    throw error;
  }
};

/**
 * Update a data entry
 */
export const updateData = async (id: string, dataEntry: UpdateDataDto) => {
  try {
    const { data, error } = await supabase
      .from('data')
      .update(dataEntry)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating data entry with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a data entry
 */
export const deleteData = async (id: string) => {
  try {
    const { error } = await supabase
      .from('data')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting data entry with ID ${id}:`, error);
    throw error;
  }
};
