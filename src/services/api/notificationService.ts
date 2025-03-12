
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '../supabase/supabaseClient';

export const getNotifications = async (userId: string, limit = 10, offset = 0) => {
  try {
    const { data, count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    return { data: data as Notification[], count, error: null };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { data: null, count: 0, error };
  }
};

export const getUnreadNotificationsCount = async (userId: string) => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) throw error;
    
    return { count: count || 0, error: null };
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    return { count: 0, error };
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('mark_notification_read', { p_notification_id: notificationId });
    
    if (error) throw error;
    
    return { success: data, error: null };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error };
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const { data, error } = await supabase
      .rpc('mark_all_notifications_read');
    
    if (error) throw error;
    
    return { count: data, error: null };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { count: 0, error };
  }
};

export default {
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead
};
