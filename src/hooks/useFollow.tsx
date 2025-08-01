
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export const useFollow = () => {
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFollowing = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (error) throw error;
      setFollowingIds(data.map(follow => follow.following_id));
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFollowing();
    }
  }, [user]);

  const followUser = async (userId: string) => {
    if (!user || userId === user.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: userId
        });

      if (error) throw error;
      
      setFollowingIds(prev => [...prev, userId]);
      toast({
        title: "Success",
        description: "User followed successfully!"
      });
    } catch (error) {
      console.error('Error following user:', error);
      toast({
        title: "Error",
        description: "Failed to follow user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const unfollowUser = async (userId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;
      
      setFollowingIds(prev => prev.filter(id => id !== userId));
      toast({
        title: "Success",
        description: "User unfollowed successfully!"
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast({
        title: "Error",
        description: "Failed to unfollow user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isFollowing = (userId: string) => {
    return followingIds.includes(userId);
  };

  return {
    followUser,
    unfollowUser,
    isFollowing,
    loading,
    followingIds
  };
};
