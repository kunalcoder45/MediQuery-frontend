// src/app/chat/[chatId]/page.tsx

"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Loader2 } from "lucide-react";

export default function SharedChatPage() {
  const { user, loading } = useAuthContext();
  const params = useParams();

  // Correctly handle the potential null value of params
  const chatId = params?.chatId ? String(params.chatId) : null;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [sharedMessages, setSharedMessages] = useState(null);

  useEffect(() => {
    // Check if we have a valid chatId before proceeding
    if (!loading && !user && chatId) {
      // Fetch public chat data if user is not logged in and chatId exists
      const fetchPublicChat = async () => {
        try {
          const res = await fetch(`/api/public/conversations/${chatId}`);
          if (!res.ok) {
            throw new Error("Failed to fetch public chat");
          }
          const data = await res.json();
          setSharedMessages(data.conversation.messages); 
          setIsLoaded(true);
        } catch (error) {
          console.error(error);
          setIsLoaded(true); // Still set to true to show an error message
        }
      };

      fetchPublicChat();
    } else if (!loading) {
      setIsLoaded(true);
    }
  }, [user, loading, chatId]);

  if (loading || !isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-600">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      <ChatInterface sharedMessages={sharedMessages} />
    </div>
  );
}