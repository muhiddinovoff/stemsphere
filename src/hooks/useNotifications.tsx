
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface Notification {
  id: string;
  user_id: string;
  from_user_id: string;
  type: string;
  post_id?: string;
  read: boolean;
  created_at: string;
  from_user: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  post?: {
    content: string;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // Get notifications for the current user
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('id, user_id, from_user_id, type, post_id, read, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (notificationsError) throw notificationsError;

      if (!notificationsData || notificationsData.length === 0) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      // Get unique user IDs and post IDs
      const userIds = [...new Set(notificationsData.map(n => n.from_user_id))];
      const postIds = [...new Set(notificationsData.map(n => n.post_id).filter(id => id))];

      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Fetch posts if there are any
      let postsData = [];
      if (postIds.length > 0) {
        const { data, error: postsError } = await supabase
          .from('posts')
          .select('id, content')
          .in('id', postIds);

        if (postsError) throw postsError;
        postsData = data || [];
      }

      // Create lookup maps
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      const postsMap = new Map();
      postsData.forEach(post => {
        postsMap.set(post.id, post);
      });

      // Format notifications
      const formattedNotifications = notificationsData
        .filter(notification => profilesMap.has(notification.from_user_id))
        .map(notification => ({
          ...notification,
          from_user: {
            username: profilesMap.get(notification.from_user_id).username,
            display_name: profilesMap.get(notification.from_user_id).display_name,
            avatar_url: profilesMap.get(notification.from_user_id).avatar_url
          },
          post: notification.post_id ? postsMap.get(notification.post_id) : undefined
        }));

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
};
