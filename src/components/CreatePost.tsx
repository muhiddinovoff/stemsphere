
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Hash } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useTranslation } from '@/hooks/useTranslation';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);
  const { createPost } = usePosts();
  const { t } = useTranslation();

  const categories = [
    'General', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Technology', 'Engineering'
  ];

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);
    
    const hashtagArray = hashtags
      .split(' ')
      .filter(tag => tag.startsWith('#'))
      .map(tag => tag.slice(1));

    await createPost(content, category, hashtagArray);
    
    setContent('');
    setHashtags('');
    setCategory('General');
    setLoading(false);
  };

  return (
    <Card className="glass-card mb-6 slide-up">
      <CardContent className="p-6">
        <div className="space-y-4">
          <Textarea
            placeholder={t('whatsHappening')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none border-0 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0"
            maxLength={280}
          />
          
          <div className="flex flex-wrap gap-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Add hashtags (e.g., #science #research)"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-transparent border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                <Image className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {content.length}/280
              </span>
            </div>
            
            <Button 
              onClick={handleSubmit} 
              disabled={!content.trim() || loading}
              className="glow-button"
            >
              {loading ? 'Posting...' : t('post')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
