
import { useState, useEffect } from 'react';
import { X, Bell, Check, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import notificationService from '@/services/notificationService';
import { Notification } from '@/services/supabase/supabaseClient';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data: authUser } = await supabase.auth.getUser();
        const userId = authUser?.user?.id;
        
        if (!userId) {
          console.error("No authenticated user found");
          return;
        }
        
        const result = await notificationService.getNotifications(userId);
        if (result.data) {
          setNotifications(result.data);
          setUnreadCount(result.data.filter(n => !n.is_read).length);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: 'Xəta',
          description: 'Bildirişlər yüklənərkən xəta baş verdi',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Set up real-time subscription
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel(`public:notifications:user_id=eq.${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            toast({
              title: newNotification.title,
              description: newNotification.body,
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const unsubscribe = setupSubscription();
    
    // Cleanup subscription
    return () => {
      if (unsubscribe) {
        unsubscribe.then(fn => fn && fn());
      }
    };
  }, [toast]);

  const handleMarkAllAsRead = async () => {
    try {
      const { data: authUser } = await supabase.auth.getUser();
      const userId = authUser?.user?.id;
      
      if (!userId) {
        console.error("No authenticated user found");
        return;
      }
      
      await notificationService.markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast({
        title: 'Uğurlu əməliyyat',
        description: 'Bütün bildirişlər oxunmuş kimi işarələndi',
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: 'Xəta',
        description: 'Bildirişlər yenilənərkən xəta baş verdi',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markNotificationAsRead(id);
      setNotifications(
        notifications.map(n => 
          n.id === id ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Xəta',
        description: 'Bildiriş yenilənərkən xəta baş verdi',
        variant: 'destructive',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-80 bg-white border-l border-infoline-light-gray shadow-lg animate-in slide-in-from-right">
      <div className="flex items-center justify-between border-b border-infoline-light-gray p-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-infoline-dark-blue" />
          <h2 className="font-semibold text-infoline-dark-blue">Bildirişlər</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={handleMarkAllAsRead}
            >
              <Check className="h-4 w-4 mr-1" />
              Hamısını oxunmuş et
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-4rem)]">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-infoline-blue"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-infoline-dark-gray">
            <Bell className="h-8 w-8 mb-2 opacity-30" />
            <p>Bildirişiniz yoxdur</p>
          </div>
        ) : (
          <div className="divide-y divide-infoline-light-gray">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-infoline-light-gray/20 ${
                  !notification.is_read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.notification_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-infoline-dark-blue">
                        {notification.title}
                      </h4>
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-infoline-dark-gray mt-1">
                      {notification.body}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-infoline-gray">
                        {format(new Date(notification.created_at), 'dd.MM.yyyy HH:mm')}
                      </span>
                      {notification.action_url && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-6 p-0 text-xs text-infoline-blue"
                          asChild
                        >
                          <a href={notification.action_url}>Bax</a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
