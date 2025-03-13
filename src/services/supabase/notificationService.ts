
import { supabase } from './supabaseClient';
import { Json } from '@/integrations/supabase/types';

export interface DbNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  notification_type: string;
  action_url: string;
  data: Json;
  is_read: boolean;
  read_at: string;
  created_at: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  actionUrl?: string;
  data?: any;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface CreateNotificationDto {
  user_id: string;
  title: string;
  body: string;
  notification_type: string;
  action_url?: string;
  data?: Json;
}

// Transform database notification to client notification
const mapDbNotificationToClient = (dbNotification: DbNotification): Notification => {
  return {
    id: dbNotification.id,
    userId: dbNotification.user_id,
    title: dbNotification.title,
    message: dbNotification.body,
    type: dbNotification.notification_type,
    actionUrl: dbNotification.action_url,
    data: dbNotification.data,
    isRead: dbNotification.is_read,
    readAt: dbNotification.read_at,
    createdAt: dbNotification.created_at
  };
};

// Get unread notifications for current user
export const getUnreadNotifications = async (): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('is_read', false)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return (data || []).map(mapDbNotificationToClient);
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
};

// Get all notifications for current user
export const getAllNotifications = async (limit = 50): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    return (data || []).map(mapDbNotificationToClient);
  } catch (error) {
    console.error('Error fetching all notifications:', error);
    throw error;
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('mark_notification_read', { p_notification_id: notificationId });
      
    if (error) throw error;
    
    return data as boolean;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .rpc('mark_all_notifications_read');
      
    if (error) throw error;
    
    return data as number;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Create a new notification
export const createNotifications = async (notifications: CreateNotificationDto[]): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();
      
    if (error) throw error;
    
    return (data || []).map(mapDbNotificationToClient);
  } catch (error) {
    console.error('Error creating notifications:', error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (notificationId: string): Promise<boolean> => {
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

// Get notification count
export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);
      
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    throw error;
  }
};
