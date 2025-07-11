
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useFollowStats = () => {
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFollowStats = async () => {
    if (!user) return;

    try {
      // Get following count
      const { data: followingData, error: followingError } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id);

      if (followingError) throw followingError;

      // Get followers count
      const { data: followersData, error: followersError } = await supabase
        .from('follows')
        .select('id')
        .eq('following_id', user.id);

      if (followersError) throw followersError;

      setFollowingCount(followingData?.length || 0);
      setFollowersCount(followersData?.length || 0);
    } catch (error) {
      console.error('Error fetching follow stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFollowStats();
    }
  }, [user]);

  return {
    followingCount,
    followersCount,
    loading,
    refreshStats: fetchFollowStats
  };
};
