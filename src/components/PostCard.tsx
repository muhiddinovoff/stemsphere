import React from 'react';
import { Post } from '@/hooks/usePosts';
import { Heart, MessageCircle } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

const PostCard = ({ post, onClick }: PostCardProps) => {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div 
      className="glass-card p-6 hover:bg-accent/5 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center">
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
          <div className="flex items-center space-x-2">
            <h4 className="text-lg font-semibold text-foreground truncate">{post.profiles.display_name}</h4>
            {post.profiles.verified && (
              <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
            <span className="text-muted-foreground text-sm truncate">@{post.profiles.username}</span>
          </div>
          
          <p className="mt-3 text-foreground leading-relaxed">{post.content}</p>
          
          {post.image_url && (
            <img 
              src={post.image_url} 
              alt="Post image" 
              className="mt-3 rounded-lg max-w-full h-auto"
            />
          )}
          
          <div className="flex items-center space-x-4 mt-4 text-muted-foreground">
            <span>{post._count?.likes || 0} Likes</span>
            <span>{post._count?.comments || 0} Comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
