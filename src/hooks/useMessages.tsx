
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  receiver: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  other_user_id: string;
  other_user: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  last_message: Message;
  unread_count: number;
}

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConversations = async () => {
    if (!user) return;

    try {
      // Get all messages for the current user
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, content, read, created_at')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      if (!messagesData || messagesData.length === 0) {
        setConversations([]);
        return;
      }

      // Get unique user IDs (excluding current user)
      const userIds = [...new Set(
        messagesData
          .map(msg => msg.sender_id === user.id ? msg.receiver_id : msg.sender_id)
          .filter(id => id !== user.id)
      )];

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create profile lookup map
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Group messages by conversation
      const conversationMap = new Map<string, Conversation>();
      
      messagesData.forEach(message => {
        const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        const otherUser = profilesMap.get(otherUserId);
        
        if (!otherUser) return;
        
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            other_user_id: otherUserId,
            other_user: {
              username: otherUser.username,
              display_name: otherUser.display_name,
              avatar_url: otherUser.avatar_url
            },
            last_message: {
              ...message,
              sender: message.sender_id === user.id ? 
                { username: 'You', display_name: 'You' } : 
                { username: otherUser.username, display_name: otherUser.display_name, avatar_url: otherUser.avatar_url },
              receiver: message.receiver_id === user.id ? 
                { username: 'You', display_name: 'You' } : 
                { username: otherUser.username, display_name: otherUser.display_name, avatar_url: otherUser.avatar_url }
            },
            unread_count: 0
          });
        }
        
        // Count unread messages (only those received by current user)
        if (message.receiver_id === user.id && !message.read) {
          const conv = conversationMap.get(otherUserId)!;
          conv.unread_count++;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    if (!user) return;

    try {
      // Get messages between current user and other user
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, content, read, created_at')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      if (!messagesData) {
        setMessages([]);
        return;
      }

      // Get profiles for both users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', [user.id, otherUserId]);

      if (profilesError) throw profilesError;

      // Create profile lookup map
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Format messages with profile data
      const formattedMessages = messagesData.map(message => ({
        ...message,
        sender: profilesMap.get(message.sender_id) || { username: 'Unknown', display_name: 'Unknown' },
        receiver: profilesMap.get(message.receiver_id) || { username: 'Unknown', display_name: 'Unknown' }
      }));

      setMessages(formattedMessages);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', otherUserId)
        .eq('receiver_id', user.id)
        .eq('read', false);

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (receiverId: string, content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: content.trim()
        });

      if (error) throw error;

      // Refresh conversations and messages
      await fetchConversations();
      await fetchMessages(receiverId);

      toast({
        title: "Success",
        description: "Message sent successfully!"
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  return {
    conversations,
    messages,
    loading,
    fetchMessages,
    sendMessage,
    refreshConversations: fetchConversations
  };
};
