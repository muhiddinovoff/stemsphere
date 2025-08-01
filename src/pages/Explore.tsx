import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Search, Grid3X3, TrendingUp, UserPlus, UserMinus } from 'lucide-react';
import { useSearch, SearchResult } from '@/hooks/useSearch';
import { useAuth } from '@/hooks/useAuth';
import { useFollow } from '@/hooks/useFollow';
import { Button } from '@/components/ui/button';

interface Category {
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface ExploreProps {
  onProfileClick?: (userId: string) => void;
}

const Explore = ({ onProfileClick }: ExploreProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { results, loading, searchUsers, clearResults } = useSearch();
  const auth = useAuth();
  const { followUser, unfollowUser, isFollowing, loading: followLoading } = useFollow();

  const categories: Category[] = [
    {
      name: 'Physics',
      description: 'Explore the fundamental laws of the universe.',
      icon: TrendingUp,
    },
    {
      name: 'Chemistry',
      description: 'Discover the composition, structure, properties, and reactions of matter.',
      icon: Grid3X3,
    },
    {
      name: 'Biology',
      description: 'Study the science of life and living organisms.',
      icon: TrendingUp,
    },
    {
      name: 'Mathematics',
      description: 'Uncover the abstract science of number, quantity, and space.',
      icon: Grid3X3,
    },
    {
      name: 'Technology',
      description: 'Explore the latest advancements in technology and innovation.',
      icon: TrendingUp,
    },
    {
      name: 'Engineering',
      description: 'Design and build structures, machines, and systems.',
      icon: Grid3X3,
    },
  ];

  const trendingHashtags = ['science', 'research', 'innovation', 'technology', 'engineering', 'mathematics'];

  const handleFollow = async (userId: string) => {
    if (isFollowing(userId)) {
      await unfollowUser(userId);
    } else {
      await followUser(userId);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search Section */}
        <div className="glass-card p-6 slide-up">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Explore & Discover
          </h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for users, topics, or hashtags..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) {
                  searchUsers(e.target.value);
                } else {
                  clearResults();
                }
              }}
              className="w-full pl-10 pr-4 py-3 glass-button text-lg focus:outline-none focus:ring-2 focus:ring-primary rounded-xl"
            />
          </div>
          
          {loading && (
            <div className="mt-4 flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          )}
          
          {results.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-lg">Search Results</h3>
              {results.map((user) => (
                <div key={user.id} className="glass-card-secondary p-4 rounded-lg hover:glass-card-hover transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center space-x-3 flex-1 cursor-pointer"
                      onClick={() => onProfileClick && onProfileClick(user.id)}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-blue-400/20 flex items-center justify-center glass-card-secondary">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={user.display_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary font-semibold text-lg">
                            {user.display_name.charAt(0)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-foreground hover:text-primary transition-colors">
                            {user.display_name}
                          </h4>
                          {user.verified && (
                            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">@{user.username}</p>
                        <p className="text-muted-foreground text-sm">{user.field}</p>
                        {user.bio && <p className="text-foreground text-sm mt-1">{user.bio}</p>}
                      </div>
                    </div>
                    
                    {user.id !== auth.user?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFollow(user.id)}
                        disabled={followLoading}
                        className="glass-button flex items-center space-x-1 hover:scale-105 transition-all duration-200"
                      >
                        {isFollowing(user.id) ? (
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
              ))}
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="glass-card p-6 fade-in">
          <h3 className="text-xl font-bold mb-4">Explore Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="glass-card-secondary p-4 rounded-lg hover:glass-card-hover transition-all duration-300 cursor-pointer group hover:scale-105"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <category.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-200" />
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        <div className="glass-card p-6 fade-in">
          <h3 className="text-xl font-bold mb-4">Trending Topics</h3>
          <div className="flex flex-wrap gap-3">
            {trendingHashtags.map((hashtag, index) => (
              <span
                key={hashtag}
                className="glass-button px-4 py-2 rounded-full text-primary hover:scale-105 cursor-pointer transition-all duration-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                #{hashtag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
