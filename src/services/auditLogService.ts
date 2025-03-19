/**
 * Audit log xidməti - sistem əməliyyatlarının izlənməsi üçün
 */
import { supabase } from '@/lib/supabase';
import { Json } from '@/types/supabase';
import { logger } from '@/utils/logger';

export interface AuditLogEntry {
  id: string;
  action: string;
  table_name: string;
  record_id?: string;
  user_id?: string;
  old_data?: Json;
  new_data?: Json;
  metadata?: Json;
  ip_address?: string;
  user_agent?: string;
  component?: string;
  success?: boolean;
  duration_ms?: number;
  created_at: string;
}

export interface AuditLogFilter {
  action?: string;
  tableName?: string;
  userId?: string;
  recordId?: string;
  component?: string;
  startDate?: string;
  endDate?: string;
  success?: boolean;
  page?: number;
  pageSize?: number;
}

export interface AuditLogResponse {
  data: AuditLogEntry[] | null;
  count: number;
  error: any | null;
}

/**
 * Audit log xidməti
 */
const auditLogService = {
  /**
   * Audit logları əldə et
   */
  getAuditLogs: async (filters?: AuditLogFilter): Promise<AuditLogResponse> => {
    try {
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          users:user_id(id, first_name, last_name, email)
        `, { count: 'exact' });
      
      // Filtrləri tətbiq et
      if (filters) {
        if (filters.action) {
          query = query.eq('action', filters.action);
        }
        if (filters.tableName) {
          query = query.eq('table_name', filters.tableName);
        }
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }
        if (filters.recordId) {
          query = query.eq('record_id', filters.recordId);
        }
        if (filters.component) {
          query = query.eq('component', filters.component);
        }
        if (filters.startDate) {
          query = query.gte('created_at', filters.startDate);
        }
        if (filters.endDate) {
          query = query.lte('created_at', filters.endDate);
        }
        if (filters.success !== undefined) {
          query = query.eq('success', filters.success);
        }
      }
      
      // Sıralama
      query = query.order('created_at', { ascending: false });
      
      // Səhifələmə
      if (filters?.page && filters?.pageSize) {
        const from = (filters.page - 1) * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        logger.error('Audit logları əldə etmə xətası:', error);
        return { data: null, count: 0, error };
      }
      
      return { data: data as AuditLogEntry[], count: count || 0, error: null };
    } catch (error) {
      logger.error('Audit logları əldə etmə xətası:', error);
      return { data: null, count: 0, error };
    }
  },
  
  /**
   * Audit log əlavə et
   */
  addAuditLog: async (entry: Omit<AuditLogEntry, 'id' | 'created_at'>): Promise<AuditLogEntry | null> => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert(entry)
        .select()
        .single();
      
      if (error) {
        logger.error('Audit log əlavə etmə xətası:', error);
        return null;
      }
      
      return data as AuditLogEntry;
    } catch (error) {
      logger.error('Audit log əlavə etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Cədvəl üzrə audit log əlavə et
   */
  logTableAction: async (
    action: string,
    tableName: string,
    userId: string,
    recordId?: string,
    oldData?: any,
    newData?: any,
    metadata?: any,
    success: boolean = true
  ): Promise<AuditLogEntry | null> => {
    try {
      const entry = {
        action,
        table_name: tableName,
        user_id: userId,
        record_id: recordId,
        old_data: oldData,
        new_data: newData,
        metadata,
        success,
        ip_address: await auditLogService.getClientIp(),
        user_agent: navigator.userAgent,
        duration_ms: 0 // Bu, real tətbiqdə ölçüləcək
      };
      
      return await auditLogService.addAuditLog(entry);
    } catch (error) {
      logger.error('Cədvəl əməliyyatı loq etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Komponentin əməliyyatını loq et
   */
  logComponentAction: async (
    action: string,
    component: string,
    userId: string,
    metadata?: any,
    success: boolean = true,
    durationMs?: number
  ): Promise<AuditLogEntry | null> => {
    try {
      const entry = {
        action,
        table_name: 'components',
        user_id: userId,
        component,
        metadata,
        success,
        ip_address: await auditLogService.getClientIp(),
        user_agent: navigator.userAgent,
        duration_ms: durationMs || 0
      };
      
      return await auditLogService.addAuditLog(entry);
    } catch (error) {
      logger.error('Komponent əməliyyatı loq etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Giriş əməliyyatını loq et
   */
  logLogin: async (
    userId: string,
    success: boolean,
    metadata?: any
  ): Promise<AuditLogEntry | null> => {
    try {
      return await auditLogService.logComponentAction(
        'login',
        'auth',
        userId,
        metadata,
        success
      );
    } catch (error) {
      logger.error('Giriş loq etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Çıxış əməliyyatını loq et
   */
  logLogout: async (userId: string): Promise<AuditLogEntry | null> => {
    try {
      return await auditLogService.logComponentAction(
        'logout',
        'auth',
        userId
      );
    } catch (error) {
      logger.error('Çıxış loq etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Məlumat əməliyyatını loq et
   */
  logDataAction: async (
    action: string,
    userId: string,
    dataId: string,
    oldData?: any,
    newData?: any,
    metadata?: any,
    success: boolean = true
  ): Promise<AuditLogEntry | null> => {
    try {
      return await auditLogService.logTableAction(
        action,
        'data',
        userId,
        dataId,
        oldData,
        newData,
        metadata,
        success
      );
    } catch (error) {
      logger.error('Məlumat əməliyyatı loq etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Kateqoriya əməliyyatını loq et
   */
  logCategoryAction: async (
    action: string,
    userId: string,
    categoryId: string,
    oldData?: any,
    newData?: any,
    metadata?: any,
    success: boolean = true
  ): Promise<AuditLogEntry | null> => {
    try {
      return await auditLogService.logTableAction(
        action,
        'categories',
        userId,
        categoryId,
        oldData,
        newData,
        metadata,
        success
      );
    } catch (error) {
      logger.error('Kateqoriya əməliyyatı loq etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * İstifadəçi əməliyyatını loq et
   */
  logUserAction: async (
    action: string,
    userId: string,
    targetUserId: string,
    oldData?: any,
    newData?: any,
    metadata?: any,
    success: boolean = true
  ): Promise<AuditLogEntry | null> => {
    try {
      return await auditLogService.logTableAction(
        action,
        'users',
        userId,
        targetUserId,
        oldData,
        newData,
        metadata,
        success
      );
    } catch (error) {
      logger.error('İstifadəçi əməliyyatı loq etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Müştəri IP ünvanını əldə et
   */
  getClientIp: async (): Promise<string | undefined> => {
    try {
      // Bu, real tətbiqdə daha mürəkkəb ola bilər
      // Burada sadə bir nümunə göstərilir
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      logger.error('IP ünvanı əldə etmə xətası:', error);
      return undefined;
    }
  },
  
  /**
   * Audit log statistikasını əldə et
   */
  getAuditStats: async (days: number = 30): Promise<any> => {
    try {
      // Son N gün üçün tarix hesabla
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Əməliyyat növlərinə görə statistika
      const { data: actionStats, error: actionError } = await supabase
        .from('audit_logs')
        .select('action, count')
        .gte('created_at', startDate.toISOString())
        .group('action');
      
      if (actionError) {
        logger.error('Əməliyyat statistikası əldə etmə xətası:', actionError);
        return null;
      }
      
      // İstifadəçilərə görə statistika
      const { data: userStats, error: userError } = await supabase
        .from('audit_logs')
        .select('user_id, users:user_id(first_name, last_name), count')
        .gte('created_at', startDate.toISOString())
        .group('user_id, users:user_id(first_name, last_name)')
        .order('count', { ascending: false })
        .limit(10);
      
      if (userError) {
        logger.error('İstifadəçi statistikası əldə etmə xətası:', userError);
        return null;
      }
      
      // Cədvəllərə görə statistika
      const { data: tableStats, error: tableError } = await supabase
        .from('audit_logs')
        .select('table_name, count')
        .gte('created_at', startDate.toISOString())
        .group('table_name');
      
      if (tableError) {
        logger.error('Cədvəl statistikası əldə etmə xətası:', tableError);
        return null;
      }
      
      // Günlük əməliyyat sayı
      const { data: dailyStats, error: dailyError } = await supabase
        .from('audit_logs')
        .select('created_at')
        .gte('created_at', startDate.toISOString());
      
      if (dailyError) {
        logger.error('Günlük statistika əldə etmə xətası:', dailyError);
        return null;
      }
      
      // Günlük əməliyyat sayını hesabla
      const dailyCounts: Record<string, number> = {};
      if (dailyStats) {
        dailyStats.forEach(log => {
          const date = new Date(log.created_at).toISOString().split('T')[0];
          dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        });
      }
      
      return {
        actionStats,
        userStats,
        tableStats,
        dailyCounts: Object.entries(dailyCounts).map(([date, count]) => ({ date, count }))
      };
    } catch (error) {
      logger.error('Audit statistikası əldə etmə xətası:', error);
      return null;
    }
  }
};

export default auditLogService;
