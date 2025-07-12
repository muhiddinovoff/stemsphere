import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface Post {
  id: string;
  content: string;
  created_at: string;
  category: string;
  hashtags: string[];
  image_url?: string;
  user_id: string;
  profiles: {
    username: string;
    display_name: string;
    field: string;
    verified: boolean;
    avatar_url?: string;
  };
  likes: { user_id: string }[];
  comments: { id: string }[];
  _count?: {
    likes: number;
    comments: number;
  };
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts...');
      
      // First get posts
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
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Posts query error:', postsError);
        throw postsError;
      }

      if (!postsData || postsData.length === 0) {
        console.log('No posts found');
        setPosts([]);
        return;
      }

      // Get all unique user IDs from posts
      const userIds = [...new Set(postsData.map(post => post.user_id))];

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          display_name,
          field,
          verified,
          avatar_url
        `)
        .in('id', userIds);

      if (profilesError) {
        console.error('Profiles query error:', profilesError);
        throw profilesError;
      }

      // Fetch likes for all posts
      const postIds = postsData.map(post => post.id);
      const { data: likesData, error: likesError } = await supabase
        .from('likes')
        .select('post_id, user_id')
        .in('post_id', postIds);

      if (likesError) {
        console.error('Likes query error:', likesError);
      }

      // Fetch comments count for all posts
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('post_id, id')
        .in('post_id', postIds);

      if (commentsError) {
        console.error('Comments query error:', commentsError);
      }

      // Create profile lookup map
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Create likes lookup map
      const likesMap = new Map();
      likesData?.forEach(like => {
        if (!likesMap.has(like.post_id)) {
          likesMap.set(like.post_id, []);
        }
        likesMap.get(like.post_id).push({ user_id: like.user_id });
      });

      // Create comments count map
      const commentsMap = new Map();
      commentsData?.forEach(comment => {
        if (!commentsMap.has(comment.post_id)) {
          commentsMap.set(comment.post_id, []);
        }
        commentsMap.get(comment.post_id).push({ id: comment.id });
      });

      // Combine the data
      const formattedPosts = postsData
        .filter(post => profilesMap.has(post.user_id))
        .map(post => {
          const profile = profilesMap.get(post.user_id);
          const likes = likesMap.get(post.id) || [];
          const comments = commentsMap.get(post.id) || [];

          return {
            ...post,
            profiles: {
              username: profile.username,
              display_name: profile.display_name,
              field: profile.field || 'General',
              verified: profile.verified || false,
              avatar_url: profile.avatar_url
            },
            likes,
            comments,
            _count: {
              likes: likes.length,
              comments: comments.length
            }
          };
        });

      console.log('Formatted posts:', formattedPosts);
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const createPost = async (content: string, category: string, hashtags: string[]) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          content,
          category,
          hashtags,
          user_id: user.id
        });

      if (error) throw error;

      await fetchPosts();
      toast({
        title: "Success",
        description: "Post created successfully!"
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    try {
      const existingLike = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike.data) {
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        // Create notification for the post owner
        const post = posts.find(p => p.id === postId);
        if (post && post.user_id !== user.id) {
          await supabase.rpc('create_notification', {
            p_user_id: post.user_id,
            p_type: 'like',
            p_from_user_id: user.id,
            p_post_id: postId
          });
        }
      }

      await fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content
        });

      if (error) throw error;

      // Create notification for the post owner
      const post = posts.find(p => p.id === postId);
      if (post && post.user_id !== user.id) {
        await supabase.rpc('create_notification', {
          p_user_id: post.user_id,
          p_type: 'comment',
          p_from_user_id: user.id,
          p_post_id: postId
        });
      }

      await fetchPosts();
      toast({
        title: "Success",
        description: "Comment added successfully!"
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    addComment,
    refreshPosts: fetchPosts
  };
};
