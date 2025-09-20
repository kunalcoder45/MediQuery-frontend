"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface ChatMessage {
  id: string;
  content: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  createdAt: string;
  metadata?: string;
}

export function SharedChatPage() {
  const { user, loading } = useAuthContext();
  const params = useParams();
  const router = useRouter();
  const [chatId, setChatId] = useState<string | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [sharedMessages, setSharedMessages] = useState<ChatMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string>("");

  // Get API base URL with better fallback handling
  const getApiBaseUrl = () => {
    if (process.env.NODE_ENV === 'production') {
      return process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || 'https://your-backend-api.com';
    }
    return process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || 'http://localhost:8000';
  };

  const CHAT_API_BASE_URL = getApiBaseUrl();

  useEffect(() => {
    const fetchSharedChat = async () => {
      if (!chatId) {
        setError("Invalid chat ID");
        setIsLoaded(true);
        return;
      }

      if (!CHAT_API_BASE_URL || CHAT_API_BASE_URL.includes('your-backend-api.com')) {
        setError("API configuration error. Please contact support.");
        setIsLoaded(true);
        return;
      }

      console.log("Attempting to fetch shared chat:", {
        chatId,
        apiUrl: CHAT_API_BASE_URL,
        fullUrl: `${CHAT_API_BASE_URL}/api/public/conversations/${chatId}`
      });

      try {
        const response = await fetch(
          `${CHAT_API_BASE_URL}/api/public/conversations/${chatId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log("API Response:", {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Chat not found or no longer available");
          }
          if (response.status === 403) {
            throw new Error("Chat is private or access denied");
          }
          throw new Error(`Failed to load chat (${response.status}: ${response.statusText})`);
        }

        const data = await response.json();
        console.log("Received data:", data);
        
        setSharedMessages(data.conversation?.messages || []);
        setChatTitle(data.conversation?.title || "Untitled Chat");
      } catch (err) {
        console.error("Error fetching shared chat:", err);
        setError(err instanceof Error ? err.message : "Failed to load chat");
      } finally {
        setIsLoaded(true);
      }
    };

    if (chatId && !loading) {
      fetchSharedChat();
    } else if (!loading) {
      setIsLoaded(true);
    }
  }, [chatId, loading, CHAT_API_BASE_URL]);

  useEffect(() => {
    console.log("Debug Info:", {
      chatId,
      params,
      CHAT_API_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      loading,
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'SSR'
    });

    if (params?.chatId && typeof params.chatId === "string") {
      setChatId(params.chatId);
    } else {
      console.error("Invalid chatId param:", params);
      setError("Invalid chat URL");
      setIsLoaded(true);
    }
  }, [params, CHAT_API_BASE_URL]);

  // Loading state
  if (loading || !isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600">Loading shared chat...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-6 space-y-2 flex flex-col items-center">
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="default"
          >
            Go to Home
          </Button>
        </div>
        
        {/* Debug Info in Development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-100 rounded text-xs text-gray-600 max-w-md">
            <p><strong>Debug Info:</strong></p>
            <p>Chat ID: {chatId}</p>
            <p>API URL: {CHAT_API_BASE_URL}</p>
            <p>Environment: {process.env.NODE_ENV}</p>
          </div>
        )}
      </div>
    );
  }

  // Success state
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