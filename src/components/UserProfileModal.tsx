
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Calendar, MapPin, UserPlus, UserMinus, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFollow } from '@/hooks/useFollow';
import { Post } from '@/hooks/usePosts';
import PostCard from './PostCard';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  field?: string;
  verified: boolean;
  created_at: string;
}

interface UserProfileModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onMessage?: (userId: string) => void;
}

const UserProfileModal = ({ userId, isOpen, onClose, onMessage }: UserProfileModalProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const { user } = useAuth();
  const { followUser, unfollowUser, isFollowing, loading: followLoading } = useFollow();

  const fetchUserProfile = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch followers and following counts
      const [followersResult, followingResult] = await Promise.all([
        supabase.from('follows').select('id').eq('following_id', userId),
        supabase.from('follows').select('id').eq('follower_id', userId)
      ]);

      setFollowersCount(followersResult.data?.length || 0);
      setFollowingCount(followingResult.data?.length || 0);

      // Fetch user posts with engagement data
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          category,
          hashtags,
          image_url,
          user_id
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(12);

      if (postsError) throw postsError;

      // Get engagement data for posts
      const postIds = postsData?.map(post => post.id) || [];
      
      let likesData = [];
      let commentsData = [];
      
      if (postIds.length > 0) {
        const [likes, comments] = await Promise.all([
          supabase.from('likes').select('post_id, user_id').in('post_id', postIds),
          supabase.from('comments').select('post_id, id').in('post_id', postIds)
        ]);

        likesData = likes.data || [];
        commentsData = comments.data || [];
      }

      // Format posts with engagement data
      const formattedPosts = postsData?.map(post => ({
        ...post,
        profiles: {
          username: profileData.username,
          display_name: profileData.display_name,
          field: profileData.field || 'General',
          verified: profileData.verified || false,
          avatar_url: profileData.avatar_url
        },
        likes: likesData.filter(like => like.post_id === post.id).map(like => ({ user_id: like.user_id })),
        comments: commentsData.filter(comment => comment.post_id === post.id).map(comment => ({ id: comment.id })),
        _count: {
          likes: likesData.filter(like => like.post_id === post.id).length,
          comments: commentsData.filter(comment => comment.post_id === post.id).length
        }
      })) || [];

      setProfile(profileData);
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && isOpen) {
      fetchUserProfile();
    }
  }, [userId, isOpen]);

  const handleFollow = async () => {
    if (!profile || !user || followLoading) return;
    
    try {
      if (isFollowing(profile.id)) {
        await unfollowUser(profile.id);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        await followUser(profile.id);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  if (!profile) return null;

  const isOwnProfile = user?.id === userId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="profile-modal max-w-5xl p-0 border-0">
        {loading ? (
          <div className="text-center py-20 animate-bounce-in">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-glass-border">
              <h2 className="text-xl font-bold">@{profile.username}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="glass-button p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Profile Info */}
            <div className="p-6 border-b border-glass-border animate-fade-in-up">
              <div className="flex items-start space-x-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-blue-500 to-purple-500 p-1 animate-bounce-in">
                    <div className="w-full h-full rounded-full overflow-hidden mirror-glass-strong">
                      {profile.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.display_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-blue-500">
                          <span className="text-white font-bold text-2xl">
                            {profile.display_name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {profile.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center mirror-glass-strong animate-bounce-in" style={{ animationDelay: '0.3s' }}>
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </div>
                
                {/* Profile Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold animate-slide-in-right">{profile.display_name}</h3>
                      <p className="text-muted-foreground animate-slide-in-right" style={{ animationDelay: '0.1s' }}>@{profile.username}</p>
                    </div>
                    
                    {!isOwnProfile && user && (
                      <div className="flex space-x-2 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                        <Button
                          onClick={handleFollow}
                          disabled={followLoading}
                          className={`glass-button flex items-center space-x-2 ${
                            isFollowing(profile.id) 
                              ? 'bg-muted hover:bg-destructive hover:text-white' 
                              : 'bg-primary hover:bg-primary/80 text-white'
                          }`}
                        >
                          {isFollowing(profile.id) ? (
                            <>
                              <UserMinus className="h-4 w-4" />
                              <span>Unfollow</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4" />
                              <span>Follow</span>
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => onMessage && onMessage(profile.id)}
                          variant="outline"
                          className="glass-button flex items-center space-x-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Message</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex space-x-6 mb-3 animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                    <div className="text-center">
                      <div className="font-bold text-lg">{posts.length}</div>
                      <div className="text-sm text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{followersCount}</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{followingCount}</div>
                      <div className="text-sm text-muted-foreground">Following</div>
                    </div>
                  </div>
                  
                  {profile.bio && (
                    <p className="text-foreground mb-3 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>{profile.bio}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground animate-slide-in-right" style={{ animationDelay: '0.5s' }}>
                    {profile.field && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.field}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {posts.length === 0 ? (
                <div className="text-center py-12 animate-fade-in-up">
                  <div className="w-16 h-16 rounded-full mirror-glass-strong flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg">No posts yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isOwnProfile ? "Share your first post!" : `${profile.display_name} hasn't posted anything yet.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold animate-slide-in-right">Recent Posts</h4>
                  <div className="space-y-0">
                    {posts.map((post, index) => (
                      <div 
                        key={post.id} 
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
