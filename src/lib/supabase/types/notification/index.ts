
import { Json } from '../shared';

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
  data?: Json;
}

export interface CreateNotificationDto {
  user_id: string;
  title: string;
  body: string;
  notification_type: string;
  action_url?: string;
  data?: Json;
}
