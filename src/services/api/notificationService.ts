
import api from './index';

interface NotificationFilter {
  read?: boolean;
  type?: string;
  page?: number;
  limit?: number;
}

const notificationService = {
  getNotifications: async (filters: NotificationFilter = {}) => {
    const response = await api.get('/notifications', { params: filters });
    return response.data;
  },
  
  markAsRead: async (id: string) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }
};

export default notificationService;
