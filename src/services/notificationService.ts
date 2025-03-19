
import { supabase } from '@/lib/supabase';
import { Notification } from '@/types/supabase';

/**
 * Notification service for handling user notifications
 */
const notificationService = {
  /**
   * Get all notifications for a user
   * @param userId User ID
   * @param limit Optional limit for number of notifications
   */
  getUserNotifications: async (userId: string, limit?: number): Promise<Notification[]> => {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      
      return data as Notification[];
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      return [];
    }
  },
  
  /**
   * Get notifications with a specific type
   * @param userId User ID
   * @param type Notification type
   */
  getNotifications: async (userId: string, type?: string): Promise<Notification[]> => {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching notifications by type:', error);
        return [];
      }
      
      return data as Notification[];
    } catch (error) {
      console.error('Error in getNotifications:', error);
      return [];
    }
  },
  
  /**
   * Get count of unread notifications
   * @param userId User ID
   */
  getUnreadCount: async (userId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);
        
      if (error) {
        console.error('Error fetching unread count:', error);
        return 0;
      }
      
      return count || 0;
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      return 0;
    }
  },
  
  /**
   * Mark a notification as read
   * @param notificationId Notification ID
   */
  markNotificationAsRead: async (notificationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);
        
      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in markNotificationAsRead:', error);
      return false;
    }
  },
  
  /**
   * Mark all notifications as read for a user
   * @param userId User ID
   */
  markAllNotificationsAsRead: async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('is_read', false);
        
      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in markAllNotificationsAsRead:', error);
      return false;
    }
  },
  
  /**
   * Create a notification
   * @param notification Notification data
   */
  createNotification: async (notification: {
    userId: string;
    title: string;
    message: string;
    type: string;
    link?: string;
  }): Promise<Notification | null> => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          link: notification.link,
          is_read: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating notification:', error);
        return null;
      }
      
      return data as Notification;
    } catch (error) {
      console.error('Error in createNotification:', error);
      return null;
    }
  },
  
  /**
   * Delete a notification
   * @param notificationId Notification ID
   */
  deleteNotification: async (notificationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
        
      if (error) {
        console.error('Error deleting notification:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteNotification:', error);
      return false;
    }
  },
  
  /**
   * Delete all notifications for a user
   * @param userId User ID
   */
  deleteAllNotifications: async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error deleting all notifications:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteAllNotifications:', error);
      return false;
    }
  },
  
  /**
   * Send data approval notification
   */
  sendDataApprovedNotification: async (
    dataId: string, 
    categoryName: string, 
    submitterId: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: submitterId,
          title: 'Məlumat təsdiqləndi',
          message: `${categoryName} kateqoriyası üzrə təqdim etdiyiniz məlumatlar təsdiqləndi.`,
          type: 'success',
          link: `/data/${dataId}`,
          is_read: false,
          created_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error sending data approved notification:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in sendDataApprovedNotification:', error);
      return false;
    }
  },
  
  /**
   * Send data rejection notification
   */
  sendDataRejectedNotification: async (
    dataId: string, 
    categoryName: string, 
    submitterId: string,
    reason: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: submitterId,
          title: 'Məlumat rədd edildi',
          message: `${categoryName} kateqoriyası üzrə təqdim etdiyiniz məlumatlar rədd edildi. Səbəb: ${reason}`,
          type: 'error',
          link: `/data/${dataId}`,
          is_read: false,
          created_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error sending data rejected notification:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in sendDataRejectedNotification:', error);
      return false;
    }
  }
};

export default notificationService;
