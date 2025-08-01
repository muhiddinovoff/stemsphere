
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Calendar, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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
  const { user } = useAuth();

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

      // Fetch user posts
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
        .limit(10);

      if (postsError) throw postsError;

      // Get likes and comments count for posts
      const postIds = postsData?.map(post => post.id) || [];
      
      let likesData = [];
      let commentsData = [];
      
      if (postIds.length > 0) {
        const { data: likes } = await supabase
          .from('likes')
          .select('post_id, user_id')
          .in('post_id', postIds);

        const { data: comments } = await supabase
          .from('comments')
          .select('post_id, id')
          .in('post_id', postIds);

        likesData = likes || [];
        commentsData = comments || [];
      }

      // Format posts with profile data and counts
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

  if (!profile) return null;

  const isOwnProfile = user?.id === userId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.display_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {profile.display_name.charAt(0)}
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold">{profile.display_name}</h2>
                  {profile.verified && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground">@{profile.username}</p>
                
                {profile.bio && (
                  <p className="mt-2 text-foreground">{profile.bio}</p>
                )}
                
                <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
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
                
                {!isOwnProfile && onMessage && (
                  <Button
                    onClick={() => onMessage(profile.id)}
                    className="mt-4 flex items-center space-x-2"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Message</span>
                  </Button>
                )}
              </div>
            </div>

            {/* User Posts */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
              {posts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No posts yet</p>
              ) : (
                <div className="space-y-0">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
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
