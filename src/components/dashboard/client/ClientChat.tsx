import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  file_url: string;
  file_name: string;
  file_type: string | null;
  created_at: string;
}

const ClientChat = ({ userId }: { userId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [adminId, setAdminId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminId();
  }, []);

  useEffect(() => {
    if (adminId) {
      fetchMessages();
      fetchDocuments();
      subscribeToMessages();
      subscribeToDocuments();
    }
  }, [adminId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAdminId = async () => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching admin ID:", error);
      toast({ title: "Unable to connect to admin", variant: "destructive" });
      return;
    }

    if (data) setAdminId(data.user_id);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .or(`sender_id.eq.${userId},sender_id.eq.${adminId}`)
      .or(`receiver_id.eq.${userId},receiver_id.eq.${adminId}`)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    // Filter to only show messages between user and admin
    const filteredMessages =
      data?.filter(
        (msg) =>
          (msg.sender_id === userId && msg.receiver_id === adminId) ||
          (msg.sender_id === adminId && msg.receiver_id === userId),
      ) || [];

    setMessages(filteredMessages);

    // Mark admin messages as read
    await supabase
      .from("chat_messages")
      .update({ is_read: true })
      .eq("sender_id", adminId)
      .eq("receiver_id", userId)
      .eq("is_read", false);
  };

  const fetchDocuments = async () => {
    const { data } = await supabase
      .from("chat_documents")
      .select("*")
      .or(`sender_id.eq.${adminId},receiver_id.eq.${adminId}`)
      .order("created_at", { ascending: false });

    if (data) setDocuments(data);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`client_chat_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          console.log("Message received:", payload);
          fetchMessages();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const subscribeToDocuments = () => {
    const channel = supabase
      .channel("client_chat_documents")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_documents",
        },
        () => fetchDocuments(),
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
    if (!newMessage.trim() || !adminId) {
      toast({ title: "Cannot send empty message: ", description: newMessage, variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("chat_messages").insert({
      sender_id: userId,
      receiver_id: adminId,
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chat with Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] mb-4 pr-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender_id === userId ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="text-sm">{msg.message}</div>
                    <div className="text-xs opacity-70 mt-1">{new Date(msg.created_at).toLocaleString()}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="flex gap-2">
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
        </CardContent>
      </Card>

      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Session Notes & Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 bg-muted rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">{doc.file_name}</div>
                        <div className="text-xs opacity-70">{new Date(doc.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => window.open(doc.file_url, "_blank")}>
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientChat;
