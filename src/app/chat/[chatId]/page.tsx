// // // src/app/chat/[chatId]/page.tsx

// // "use client";

// // import { useAuthContext } from "@/contexts/AuthContext";
// // import { useParams } from "next/navigation";
// // import { useEffect, useState } from "react";
// // import { ChatInterface } from "@/components/chat/ChatInterface";
// // import { Loader2 } from "lucide-react";

// // export default function SharedChatPage() {
// //   const { user, loading } = useAuthContext();
// //   const params = useParams();

// //   // Correctly handle the potential null value of params
// //   const chatId = params?.chatId ? String(params.chatId) : null;

// //   const [isLoaded, setIsLoaded] = useState(false);
// //   const [sharedMessages, setSharedMessages] = useState(null);

// //   useEffect(() => {
// //     // Check if we have a valid chatId before proceeding
// //     if (!loading && !user && chatId) {
// //       // Fetch public chat data if user is not logged in and chatId exists
// //       const fetchPublicChat = async () => {
// //         try {
// //           const res = await fetch(`/api/public/conversations/${chatId}`);
// //           if (!res.ok) {
// //             throw new Error("Failed to fetch public chat");
// //           }
// //           const data = await res.json();
// //           setSharedMessages(data.conversation.messages); 
// //           setIsLoaded(true);
// //         } catch (error) {
// //           console.error(error);
// //           setIsLoaded(true); // Still set to true to show an error message
// //         }
// //       };

// //       fetchPublicChat();
// //     } else if (!loading) {
// //       setIsLoaded(true);
// //     }
// //   }, [user, loading, chatId]);

// //   if (loading || !isLoaded) {
// //     return (
// //       <div className="flex flex-col items-center justify-center min-h-[80vh]">
// //         <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
// //         <p className="mt-4 text-gray-600">Loading chat...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex justify-center p-4">
// //       <ChatInterface sharedMessages={sharedMessages} />
// //     </div>
// //   );
// // }




// "use client";

// import { useAuthContext } from "@/contexts/AuthContext";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { ChatInterface } from "@/components/chat/ChatInterface";
// import { Loader2, AlertCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// interface ChatMessage {
//   id: string;
//   content: string;
//   role: 'USER' | 'ASSISTANT' | 'SYSTEM';
//   createdAt: string;
//   metadata?: string;
// }

// interface SharedChatData {
//   id: string;
//   title: string;
//   createdAt: string;
//   messages: ChatMessage[];
// }

// export default function SharedChatPage() {
//   const { user, loading } = useAuthContext();
//   const params = useParams();

//   const chatId = params?.chatId ? String(params.chatId) : null;

//   const [isLoaded, setIsLoaded] = useState(false);
//   const [sharedMessages, setSharedMessages] = useState<ChatMessage[] | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [chatTitle, setChatTitle] = useState<string>("");
//   const CHAT_API_BASE_URL = process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || 'http://localhost:8000/';

//   useEffect(() => {
//     const fetchSharedChat = async () => {
//       if (!chatId) {
//         setError("Invalid chat ID");
//         setIsLoaded(true);
//         return;
//       }

//       try {
//         console.log(`Fetching shared chat: ${chatId}`);

//         // Use full URL for API call
//         const response = await fetch(`${CHAT_API_BASE_URL}api/public/conversations/${chatId}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 404) {
//             throw new Error("Chat not found or has been deleted");
//           } else {
//             throw new Error(`Failed to load chat (${response.status})`);
//           }
//         }

//         const data = await response.json();

//         if (data.conversation && data.conversation.messages) {
//           setSharedMessages(data.conversation.messages);
//           setChatTitle(data.conversation.title);
//           console.log(`Loaded ${data.conversation.messages.length} messages`);
//         } else {
//           throw new Error("Invalid chat data received");
//         }

//       } catch (error) {
//         console.error('Error fetching shared chat:', error);
//         setError(error instanceof Error ? error.message : "Failed to load shared chat");
//       } finally {
//         setIsLoaded(true);
//       }
//     };

//     // Only fetch when we have a chatId and we're not still loading auth
//     if (chatId && !loading) {
//       fetchSharedChat();
//     } else if (!loading) {
//       setIsLoaded(true);
//     }
//   }, [chatId, loading]);

//   // Show loading state
//   if (loading || !isLoaded) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[80vh]">
//         <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
//         <p className="mt-4 text-gray-600">Loading shared chat...</p>
//       </div>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
//         <Alert className="max-w-md">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>
//             {error}
//           </AlertDescription>
//         </Alert>
//         <div className="mt-6 space-y-2">
//           <Button
//             onClick={() => window.location.reload()}
//             variant="outline"
//           >
//             Try Again
//           </Button>
//           <Button
//             onClick={() => window.location.href = '/'}
//             variant="default"
//           >
//             Start New Chat
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // Show the chat interface with shared messages
//   return (
//     <div className="flex flex-col min-h-screen">
//       {chatTitle && (
//         <div className="bg-blue-50 border-b border-blue-200 p-2 text-center md:p-4">
//           <h1 className="text-base font-semibold text-blue-900 md:text-lg">
//             Shared Chat: {chatTitle}
//           </h1>
//           <p className="text-xs text-blue-600 md:text-sm">
//             This conversation has been shared with you
//           </p>
//         </div>
//       )}

//       <div className="flex-1 flex justify-center p-0 w-full">
//         <ChatInterface sharedMessages={sharedMessages} />
//       </div>
//     </div>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NextPage } from "next";

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

const CHAT_API_BASE_URL = process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || 'http://localhost:8000/';

const SharedChatPage: NextPage = () => {
  // useParams hook ko hata kar sidha window.location se chatId le rahe hain
  // taki "next/navigation" import error na aaye.
  const getChatId = () => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/');
      return pathSegments[pathSegments.length - 1];
    }
    return null;
  };
  const chatId = getChatId();

  const [isLoading, setIsLoading] = useState(true);
  const [sharedMessages, setSharedMessages] = useState<ChatMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string>("");

  useEffect(() => {
    // Sirf tabhi aage badhe jab ek valid chatId uplabdh ho.
    if (!chatId) {
      setIsLoading(false);
      setError("Invalid chat ID. Kripya URL check karein.");
      return;
    }

    const fetchSharedChat = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`Fetching shared chat: ${chatId}`);

        // API call ke liye pura URL istemal karein.
        const response = await fetch(`${CHAT_API_BASE_URL}api/public/conversations/${chatId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Chat mili nahi ya delete kar di gayi hai.");
          }
          throw new Error(`Chat load karne mein fail (${response.status})`);
        }

        const data = await response.json();

        if (data.conversation && data.conversation.messages) {
          setSharedMessages(data.conversation.messages);
          setChatTitle(data.conversation.title);
          console.log(`Loaded ${data.conversation.messages.length} messages.`);
        } else {
          throw new Error("Invalid chat data mili.");
        }

      } catch (err) {
        console.error('Shared chat fetch karne mein error:', err);
        setError(err instanceof Error ? err.message : "Shared chat load karne mein fail.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedChat();

  }, [chatId]);

  // Loading state dikhayen.
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-600">Chat load ho rahi hai...</p>
      </div>
    );
  }

  // Error state dikhayen.
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
            Phir se koshish karein
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="default"
          >
            Nayi chat shuru karein
          </Button>
        </div>
      </div>
    );
  }

  // Shared messages ke sath chat interface dikhayen.
  return (
    <div className="flex flex-col min-h-screen">
      {chatTitle && (
        <div className="bg-blue-50 border-b border-blue-200 p-2 text-center md:p-4">
          <h1 className="text-base font-semibold text-blue-900 md:text-lg">
            Shared Chat: {chatTitle}
          </h1>
          <p className="text-xs text-blue-600 md:text-sm">
            Yeh conversation aapke sath share ki gayi hai
          </p>
        </div>
      )}

      <div className="flex-1 flex justify-center p-0 w-full">
        <ChatInterface sharedMessages={sharedMessages} />
      </div>
    </div>
  );
}

export default SharedChatPage;
