
import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  id: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
    field: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  category: 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics' | 'Technology' | 'Engineering';
  likes: number;
  comments: number;
  reposts: number;
  image?: string;
  hashtags?: string[];
}

const PostCard = ({ 
  author, 
  content, 
  timestamp, 
  category, 
  likes, 
  comments, 
  reposts, 
  image, 
  hashtags 
}: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLocalLikes(liked ? localLikes - 1 : localLikes + 1);
  };

  const getCategoryColor = (cat: string) => {
    const colors = {
      Physics: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
      Chemistry: 'bg-green-500/20 text-green-600 border-green-500/30',
      Biology: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
      Mathematics: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
      Technology: 'bg-orange-500/20 text-orange-600 border-orange-500/30',
      Engineering: 'bg-red-500/20 text-red-600 border-red-500/30',
    };
    return colors[cat as keyof typeof colors] || colors.Technology;
  };

  return (
    <article className="glass-card p-6 mb-4 fade-in hover:shadow-lg transition-all duration-300">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center shrink-0">
          <span className="text-white font-semibold text-lg">
            {author.name.charAt(0)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer">
                {author.name}
              </h3>
              {author.verified && (
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <span className="text-muted-foreground text-sm">@{author.username}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground text-sm">{timestamp}</span>
            </div>
            <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Category & Field */}
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(category)}`}>
              {category}
            </span>
            <span className="text-xs text-muted-foreground">{author.field}</span>
          </div>

          {/* Content */}
          <div className="mb-4">
            <p className="text-foreground leading-relaxed mb-2">{content}</p>
            
            {/* Hashtags */}
            {hashtags && (
              <div className="flex flex-wrap gap-1 mb-2">
                {hashtags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-primary hover:text-primary/80 cursor-pointer text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Image */}
            {image && (
              <div className="rounded-lg overflow-hidden mt-3 glass-card">
                <img 
                  src={image} 
                  alt="Post content" 
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-2 hover:bg-red-500/10 hover:text-red-500 ${
                liked ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              <span className="text-xs">{localLikes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 hover:bg-blue-500/10 hover:text-blue-500 text-muted-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{comments}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 hover:bg-green-500/10 hover:text-green-500 text-muted-foreground"
            >
              <Repeat2 className="h-4 w-4" />
              <span className="text-xs">{reposts}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBookmarked(!bookmarked)}
              className={`hover:bg-yellow-500/10 hover:text-yellow-500 ${
                bookmarked ? 'text-yellow-500' : 'text-muted-foreground'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary text-muted-foreground"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
