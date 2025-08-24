// import type { Message } from "@/lib/types";
// import { cn } from "@/lib/utils";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { BotIcon, UserIcon, AlertTriangleIcon, Loader2 } from "lucide-react";
// import { MedicineCard } from "./MedicineCard";

// interface ChatMessageProps {
//   message: Message;
//   onCheckNearbyStores: (medicineName: string) => void;
// }

// export function ChatMessage({ message, onCheckNearbyStores }: ChatMessageProps) {
//   const isUser = message.sender === "user";
//   const isBot = message.sender === "bot";
//   const isSystem = message.sender === "system";

//   if (isSystem) {
//     return (
//       <div className="flex justify-center my-2 px-2">
//         <div className="px-4 py-2 rounded-lg text-sm max-w-full sm:max-w-[80%] bg-yellow-100 text-yellow-700 border border-yellow-300 flex items-center gap-2">
//           <AlertTriangleIcon className="h-4 w-4" />
//           <span>{message.text}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={cn(
//         "md:flex items-start gap-2 my-3 px-2 sm:px-4",
//         isUser ? "justify-end flex" : " justify-start"
//       )}
//     >
//       {!isUser && (
//         <Avatar className="p-0 mb-2">
//           <AvatarFallback className="bg-primary text-black">
//             <BotIcon className="p-1" />
//           </AvatarFallback>
//         </Avatar>
//       )}

//       <div
//         className={cn(
//           "px-4 py-3 rounded-xl md:w-[32%] shadow-md",

//           isUser
//             ? "bg-card text-card-foreground rounded-br-none border md:w-auto"
//             : "bg-primary text-primary-foreground rounded-bl-none"
//         )}
//       >
//         {message.isLoading && isBot ? (
//           <div className="flex items-center space-x-2">
//             <Loader2 className="h-4 w-4 animate-spin" />
//             <span>Typing...</span>
//           </div>
//         ) : (
//           <>
//             {message.text && (
//               <p className="whitespace-pre-wrap text-sm sm:text-base">{message.text}</p>
//             )}
//             <div className="w-full">
//               {message.suggestions && message.suggestions.length > 0 && (
//                 <div className="mt-3 space-y-3">
//                   {message.suggestions.map((suggestion, index) => (
//                     <MedicineCard
//                       key={index}
//                       suggestion={suggestion}
//                       onCheckNearbyStores={onCheckNearbyStores}
//                     />
//                   ))}
//                   <p className="text-xs text-primary-foreground/80 mt-3 pt-2 border-t border-primary-foreground/20">
//                     <AlertTriangleIcon className="inline h-3 w-3 mr-1" />
//                     Disclaimer: This is not medical advice. Always consult a doctor before taking any medicine.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>

//       {isUser && (
//         <Avatar className="p-0">
//           <AvatarFallback className="bg-secondary text-black">
//             <UserIcon className="p-1" />
//           </AvatarFallback>
//         </Avatar>
//       )}
//     </div>
//   );
// }


// "use client";

// import type { Message } from "@/lib/types";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Bot, User, AlertTriangle, Loader2 } from "lucide-react";
// import { MedicineCard } from "./MedicineCard";
// import { marked } from "marked";

// interface ChatMessageProps {
//   message: Message;
//   onCheckNearbyStores: (medicineName: string) => void;
// }

// export function ChatMessage({ message, onCheckNearbyStores }: ChatMessageProps) {
//   const isUser = message.sender === "user";
//   const isBot = message.sender === "bot";
//   const isSystem = message.sender === "system";

//   if (isSystem) {
//     return (
//       <div className="flex justify-center my-4 px-4">
//         <div className="px-6 py-3 rounded-xl text-sm max-w-full sm:max-w-[85%] bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-300 flex items-center gap-2 shadow-md">
//           <AlertTriangle className="h-5 w-5 flex-shrink-0" />
//           <span dangerouslySetInnerHTML={{ __html: marked.parse(message.text || '') }} />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`my-6 px-4 ${isUser ? "flex justify-end" : "flex justify-start"}`}>
//       <div className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"} sm:flex-row sm:items-start sm:gap-4 ${isUser ? "sm:flex-row-reverse" : ""}`}>
//         <div className="flex items-center justify-center">
//           {isUser ? (
//             <Avatar className="mt-1 ring-2 ring-green-100">
//               <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
//                 <User className="h-5 w-5" />
//               </AvatarFallback>
//             </Avatar>
//           ) : (
//             <Avatar className="mt-1 ring-2 ring-blue-100">
//               <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
//                 <Bot className="h-5 w-5" />
//               </AvatarFallback>
//             </Avatar>
//           )}
//         </div>

//         <div className={`rounded-2xl shadow-lg max-w-[100%] ${isUser
//           ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm"
//           : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"
//           }`}>
//           <div className="px-5 py-4">
//             {message.isLoading && isBot ? (
//               <div className="flex items-center space-x-3">
//                 <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
//                 <span className="text-gray-600">Gemini AI analyzing symptoms...</span>
//               </div>
//             ) : (
//               <>
//                 {message.text && (
//                   <div
//                     className="prose prose-sm sm:prose-base leading-relaxed"
//                     dangerouslySetInnerHTML={{ __html: marked.parse(message.text) }}
//                   />
//                 )}
//               </>
//             )}
//           </div>

//           {/* Medicine Suggestions */}
//           {message.suggestions && message.suggestions.length > 0 && (
//             <div className="px-5 pb-5 space-y-4">
//               <div className="border-t border-gray-200 pt-4">
//                 <h4 className="font-bold text-green-700 text-lg mb-4 flex items-center gap-2">
//                   Gemini AI Recommended Medicines:
//                 </h4>
//                 <div className="space-y-4">
//                   {message.suggestions.map((suggestion, index) => (
//                     <MedicineCard
//                       key={index}
//                       suggestion={suggestion}
//                       onCheckNearbyStores={onCheckNearbyStores}
//                     />
//                   ))}
//                 </div>

//                 {/* Disclaimer */}
//                 <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                   <p className="text-xs text-yellow-800 flex items-center gap-2">
//                     <AlertTriangle className="h-4 w-4 flex-shrink-0" />
//                     <span>
//                       <strong>AI Disclaimer:</strong> These are Gemini AI generated recommendations.
//                       For real medical advice, please consult with a qualified doctor.
//                       This cannot replace professional medical advice in any way.
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }




"use client";

import type { Message } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, AlertTriangle, Loader2 } from "lucide-react";
import { MedicineCard } from "./MedicineCard";
import { marked } from "marked";

interface ChatMessageProps {
  message: Message;
  onCheckNearbyStores: (medicineName: string) => void;
}

export function ChatMessage({ message, onCheckNearbyStores }: ChatMessageProps) {
  const isUser = message.sender === "user";
  const isBot = message.sender === "bot";
  const isSystem = message.sender === "system";
  const hasGeminiSuggestions = message.suggestions && message.suggestions.length > 0;

  if (isSystem) {
    return (
      <div className="flex justify-center my-4 px-4">
        <div className="px-6 py-3 rounded-xl text-sm max-w-full sm:max-w-[85%] bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-300 flex items-center gap-2 shadow-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span dangerouslySetInnerHTML={{ __html: marked.parse(message.text || '') }} />
        </div>
      </div>
    );
  }

  return (
    <div className={`my-6 px-4 ${isUser ? "flex justify-end" : "flex justify-start"}`}>
      <div className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"} sm:flex-row sm:items-start sm:gap-4 ${isUser ? "sm:flex-row-reverse" : ""}`}>
        <div className="flex items-center justify-center">
          {isUser ? (
            <Avatar className="mt-1 ring-2 ring-green-100">
              <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="mt-1 ring-2 ring-blue-100">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <div className={`rounded-2xl shadow-lg ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm max-w-[100%]"
            : `bg-white text-gray-800 rounded-bl-sm border border-gray-200 ${
                hasGeminiSuggestions ? "max-w-[45%]" : "max-w-[100%]"
              }`
          }`}>
          <div className="px-5 py-4">
            {message.isLoading && isBot ? (
              <div className="flex items-center space-x-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <span className="text-gray-600">Gemini AI analyzing symptoms...</span>
              </div>
            ) : (
              <>
                {message.text && (
                  <div
                    className="prose prose-sm sm:prose-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: marked.parse(message.text) }}
                  />
                )}
              </>
            )}
          </div>

          {/* Medicine Suggestions */}
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="px-5 pb-5 space-y-4">
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold text-green-700 text-lg mb-4 flex items-center gap-2">
                  Gemini AI Recommended Medicines:
                </h4>
                <div className="space-y-4">
                  {message.suggestions.map((suggestion, index) => (
                    <MedicineCard
                      key={index}
                      suggestion={suggestion}
                      onCheckNearbyStores={onCheckNearbyStores}
                    />
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span>
                      <strong>AI Disclaimer:</strong> These are Gemini AI generated recommendations.
                      For real medical advice, please consult with a qualified doctor.
                      This cannot replace professional medical advice in any way.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}