
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface SearchResult {
  id: string;
  username: string;
  display_name: string;
  field: string;
  verified: boolean;
  avatar_url?: string;
  bio?: string;
}

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      console.log('Searching for:', query);
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          display_name,
          field,
          verified,
          avatar_url,
          bio
        `)
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%,field.ilike.%${query}%`)
        .limit(10);

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      console.log('Search results:', data);
      setResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return {
    results,
    loading,
    searchUsers,
    clearResults
  };
};
