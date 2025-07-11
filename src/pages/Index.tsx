
import React from 'react';
import Layout from '@/components/Layout';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import { usePosts } from '@/hooks/usePosts';
import { useTranslation } from '@/hooks/useTranslation';

const Index = () => {
  const { posts, loading } = usePosts();
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-4">
        {/* Welcome Header */}
        <div className="glass-card p-6 mb-6 text-center fade-in">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
            {t('welcome')}
          </h2>
          <p className="text-muted-foreground">
            {t('connect')}
          </p>
        </div>

        {/* Create Post */}
        <CreatePost />

        {/* Feed */}
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : (
          <div className="space-y-0">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {posts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No posts yet. Create the first one!</p>
              </div>
            )}
          </div>
        )}

        {/* Load More */}
        {posts.length > 0 && (
          <div className="text-center mt-8">
            <button className="glass-card px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors text-primary font-medium">
              {t('loadMore')}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
