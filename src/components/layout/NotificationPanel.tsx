import { useState, useEffect } from 'react';
import { Bell, X, Check, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import notificationService from '@/services/notificationService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { format, formatDistanceToNow } from 'date-fns';
import { az } from 'date-fns/locale';
import { Notification } from '@/types/supabase';

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    // Load initial notifications
    fetchNotifications();
    
    // Set up an interval to check for new notifications
    const intervalId = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      // Fetch notifications for the current user
      const fetchedNotifications = await notificationService.getUserNotifications(user.id);
      setNotifications(fetchedNotifications || []);
      
      // Count unread notifications
      setUnreadCount((fetchedNotifications || []).filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const getFilteredNotifications = () => {
    if (activeTab === 'all') {
      return notifications;
    }
    return notifications.filter(notification => notification.type === activeTab);
  };
  
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };
  
  const formatNotificationDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // If the notification is from today, show the time
      if (date.toDateString() === new Date().toDateString()) {
        return format(date, 'HH:mm', { locale: az });
      }
      
      // Otherwise, show relative time (e.g., "2 days ago")
      return formatDistanceToNow(date, { locale: az, addSuffix: true });
    } catch {
      return dateString;
    }
  };
  
  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read if not already
      if (!notification.is_read) {
        await notificationService.markAsRead(notification.id);
      }
      
      // Navigate to the linked page if available
      if (notification.link) {
        navigate(notification.link);
      }
      
      // Close the panel
      setIsOpen(false);
      
      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };
  
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 p-0 rounded-md border bg-card shadow-md">
          <div className="flex items-center justify-between border-b p-3">
            <h3 className="font-semibold text-foreground">Bildirişlər</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="flex items-center justify-between px-3 py-2">
              <TabsList>
                <TabsTrigger value="all">Hamısı</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="success">Uğurlu</TabsTrigger>
                <TabsTrigger value="error">Xəta</TabsTrigger>
              </TabsList>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground h-8"
                onClick={handleMarkAllAsRead}
              >
                <Check className="h-3 w-3 mr-1" />
                Oxunmuş kimi işarələ
              </Button>
            </div>
            
            <TabsContent value={activeTab} className="m-0">
              <ScrollArea className="h-[300px] p-0">
                {getFilteredNotifications().length > 0 ? (
                  <div className="space-y-1">
                    {getFilteredNotifications().map((notification) => (
                      <button
                        key={notification.id}
                        className={`w-full flex items-start p-3 text-left hover:bg-muted ${
                          !notification.is_read ? 'bg-muted/50' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="w-full">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-muted-foreground">
                              {formatNotificationDate(notification.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    <p>Bildiriş yoxdur</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
          
          <div className="border-t p-2">
            <Button variant="ghost" size="sm" className="w-full justify-center text-muted-foreground">
              Bütün bildirişlərə bax
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
