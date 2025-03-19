/**
 * Data xidməti - məlumatların idarə edilməsi üçün
 */
import { supabase, withRetry } from '@/lib/supabase';
import { Data, DataHistory } from '@/types/supabase';
import { logger } from '@/utils/logger';

export interface DataEntryFilter {
  categoryId?: string;
  schoolId?: string;
  status?: 'draft' | 'submitted' | 'approved' | 'rejected';
  userId?: string;
  page?: number;
  pageSize?: number;
}

export interface DataEntryResponse {
  data: Data[] | null;
  count: number;
  error: any | null;
}

/**
 * Data xidməti
 */
const dataService = {
  /**
   * Kateqoriya üçün məlumatları əldə et
   */
  getDataEntries: async (filters: DataEntryFilter): Promise<DataEntryResponse> => {
    try {
      let query = supabase
        .from('data')
        .select(`
          *,
          schools:schools(id, name),
          categories:categories(id, name, description),
          created_by_user:users!created_by(id, first_name, last_name),
          approved_by_user:users!approved_by(id, first_name, last_name)
        `, { count: 'exact' });
      
      // Filtrləri tətbiq et
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      
      if (filters.schoolId) {
        query = query.eq('school_id', filters.schoolId);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.userId) {
        query = query.eq('created_by', filters.userId);
      }
      
      // Sıralama
      query = query.order('created_at', { ascending: false });
      
      // Səhifələmə
      if (filters.page && filters.pageSize) {
        const from = (filters.page - 1) * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        logger.error('Məlumatları əldə etmə xətası:', error);
        return { data: null, count: 0, error };
      }
      
      return { data: data as Data[], count: count || 0, error: null };
    } catch (error) {
      logger.error('Məlumatları əldə etmə xətası:', error);
      return { data: null, count: 0, error };
    }
  },
  
  /**
   * Konkret məlumatı əldə et
   */
  getDataEntry: async (entryId: string): Promise<Data | null> => {
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
      
      if (error) {
        logger.error('Məlumat əldə etmə xətası:', error);
        return null;
      }
      
      return data as Data;
    } catch (error) {
      logger.error('Məlumat əldə etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Yeni məlumat yarat
   */
  createDataEntry: async (entry: Partial<Data>): Promise<Data | null> => {
    try {
      // Məcburi sahələrin olduğunu yoxla
      if (!entry.category_id || !entry.school_id || !entry.created_by || !entry.data) {
        logger.error('Məlumat yaratma xətası: Məcburi sahələr çatışmır');
        return null;
      }

      const dataEntry = {
        category_id: entry.category_id,
        school_id: entry.school_id,
        created_by: entry.created_by,
        data: entry.data,
        status: entry.status || 'draft',
        rejection_reason: entry.rejection_reason,
        approved_by: entry.approved_by,
        approved_at: entry.approved_at,
        submitted_at: entry.submitted_at
      };
      
      const { data, error } = await supabase
        .from('data')
        .insert(dataEntry)
        .select()
        .single();
      
      if (error) {
        logger.error('Məlumat yaratma xətası:', error);
        return null;
      }
      
      return data as Data;
    } catch (error) {
      logger.error('Məlumat yaratma xətası:', error);
      return null;
    }
  },
  
  /**
   * Məlumatı yenilə
   */
  updateDataEntry: async (entryId: string, updates: Partial<Data>, userId: string): Promise<Data | null> => {
    try {
      // Əvvəlcə cari məlumatı əldə et
      const { data: currentEntry, error: fetchError } = await supabase
        .from('data')
        .select('*')
        .eq('id', entryId)
        .single();
      
      if (fetchError) {
        logger.error('Cari məlumatı əldə etmə xətası:', fetchError);
        return null;
      }
      
      // Məlumatı yenilə
      const { data, error } = await supabase
        .from('data')
        .update(updates)
        .eq('id', entryId)
        .select()
        .single();
      
      if (error) {
        logger.error('Məlumat yeniləmə xətası:', error);
        return null;
      }
      
      // Tarixçə qeydi yarat
      if (currentEntry) {
        await supabase
          .from('data_history')
          .insert({
            data_id: entryId,
            changed_by: userId,
            data: updates.data || currentEntry.data,
            status: updates.status || currentEntry.status
          });
      }
      
      return data as Data;
    } catch (error) {
      logger.error('Məlumat yeniləmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Məlumatı təsdiq et
   */
  approveDataEntry: async (entryId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('data')
        .update({
          status: 'approved',
          approved_by: userId,
          approved_at: new Date().toISOString()
        })
        .eq('id', entryId);
      
      if (error) {
        logger.error('Məlumat təsdiq xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Məlumat təsdiq xətası:', error);
      return false;
    }
  },
  
  /**
   * Məlumatı rədd et
   */
  rejectDataEntry: async (entryId: string, reason: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('data')
        .update({
          status: 'rejected',
          rejection_reason: reason
        })
        .eq('id', entryId);
      
      if (error) {
        logger.error('Məlumat rədd etmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Məlumat rədd etmə xətası:', error);
      return false;
    }
  },
  
  /**
   * Məlumat tarixçəsini əldə et
   */
  getDataEntryHistory: async (dataId: string): Promise<DataHistory[]> => {
    try {
      const { data, error } = await supabase
        .from('data_history')
        .select(`
          *,
          users:changed_by(id, first_name, last_name)
        `)
        .eq('data_id', dataId)
        .order('changed_at', { ascending: false });
      
      if (error) {
        logger.error('Məlumat tarixçəsi əldə etmə xətası:', error);
        return [];
      }
      
      return data as unknown as DataHistory[];
    } catch (error) {
      logger.error('Məlumat tarixçəsi əldə etmə xətası:', error);
      return [];
    }
  },
  
  /**
   * Şablon əldə et
   */
  getTemplate: async (categoryId: string) => {
    try {
      // Kateqoriya sütunlarını əldə et
      const { data: columns, error } = await supabase
        .from('columns')
        .select('*')
        .eq('category_id', categoryId)
        .order('order', { ascending: true });
        
      if (error) {
        logger.error('Şablon əldə etmə xətası:', error);
        throw error;
      }
      
      return columns;
    } catch (error) {
      logger.error('Şablon əldə etmə xətası:', error);
      throw error;
    }
  },
  
  /**
   * Məlumat idxal et
   */
  importData: async (fileData: FormData) => {
    try {
      // FormData-dan faylı çıxar
      const file = fileData.get('file') as File;
      if (!file) throw new Error('Fayl təqdim edilməyib');
      
      // Supabase saxlama ilə faylı yüklə
      const fileName = `imports/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('data_imports')
        .upload(fileName, file);
        
      if (uploadError) {
        logger.error('Fayl yükləmə xətası:', uploadError);
        throw uploadError;
      }
      
      // Sonrakı emal üçün fayl yolunu qaytar
      return { 
        success: true, 
        message: 'Fayl uğurla yükləndi', 
        filePath: fileName 
      };
    } catch (error) {
      logger.error('Məlumat idxal xətası:', error);
      return {
        success: false,
        message: 'Məlumat idxal xətası',
        error
      };
    }
  }
};

export default dataService;
