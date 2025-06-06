import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Search,
  MessageSquare,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  subscribeToMessages,
} from "@/lib/database";
import { hasValidSupabaseConfig } from "@/lib/supabase";
import { mockUsers } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const Chat = () => {
  const user = getCurrentUser();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const hasSupabase = hasValidSupabaseConfig();

  useEffect(() => {
    if (user) {
      loadConversations();

      if (hasSupabase) {
        // Set up real-time subscription for messages
        const messageSubscription = subscribeToMessages(user.id, (payload) => {
          console.log("New message:", payload);

          if (payload.eventType === "INSERT") {
            const newMessage = payload.new;

            // Update messages if it's for the current conversation
            if (
              selectedChat &&
              (newMessage.sender_id === selectedChat ||
                newMessage.recipient_id === selectedChat)
            ) {
              setMessages((prev) => [...prev, newMessage]);
            }

            // Refresh conversations to update last message and unread count
            loadConversations();
          }
        });

        return () => {
          messageSubscription.unsubscribe();
        };
      }
    }
  }, [user, selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      if (hasSupabase) {
        const data = await getConversations(user.id);
        setConversations(data || []);
      } else {
        // Mock conversations for demo
        const mockConversations = [
          {
            id: mockUsers[1].id,
            otherUser: mockUsers[1],
            lastMessage: {
              content:
                "Hello! I saw your product listing for tomatoes. Are they still available?",
              created_at: new Date().toISOString(),
              sender_id: mockUsers[1].id,
              read: true,
            },
            unreadCount: 0,
          },
          {
            id: mockUsers[2].id,
            otherUser: mockUsers[2],
            lastMessage: {
              content:
                "Hi! I would like to book a hair appointment for this weekend.",
              created_at: new Date(Date.now() - 86400000).toISOString(),
              sender_id: mockUsers[2].id,
              read: false,
            },
            unreadCount: 1,
          },
        ];
        setConversations(mockConversations);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    if (!user) return;

    try {
      if (hasSupabase) {
        const data = await getMessages(user.id, otherUserId);
        setMessages(data || []);

        // Mark messages as read
        const unreadMessages =
          data
            ?.filter((msg) => msg.recipient_id === user.id && !msg.read)
            .map((msg) => msg.id) || [];

        if (unreadMessages.length > 0) {
          await markMessagesAsRead(unreadMessages);
        }
      } else {
        // Mock messages for demo
        const mockMessages = [
          {
            id: "1",
            sender_id: otherUserId,
            recipient_id: user.id,
            content: "Hello! How are you?",
            type: "text",
            created_at: new Date(Date.now() - 3600000).toISOString(),
            sender: mockUsers.find((u) => u.id === otherUserId),
            recipient: user,
            read: true,
          },
          {
            id: "2",
            sender_id: user.id,
            recipient_id: otherUserId,
            content: "Hi! I'm doing well, thank you!",
            type: "text",
            created_at: new Date(Date.now() - 1800000).toISOString(),
            sender: user,
            recipient: mockUsers.find((u) => u.id === otherUserId),
            read: true,
          },
        ];
        setMessages(mockMessages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || !user || isSending) return;

    setIsSending(true);
    const tempMessage = {
      id: "temp-" + Date.now(),
      sender_id: user.id,
      recipient_id: selectedChat,
      content: messageInput.trim(),
      type: "text" as const,
      created_at: new Date().toISOString(),
      sender: user,
      recipient: conversations.find((c) => c.id === selectedChat)?.otherUser,
      read: false,
    };

    // Optimistically add message to UI
    setMessages((prev) => [...prev, tempMessage]);
    setMessageInput("");

    try {
      if (hasSupabase) {
        await sendMessage({
          sender_id: user.id,
          recipient_id: selectedChat,
          content: tempMessage.content,
          type: "text",
        });
      } else {
        // For demo, just keep the optimistic update
        console.log("Demo: Message sent", tempMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery) return true;
    return (
      conversation.otherUser?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage?.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  const currentConversation = conversations.find((c) => c.id === selectedChat);
  const otherUser = currentConversation?.otherUser;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/login">Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {!hasSupabase && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Real-time messaging requires Supabase
              setup. Set up credentials in .env file for live chat.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* Chat List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Loading conversations...
                    </p>
                  </div>
                ) : filteredConversations.length > 0 ? (
                  <div className="space-y-1">
                    {filteredConversations.map((conversation) => {
                      const isSelected = selectedChat === conversation.id;
                      const hasUnread = conversation.unreadCount > 0;

                      return (
                        <div
                          key={conversation.id}
                          className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                            isSelected ? "bg-muted" : ""
                          }`}
                          onClick={() => setSelectedChat(conversation.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={conversation.otherUser?.avatar}
                                alt={conversation.otherUser?.name}
                              />
                              <AvatarFallback>
                                {conversation.otherUser?.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium truncate">
                                  {conversation.otherUser?.name}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(
                                    conversation.lastMessage?.created_at || "",
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground truncate">
                                  {conversation.lastMessage?.content}
                                </p>
                                {hasUnread && (
                                  <Badge className="h-5 w-5 p-0 bg-primary rounded-full text-xs">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No conversations found
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-3">
            {selectedChat && otherUser ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={otherUser.avatar}
                          alt={otherUser.name}
                        />
                        <AvatarFallback>
                          {otherUser.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{otherUser.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {otherUser.role} •{" "}
                          {otherUser.area || otherUser.location?.area}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-25rem)] p-4">
                    <div className="space-y-4">
                      {messages.map((message, index) => {
                        const isOwn = message.sender_id === user.id;
                        const showDate =
                          index === 0 ||
                          formatDate(message.created_at) !==
                            formatDate(messages[index - 1].created_at);

                        return (
                          <div key={message.id}>
                            {showDate && (
                              <div className="text-center my-4">
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                  {formatDate(message.created_at)}
                                </span>
                              </div>
                            )}
                            <div
                              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md ${isOwn ? "order-2" : "order-1"}`}
                              >
                                {!isOwn && (
                                  <Avatar className="h-6 w-6 mb-1">
                                    <AvatarImage
                                      src={message.sender?.avatar}
                                      alt={message.sender?.name}
                                    />
                                    <AvatarFallback>
                                      {message.sender?.name?.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div
                                  className={`px-4 py-2 rounded-lg ${
                                    isOwn
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  }`}
                                >
                                  {message.type === "image" ? (
                                    <div className="space-y-2">
                                      <img
                                        src={message.image_url}
                                        alt="Shared image"
                                        className="rounded max-w-full h-auto"
                                      />
                                      {message.content && (
                                        <p className="text-sm">
                                          {message.content}
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-sm">{message.content}</p>
                                  )}
                                </div>
                                <p
                                  className={`text-xs text-muted-foreground mt-1 ${
                                    isOwn ? "text-right" : "text-left"
                                  }`}
                                >
                                  {formatTime(message.created_at)}
                                  {message.id.startsWith("temp-") && (
                                    <span className="ml-1">Sending...</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" disabled={isSending}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" disabled={isSending}>
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                      disabled={isSending}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || isSending}
                    >
                      {isSending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center h-full">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Select a conversation
                </h3>
                <p className="text-muted-foreground text-center">
                  Choose a conversation from the list to start messaging
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
