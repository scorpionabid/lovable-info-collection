/**
 * Təsdiqləmə xidməti - məlumatların təsdiqlənməsi və idarə edilməsi üçün
 */
import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

export interface ApprovalFilter {
  status?: 'pending' | 'approved' | 'rejected';
  categoryId?: string;
  schoolId?: string;
  regionId?: string;
  sectorId?: string;
  page?: number;
  limit?: number;
}

export interface ApprovalResponse {
  data: any[] | null;
  count: number;
  error: any | null;
}

/**
 * Təsdiqləmə xidməti
 */
const approvalService = {
  /**
   * Gözləyən təsdiqləmələri əldə et
   * @param filters Filter parametrləri
   * @returns Gözləyən təsdiqləmələr
   */
  getPendingApprovals: async (filters: ApprovalFilter = {}): Promise<ApprovalResponse> => {
    try {
      let query = supabase
        .from('data')
        .select(`
          *,
          schools:schools(id, name),
          categories:categories(id, name, description),
          created_by_user:users!created_by(id, first_name, last_name)
        `, { count: 'exact' })
        .eq('status', 'submitted');
      
      // Filtrləri tətbiq et
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      
      if (filters.schoolId) {
        query = query.eq('school_id', filters.schoolId);
      }
      
      if (filters.regionId) {
        query = query.eq('schools.region_id', filters.regionId);
      }
      
      if (filters.sectorId) {
        query = query.eq('schools.sector_id', filters.sectorId);
      }
      
      // Sıralama
      query = query.order('created_at', { ascending: false });
      
      // Səhifələmə
      if (filters.page && filters.limit) {
        const from = (filters.page - 1) * filters.limit;
        const to = from + filters.limit - 1;
        query = query.range(from, to);
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        logger.error('Gözləyən təsdiqləmələri əldə etmə xətası:', error);
        return { data: null, count: 0, error };
      }
      
      return { data, count: count || 0, error: null };
    } catch (error) {
      logger.error('Gözləyən təsdiqləmələri əldə etmə xətası:', error);
      return { data: null, count: 0, error };
    }
  },
  
  /**
   * Məlumatı təsdiqlə
   * @param dataId Məlumat ID-si
   * @param comment Təsdiqləmə şərhi
   * @returns Təsdiqlənmiş məlumat
   */
  approveData: async (dataId: string, comment?: string) => {
    try {
      const user = supabase.auth.getUser();
      const userId = (await user).data.user?.id;
      
      if (!userId) {
        logger.error('Təsdiqləmə xətası: İstifadəçi tapılmadı');
        return null;
      }
      
      // Məlumatı yenilə
      const { data, error } = await supabase
        .from('data')
        .update({
          status: 'approved',
          approved_by: userId,
          approved_at: new Date().toISOString(),
          approval_comment: comment || null
        })
        .eq('id', dataId)
        .select()
        .single();
      
      if (error) {
        logger.error('Məlumat təsdiqləmə xətası:', error);
        return null;
      }
      
      // Audit log əlavə et
      await supabase
        .from('audit_logs')
        .insert({
          user_id: userId,
          action: 'approve',
          table_name: 'data',
          record_id: dataId,
          details: { comment }
        });
      
      return data;
    } catch (error) {
      logger.error('Məlumat təsdiqləmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Məlumatı rədd et
   * @param dataId Məlumat ID-si
   * @param reason Rədd etmə səbəbi
   * @returns Rədd edilmiş məlumat
   */
  rejectData: async (dataId: string, reason: string) => {
    try {
      const user = supabase.auth.getUser();
      const userId = (await user).data.user?.id;
      
      if (!userId) {
        logger.error('Rədd etmə xətası: İstifadəçi tapılmadı');
        return null;
      }
      
      // Məlumatı yenilə
      const { data, error } = await supabase
        .from('data')
        .update({
          status: 'rejected',
          rejected_by: userId,
          rejected_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', dataId)
        .select()
        .single();
      
      if (error) {
        logger.error('Məlumat rədd etmə xətası:', error);
        return null;
      }
      
      // Audit log əlavə et
      await supabase
        .from('audit_logs')
        .insert({
          user_id: userId,
          action: 'reject',
          table_name: 'data',
          record_id: dataId,
          details: { reason }
        });
      
      return data;
    } catch (error) {
      logger.error('Məlumat rədd etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Təsdiqləmə tarixçəsini əldə et
   * @param filters Filter parametrləri
   * @returns Təsdiqləmə tarixçəsi
   */
  getApprovalHistory: async (filters: ApprovalFilter = {}): Promise<ApprovalResponse> => {
    try {
      let query = supabase
        .from('data')
        .select(`
          *,
          schools:schools(id, name),
          categories:categories(id, name, description),
          created_by_user:users!created_by(id, first_name, last_name),
          approved_by_user:users!approved_by(id, first_name, last_name),
          rejected_by_user:users!rejected_by(id, first_name, last_name)
        `, { count: 'exact' })
        .or('status.eq.approved,status.eq.rejected');
      
      // Filtrləri tətbiq et
      if (filters.status && filters.status !== 'pending') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      
      if (filters.schoolId) {
        query = query.eq('school_id', filters.schoolId);
      }
      
      if (filters.regionId) {
        query = query.eq('schools.region_id', filters.regionId);
      }
      
      if (filters.sectorId) {
        query = query.eq('schools.sector_id', filters.sectorId);
      }
      
      // Sıralama
      query = query.order('updated_at', { ascending: false });
      
      // Səhifələmə
      if (filters.page && filters.limit) {
        const from = (filters.page - 1) * filters.limit;
        const to = from + filters.limit - 1;
        query = query.range(from, to);
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        logger.error('Təsdiqləmə tarixçəsini əldə etmə xətası:', error);
        return { data: null, count: 0, error };
      }
      
      return { data, count: count || 0, error: null };
    } catch (error) {
      logger.error('Təsdiqləmə tarixçəsini əldə etmə xətası:', error);
      return { data: null, count: 0, error };
    }
  }
};

export default approvalService;
