
import React from 'react';
import Layout from '@/components/Layout';
import { Search, TrendingUp, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { useFollow } from '@/hooks/useFollow';

const Explore = () => {
  const { t } = useTranslation();
  const { toggleFollow, isFollowing } = useFollow();

  const trendingTopics = [
    { tag: 'QuantumComputing', posts: '15.2K', growth: '+23%' },
    { tag: 'ClimateScience', posts: '8.7K', growth: '+45%' },
    { tag: 'CRISPR', posts: '12.1K', growth: '+18%' },
    { tag: 'MachineLearning', posts: '22.5K', growth: '+67%' },
    { tag: 'SpaceExploration', posts: '9.8K', growth: '+29%' },
    { tag: 'Neuroscience', posts: '11.3K', growth: '+34%' }
  ];

  const categories = [
    { name: 'Physics', count: '45.2K', color: 'from-blue-500 to-blue-600', icon: '⚛️' },
    { name: 'Chemistry', count: '32.1K', color: 'from-green-500 to-green-600', icon: '🧪' },
    { name: 'Biology', count: '38.7K', color: 'from-emerald-500 to-emerald-600', icon: '🧬' },
    { name: 'Mathematics', count: '28.4K', color: 'from-purple-500 to-purple-600', icon: '📐' },
    { name: 'Technology', count: '52.9K', color: 'from-orange-500 to-orange-600', icon: '💻' },
    { name: 'Engineering', count: '41.6K', color: 'from-red-500 to-red-600', icon: '🔧' }
  ];

  const featuredScientists = [
    { id: '1', name: 'Dr. Marie Curie Institute', field: 'Radioactivity Research', followers: '125K', verified: true },
    { id: '2', name: 'NASA Jet Propulsion Lab', field: 'Space Technology', followers: '2.1M', verified: true },
    { id: '3', name: 'Dr. Jennifer Doudna', field: 'CRISPR Research', followers: '89K', verified: true },
    { id: '4', name: 'MIT AI Lab', field: 'Artificial Intelligence', followers: '456K', verified: true },
    { id: '5', name: 'Dr. Katalin Karikó', field: 'mRNA Research', followers: '67K', verified: true },
    { id: '6', name: 'CERN Official', field: 'Particle Physics', followers: '1.8M', verified: true }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20 md:pb-4">
        {/* Search Header */}
        <div className="glass-card p-6 mb-6 fade-in">
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {t('explore')} STEM
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="Search scientists, topics, or research..."
              className="pl-10 glass-card border-primary/30"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Trending Topics */}
          <div className="glass-card p-6 slide-up">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">{t('trendingTopics')}</h2>
            </div>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={topic.tag} className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors">
                  <div>
                    <p className="font-medium text-primary">#{topic.tag}</p>
                    <p className="text-sm text-muted-foreground">{topic.posts} {t('posts')}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-500 font-medium">{topic.growth}</span>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="glass-card p-6 slide-up">
            <div className="flex items-center mb-4">
              <BookOpen className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">{t('stemCategories')}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button key={category.name} className="group relative overflow-hidden rounded-lg p-4 text-left transition-all hover:scale-105">
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                  <div className="relative">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} {t('posts')}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Scientists */}
          <div className="glass-card p-6 slide-up lg:col-span-2">
            <div className="flex items-center mb-4">
              <Users className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">{t('featuredScientists')}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredScientists.map((scientist) => (
                <div key={scientist.id} className="glass-card p-4 hover:shadow-lg transition-all">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center shrink-0">
                      <span className="text-white font-semibold">
                        {scientist.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h3 className="font-semibold text-sm">{scientist.name}</h3>
                        {scientist.verified && (
                          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center ml-1">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{scientist.field}</p>
                      <p className="text-xs text-muted-foreground mb-3">{scientist.followers} {t('followers')}</p>
                      <Button 
                        size="sm" 
                        onClick={() => toggleFollow(scientist.id)}
                        className="glow-button w-full"
                      >
                        {isFollowing(scientist.id) ? t('following') : t('follow')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
