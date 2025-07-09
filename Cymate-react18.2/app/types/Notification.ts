interface NotificationUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
  profile_picture?: string;
}

interface NotificationPost {
  id: string;
  title?: string;
  content: string;
  post_type: 'post' | 'blog' | 'question' | 'event';
}

interface Notification {
  id: string;
  user: NotificationUser;
  sender: NotificationUser;
  notification_type: 'comment' | 'share' | 'react' | 'mention' | 'follow' | 'like';
  message: string;
  is_read: boolean;
  post?: NotificationPost;
  created_at: string;
  post_id?: number;
  liked?: boolean;
  disliked?: boolean;
  thundered?: boolean;
}

interface NotificationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

export type { 
  Notification, 
  NotificationUser, 
  NotificationPost, 
  NotificationResponse 
}
