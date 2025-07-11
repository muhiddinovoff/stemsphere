
import React from 'react';
import Layout from '@/components/Layout';
import { Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';

const Explore = () => {
  const { t } = useTranslation();

  const categories = [
    { name: 'Physics', count: '45.2K', color: 'from-blue-500 to-blue-600', icon: '⚛️' },
    { name: 'Chemistry', count: '32.1K', color: 'from-green-500 to-green-600', icon: '🧪' },
    { name: 'Biology', count: '38.7K', color: 'from-emerald-500 to-emerald-600', icon: '🧬' },
    { name: 'Mathematics', count: '28.4K', color: 'from-purple-500 to-purple-600', icon: '📐' },
    { name: 'Technology', count: '52.9K', color: 'from-orange-500 to-orange-600', icon: '💻' },
    { name: 'Engineering', count: '41.6K', color: 'from-red-500 to-red-600', icon: '🔧' }
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
      </div>
    </Layout>
  );
};

export default Explore;
