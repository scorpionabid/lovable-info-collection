
import { useState } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
};

interface NotificationPanelProps {
  onClose?: () => void;
}

// Sample notifications data
const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Yeni məlumat tələbi',
    message: 'Şimal regionu üçün yeni məlumat tələbi yaradıldı',
    time: '15 dəq əvvəl',
    read: false,
    type: 'info',
  },
  {
    id: '2',
    title: 'Məlumat təsdiqləndi',
    message: 'Müəllim məlumatları Bakı region admini tərəfindən təsdiqləndi',
    time: '2 saat əvvəl',
    read: false,
    type: 'success',
  },
  {
    id: '3',
    title: 'Diqqət!',
    message: 'Məktəb #42 hesabatında məlumat çatışmazlığı var',
    time: '1 gün əvvəl',
    read: true,
    type: 'warning',
  },
  {
    id: '4',
    title: 'Sistem yeniləməsi',
    message: 'Sistem bu gün 22:00-da texniki işlər üçün müvəqqəti olaraq əlçatan olmayacaq',
    time: '2 gün əvvəl',
    read: true,
    type: 'info',
  },
];

export const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'info': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-h-[500px] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-infoline-light-gray">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-infoline-dark-gray" />
          <span className="font-medium text-infoline-dark-blue">Bildirişlər</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-infoline-blue text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={markAllAsRead}
            className="text-xs text-infoline-blue hover:text-infoline-dark-blue"
          >
            Hamısını oxunmuş et
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-xs text-infoline-dark-gray hover:text-infoline-dark-blue"
            >
              Bağla
            </button>
          )}
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <Bell size={40} className="text-infoline-light-gray mb-2" />
          <p className="text-infoline-dark-gray">Bildiriş yoxdur</p>
        </div>
      ) : (
        <>
          <div className="overflow-y-auto divide-y divide-infoline-light-gray">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "flex gap-3 p-4 transition-colors hover:bg-infoline-light-gray",
                  !notification.read && "bg-blue-50"
                )}
              >
                <div className={cn(
                  "w-2 h-2 mt-1.5 rounded-full flex-shrink-0",
                  getTypeColor(notification.type)
                )} />
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm text-infoline-dark-blue">{notification.title}</p>
                    <span className="text-xs text-infoline-dark-gray whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-infoline-dark-gray mt-1 break-words">
                    {notification.message}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {!notification.read && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="p-1.5 text-infoline-blue hover:bg-white rounded-full"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1.5 text-infoline-dark-gray hover:text-red-500 hover:bg-white rounded-full"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-infoline-light-gray p-3">
            <button className="w-full py-2 text-center text-sm text-infoline-blue hover:bg-infoline-light-gray rounded-md">
              Bütün bildirişlərə bax
            </button>
          </div>
        </>
      )}
    </div>
  );
};
