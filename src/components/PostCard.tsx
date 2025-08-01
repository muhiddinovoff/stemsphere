
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
  onProfileClick?: (userId: string) => void;
}

const PostCard = ({ post, onClick, onDelete, onProfileClick }: PostCardProps) => {
  const { user } = useAuth();
  const { toggleLike } = usePosts();
  const { followUser, unfollowUser, isFollowing, loading: followLoading } = useFollow();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isReposting, setIsReposting] = useState(false);
  const [repostCount, setRepostCount] = useState(0);

  const isLiked = post.likes?.some(like => like.user_id === user?.id);
  const isOwnPost = user?.id === post.user_id;
  const isFollowingUser = isFollowing(post.user_id);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;
    
    setIsLiking(true);
    await toggleLike(post.id);
    setIsLiking(false);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isReposting) return;
    
    setIsReposting(true);
    // Add repost animation
    const button = e.currentTarget;
    button.classList.add('repost-animate');
    
    setTimeout(() => {
      button.classList.remove('repost-animate');
      setIsReposting(false);
      setRepostCount(prev => prev + 1);
    }, 600);
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

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onProfileClick) {
      onProfileClick(post.user_id);
    }
  };

  return (
    <div className="glass-card p-6 hover:glass-card-hover transition-all duration-500 cursor-pointer fade-in mirror-shine">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div 
          className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-blue-400/20 flex items-center justify-center glass-card-secondary cursor-pointer hover:scale-105 transition-transform duration-300 pulse-glow"
          onClick={handleProfileClick}
        >
          {post.profiles.avatar_url ? (
            <img 
              src={post.profiles.avatar_url} 
              alt={post.profiles.display_name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-primary font-bold text-lg">
              {post.profiles.display_name.charAt(0)}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header with follow button */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 flex-1 min-w-0 cursor-pointer" onClick={handleProfileClick}>
              <h4 className="text-lg font-bold text-foreground hover:text-primary transition-colors duration-200 truncate">
                {post.profiles.display_name}
              </h4>
              {post.profiles.verified && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
              <span className="text-muted-foreground text-sm hover:text-foreground transition-colors truncate">
                @{post.profiles.username}
              </span>
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-muted-foreground text-sm hover:text-foreground transition-colors">
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
                  className="glass-button flex items-center space-x-1 hover:scale-105 transition-transform duration-200"
                >
                  {isFollowingUser ? (
                    <>
                      <UserMinus className="h-4 w-4" />
                      <span className="hidden sm:inline">Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      <span className="hidden sm:inline">Follow</span>
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
                  className="glass-button text-destructive hover:text-destructive hover:scale-105 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="mb-4">
            <p className="text-foreground leading-relaxed text-base">{post.content}</p>
            
            {/* Hashtags */}
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.hashtags.map((tag, index) => (
                  <span key={index} className="text-primary hover:text-primary/80 text-sm cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Image */}
          {post.image_url && (
            <div className="mb-4 glass-card-secondary rounded-lg overflow-hidden">
              <img 
                src={post.image_url} 
                alt="Post image" 
                className="w-full h-auto max-h-96 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center justify-between max-w-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="glass-button flex items-center space-x-2 text-muted-foreground hover:text-blue-500 hover:scale-110 transition-all duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">{post._count?.comments || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRepost}
              disabled={isReposting}
              className="glass-button flex items-center space-x-2 text-muted-foreground hover:text-green-500 hover:scale-110 transition-all duration-200"
            >
              <Repeat className="h-5 w-5" />
              <span className="font-medium">{repostCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className={`glass-button flex items-center space-x-2 transition-all duration-200 hover:scale-110 ${
                isLiked 
                  ? 'text-red-500' 
                  : 'text-muted-foreground hover:text-red-500'
              } ${isLiking ? 'like-animate' : ''}`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{post._count?.likes || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="glass-button text-muted-foreground hover:text-purple-500 hover:scale-110 transition-all duration-200"
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
