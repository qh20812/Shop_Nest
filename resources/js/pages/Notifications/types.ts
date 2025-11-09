export interface Notification {
  notification_id: number;
  user_id: number;
  title: string;
  content: string;
  type: number; // Notification type ID from enum
  type_label: string; // Human readable label
  type_description: string; // Detailed description
  is_read: boolean;
  notifiable_type?: string;
  notifiable_id?: number;
  action_url?: string;
  read_at?: string;
  created_at: string;
  updated_at: string;
  notifiable?: Record<string, unknown>; // Polymorphic relationship
}

export interface NotificationCollection {
  data: Notification[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}