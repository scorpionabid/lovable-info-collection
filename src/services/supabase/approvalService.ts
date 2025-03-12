
import { supabase } from './supabaseClient';
import { DataEntry } from './supabaseClient';

// Get all pending data entries for approval
export const getPendingApprovals = async () => {
  try {
    // Using 'data' table instead of 'data_entries'
    const { data, error } = await supabase
      .from('data')
      .select(`
        *,
        schools:schools(id, name),
        categories:categories(id, name)
      `)
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    return { data: null, error };
  }
};

// Get approvals for a specific region
export const getRegionApprovals = async (regionId: string) => {
  try {
    const { data, error } = await supabase
      .from('data')
      .select(`
        *,
        schools:schools(id, name, region_id),
        categories:categories(id, name)
      `)
      .eq('status', 'submitted')
      .eq('schools.region_id', regionId)
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching region approvals:', error);
    return { data: null, error };
  }
};

// Get approvals for a specific sector
export const getSectorApprovals = async (sectorId: string) => {
  try {
    const { data, error } = await supabase
      .from('data')
      .select(`
        *,
        schools:schools(id, name, sector_id),
        categories:categories(id, name)
      `)
      .eq('status', 'submitted')
      .eq('schools.sector_id', sectorId)
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching sector approvals:', error);
    return { data: null, error };
  }
};

// Approve a data entry
export const approveDataEntry = async (entryId: string, userId: string) => {
  try {
    // First fetch the current data entry
    const { data: currentEntry, error: fetchError } = await supabase
      .from('data')
      .select('*')
      .eq('id', entryId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Update the data entry status
    const { data, error } = await supabase
      .from('data')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: userId
      })
      .eq('id', entryId)
      .select();
    
    if (error) throw error;
    
    // Create a history record
    if (currentEntry) {
      await supabase
        .from('data_history')
        .insert({
          data_id: entryId,
          data: currentEntry.data,
          status: 'approved',
          changed_by: userId
        });
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error approving data entry:', error);
    return { data: null, error };
  }
};
