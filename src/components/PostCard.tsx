
import React, { useState } from 'react';
import { Post } from '@/hooks/usePosts';
import { Heart, MessageCircle, Repeat, Share, Trash2, UserPlus, UserMinus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { useFollow } from '@/hooks/useFollow';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: Post;
  onClick?: () => void;
  onDelete?: (postId: string) => void;
}

const PostCard = ({ post, onClick, onDelete }: PostCardProps) => {
  const { user } = useAuth();
  const { toggleLike } = usePosts();
  const { followUser, unfollowUser, isFollowing, loading: followLoading } = useFollow();
  const [isDeleting, setIsDeleting] = useState(false);

  const isLiked = post.likes?.some(like => like.user_id === user?.id);
  const isOwnPost = user?.id === post.user_id;
  const isFollowingUser = isFollowing(post.user_id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(post.id);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.profiles.display_name}`,
        text: post.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOwnPost || isDeleting) return;
    
    if (confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true);
      try {
        if (onDelete) {
          await onDelete(post.id);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || isOwnPost || followLoading) return;
    
    try {
      if (isFollowingUser) {
        await unfollowUser(post.user_id);
      } else {
        await followUser(post.user_id);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  return (
    <div className="glass-card p-6 hover:glass-card-hover transition-all duration-300 cursor-pointer fade-in">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center glass-card-secondary">
          {post.profiles.avatar_url ? (
            <img 
              src={post.profiles.avatar_url} 
              alt={post.profiles.display_name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-semibold">
              {post.profiles.display_name.charAt(0)}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header with follow button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-foreground truncate">
                {post.profiles.display_name}
              </h4>
              {post.profiles.verified && (
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <span className="text-muted-foreground text-sm truncate">
                @{post.profiles.username}
              </span>
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
            </div>
            
            {/* Follow/Delete buttons */}
            <div className="flex items-center space-x-2">
              {!isOwnPost && user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFollow}
                  disabled={followLoading}
                  className="glass-button flex items-center space-x-1"
                >
                  {isFollowingUser ? (
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
              )}
              
              {isOwnPost && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="glass-button text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Content */}
          <p className="mt-3 text-foreground leading-relaxed">{post.content}</p>
          
          {/* Image */}
          {post.image_url && (
            <img 
              src={post.image_url} 
              alt="Post image" 
              className="mt-3 rounded-lg max-w-full h-auto glass-card-secondary"
            />
          )}
          
          {/* Action buttons */}
          <div className="flex items-center justify-between mt-4 max-w-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="glass-button flex items-center space-x-2 text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{post._count?.comments || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="glass-button flex items-center space-x-2 text-muted-foreground hover:text-green-500"
            >
              <Repeat className="h-5 w-5" />
              <span>0</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`glass-button flex items-center space-x-2 transition-colors ${
                isLiked 
                  ? 'text-red-500' 
                  : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post._count?.likes || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="glass-button text-muted-foreground hover:text-blue-500"
            >
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
