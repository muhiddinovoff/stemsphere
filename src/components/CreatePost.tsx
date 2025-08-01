
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Hash, Video, X } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const { createPost } = usePosts();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const categories = [
    'General', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Technology', 'Engineering'
  ];

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedMedia(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
  };

  const uploadMedia = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      const bucket = file.type.startsWith('video/') ? 'videos' : 'images';

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload media file",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);
    
    try {
      let mediaUrl = null;
      if (selectedMedia) {
        mediaUrl = await uploadMedia(selectedMedia);
        if (!mediaUrl) {
          setLoading(false);
          return;
        }
      }

      const hashtagArray = hashtags
        .split(' ')
        .filter(tag => tag.startsWith('#'))
        .map(tag => tag.slice(1));

      await createPost(content, category, hashtagArray, mediaUrl);
      
      setContent('');
      setHashtags('');
      setCategory('General');
      setSelectedMedia(null);
      setMediaPreview(null);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card mb-6 slide-up mirror-shine">
      <CardContent className="p-6">
        <div className="space-y-4">
          <Textarea
            placeholder={t('whatsHappening') || "What's happening in STEM?"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none border-0 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0 glass-button"
            maxLength={280}
          />
          
          {/* Media Preview */}
          {mediaPreview && (
            <div className="relative glass-card-secondary rounded-lg overflow-hidden">
              {selectedMedia?.type.startsWith('video/') ? (
                <video 
                  src={mediaPreview} 
                  controls 
                  className="w-full max-h-64 object-cover"
                />
              ) : (
                <img 
                  src={mediaPreview} 
                  alt="Preview" 
                  className="w-full max-h-64 object-cover"
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={removeMedia}
                className="absolute top-2 right-2 glass-button text-white hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-32 glass-button">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="hover:bg-glass-hover">
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
                  className="w-full pl-10 pr-3 py-2 glass-button text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-glass-border">
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaSelect}
                className="hidden"
                id="media-upload"
              />
              <label htmlFor="media-upload">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="glass-button text-primary hover:bg-primary/10 hover:scale-105 transition-all duration-200"
                  asChild
                >
                  <span className="cursor-pointer flex items-center space-x-1">
                    <Image className="h-4 w-4" />
                    <span className="hidden sm:inline">Photo</span>
                  </span>
                </Button>
              </label>
              
              <label htmlFor="media-upload">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="glass-button text-purple-500 hover:bg-purple-500/10 hover:scale-105 transition-all duration-200"
                  asChild
                >
                  <span className="cursor-pointer flex items-center space-x-1">
                    <Video className="h-4 w-4" />
                    <span className="hidden sm:inline">Video</span>
                  </span>
                </Button>
              </label>
              
              <span className="text-sm text-muted-foreground">
                {content.length}/280
              </span>
            </div>
            
            <Button 
              onClick={handleSubmit} 
              disabled={!content.trim() || loading}
              className="glass-button bg-primary/20 hover:bg-primary/30 text-primary hover:scale-105 transition-all duration-200 pulse-glow"
            >
              {loading ? 'Posting...' : t('post') || 'Post'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
