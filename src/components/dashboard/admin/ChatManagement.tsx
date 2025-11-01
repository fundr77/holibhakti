import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, FileText, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface Document {
  id: string;
  sender_id: string;
  receiver_id: string;
  file_url: string;
  file_name: string;
  file_type: string | null;
  created_at: string;
}

const ChatManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      fetchDocuments();
      subscribeToMessages();
      subscribeToDocuments();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, phone_number")
      .neq("id", (await supabase.auth.getUser()).data.user?.id);
    
    if (data) setUsers(data);
  };

  const fetchMessages = async () => {
    if (!selectedUser || !currentUserId) return;
    
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .or(`sender_id.eq.${selectedUser.id},sender_id.eq.${currentUserId}`)
      .or(`receiver_id.eq.${selectedUser.id},receiver_id.eq.${currentUserId}`)
      .order("created_at", { ascending: true });
    
    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }
    
    // Filter to only show messages between admin and selected user
    const filteredMessages = data?.filter(msg => 
      (msg.sender_id === currentUserId && msg.receiver_id === selectedUser.id) ||
      (msg.sender_id === selectedUser.id && msg.receiver_id === currentUserId)
    ) || [];
    
    setMessages(filteredMessages);
    
    // Mark messages as read
    await supabase
      .from("chat_messages")
      .update({ is_read: true })
      .eq("sender_id", selectedUser.id)
      .eq("receiver_id", currentUserId)
      .eq("is_read", false);
  };

  const fetchDocuments = async () => {
    if (!selectedUser) return;
    
    const { data } = await supabase
      .from("chat_documents")
      .select("*")
      .or(`sender_id.eq.${selectedUser.id},receiver_id.eq.${selectedUser.id}`)
      .order("created_at", { ascending: false });
    
    if (data) setDocuments(data);
  };

  const subscribeToMessages = () => {
    if (!selectedUser) return;

    const channel = supabase
      .channel(`admin_chat_${selectedUser.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          console.log('Admin received message:', payload);
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const subscribeToDocuments = () => {
    if (!selectedUser) return;

    const channel = supabase
      .channel('chat_documents')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_documents',
        },
        () => fetchDocuments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !currentUserId) {
      toast({ title: "Cannot send empty message", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("chat_messages").insert({
      sender_id: currentUserId,
      receiver_id: selectedUser.id,
      message: newMessage.trim(),
    });

    if (error) {
      console.error("Error sending message:", error);
      toast({ title: "Error sending message", description: error.message, variant: "destructive" });
    } else {
      setNewMessage("");
      fetchMessages(); // Refresh messages after sending
    }
  };

  const handleShareDocument = async () => {
    if (!documentUrl.trim() || !documentName.trim() || !selectedUser) return;

    const { error } = await supabase.from("chat_documents").insert({
      sender_id: currentUserId,
      receiver_id: selectedUser.id,
      file_url: documentUrl.trim(),
      file_name: documentName.trim(),
      file_type: documentUrl.split('.').pop() || 'unknown',
    });

    if (error) {
      toast({ title: "Error sharing document", variant: "destructive" });
    } else {
      setDocumentUrl("");
      setDocumentName("");
      toast({ title: "Document shared successfully" });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
      {/* Users List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                  selectedUser?.id === user.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{user.full_name || "Unnamed User"}</div>
                    <div className="text-xs opacity-70">{user.phone_number}</div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="md:col-span-2 flex flex-col">
        <CardHeader>
          <CardTitle>
            {selectedUser ? `Chat with ${selectedUser.full_name || "User"}` : "Select a user to chat"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 mb-4 pr-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender_id === currentUserId
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="text-sm">{msg.message}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(msg.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="flex gap-2 mb-4">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="resize-none"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Documents Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    Shared Documents & Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Share Document */}
                  <div className="space-y-2">
                    <Input
                      placeholder="Document URL"
                      value={documentUrl}
                      onChange={(e) => setDocumentUrl(e.target.value)}
                    />
                    <Input
                      placeholder="Document Name"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                    />
                    <Button onClick={handleShareDocument} size="sm" className="w-full">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Share Document
                    </Button>
                  </div>

                  {/* Documents List */}
                  <ScrollArea className="h-[150px]">
                    <div className="space-y-2">
                      {documents.map((doc) => (
                        <div key={doc.id} className="p-2 bg-muted rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <div>
                              <div className="text-sm font-medium">{doc.file_name}</div>
                              <div className="text-xs opacity-70">
                                {new Date(doc.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(doc.file_url, '_blank')}
                          >
                            Open
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a user from the list to start chatting
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatManagement;