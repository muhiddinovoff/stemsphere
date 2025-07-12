
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

const Index = () => {
  const { posts, loading } = usePosts();
  const { results, loading: searchLoading, searchUsers, clearResults } = useSearch();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

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
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.display_name.charAt(0)}
                            </span>
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
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
