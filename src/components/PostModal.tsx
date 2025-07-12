
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '@/hooks/usePosts';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';

interface PostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

const PostModal = ({ post, isOpen, onClose }: PostModalProps) => {
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();
  const { toggleLike } = usePosts();
  const { comments, loading, addComment } = useComments(post?.id || '');

  if (!post) return null;

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    await addComment(commentText);
    setCommentText('');
  };

  const handleLike = () => {
    toggleLike(post.id);
  };

  const isLiked = post.likes?.some(like => like.user_id === user?.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post Details</DialogTitle>
        </DialogHeader>
        
        {/* Original Post */}
        <div className="border-b pb-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center">
              {post.profiles.avatar_url ? (
                <img 
                  src={post.profiles.avatar_url} 
                  alt={post.profiles.display_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {post.profiles.display_name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold">{post.profiles.display_name}</h4>
                {post.profiles.verified && (
                  <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                <span className="text-muted-foreground text-sm">@{post.profiles.username}</span>
                <span className="text-muted-foreground text-sm">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="mt-2 text-foreground">{post.content}</p>
              {post.image_url && (
                <img 
                  src={post.image_url} 
                  alt="Post image" 
                  className="mt-3 rounded-lg max-w-full h-auto"
                />
              )}
              
              {/* Post Actions */}
              <div className="flex items-center space-x-6 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{post._count?.likes || 0}</span>
                </Button>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span>{comments.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Comment */}
        {user && (
          <div className="flex space-x-3 py-4 border-b">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center">
              <span className="text-white font-semibold text-xs">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[60px] resize-none"
              />
              <Button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                size="sm"
                className="ml-auto flex items-center space-x-1"
              >
                <Send className="h-4 w-4" />
                <span>Reply</span>
              </Button>
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center">
                  {comment.profiles.avatar_url ? (
                    <img 
                      src={comment.profiles.avatar_url} 
                      alt={comment.profiles.display_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-xs">
                      {comment.profiles.display_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-medium text-sm">{comment.profiles.display_name}</h5>
                    <span className="text-muted-foreground text-xs">@{comment.profiles.username}</span>
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
