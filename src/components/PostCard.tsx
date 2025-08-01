
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Repeat2, Share, Trash2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { usePosts, Post } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { useFollow } from '@/hooks/useFollow';

interface PostCardProps {
  post: Post;
  onUserClick?: (userId: string) => void;
}

const PostCard = ({ post, onUserClick }: PostCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const { likePost, deletePost } = usePosts();
  const { user } = useAuth();
  const { isFollowing } = useFollow();

  const isLiked = post.likes?.some(like => like.user_id === user?.id);
  const isOwner = user?.id === post.user_id;
  const isUserFollowing = user ? isFollowing(post.user_id) : false;

  const handleLike = async () => {
    if (!user) return;
    await likePost(post.id);
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    await deletePost(post.id);
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUserClick) {
      onUserClick(post.user_id);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.profiles.display_name}`,
          text: post.content,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${post.content} - ${post.profiles.display_name}`);
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in-up hover:scale-102 transition-all duration-300 border-b border-glass-border last:border-b-0">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        {/* Avatar */}
        <div 
          className="relative cursor-pointer group"
          onClick={handleUserClick}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-blue-500 to-purple-500 p-0.5 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full rounded-full overflow-hidden mirror-glass">
              {post.profiles.avatar_url ? (
                <img 
                  src={post.profiles.avatar_url} 
                  alt={post.profiles.display_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-blue-500">
                  <span className="text-white font-semibold">
                    {post.profiles.display_name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
          {post.profiles.verified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center mirror-glass-strong">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        
        {/* User Info and Actions */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div 
              className="cursor-pointer group"
              onClick={handleUserClick}
            >
              <div className="flex items-center space-x-2">
                <h3 className="font-bold group-hover:text-primary transition-colors duration-200">
                  {post.profiles.display_name}
                </h3>
                <span className="text-muted-foreground text-sm">@{post.profiles.username}</span>
                <span className="text-muted-foreground text-sm">·</span>
                <span className="text-muted-foreground text-sm">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
              </div>
              <div className="text-xs text-primary font-medium">
                {post.profiles.field}
              </div>
            </div>
            
            {/* More Actions */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActions(!showActions)}
                className="glass-button p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              
              {showActions && (
                <div className="absolute right-0 top-8 mirror-glass-strong rounded-lg p-2 min-w-32 z-10">
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className="w-full justify-start text-destructive hover:text-destructive glass-button"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="w-full justify-start glass-button"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4 pl-16">
        <p className="text-foreground whitespace-pre-wrap break-words">{post.content}</p>
        
        {post.image_url && (
          <div className="mt-4 rounded-xl overflow-hidden mirror-glass-strong">
            <img 
              src={post.image_url} 
              alt="Post content" 
              className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.hashtags.map((tag, index) => (
              <span 
                key={index} 
                className="text-primary text-sm font-medium hover:text-primary/80 cursor-pointer transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pl-16 pt-4 border-t border-glass-border">
        <div className="flex items-center space-x-6">
          {/* Like */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`glass-button flex items-center space-x-2 group ${
              isLiked ? 'text-red-500' : 'hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 transition-all duration-200 ${
              isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'
            }`} />
            <span className="text-sm font-medium">{post._count?.likes || 0}</span>
          </Button>

          {/* Comment */}
          <Button
            variant="ghost"
            size="sm"
            className="glass-button flex items-center space-x-2 group hover:text-blue-500"
          >
            <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-medium">{post._count?.comments || 0}</span>
          </Button>

          {/* Repost */}
          <Button
            variant="ghost"
            size="sm"
            className="glass-button flex items-center space-x-2 group hover:text-green-500"
          >
            <Repeat2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-medium">0</span>
          </Button>

          {/* Share */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="glass-button group hover:text-blue-500"
          >
            <Share className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          </Button>
        </div>

        {/* Follow/Following indicator */}
        {!isOwner && user && (
          <div className={`text-xs px-2 py-1 rounded-full mirror-glass transition-all duration-200 ${
            isUserFollowing 
              ? 'text-green-600 border border-green-600/20' 
              : 'text-muted-foreground'
          }`}>
            {isUserFollowing ? 'Following' : 'Not following'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
