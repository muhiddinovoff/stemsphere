
import React from 'react';
import Layout from '@/components/Layout';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import { usePosts } from '@/hooks/usePosts';

interface IndexProps {
  onUserClick?: (userId: string) => void;
}

const Index = ({ onUserClick }: IndexProps) => {
  const { posts, loading } = usePosts();

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-20 animate-bounce-in">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="glass-card p-6 animate-fade-in-up">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl mirror-glass-strong flex items-center justify-center">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-blue-500"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Welcome to STEMSphere
            </h1>
            <p className="text-muted-foreground">Connect with brilliant minds in science, technology, engineering, and mathematics</p>
          </div>
        </div>
      </div>

      {/* Create Post */}
      <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
        <CreatePost />
      </div>

      {/* Posts Feed */}
      <div className="space-y-0">
        {posts.length === 0 ? (
          <div className="glass-card p-12 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 rounded-full mirror-glass-strong flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-blue-500"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Your feed is empty</h3>
            <p className="text-muted-foreground mb-4">
              Start following other users or create your first post to get started!
            </p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div 
              key={post.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(index + 3) * 0.1}s` }}
            >
              <PostCard post={post} onUserClick={onUserClick} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
