"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChatMessage {
  id: string;
  content: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  createdAt: string;
  metadata?: string;
}

interface SharedChatData {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export default function SharedChatPage() {
  const { user, loading } = useAuthContext();
  const params = useParams();

  const chatId = params?.chatId ? String(params.chatId) : null;

  const [isLoaded, setIsLoaded] = useState(false);
  const [sharedMessages, setSharedMessages] = useState<ChatMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string>("");
  
  // Fixed: Updated to use your production backend URL
  const CHAT_API_BASE_URL = process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || 'https://mediquery-chat-server.onrender.com';

  useEffect(() => {
    const fetchSharedChat = async () => {
      if (!chatId) {
        setError("Invalid chat ID");
        setIsLoaded(true);
        return;
      }

      try {
        console.log(`Fetching shared chat: ${chatId}`);
        console.log(`API URL: ${CHAT_API_BASE_URL}/api/public/conversations/${chatId}`);

        // Fixed: Corrected API URL format
        const response = await fetch(`${CHAT_API_BASE_URL}/api/public/conversations/${chatId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Chat not found or has been deleted");
          } else {
            throw new Error(`Failed to load chat (${response.status})`);
          }
        }

        const data = await response.json();
        console.log('Received data:', data);

        if (data.conversation && data.conversation.messages) {
          setSharedMessages(data.conversation.messages);
          setChatTitle(data.conversation.title);
          console.log(`Loaded ${data.conversation.messages.length} messages`);
        } else {
          throw new Error("Invalid chat data received");
        }

      } catch (error) {
        console.error('Error fetching shared chat:', error);
        setError(error instanceof Error ? error.message : "Failed to load shared chat");
      } finally {
        setIsLoaded(true);
      }
    };

    // Only fetch when we have a chatId and we're not still loading auth
    if (chatId && !loading) {
      fetchSharedChat();
    } else if (!loading) {
      setIsLoaded(true);
    }
  }, [chatId, loading, CHAT_API_BASE_URL]);

  // Show loading state
  if (loading || !isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-600">Loading shared chat...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <div className="mt-6 space-y-2">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try Again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="default"
          >
            Start New Chat
          </Button>
        </div>
      </div>
    );
  }

  // Show the chat interface with shared messages
  return (
    <div className="flex flex-col min-h-screen">
      {chatTitle && (
        <div className="bg-blue-50 border-b border-b-blue-200 p-2 text-center md:p-4">
          <h1 className="text-base font-semibold text-blue-900 md:text-lg">
            Shared Chat: {chatTitle}
          </h1>
          <p className="text-xs text-blue-600 md:text-sm">
            This conversation has been shared with you
          </p>
        </div>
      )}

      <div className="flex-1 flex justify-center p-0 w-full">
        <ChatInterface sharedMessages={sharedMessages} />
      </div>
    </div>
  );
}