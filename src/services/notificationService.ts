/**
 * Bildiriş xidməti - bildirişlərin idarə edilməsi üçün
 */
import { supabase, withRetry } from '@/lib/supabase';
import { Notification } from '@/types/supabase';
import { logger } from '@/utils/logger';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'data_submitted' | 'data_approved' | 'data_rejected';

export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
}

/**
 * Bildiriş xidməti
 */
const notificationService = {
  /**
   * İstifadəçi bildirişlərini əldə et
   */
  getUserNotifications: async (userId: string, limit: number = 10): Promise<Notification[]> => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        logger.error('Bildirişləri əldə etmə xətası:', error);
        return [];
      }
      
      return data as Notification[];
    } catch (error) {
      logger.error('Bildirişləri əldə etmə xətası:', error);
      return [];
    }
  },
  
  /**
   * Oxunmamış bildirişləri əldə et
   */
  getUnreadNotifications: async (userId: string): Promise<Notification[]> => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Oxunmamış bildirişləri əldə etmə xətası:', error);
        return [];
      }
      
      return data as Notification[];
    } catch (error) {
      logger.error('Oxunmamış bildirişləri əldə etmə xətası:', error);
      return [];
    }
  },
  
  /**
   * Oxunmamış bildiriş sayını əldə et
   */
  getUnreadCount: async (userId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);
      
      if (error) {
        logger.error('Oxunmamış bildiriş sayını əldə etmə xətası:', error);
        return 0;
      }
      
      return count || 0;
    } catch (error) {
      logger.error('Oxunmamış bildiriş sayını əldə etmə xətası:', error);
      return 0;
    }
  },
  
  /**
   * Bildirişi oxunmuş kimi işarələ
   */
  markAsRead: async (notificationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);
      
      if (error) {
        logger.error('Bildirişi oxunmuş kimi işarələmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Bildirişi oxunmuş kimi işarələmə xətası:', error);
      return false;
    }
  },
  
  /**
   * Bütün bildirişləri oxunmuş kimi işarələ
   */
  markAllAsRead: async (userId: string): Promise<boolean> => {
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
        logger.error('Bütün bildirişləri oxunmuş kimi işarələmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Bütün bildirişləri oxunmuş kimi işarələmə xətası:', error);
      return false;
    }
  },
  
  /**
   * Yeni bildiriş yarat
   */
  createNotification: async (notification: CreateNotificationDto): Promise<Notification | null> => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          link: notification.link,
          is_read: false
        })
        .select()
        .single();
      
      if (error) {
        logger.error('Bildiriş yaratma xətası:', error);
        return null;
      }
      
      return data as Notification;
    } catch (error) {
      logger.error('Bildiriş yaratma xətası:', error);
      return null;
    }
  },
  
  /**
   * Bildirişi sil
   */
  deleteNotification: async (notificationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) {
        logger.error('Bildiriş silmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Bildiriş silmə xətası:', error);
      return false;
    }
  },
  
  /**
   * Bütün bildirişləri sil
   */
  deleteAllNotifications: async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        logger.error('Bütün bildirişləri silmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Bütün bildirişləri silmə xətası:', error);
      return false;
    }
  },
  
  /**
   * Çoxlu istifadəçilərə bildiriş göndər
   */
  sendBulkNotifications: async (userIds: string[], notification: Omit<CreateNotificationDto, 'userId'>): Promise<boolean> => {
    try {
      // Hər istifadəçi üçün bildiriş yarat
      const notifications = userIds.map(userId => ({
        user_id: userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        link: notification.link,
        is_read: false
      }));
      
      // Toplu əlavə et
      const { error } = await supabase
        .from('notifications')
        .insert(notifications);
      
      if (error) {
        logger.error('Toplu bildiriş göndərmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Toplu bildiriş göndərmə xətası:', error);
      return false;
    }
  },
  
  /**
   * Məlumat təqdim edildiyi zaman bildiriş göndər
   */
  sendDataSubmittedNotification: async (
    dataId: string,
    categoryName: string,
    schoolName: string,
    approverIds: string[]
  ): Promise<boolean> => {
    try {
      // Təsdiqləyicilərə bildiriş göndər
      const notifications = approverIds.map(approverId => ({
        user_id: approverId,
        title: 'Yeni məlumat təqdim edildi',
        message: `${schoolName} məktəbi "${categoryName}" kateqoriyası üçün yeni məlumat təqdim etdi.`,
        type: 'data_submitted' as NotificationType,
        link: `/data/${dataId}`,
        is_read: false
      }));
      
      // Toplu əlavə et
      const { error } = await supabase
        .from('notifications')
        .insert(notifications);
      
      if (error) {
        logger.error('Məlumat təqdim bildirişi göndərmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Məlumat təqdim bildirişi göndərmə xətası:', error);
      return false;
    }
  },
  
  /**
   * Məlumat təsdiq edildiyi zaman bildiriş göndər
   */
  sendDataApprovedNotification: async (
    dataId: string,
    categoryName: string,
    submitterId: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: submitterId,
          title: 'Məlumat təsdiq edildi',
          message: `"${categoryName}" kateqoriyası üçün təqdim etdiyiniz məlumat təsdiq edildi.`,
          type: 'data_approved',
          link: `/data/${dataId}`,
          is_read: false
        })
        .select()
        .single();
      
      if (error) {
        logger.error('Məlumat təsdiq bildirişi göndərmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Məlumat təsdiq bildirişi göndərmə xətası:', error);
      return false;
    }
  },
  
  /**
   * Məlumat rədd edildiyi zaman bildiriş göndər
   */
  sendDataRejectedNotification: async (
    dataId: string,
    categoryName: string,
    submitterId: string,
    reason: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: submitterId,
          title: 'Məlumat rədd edildi',
          message: `"${categoryName}" kateqoriyası üçün təqdim etdiyiniz məlumat rədd edildi. Səbəb: ${reason}`,
          type: 'data_rejected',
          link: `/data/${dataId}`,
          is_read: false
        })
        .select()
        .single();
      
      if (error) {
        logger.error('Məlumat rədd bildirişi göndərmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Məlumat rədd bildirişi göndərmə xətası:', error);
      return false;
    }
  }
};

export default notificationService;
