
import { supabase } from '../client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
  action_url?: string;
  data?: any;
}

export interface CreateNotificationDto {
  user_id: string;
  title: string;
  body: string;
  notification_type: string;
  action_url?: string;
  data?: any;
}

/**
 * Get notifications for the current user
 */
export const getNotifications = async (limit = 10, includeRead = false) => {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (!includeRead) {
      query = query.eq('is_read', false);
    }
    
    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationRead = async (notificationId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('mark_notification_read', { p_notification_id: notificationId });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async () => {
  try {
    const { data, error } = await supabase
      .rpc('mark_all_notifications_read');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Send a notification to a user
 */
export const sendNotification = async (notification: CreateNotificationDto) => {
  try {
    const { data, error } = await supabase
      .rpc('send_notification', {
        p_user_id: notification.user_id,
        p_title: notification.title,
        p_body: notification.body,
        p_notification_type: notification.notification_type,
        p_action_url: notification.action_url || null,
        p_data: notification.data || null
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};
