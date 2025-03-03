
import { supabase } from './supabaseClient';

const approvalService = {
  getPendingApprovals: async (filters?: { regionId?: string; sectorId?: string; categoryId?: string }) => {
    let query = supabase
      .from('data_entries')
      .select(`
        *,
        schools(id, name, region_id, sector_id),
        categories(id, name),
        users(id, first_name, last_name)
      `)
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: true });
    
    if (filters?.regionId) {
      query = query.filter('schools.region_id', 'eq', filters.regionId);
    }
    
    if (filters?.sectorId) {
      query = query.filter('schools.sector_id', 'eq', filters.sectorId);
    }
    
    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },
  
  approveData: async (dataId: string, userId: string) => {
    const { data, error } = await supabase
      .from('data_entries')
      .update({
        status: 'approved',
        approved_by: userId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', dataId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  rejectData: async (dataId: string, reason: string) => {
    const { data, error } = await supabase
      .from('data_entries')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', dataId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  getApprovalHistory: async (filters?: { userId?: string; categoryId?: string; status?: string }) => {
    let query = supabase
      .from('data_entries')
      .select(`
        *,
        schools(id, name),
        categories(id, name),
        users:user_id(id, first_name, last_name),
        approvers:approved_by(id, first_name, last_name)
      `)
      .or('status.eq.approved,status.eq.rejected')
      .order('updated_at', { ascending: false });
    
    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }
    
    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
};

export default approvalService;
