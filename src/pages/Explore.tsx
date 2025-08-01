
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, UserMinus } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { useFollow } from '@/hooks/useFollow';
import { useAuth } from '@/hooks/useAuth';

interface ExploreProps {
  onUserClick?: (userId: string) => void;
}

const Explore = ({ onUserClick }: ExploreProps) => {
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
    <div className="max-w-4xl mx-auto">
      <div className="glass-card p-6 mb-6 animate-fade-in-up">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 rounded-xl mirror-glass-strong flex items-center justify-center">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Explore STEMSphere
            </h1>
            <p className="text-muted-foreground">Discover amazing people in STEM</p>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="flex space-x-3">
          <Input
            type="text"
            placeholder="Search users, fields, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 glass-input"
          />
          <Button type="submit" disabled={loading} className="glass-button px-6">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>

      {loading && (
        <div className="text-center py-12 animate-bounce-in">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Searching the STEMSphere...</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4 animate-slide-in-right">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-xl font-semibold">Search Results</h2>
            <div className="px-2 py-1 rounded-full mirror-glass-strong text-sm text-muted-foreground">
              {results.length} found
            </div>
          </div>
          
          <div className="grid gap-4">
            {results.map((result, index) => {
              const isFollowingUser = isFollowing(result.id);
              const isOwnProfile = user?.id === result.id;
              
              return (
                <div 
                  key={result.id} 
                  className="glass-card p-6 animate-fade-in-up cursor-pointer hover:scale-102 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => onUserClick && onUserClick(result.id)}
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-blue-500 to-purple-500 p-1">
                        <div className="w-full h-full rounded-full overflow-hidden mirror-glass-strong">
                          {result.avatar_url ? (
                            <img 
                              src={result.avatar_url} 
                              alt={result.display_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-blue-500">
                              <span className="text-white font-bold text-lg">
                                {result.display_name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {result.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center mirror-glass-strong">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-lg truncate">{result.display_name}</h3>
                        <div className="px-2 py-1 rounded-full mirror-glass text-xs font-medium text-primary">
                          {result.field}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">@{result.username}</p>
                      
                      {result.bio && (
                        <p className="text-sm text-foreground/80 line-clamp-2">{result.bio}</p>
                      )}
                    </div>
                    
                    {/* Actions */}
                    {!isOwnProfile && user && (
                      <Button
                        variant={isFollowingUser ? "outline" : "default"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollow(result.id, isFollowingUser);
                        }}
                        disabled={followLoading}
                        className={`glass-button flex items-center space-x-2 ${
                          isFollowingUser 
                            ? 'hover:bg-destructive hover:text-white hover:border-destructive' 
                            : 'bg-primary hover:bg-primary/80 text-white'
                        }`}
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
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && results.length === 0 && searchQuery && (
        <div className="text-center py-12 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full mirror-glass-strong flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-lg">No results found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try searching with different keywords
          </p>
        </div>
      )}
    </div>
  );
};

export default Explore;
