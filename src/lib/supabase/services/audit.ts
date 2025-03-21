
import { supabase } from '@/lib/supabase/client';
import { TableName } from '@/services/supabase/constants';
import { castType } from '@/utils/typeUtils';

// Define simpler types to avoid deep instantiation
export interface AuditLog {
  id: string;
  action: string;
  table_name: string;
  record_id?: string;
  user_id?: string;
  created_at: string;
  // Added properties that match audit_logs table
  component?: string;
  duration_ms?: number;
  ip_address?: string;
  metadata?: any;
  new_data?: any;
  old_data?: any;
  success?: boolean;
  user_agent?: string;
  // For backwards compatibility with old API
  timestamp?: string;
  event_type?: string;
  resource_type?: string;
  resource_id?: string;
  user?: string;
  details?: any;
  endpoint?: string;
}

/**
 * Audit log service to interface with the audit_logs table
 */
export const auditLogService = {
  // Get all audit logs with filtering
  async getAuditLogs(filters: any = {}): Promise<AuditLog[]> {
    try {
      let query = supabase
        .from(TableName.AUDIT_LOGS)
        .select('*');
      
      // Apply filters
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      
      if (filters.tableName) {
        query = query.eq('table_name', filters.tableName);
      }
      
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      if (filters.fromDate) {
        query = query.gte('created_at', filters.fromDate);
      }
      
      if (filters.toDate) {
        query = query.lte('created_at', filters.toDate);
      }
      
      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }
      
      // Ordering
      if (filters.orderBy) {
        query = query.order(filters.orderBy, { ascending: filters.ascending !== false });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map to AuditLog interface with casting to avoid deep type instantiation
      return castType<AuditLog[]>(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  },
  
  // Get a single audit log
  async getAuditLog(id: string): Promise<AuditLog | null> {
    try {
      const { data, error } = await supabase
        .from(TableName.AUDIT_LOGS)
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return castType<AuditLog>(data);
    } catch (error) {
      console.error(`Error fetching audit log with ID ${id}:`, error);
      return null;
    }
  },
  
  // Create a new audit log
  async createAuditLog(logData: Omit<AuditLog, 'id' | 'created_at'>[]): Promise<AuditLog | null> {
    try {
      // Map to database schema
      const dbData = logData.map(log => ({
        action: log.action,
        table_name: log.table_name,
        record_id: log.record_id || null,
        user_id: log.user_id || null,
        component: log.component || null,
        metadata: log.metadata || null,
        new_data: log.new_data || null,
        old_data: log.old_data || null,
        success: log.success || true,
        ip_address: log.ip_address || null,
        user_agent: log.user_agent || null,
        duration_ms: log.duration_ms || 0
      }));
      
      const { data, error } = await supabase
        .from(TableName.AUDIT_LOGS)
        .insert(dbData)
        .select()
        .single();
        
      if (error) throw error;
      
      return castType<AuditLog>(data);
    } catch (error) {
      console.error('Error creating audit log:', error);
      return null;
    }
  },
  
  // Get logs by table name
  async getLogsByTable(tableName: string, limit = 50): Promise<AuditLog[]> {
    try {
      const { data, error } = await supabase
        .from(TableName.AUDIT_LOGS)
        .select('*')
        .eq('table_name', tableName)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return castType<AuditLog[]>(data || []);
    } catch (error) {
      console.error(`Error fetching logs for table ${tableName}:`, error);
      return [];
    }
  }
};

export default auditLogService;
