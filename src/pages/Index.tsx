import React, { useState } from 'react';
import Layout from '@/components/Layout';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import { usePosts } from '@/hooks/usePosts';
import { useSearch } from '@/hooks/useSearch';
import { useTranslation } from '@/hooks/useTranslation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PostModal from '@/components/PostModal';
import UserProfileModal from '@/components/UserProfileModal';
import MessagingModal from '@/components/MessagingModal';

// Dock Component
const Dock = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 max-w-md">
      <div className="glass-dock flex justify-around">
        <a href="/" className="icon p-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 18l-6-3.75V8.25L12 5l6 3.25v6.5L12 20z"/>
          </svg>
          <span className="sr-only">{t('home')}</span>
        </a>
        <a href="/explore" className="icon p-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v2h2v2h-2v2h2v2h-2v2h6v-8h-4z"/>
          </svg>
          <span className="sr-only">{t('explore')}</span>
        </a>
        <a href="/categories" className="icon p-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 16H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          <span className="sr-only">{t('categories')}</span>
        </a>
        <a href="/messages" className="icon p-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
          <span className="sr-only">{t('messages')}</span>
        </a>
        <a href="/profile" className="icon p-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-1.13-4.97-2.71.23-1.23 1.86-2.29 3.97-2.29s3.74 1.06 3.97 2.29c-.54 1.58-2.94 2.71-4.97 2.71z"/>
          </svg>
          <span className="sr-only">{t('profile')}</span>
        </a>
      </div>
    </div>
  );
};

const Index = () => {
  const { posts, loading } = usePosts();
  const { results, loading: searchLoading, searchUsers, clearResults } = useSearch();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const [messagingUserId, setMessagingUserId] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowSearch(true);
      searchUsers(query);
    } else {
      setShowSearch(false);
      clearResults();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
    clearResults();
  };

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleMessage = (userId: string) => {
    setMessagingUserId(userId);
    setSelectedUserId(null);
    setShowMessaging(true);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-24">
        {/* Welcome Header */}
        <div className="glass-card p-6 mb-6 text-center fade-in">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
            {t('welcome')}
          </h2>
          <p className="text-muted-foreground">
            {t('connect')}
          </p>
        </div>

        {/* Search Section */}
        <div className="glass-card p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search for scientists and researchers..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search Results */}
          {showSearch && (
            <div className="mt-4">
              {searchLoading ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Search Results</h3>
                  {results.map((user) => (
                    <Card key={user.id} className="hover:bg-accent/5 transition-colors">
                      <CardContent className="p-3">
                        <div 
                          className="flex items-center space-x-3 cursor-pointer"
                          onClick={() => handleUserClick(user.id)}
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center">
                            {user.avatar_url ? (
                              <img 
                                src={user.avatar_url} 
                                alt={user.display_name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-semibold text-sm">
                                {user.display_name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1">
                              <h4 className="font-medium text-foreground truncate">{user.display_name}</h4>
                              {user.verified && (
                                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                            {user.field && (
                              <p className="text-xs text-muted-foreground">{user.field}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No users found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Post */}
        {!showSearch && <CreatePost />}

        {/* Feed */}
        {!showSearch && (
          <>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            ) : (
              <div className="space-y-0">
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onClick={() => handlePostClick(post)}
                  />
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
          </>
        )}
      </div>

      {/* Modals */}
      <PostModal 
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
      
      <UserProfileModal
        userId={selectedUserId}
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        onMessage={handleMessage}
      />
      
      <MessagingModal
        isOpen={showMessaging}
        onClose={() => {
          setShowMessaging(false);
          setMessagingUserId(null);
        }}
        selectedUserId={messagingUserId || undefined}
      />

      {/* Dock */}
      <Dock />
    </Layout>
  );
};

export default Index;
