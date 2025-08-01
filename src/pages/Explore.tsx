
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, UserMinus } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { useFollow } from '@/hooks/useFollow';
import { useAuth } from '@/hooks/useAuth';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { results, loading, searchUsers, clearResults } = useSearch();
  const { followUser, unfollowUser, isFollowing, loading: followLoading } = useFollow();
  const { user } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchUsers(searchQuery.trim());
    } else {
      clearResults();
    }
  };

  const handleFollow = async (userId: string, isCurrentlyFollowing: boolean) => {
    if (!user || followLoading) return;
    
    try {
      if (isCurrentlyFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <div className="glass-card p-6 mb-6 fade-in">
          <h1 className="text-2xl font-bold mb-4">Explore STEMSphere</h1>
          
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search users, fields, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 glass-card"
            />
            <Button type="submit" disabled={loading} className="glass-button">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground mt-2">Searching...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Search Results</h2>
            {results.map((result) => {
              const isFollowingUser = isFollowing(result.id);
              const isOwnProfile = user?.id === result.id;
              
              return (
                <div key={result.id} className="glass-card p-4 fade-in">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center glass-card-secondary">
                      {result.avatar_url ? (
                        <img 
                          src={result.avatar_url} 
                          alt={result.display_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold">
                          {result.display_name.charAt(0)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{result.display_name}</h3>
                          {result.verified && (
                            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        
                        {!isOwnProfile && user && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFollow(result.id, isFollowingUser)}
                            disabled={followLoading}
                            className="glass-button flex items-center space-x-1"
                          >
                            {isFollowingUser ? (
                              <>
                                <UserMinus className="h-4 w-4" />
                                <span>Unfollow</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4" />
                                <span>Follow</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground text-sm">@{result.username}</p>
                      <p className="text-sm text-primary">{result.field}</p>
                      
                      {result.bio && (
                        <p className="mt-2 text-sm">{result.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Explore;
