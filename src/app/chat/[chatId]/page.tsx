// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'picsum.photos',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },
//   async rewrites() {
//     return [
//       {
//         source: '/api/web3forms/:path*',
//         destination: 'https://api.web3forms.com/:path*',
//       },
//       // Agar chat API ko proxy karna hai to ye uncomment kar sakte ho:
//       // {
//       //   source: '/api/chat/:path*',
//       //   destination: 'https://mediquery-chat-server.onrender.com/api/chat/:path*',
//       // },
//     ];
//   },
// };

// export default nextConfig;



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

export default function SharedChatPage() {
  const { user, loading } = useAuthContext();
  const params = useParams();
  const chatId = params?.chatId ? String(params.chatId) : null;

  const [isLoaded, setIsLoaded] = useState(false);
  const [sharedMessages, setSharedMessages] = useState<ChatMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string>("");

  const CHAT_API_BASE_URL =
    process.env.NEXT_PUBLIC_CHAT_API_BASE_URL ||
    "https://mediquery-chat-server.onrender.com";

  useEffect(() => {
    const fetchSharedChat = async () => {
      if (!chatId) {
        setError("Invalid chat ID");
        setIsLoaded(true);
        return;
      }

      try {
        const response = await fetch(
          `${CHAT_API_BASE_URL}/api/public/conversations/${chatId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to load chat (${response.status})`);
        }

        const data = await response.json();
        setSharedMessages(data.conversation?.messages || []);
        setChatTitle(data.conversation?.title || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chat");
      } finally {
        setIsLoaded(true);
      }
    };

    if (chatId && !loading) fetchSharedChat();
    else if (!loading) setIsLoaded(true);
  }, [chatId, loading, CHAT_API_BASE_URL]);

  if (loading || !isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-600">Loading shared chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-6 space-y-2">
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
          <Button onClick={() => (window.location.href = "/")} variant="default">
            Start New Chat
          </Button>
        </div>
      </div>
    );
  }

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
