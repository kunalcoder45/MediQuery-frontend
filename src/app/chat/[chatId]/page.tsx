// // // "use client";

// // // export const dynamic = "force-dynamic";
// // // export const fetchCache = "force-no-store";
// // // export const dynamicParams = true;

// // // import { useAuthContext } from "@/contexts/AuthContext";
// // // import { useParams } from "next/navigation";
// // // import { useEffect, useState } from "react";
// // // import { ChatInterface } from "@/components/chat/ChatInterface";
// // // import { Loader2, AlertCircle } from "lucide-react";
// // // import { Button } from "@/components/ui/button";
// // // import { Alert, AlertDescription } from "@/components/ui/alert";
// // // import { useRouter } from "next/navigation";

// // // interface ChatMessage {
// // //   id: string;
// // //   content: string;
// // //   role: "USER" | "ASSISTANT" | "SYSTEM";
// // //   createdAt: string;
// // //   metadata?: string;
// // // }

// // // export default function SharedChatPage() {
// // //   const { user, loading } = useAuthContext();
// // //   const params = useParams();
// // //   const router = useRouter();
// // //   const [chatId, setChatId] = useState<string | null>(null);

// // //   const [isLoaded, setIsLoaded] = useState(false);
// // //   const [sharedMessages, setSharedMessages] = useState<ChatMessage[] | null>(null);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [chatTitle, setChatTitle] = useState<string>("");

// // //   // Fixed API base URL - removed /api suffix
// // //   const CHAT_API_BASE_URL = process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || "http://localhost:8000";

// // //   useEffect(() => {
// // //     const fetchSharedChat = async () => {
// // //       if (!chatId) {
// // //         setError("Invalid chat ID");
// // //         setIsLoaded(true);
// // //         return;
// // //       }

// // //       if (!CHAT_API_BASE_URL) {
// // //         setError("API configuration error. Please try again later.");
// // //         setIsLoaded(true);
// // //         return;
// // //       }

// // //       try {
// // //         // Fixed API endpoint - added /api prefix
// // //         const response = await fetch(
// // //           `${CHAT_API_BASE_URL}/api/public/conversations/${chatId}`
// // //         );

// // //         if (!response.ok) {
// // //           if (response.status === 404) {
// // //             throw new Error("Chat not found or no longer available");
// // //           }
// // //           throw new Error(`Failed to load chat (${response.status})`);
// // //         }

// // //         const data = await response.json();
// // //         setSharedMessages(data.conversation?.messages || []);
// // //         setChatTitle(data.conversation?.title || "Untitled Chat");
// // //       } catch (err) {
// // //         console.error("Error fetching shared chat:", err);
// // //         setError(err instanceof Error ? err.message : "Failed to load chat");
// // //       } finally {
// // //         setIsLoaded(true);
// // //       }
// // //     };

// // //     if (chatId && !loading) {
// // //       fetchSharedChat();
// // //     } else if (!loading) {
// // //       setIsLoaded(true);
// // //     }
// // //   }, [chatId, loading, CHAT_API_BASE_URL]);

// // //   useEffect(() => {
// // //     console.log("Debug Info:", {
// // //       chatId,
// // //       params,
// // //       CHAT_API_BASE_URL: process.env.NEXT_PUBLIC_CHAT_API_BASE_URL,
// // //       loading
// // //     });

// // //     if (params?.chatId && typeof params.chatId === "string") {
// // //       setChatId(params.chatId);
// // //     } else {
// // //       console.error("Invalid chatId param:", params);
// // //       setError("Invalid chat URL");
// // //       setIsLoaded(true);
// // //     }
// // //   }, [params]);

// // //   useEffect(() => {
// // //     if (params?.chatId && typeof params.chatId === "string") {
// // //       setChatId(params.chatId);
// // //     } else {
// // //       console.error("Invalid chatId param:", params);
// // //       setError("Invalid chat URL");
// // //       setIsLoaded(true);
// // //     }
// // //   }, [params]);

// // //   // Loading state
// // //   if (loading || !isLoaded) {
// // //     return (
// // //       <div className="flex flex-col items-center justify-center min-h-[80vh]">
// // //         <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
// // //         <p className="mt-4 text-gray-600">Loading shared chat...</p>
// // //       </div>
// // //     );
// // //   }

// // //   // Error state
// // //   if (error) {
// // //     return (
// // //       <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
// // //         <Alert className="max-w-md">
// // //           <AlertCircle className="h-4 w-4" />
// // //           <AlertDescription>{error}</AlertDescription>
// // //         </Alert>
// // //         <div className="mt-6 space-y-2 flex flex-col items-center">
// // //           <Button onClick={() => window.location.reload()} variant="outline">
// // //             Try Again
// // //           </Button>
// // //           <Button
// // //             onClick={() => router.push("/")}
// // //             variant="default"
// // //           >
// // //             Go to Home
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // Success state
// // //   return (
// // //     <div className="flex flex-col min-h-screen">
// // //       {chatTitle && (
// // //         <div className="bg-blue-50 border-b border-b-blue-200 p-2 text-center md:p-4">
// // //           <h1 className="text-base font-semibold text-blue-900 md:text-lg">
// // //             Shared Chat: {chatTitle}
// // //           </h1>
// // //           <p className="text-xs text-blue-600 md:text-sm">
// // //             This conversation has been shared with you
// // //           </p>
// // //         </div>
// // //       )}
// // //       <div className="flex-1 flex justify-center p-0 w-full">
// // //         <ChatInterface sharedMessages={sharedMessages} />
// // //       </div>
// // //     </div>
// // //   );
// // // }









// // // src/app/chat/[chatId]/page.tsx
// // import { Suspense } from 'react';
// // import { SharedChatPage } from '@/components/chat/SharedChatPage';
// // import { Loader2 } from 'lucide-react';

// // // Force dynamic rendering
// // export const dynamic = 'force-dynamic';
// // export const fetchCache = 'force-no-store';
// // export const dynamicParams = true;

// // function LoadingFallback() {
// //   return (
// //     <div className="flex flex-col items-center justify-center min-h-[80vh]">
// //       <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
// //       <p className="mt-4 text-gray-600">Loading shared chat...</p>
// //     </div>
// //   );
// // }

// // export default function ChatPage() {
// //   return (
// //     <Suspense fallback={<LoadingFallback />}>
// //       <SharedChatPage />
// //     </Suspense>
// //   );
// // }



// import React from 'react'
// import { Suspense } from 'react';
// import { SharedChatPage } from '@/components/chat/SharedChatPage';
// import { Loader2 } from 'lucide-react';

// export const dynamic = 'force-dynamic';
// export const fetchCache = 'force-no-store';
// export const dynamicParams = true;

// const LoadingFallback = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[80vh]">
//       <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
//       <p className="mt-4 text-gray-600">Loading shared chat...</p>
//     </div>
//   );
// };

// const page = () => {
//   return (
//     <Suspense fallback={<LoadingFallback />}>
//       <SharedChatPage />
//     </Suspense>
//   )
// }

// export default page












"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SharedChatPage } from "@/components/chat/SharedChatPage";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const dynamicParams = true;

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh]">
    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    <p className="mt-2 text-gray-600">Loading shared chat...</p>
  </div>
);

export default function ChatIdPage({
  params,
}: {
  params: { chatId: string };
}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SharedChatPage chatId={params.chatId} />
    </Suspense>
  );
}
