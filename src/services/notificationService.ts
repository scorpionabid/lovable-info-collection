
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  notification_type?: string;
  body?: string;
  action_url?: string;
  link?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  data?: any;
}

/**
 * Get notifications for a specific user
 */
const getUserNotifications = async (userId: string, limit = 50): Promise<{ data: Notification[], error: any }> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data: data || [], error };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { data: [], error };
  }
};

/**
 * Mark a notification as read
 */
const markAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Create a new notification
 */
const createNotification = async (notification: {
  user_id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
}): Promise<{ data: Notification | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { data: null, error };
  }
};

/**
 * Delete a notification
 */
const deleteNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};

/**
 * Get unread notification count
 */
const getUnreadCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    return 0;
  }
};

const notificationService = {
  getUserNotifications,
  markAsRead,
  createNotification,
  deleteNotification,
  getUnreadCount
};

export default notificationService;
