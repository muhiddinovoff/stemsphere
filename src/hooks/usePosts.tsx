
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
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          category,
          hashtags,
          image_url,
          user_id,
          profiles!posts_user_id_fkey (
            username,
            display_name,
            field,
            verified,
            avatar_url
          ),
          likes!likes_post_id_fkey (user_id),
          comments!comments_post_id_fkey (id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPosts = data?.map(post => ({
        ...post,
        _count: {
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0
        }
      })) || [];

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
