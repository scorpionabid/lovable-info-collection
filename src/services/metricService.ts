/**
 * Metrik xidməti - API sorğuları və sistem performansının izlənməsi üçün
 */
import { supabase } from '@/lib/supabase';
import { Json } from '@/types/supabase';
import { logger } from '@/utils/logger';

export interface ApiMetric {
  id: string;
  endpoint: string;
  method: string;
  duration_ms: number;
  status_code: number | null;
  request_params: Json | null;
  request_size: number | null;
  response_size: number | null;
  response_summary: Json | null;
  user_id: string | null;
  timestamp: string;
}

export interface MetricFilter {
  endpoint?: string;
  method?: string;
  minDuration?: number;
  maxDuration?: number;
  statusCode?: number;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface MetricResponse {
  data: ApiMetric[] | null;
  count: number;
  error: any | null;
}

/**
 * Metrik xidməti
 */
const metricService = {
  /**
   * API metrikalarını əldə et
   */
  getApiMetrics: async (filters?: MetricFilter): Promise<MetricResponse> => {
    try {
      let query = supabase
        .from('api_metrics')
        .select(`
          *,
          users:user_id(id, first_name, last_name, email)
        `, { count: 'exact' });
      
      // Filtrləri tətbiq et
      if (filters) {
        if (filters.endpoint) {
          query = query.ilike('endpoint', `%${filters.endpoint}%`);
        }
        if (filters.method) {
          query = query.eq('method', filters.method);
        }
        if (filters.minDuration !== undefined) {
          query = query.gte('duration_ms', filters.minDuration);
        }
        if (filters.maxDuration !== undefined) {
          query = query.lte('duration_ms', filters.maxDuration);
        }
        if (filters.statusCode !== undefined) {
          query = query.eq('status_code', filters.statusCode);
        }
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }
        if (filters.startDate) {
          query = query.gte('timestamp', filters.startDate);
        }
        if (filters.endDate) {
          query = query.lte('timestamp', filters.endDate);
        }
      }
      
      // Sıralama
      query = query.order('timestamp', { ascending: false });
      
      // Səhifələmə
      if (filters?.page && filters?.pageSize) {
        const from = (filters.page - 1) * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        logger.error('API metrikalarını əldə etmə xətası:', error);
        return { data: null, count: 0, error };
      }
      
      return { data: data as ApiMetric[], count: count || 0, error: null };
    } catch (error) {
      logger.error('API metrikalarını əldə etmə xətası:', error);
      return { data: null, count: 0, error };
    }
  },
  
  /**
   * API metrikası əlavə et
   */
  addApiMetric: async (metric: Omit<ApiMetric, 'id' | 'timestamp'>): Promise<ApiMetric | null> => {
    try {
      const { data, error } = await supabase
        .from('api_metrics')
        .insert({
          ...metric,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        logger.error('API metrikası əlavə etmə xətası:', error);
        return null;
      }
      
      return data as ApiMetric;
    } catch (error) {
      logger.error('API metrikası əlavə etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * API sorğusunu izlə
   */
  trackApiRequest: async (
    endpoint: string,
    method: string,
    userId: string | null,
    requestParams?: any,
    requestSize?: number
  ): Promise<string> => {
    try {
      // Yeni metrika yaratmaq üçün unikal ID
      const metricId = crypto.randomUUID();
      
      // Başlanğıc vaxtını qeyd et
      const startTime = performance.now();
      
      // Metrika obyektini saxla
      const metricData = {
        id: metricId,
        endpoint,
        method,
        user_id: userId,
        request_params: requestParams,
        request_size: requestSize,
        duration_ms: 0, // Tamamlandıqdan sonra yenilənəcək
        status_code: null, // Tamamlandıqdan sonra yenilənəcək
        response_size: null, // Tamamlandıqdan sonra yenilənəcək
        response_summary: null // Tamamlandıqdan sonra yenilənəcək
      };
      
      // Metrika ID-ni qaytar ki, sorğu tamamlandıqdan sonra yeniləmək mümkün olsun
      return metricId;
    } catch (error) {
      logger.error('API sorğusu izləmə xətası:', error);
      return '';
    }
  },
  
  /**
   * API sorğusunu tamamla
   */
  completeApiRequest: async (
    metricId: string,
    statusCode: number,
    responseData?: any,
    responseSize?: number
  ): Promise<boolean> => {
    try {
      if (!metricId) return false;
      
      // Əvvəlcə metrika məlumatlarını əldə et
      const { data: metricData, error: fetchError } = await supabase
        .from('api_metrics')
        .select('*')
        .eq('id', metricId)
        .single();
      
      if (fetchError) {
        logger.error('Metrika əldə etmə xətası:', fetchError);
        return false;
      }
      
      // Sorğu müddətini hesabla
      const endTime = performance.now();
      const duration = Math.round(endTime - performance.timeOrigin);
      
      // Metrika məlumatlarını yenilə
      const { error } = await supabase
        .from('api_metrics')
        .update({
          duration_ms: duration,
          status_code: statusCode,
          response_size: responseSize,
          response_summary: responseData
        })
        .eq('id', metricId);
      
      if (error) {
        logger.error('Metrika yeniləmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('API sorğusu tamamlama xətası:', error);
      return false;
    }
  },
  
  /**
   * API metrika statistikasını əldə et
   */
  getApiMetricStats: async (days: number = 30): Promise<any> => {
    try {
      // Son N gün üçün tarix hesabla
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Endpoint-lərə görə statistika
      const { data: endpointStats, error: endpointError } = await supabase
        .from('api_metrics')
        .select('endpoint, count, avg(duration_ms)')
        .gte('timestamp', startDate.toISOString())
        .group('endpoint');
      
      if (endpointError) {
        logger.error('Endpoint statistikası əldə etmə xətası:', endpointError);
        return null;
      }
      
      // Status kodlarına görə statistika
      const { data: statusStats, error: statusError } = await supabase
        .from('api_metrics')
        .select('status_code, count')
        .gte('timestamp', startDate.toISOString())
        .group('status_code');
      
      if (statusError) {
        logger.error('Status statistikası əldə etmə xətası:', statusError);
        return null;
      }
      
      // Metodlara görə statistika
      const { data: methodStats, error: methodError } = await supabase
        .from('api_metrics')
        .select('method, count')
        .gte('timestamp', startDate.toISOString())
        .group('method');
      
      if (methodError) {
        logger.error('Metod statistikası əldə etmə xətası:', methodError);
        return null;
      }
      
      // Günlük sorğu sayı
      const { data: dailyStats, error: dailyError } = await supabase
        .from('api_metrics')
        .select('timestamp')
        .gte('timestamp', startDate.toISOString());
      
      if (dailyError) {
        logger.error('Günlük statistika əldə etmə xətası:', dailyError);
        return null;
      }
      
      // Günlük sorğu sayını hesabla
      const dailyCounts: Record<string, number> = {};
      if (dailyStats) {
        dailyStats.forEach(metric => {
          const date = new Date(metric.timestamp).toISOString().split('T')[0];
          dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        });
      }
      
      // Ən yavaş sorğular
      const { data: slowestRequests, error: slowestError } = await supabase
        .from('api_metrics')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('duration_ms', { ascending: false })
        .limit(10);
      
      if (slowestError) {
        logger.error('Ən yavaş sorğular əldə etmə xətası:', slowestError);
        return null;
      }
      
      return {
        endpointStats,
        statusStats,
        methodStats,
        dailyCounts: Object.entries(dailyCounts).map(([date, count]) => ({ date, count })),
        slowestRequests
      };
    } catch (error) {
      logger.error('API metrika statistikası əldə etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Ən çox istifadə edilən endpoint-ləri əldə et
   */
  getMostUsedEndpoints: async (days: number = 30, limit: number = 10): Promise<any[]> => {
    try {
      // Son N gün üçün tarix hesabla
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('api_metrics')
        .select('endpoint, count')
        .gte('timestamp', startDate.toISOString())
        .group('endpoint')
        .order('count', { ascending: false })
        .limit(limit);
      
      if (error) {
        logger.error('Ən çox istifadə edilən endpoint-ləri əldə etmə xətası:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      logger.error('Ən çox istifadə edilən endpoint-ləri əldə etmə xətası:', error);
      return [];
    }
  },
  
  /**
   * Ən yavaş endpoint-ləri əldə et
   */
  getSlowestEndpoints: async (days: number = 30, limit: number = 10): Promise<any[]> => {
    try {
      // Son N gün üçün tarix hesabla
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('api_metrics')
        .select('endpoint, avg(duration_ms)')
        .gte('timestamp', startDate.toISOString())
        .group('endpoint')
        .order('avg', { ascending: false })
        .limit(limit);
      
      if (error) {
        logger.error('Ən yavaş endpoint-ləri əldə etmə xətası:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      logger.error('Ən yavaş endpoint-ləri əldə etmə xətası:', error);
      return [];
    }
  },
  
  /**
   * Xəta sayını əldə et
   */
  getErrorCount: async (days: number = 30): Promise<number> => {
    try {
      // Son N gün üçün tarix hesabla
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { count, error } = await supabase
        .from('api_metrics')
        .select('id', { count: 'exact', head: true })
        .gte('timestamp', startDate.toISOString())
        .gte('status_code', 400);
      
      if (error) {
        logger.error('Xəta sayını əldə etmə xətası:', error);
        return 0;
      }
      
      return count || 0;
    } catch (error) {
      logger.error('Xəta sayını əldə etmə xətası:', error);
      return 0;
    }
  }
};

export default metricService;
