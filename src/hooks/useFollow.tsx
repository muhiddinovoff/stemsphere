
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export const useFollow = () => {
  const [follows, setFollows] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFollows = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (error) throw error;

      setFollows(data?.map(f => f.following_id) || []);
    } catch (error) {
      console.error('Error fetching follows:', error);
    }
  };

  useEffect(() => {
    fetchFollows();
  }, [user]);

  const toggleFollow = async (userId: string) => {
    if (!user) return;

    try {
      const isFollowing = follows.includes(userId);

      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });

        // Create notification
        await supabase.rpc('create_notification', {
          p_user_id: userId,
          p_type: 'follow',
          p_from_user_id: user.id
        });
      }

      await fetchFollows();
      
      toast({
        title: "Success",
        description: isFollowing ? "Unfollowed successfully" : "Following successfully"
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    }
  };

  return {
    follows,
    toggleFollow,
    isFollowing: (userId: string) => follows.includes(userId)
  };
};
