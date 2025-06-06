import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { mockUsers } from "@/lib/mockData";
import { Message, Chat as ChatType, User } from "@/types/marketplace";

const Chat = () => {
  const user = getCurrentUser();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock chat data
  const mockChats: ChatType[] = [
    {
      id: "1",
      participants: [user!, mockUsers[1]],
      messages: [
        {
          id: "1",
          senderId: mockUsers[1].id,
          sender: mockUsers[1],
          recipientId: user?.id!,
          recipient: user!,
          content:
            "Hello! I saw your product listing for tomatoes. Are they still available?",
          type: "text",
          timestamp: new Date("2024-01-25T10:30:00"),
          read: true,
        },
        {
          id: "2",
          senderId: user?.id!,
          sender: user!,
          recipientId: mockUsers[1].id,
          recipient: mockUsers[1],
          content:
            "Yes, they are! Fresh from the farm. How many kilograms would you like?",
          type: "text",
          timestamp: new Date("2024-01-25T10:32:00"),
          read: true,
        },
        {
          id: "3",
          senderId: mockUsers[1].id,
          sender: mockUsers[1],
          recipientId: user?.id!,
          recipient: user!,
          content: "I would like 5kg please. What about delivery to Avondale?",
          type: "text",
          timestamp: new Date("2024-01-25T10:35:00"),
          read: true,
        },
        {
          id: "4",
          senderId: user?.id!,
          sender: user!,
          recipientId: mockUsers[1].id,
          recipient: mockUsers[1],
          content:
            "Perfect! Delivery to Avondale is $2 extra. Total would be $19.50. Can deliver today afternoon.",
          type: "text",
          timestamp: new Date("2024-01-25T10:40:00"),
          read: false,
        },
      ],
      lastMessage: {
        id: "4",
        senderId: user?.id!,
        sender: user!,
        recipientId: mockUsers[1].id,
        recipient: mockUsers[1],
        content:
          "Perfect! Delivery to Avondale is $2 extra. Total would be $19.50. Can deliver today afternoon.",
        type: "text",
        timestamp: new Date("2024-01-25T10:40:00"),
        read: false,
      },
      updatedAt: new Date("2024-01-25T10:40:00"),
    },
    {
      id: "2",
      participants: [user!, mockUsers[2]],
      messages: [
        {
          id: "5",
          senderId: mockUsers[2].id,
          sender: mockUsers[2],
          recipientId: user?.id!,
          recipient: user!,
          content:
            "Hi! I would like to book a hair appointment for this weekend. Are you available?",
          type: "text",
          timestamp: new Date("2024-01-24T14:20:00"),
          read: true,
        },
        {
          id: "6",
          senderId: user?.id!,
          sender: user!,
          recipientId: mockUsers[2].id,
          recipient: mockUsers[2],
          content:
            "Hello! Yes, I have availability on Saturday. What time works best for you?",
          type: "text",
          timestamp: new Date("2024-01-24T14:45:00"),
          read: true,
        },
      ],
      lastMessage: {
        id: "6",
        senderId: user?.id!,
        sender: user!,
        recipientId: mockUsers[2].id,
        recipient: mockUsers[2],
        content:
          "Hello! Yes, I have availability on Saturday. What time works best for you?",
        type: "text",
        timestamp: new Date("2024-01-24T14:45:00"),
        read: true,
      },
      updatedAt: new Date("2024-01-24T14:45:00"),
    },
  ];

  const [chats, setChats] = useState(mockChats);

  const currentChat = chats.find((chat) => chat.id === selectedChat);
  const otherParticipant = currentChat?.participants.find(
    (p) => p.id !== user?.id,
  );

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedChat || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      sender: user,
      recipientId: otherParticipant?.id!,
      recipient: otherParticipant!,
      content: messageInput.trim(),
      type: "text",
      timestamp: new Date(),
      read: false,
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: newMessage,
              updatedAt: new Date(),
            }
          : chat,
      ),
    );

    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
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

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    const otherUser = chat.participants.find((p) => p.id !== user?.id);
    return (
      otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

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
                {filteredChats.length > 0 ? (
                  <div className="space-y-1">
                    {filteredChats.map((chat) => {
                      const otherUser = chat.participants.find(
                        (p) => p.id !== user.id,
                      );
                      const isSelected = selectedChat === chat.id;
                      const hasUnread =
                        chat.lastMessage &&
                        !chat.lastMessage.read &&
                        chat.lastMessage.senderId !== user.id;

                      return (
                        <div
                          key={chat.id}
                          className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                            isSelected ? "bg-muted" : ""
                          }`}
                          onClick={() => setSelectedChat(chat.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={otherUser?.avatar}
                                alt={otherUser?.name}
                              />
                              <AvatarFallback>
                                {otherUser?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium truncate">
                                  {otherUser?.name}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(chat.updatedAt)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground truncate">
                                  {chat.lastMessage?.content}
                                </p>
                                {hasUnread && (
                                  <Badge className="h-2 w-2 p-0 bg-primary rounded-full" />
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
            {selectedChat && currentChat ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={otherParticipant?.avatar}
                          alt={otherParticipant?.name}
                        />
                        <AvatarFallback>
                          {otherParticipant?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {otherParticipant?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {otherParticipant?.role} •{" "}
                          {otherParticipant?.location.area}
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
                      {currentChat.messages.map((message, index) => {
                        const isOwn = message.senderId === user.id;
                        const showDate =
                          index === 0 ||
                          formatDate(message.timestamp) !==
                            formatDate(
                              currentChat.messages[index - 1].timestamp,
                            );

                        return (
                          <div key={message.id}>
                            {showDate && (
                              <div className="text-center my-4">
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                  {formatDate(message.timestamp)}
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
                                      src={message.sender.avatar}
                                      alt={message.sender.name}
                                    />
                                    <AvatarFallback>
                                      {message.sender.name.charAt(0)}
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
                                        src={message.imageUrl}
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
                                  {formatTime(message.timestamp)}
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
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!messageInput.trim()}
                    >
                      <Send className="h-4 w-4" />
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
