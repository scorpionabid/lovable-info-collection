
import { supabase, Notification } from './supabaseClient';

const notificationService = {
  getNotifications: async (filters: { read?: boolean; type?: string; page?: number; limit?: number } = {}) => {
    // Get current user ID from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error('Not authenticated');
    
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (filters.read !== undefined) {
      query = query.eq('is_read', filters.read);
    }
    
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    
    // Handle pagination
    const limit = filters.limit || 10;
    const page = filters.page || 1;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query.range(from, to);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    if (countError) throw countError;
    
    return {
      notifications: data as Notification[],
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit)
      }
    };
  },
  
  markAsRead: async (id: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Notification;
  },
  
  markAllAsRead: async () => {
    // Get current user ID from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    
    if (error) throw error;
    return true;
  },
  
  // Setup realtime notifications
  subscribeToNotifications: (onNotification: (notification: Notification) => void) => {
    // Get current user ID from auth
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) return;
      
      const subscription = supabase
        .channel('public:notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            onNotification(payload.new as Notification);
          }
        )
        .subscribe();
      
      // Return cleanup function
      return () => {
        supabase.removeChannel(subscription);
      };
    });
  }
};

export default notificationService;
