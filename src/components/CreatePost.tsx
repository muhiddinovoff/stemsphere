
import React, { useState } from 'react';
import { Image, Hash, MapPin, Smile, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = [
    'Physics', 'Chemistry', 'Biology', 'Mathematics', 
    'Technology', 'Engineering', 'Research', 'General'
  ];

  const handleSubmit = () => {
    if (content.trim()) {
      console.log('Posting:', { content, category, image: selectedImage });
      setContent('');
      setCategory('');
      setSelectedImage(null);
      setIsExpanded(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-card p-6 mb-6 fade-in">
      <div className="flex items-start space-x-4">
        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center shrink-0">
          <span className="text-white font-semibold text-lg">U</span>
        </div>

        <div className="flex-1">
          <Textarea
            placeholder="Share your STEM insights, discoveries, or questions..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (!isExpanded) setIsExpanded(true);
            }}
            className="border-0 bg-transparent resize-none text-lg placeholder:text-muted-foreground focus:ring-0 p-0"
            rows={isExpanded ? 4 : 2}
            maxLength={500}
          />

          {/* Character Counter */}
          {isExpanded && (
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs ${content.length > 450 ? 'text-red-500' : 'text-muted-foreground'}`}>
                {content.length}/500
              </span>
            </div>
          )}

          {/* Category Selection */}
          {isExpanded && (
            <div className="mt-4">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-48 glass-card border-primary/30">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Image Preview */}
          {selectedImage && (
            <div className="mt-4 relative">
              <img 
                src={selectedImage} 
                alt="Upload preview" 
                className="w-full max-w-md h-48 object-cover rounded-lg glass-card"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Action Bar */}
          {isExpanded && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center space-x-3">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary" asChild>
                    <span>
                      <Image className="h-4 w-4" />
                    </span>
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                  <Hash className="h-4 w-4" />
                </Button>
                
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                  <MapPin className="h-4 w-4" />
                </Button>
                
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || !category}
                className="glow-button px-6"
              >
                <Send className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
