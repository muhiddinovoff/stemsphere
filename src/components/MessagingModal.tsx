
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, ArrowLeft } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUserId?: string;
}

const MessagingModal = ({ isOpen, onClose, selectedUserId }: MessagingModalProps) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(selectedUserId || null);
  const [messageText, setMessageText] = useState('');
  const { conversations, messages, loading, fetchMessages, sendMessage } = useMessages();
  const { user } = useAuth();

  useEffect(() => {
    if (selectedUserId) {
      setCurrentUserId(selectedUserId);
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentUserId) return;
    
    await sendMessage(currentUserId, messageText);
    setMessageText('');
  };

  const handleSelectConversation = (userId: string) => {
    setCurrentUserId(userId);
    fetchMessages(userId);
  };

  const currentConversation = conversations.find(conv => conv.other_user_id === currentUserId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] p-0">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className={`${currentUserId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 border-r`}>
            <DialogHeader className="p-4 border-b">
              <DialogTitle>Messages</DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="flex-1">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : conversations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No conversations yet</p>
              ) : (
                <div className="space-y-0">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.other_user_id}
                      onClick={() => handleSelectConversation(conversation.other_user_id)}
                      className="flex items-center space-x-3 p-4 hover:bg-accent cursor-pointer border-b"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center">
                        {conversation.other_user.avatar_url ? (
                          <img 
                            src={conversation.other_user.avatar_url} 
                            alt={conversation.other_user.display_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-semibold text-sm">
                            {conversation.other_user.display_name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">{conversation.other_user.display_name}</h4>
                          {conversation.unread_count > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                              {conversation.unread_count}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className={`${currentUserId ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
            {currentUserId ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentUserId(null)}
                    className="md:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  {currentConversation && (
                    <>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center">
                        {currentConversation.other_user.avatar_url ? (
                          <img 
                            src={currentConversation.other_user.avatar_url} 
                            alt={currentConversation.other_user.display_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-semibold text-xs">
                            {currentConversation.other_user.display_name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{currentConversation.other_user.display_name}</h3>
                        <p className="text-sm text-muted-foreground">@{currentConversation.other_user.username}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                            message.sender_id === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender_id === user?.id 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagingModal;
