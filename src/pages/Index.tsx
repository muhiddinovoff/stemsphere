
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import PostModal from '@/components/PostModal';
import { usePosts } from '@/hooks/usePosts';

interface IndexProps {
  onProfileClick?: (userId: string) => void;
}

const Index = ({ onProfileClick }: IndexProps) => {
  const { posts, loading, deletePost } = usePosts();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  const handleDeletePost = async (postId: string) => {
    await deletePost(postId);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="fade-in">
        <CreatePost />
      </div>
      
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="glass-card p-12 text-center fade-in">
            <h3 className="text-xl font-semibold mb-2">Welcome to STEMSphere!</h3>
            <p className="text-muted-foreground">No posts yet. Be the first to share something amazing!</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div key={post.id} className="slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <PostCard 
                post={post} 
                onClick={() => handlePostClick(post)}
                onDelete={handleDeletePost}
                onProfileClick={onProfileClick}
              />
            </div>
          ))
        )}
      </div>

      <PostModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
