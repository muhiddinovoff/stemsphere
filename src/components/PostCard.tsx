
import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { usePosts, Post } from '@/hooks/usePosts';
import { useFollow } from '@/hooks/useFollow';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const { toggleLike, addComment } = usePosts();
  const { toggleFollow, isFollowing } = useFollow();
  const { t } = useTranslation();
  const { user } = useAuth();

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const handleLike = () => {
    toggleLike(post.id);
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    
    setSubmittingComment(true);
    await addComment(post.id, commentText);
    setCommentText('');
    setSubmittingComment(false);
  };

  const handleFollow = () => {
    toggleFollow(post.user_id);
  };

  const isLiked = post.likes?.some(like => like.user_id === user?.id);
  const isOwnPost = post.user_id === user?.id;

  return (
    <Card className="glass-card border-0 border-b border-border rounded-none hover:bg-accent/5 transition-colors">
      <CardContent className="p-6">
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center">
              <span className="text-white font-semibold">
                {post.profiles?.display_name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-foreground">{post.profiles?.display_name}</h3>
              <span className="text-muted-foreground">@{post.profiles?.username}</span>
              {post.profiles?.verified && (
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground text-sm">{formatTimeAgo(post.created_at)}</span>
              {!isOwnPost && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFollow}
                    className="text-primary hover:bg-primary/10 h-auto p-0 font-normal"
                  >
                    {isFollowing(post.user_id) ? t('following') : t('follow')}
                  </Button>
                </>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{post.profiles?.field}</p>
            
            <div className="mb-3">
              <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.hashtags.map((tag, index) => (
                    <span key={index} className="text-primary text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between max-w-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{post._count?.comments || 0}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-muted-foreground hover:text-green-500 hover:bg-green-500/10"
              >
                <Repeat2 className="h-4 w-4" />
                <span className="text-sm">0</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  isLiked 
                    ? 'text-red-500 hover:bg-red-500/10' 
                    : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{post._count?.likes || 0}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
            
            {showComments && (
              <div className="mt-4 space-y-3">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center">
                    <span className="text-white text-sm">
                      {user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={handleComment}
                        disabled={!commentText.trim() || submittingComment}
                        className="glow-button"
                      >
                        {submittingComment ? 'Posting...' : t('comment')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
