/**
 * Audit Log Service - Manages audit logs for the application
 */
import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

export interface AuditLog {
  id: string;
  user_id: string;
  timestamp: string;
  event_type: string;
  resource_type: string;
  resource_id: string;
  details: any;
  ip_address: string;
  user_agent: string;
  endpoint: string;
  method: string;
  status_code: number;
  error_message: string;
  created_at: string;
}

export interface AuditLogFilter {
  search?: string;
  userId?: string;
  eventType?: string;
  resourceType?: string;
  resourceId?: string;
  dateFrom?: string;
  dateTo?: string;
  endpoint?: string;
  method?: string;
  statusCode?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface AuditLogResponse {
  data: AuditLog[] | null;
  count: number;
  error: any | null;
}

const auditLogService = {
  /**
   * Get audit logs with filters and pagination
   */
  getAuditLogs: async (filters?: AuditLogFilter): Promise<AuditLogResponse> => {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.search) {
          query = query.or(`event_type.ilike.%${filters.search}%,resource_type.ilike.%${filters.search}%,resource_id.ilike.%${filters.search}%`);
        }
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }
        if (filters.eventType) {
          query = query.eq('event_type', filters.eventType);
        }
        if (filters.resourceType) {
          query = query.eq('resource_type', filters.resourceType);
        }
        if (filters.resourceId) {
          query = query.eq('resource_id', filters.resourceId);
        }
        if (filters.dateFrom) {
          query = query.gte('created_at', filters.dateFrom);
        }
        if (filters.dateTo) {
          query = query.lte('created_at', filters.dateTo);
        }
        if (filters.endpoint) {
          query = query.eq('endpoint', filters.endpoint);
        }
        if (filters.method) {
          query = query.eq('method', filters.method);
        }
        if (filters.statusCode) {
          query = query.eq('status_code', filters.statusCode);
        }
      }

      // Apply sorting
      if (filters?.sortField) {
        query = query.order(filters.sortField, { ascending: filters.sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      if (filters?.page && filters?.pageSize) {
        const from = (filters.page - 1) * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        logger.error('Audit log əldə etmə xətası:', error);
        return { data: null, count: 0, error };
      }

      return { data: data as AuditLog[], count: count || 0, error: null };
    } catch (error) {
      logger.error('Audit log əldə etmə xətası:', error);
      return { data: null, count: 0, error };
    }
  },

  /**
   * Get audit log by ID
   */
  getAuditLogById: async (id: string): Promise<AuditLog | null> => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Audit log əldə etmə xətası:', error);
        return null;
      }

      return data as AuditLog;
    } catch (error) {
      logger.error('Audit log əldə etmə xətası:', error);
      return null;
    }
  },

  /**
   * Create audit log
   */
  createAuditLog: async (auditLogData: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog | null> => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert([auditLogData])
        .select()
        .single();

      if (error) {
        logger.error('Audit log yaratma xətası:', error);
        return null;
      }

      return data as AuditLog;
    } catch (error) {
      logger.error('Audit log yaratma xətası:', error);
      return null;
    }
  },

  /**
   * Update audit log
   */
  updateAuditLog: async (id: string, auditLogData: Partial<AuditLog>): Promise<AuditLog | null> => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .update(auditLogData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Audit log yeniləmə xətası:', error);
        return null;
      }

      return data as AuditLog;
    } catch (error) {
      logger.error('Audit log yeniləmə xətası:', error);
      return null;
    }
  },

  /**
   * Delete audit log
   */
  deleteAuditLog: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Audit log silmə xətası:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Audit log silmə xətası:', error);
      return false;
    }
  },

  /**
   * Get audit log counts by event type
   */
  getAuditLogCountsByEventType: async (filters?: Omit<AuditLogFilter, 'eventType'>): Promise<{ event_type: string, count: number }[] | null> => {
    try {
      let query = supabase
        .from('audit_logs')
        .select('event_type, count(*)');

      // Apply filters
      if (filters) {
        if (filters.search) {
          query = query.or(`event_type.ilike.%${filters.search}%,resource_type.ilike.%${filters.search}%,resource_id.ilike.%${filters.search}%`);
        }
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }
        if (filters.resourceType) {
          query = query.eq('resource_type', filters.resourceType);
        }
        if (filters.resourceId) {
          query = query.eq('resource_id', filters.resourceId);
        }
        if (filters.dateFrom) {
          query = query.gte('created_at', filters.dateFrom);
        }
        if (filters.dateTo) {
          query = query.lte('created_at', filters.dateTo);
        }
        if (filters.endpoint) {
          query = query.eq('endpoint', filters.endpoint);
        }
        if (filters.method) {
          query = query.eq('method', filters.method);
        }
        if (filters.statusCode) {
          query = query.eq('status_code', filters.statusCode);
        }
      }

      // Group by event type
      // query = query.group('event_type');
      const result = await query;
      // Process the data in memory to group by endpoint
      const groupedByEventType = result.data?.reduce((groups: Record<string, any[]>, item) => {
        const key = item.event_type;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      }, {});

      if (result.error) {
        logger.error('Audit log sayı əldə etmə xətası:', result.error);
        return null;
      }

      // Manually transform the grouped data into the desired format
      const transformedData = Object.entries(groupedByEventType || {}).map(([event_type, items]) => ({
        event_type,
        count: items.length,
      }));

      return transformedData as { event_type: string; count: number }[];
    } catch (error) {
      logger.error('Audit log sayı əldə etmə xətası:', error);
      return null;
    }
  },

  /**
   * Get audit log counts by resource type
   */
  getAuditLogCountsByResourceType: async (filters?: Omit<AuditLogFilter, 'resourceType'>): Promise<{ resource_type: string, count: number }[] | null> => {
    try {
      let query = supabase
        .from('audit_logs')
        .select('resource_type, count(*)');

      // Apply filters
      if (filters) {
        if (filters.search) {
          query = query.or(`event_type.ilike.%${filters.search}%,resource_type.ilike.%${filters.search}%,resource_id.ilike.%${filters.search}%`);
        }
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }
        if (filters.eventType) {
          query = query.eq('event_type', filters.eventType);
        }
        if (filters.resourceId) {
          query = query.eq('resource_id', filters.resourceId);
        }
        if (filters.dateFrom) {
          query = query.gte('created_at', filters.dateFrom);
        }
        if (filters.dateTo) {
          query = query.lte('created_at', filters.dateTo);
        }
        if (filters.endpoint) {
          query = query.eq('endpoint', filters.endpoint);
        }
        if (filters.method) {
          query = query.eq('method', filters.method);
        }
        if (filters.statusCode) {
          query = query.eq('status_code', filters.statusCode);
        }
      }

      // Group by resource type
      // query = query.group('resource_type');
      const result = await query;
      // Process the data in memory to group by endpoint
      const groupedByResourceType = result.data?.reduce((groups: Record<string, any[]>, item) => {
        const key = item.resource_type;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      }, {});

      if (result.error) {
        logger.error('Audit log sayı əldə etmə xətası:', result.error);
        return null;
      }

      const transformedData = Object.entries(groupedByResourceType || {}).map(([resource_type, items]) => ({
        resource_type,
        count: items.length,
      }));

      return transformedData as { resource_type: string; count: number }[];
    } catch (error) {
      logger.error('Audit log sayı əldə etmə xətası:', error);
      return null;
    }
  },

  /**
   * Get audit log counts by endpoint
   */
  getAuditLogCountsByEndpoint: async (filters?: Omit<AuditLogFilter, 'endpoint'>): Promise<{ endpoint: string, count: number }[] | null> => {
    try {
      let query = supabase
        .from('audit_logs')
        .select('endpoint, count(*)');

      // Apply filters
      if (filters) {
        if (filters.search) {
          query = query.or(`event_type.ilike.%${filters.search}%,resource_type.ilike.%${filters.search}%,resource_id.ilike.%${filters.search}%`);
        }
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }
        if (filters.eventType) {
          query = query.eq('event_type', filters.eventType);
        }
        if (filters.resourceType) {
          query = query.eq('resource_type', filters.resourceType);
        }
        if (filters.resourceId) {
          query = query.eq('resource_id', filters.resourceId);
        }
        if (filters.dateFrom) {
          query = query.gte('created_at', filters.dateFrom);
        }
        if (filters.dateTo) {
          query = query.lte('created_at', filters.dateTo);
        }
        if (filters.method) {
          query = query.eq('method', filters.method);
        }
        if (filters.statusCode) {
          query = query.eq('status_code', filters.statusCode);
        }
      }

      // Group by endpoint
      // query = query.group('endpoint');
      const result = await query;
      // Process the data in memory to group by endpoint
      const groupedByEndpoint = result.data?.reduce((groups: Record<string, any[]>, item) => {
        const key = item.endpoint;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      }, {});

      if (result.error) {
        logger.error('Audit log sayı əldə etmə xətası:', result.error);
        return null;
      }

      const transformedData = Object.entries(groupedByEndpoint || {}).map(([endpoint, items]) => ({
        endpoint,
        count: items.length,
      }));

      return transformedData as { endpoint: string; count: number }[];
    } catch (error) {
      logger.error('Audit log sayı əldə etmə xətası:', error);
      return null;
    }
  },

  /**
   * Get recent audit logs
   */
  getRecentAuditLogs: async (limit: number = 5): Promise<AuditLog[] | null> => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Son audit logları əldə etmə xətası:', error);
        return null;
      }

      return data as AuditLog[];
    } catch (error) {
      logger.error('Son audit logları əldə etmə xətası:', error);
      return null;
    }
  },
};

export default auditLogService;
