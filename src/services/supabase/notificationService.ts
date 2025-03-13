
import { supabase } from './supabaseClient';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  entity_type?: string;
  entity_id?: string;
  action_url?: string;
  created_at: string;
}

export interface NotificationFilter {
  isRead?: boolean;
  type?: string;
  entityType?: string;
  entityId?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
}

export const getUserNotifications = async (userId: string, filter?: NotificationFilter) => {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filter) {
      if (filter.isRead !== undefined) {
        query = query.eq('is_read', filter.isRead);
      }
      if (filter.type) {
        query = query.eq('type', filter.type);
      }
      if (filter.entityType) {
        query = query.eq('entity_type', filter.entityType);
      }
      if (filter.entityId) {
        query = query.eq('entity_id', filter.entityId);
      }
      if (filter.fromDate) {
        query = query.gte('created_at', filter.fromDate);
      }
      if (filter.toDate) {
        query = query.lte('created_at', filter.toDate);
      }
      if (filter.limit) {
        query = query.limit(filter.limit);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    return data as Notification[];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
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

    return count || 0;
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    return 0;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const createNotification = async (notification: Omit<Notification, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single();

    if (error) throw error;

    return data as Notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

export default {
  getUserNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
  deleteNotification
};
