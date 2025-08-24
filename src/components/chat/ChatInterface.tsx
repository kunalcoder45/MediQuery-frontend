// "use client";

// import { useState, useRef, useEffect } from "react";
// import type { Message } from "@/lib/types";
// import { ChatInput } from "./ChatInput";
// import { ChatMessageList } from "./ChatMessageList";
// import { handleSymptomAnalysis } from "@/actions/chatActions";
// import { useToast } from "@/hooks/use-toast";
// import { PharmacySection } from "./PharmacySection";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";

// const initialBotMessage: Message = {
//   id: "initial-bot",
//   sender: "bot",
//   text: "Hello! I'm MediQuery. How are you feeling today? Please describe your symptoms.",
//   timestamp: new Date(),
// };

// export function ChatInterface() {
//   const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPharmacySection, setShowPharmacySection] = useState(false);
//   const [selectedMedicineForPharmacy, setSelectedMedicineForPharmacy] = useState<string | null>(null);
//   const { toast } = useToast();
//   const messageIdCounterRef = useRef(0);
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const pharmacySectionRef = useRef<HTMLDivElement | null>(null);

//   const generateUniqueId = () => {
//     messageIdCounterRef.current += 1;
//     return `msg-${messageIdCounterRef.current}`;
//   };

//   const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
//     setMessages((prev) => [
//       ...prev,
//       { ...message, id: generateUniqueId(), timestamp: new Date() },
//     ]);
//   };

//   const handleSendMessage = async (text: string) => {
//     if (!text.trim()) return;

//     addMessage({ sender: "user", text });
//     setIsLoading(true);
//     setShowPharmacySection(false);
//     setSelectedMedicineForPharmacy(null);

//     const thinkingMessageId = generateUniqueId();
//     setMessages((prev) => [
//       ...prev,
//       { id: thinkingMessageId, sender: "bot", isLoading: true, timestamp: new Date() },
//     ]);

//     try {
//       const result = await handleSymptomAnalysis(text);
//       setMessages((prev) => prev.filter((m) => m.id !== thinkingMessageId));
//       setIsLoading(false);

//       if ("error" in result) {
//         addMessage({ sender: "system", text: `Error: ${result.error}` });
//         toast({
//           title: "Analysis Error",
//           description: result.error,
//           variant: "destructive",
//         });
//       } else if (result.medicineSuggestions?.length) {
//         addMessage({ sender: "bot", suggestions: result.medicineSuggestions });
//       } else {
//         addMessage({
//           sender: "bot",
//           text: "I couldn't find specific medicine suggestions for your symptoms. Try rephrasing or being more specific. Remember, I am not a doctor.",
//         });
//       }
//     } catch {
//       setIsLoading(false);
//       addMessage({
//         sender: "system",
//         text: "Something went wrong while processing your request. Please try again.",
//       });
//       toast({
//         title: "Error",
//         description: "Something went wrong. Please try again later.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleCheckNearbyStores = (medicineName: string) => {
//     setSelectedMedicineForPharmacy(medicineName);
//     setShowPharmacySection(true);

//     // Scroll to pharmacy section
//     setTimeout(() => {
//       if (pharmacySectionRef.current && containerRef.current) {
//         const containerTop = containerRef.current.getBoundingClientRect().top;
//         const sectionTop = pharmacySectionRef.current.getBoundingClientRect().top;
//         const scrollOffset = sectionTop - containerTop + containerRef.current.scrollTop;

//         containerRef.current.scrollTo({
//           top: scrollOffset,
//           behavior: "smooth",
//         });
//       }
//     }, 100);
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="flex flex-col h-[98vh] pb-1 bg-background rounded-lg shadow-xl"
//     >
//       <div className="h-[10%] fixed"></div>
//       {/* Message Area Scrollable */}
//       <div className="h-[80%] overflow-y-auto md:relative fixed">
//         <ChatMessageList
//           messages={messages}
//           onCheckNearbyStores={handleCheckNearbyStores}
//         />
//       </div>

//       {/* Optional Pharmacy Section */}
//       {showPharmacySection && (
//         <div
//           id="pharmacy-section"
//           ref={pharmacySectionRef}
//           className="p-1 border-t bg-background min-h-[40vh] h-auto overflow-y-auto"
//           aria-live="polite"
//         >
//           <div className="flex justify-end mb-2">
//             <Button
//               variant="outline"
//               onClick={() => setShowPharmacySection(false)}
//               aria-label="Back to chat"
//             >
//               <X className="h-4 w-4 rotate-180" />
//             </Button>
//           </div>
//           <PharmacySection medicineName={null} onClose={function (): void {
//             throw new Error("Function not implemented.");
//           } } />
//         </div>
//       )}

//       {/* Input Box at Bottom */}
//       <div className="h-[10%] fixed">
//         <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useState, useRef, useEffect } from "react";
// import type { Message } from "@/lib/types";
// import { ChatInput } from "./ChatInput";
// import { ChatMessageList } from "./ChatMessageList";
// import { handleSymptomAnalysis } from "@/actions/chatActions";
// import { useToast } from "@/hooks/use-toast";
// import { PharmacySection } from "./PharmacySection";
// import { Button } from "@/components/ui/button";
// import { Bot, AlertTriangle } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// const initialBotMessage: Message = {
//   id: "initial-bot",
//   sender: "bot",
//   text: "Hello! I'm your MediQuery AI assistant.\n\nI use Google Gemini AI to analyze your symptoms and recommend proper medicines.\n\nI recommend real medicines available in Indian pharmacies!\n\nHow are you feeling today? Please describe your symptoms in detail.",
//   timestamp: new Date(),
// };

// export function ChatInterface() {
//   const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPharmacySection, setShowPharmacySection] = useState(false);
//   const [selectedMedicineForPharmacy, setSelectedMedicineForPharmacy] = useState<string | null>(null);
//   const { toast } = useToast();
//   const messageIdCounterRef = useRef(0);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   const generateUniqueId = () => {
//     messageIdCounterRef.current += 1;
//     return `msg-${messageIdCounterRef.current}`;
//   };

//   const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
//     setMessages((prev) => [
//       ...prev,
//       { ...message, id: generateUniqueId(), timestamp: new Date() },
//     ]);
//   };

//   const handleSendMessage = async (text: string) => {
//     if (!text.trim()) return;

//     addMessage({ sender: "user", text });
//     setIsLoading(true);
//     setShowPharmacySection(false);
//     setSelectedMedicineForPharmacy(null);

//     const thinkingMessageId = generateUniqueId();
//     setMessages((prev) => [
//       ...prev,
//       { id: thinkingMessageId, sender: "bot", isLoading: true, timestamp: new Date() },
//     ]);

//     try {
//       // Call Gemini AI through server action
//       const result = await handleSymptomAnalysis(text);

//       // Remove thinking message
//       setMessages((prev) => prev.filter((m) => m.id !== thinkingMessageId));
//       setIsLoading(false);

//       if ("error" in result) {
//         addMessage({ sender: "system", text: `AI Error: ${result.error}` });
//         toast({
//           title: "Gemini AI Error",
//           description: result.error,
//           variant: "destructive",
//         });
//       } else if (result.medicineSuggestions?.length) {
//         // Format the AI response
//         let responseText = "**Gemini AI Analysis Complete!**\n\n";

//         if (result.generalAdvice) {
//           responseText += `**General Advice:** ${result.generalAdvice}\n\n`;
//         }

//         if (result.redFlags) {
//           responseText += `**Warning Signs:** ${result.redFlags}\n\n`;
//         }

//         responseText += "**AI Recommended Medicines:**";

//         addMessage({ 
//           sender: "bot", 
//           text: responseText,
//           suggestions: result.medicineSuggestions 
//         });

//         // Add disclaimer if provided by AI
//         if (result.disclaimer) {
//           setTimeout(() => {
//             addMessage({
//               sender: "system",
//               text: `${result.disclaimer}`
//             });
//           }, 1000);
//         }
//       } else {
//         addMessage({
//           sender: "bot",
//           text: "Gemini AI couldn't find specific medicine suggestions for your symptoms. Try rephrasing or provide more specific details.\n\nRemember: I'm just an AI assistant, not a real doctor.",
//         });
//       }
//     } catch (error) {
//       setIsLoading(false);
//       setMessages((prev) => prev.filter((m) => m.id !== thinkingMessageId));

//       addMessage({
//         sender: "system",
//         text: "Something went wrong with Gemini AI. Please try again or try later.",
//       });

//       toast({
//         title: "Connection Error",
//         description: "Gemini AI service temporarily unavailable",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleCheckNearbyStores = (medicineName: string) => {
//     setSelectedMedicineForPharmacy(medicineName);
//     setShowPharmacySection(true);
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-6xl mx-auto bg-gradient-to-br from-blue-50 via-white to-green-50">
//       {/* Enhanced Header */}
//       <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white p-4 shadow-xl">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Avatar>
//               <AvatarFallback className="bg-white text-blue-600">
//                 <Bot className="h-6 w-6" />
//               </AvatarFallback>
//             </Avatar>
//             <div>
//               <h1 className="text-xl font-bold">MediQuery AI</h1>
//               <p className="text-sm text-blue-100">Powered by Google Gemini • Real Medicine Recommendations</p>
//             </div>
//           </div>

//           <div className="text-right text-sm">
//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-1 text-green-200">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                 <span>Gemini Connected</span>
//               </div>
//             </div>
//             <div className="text-xs text-blue-200 mt-1">
//               Real-time AI Medicine Analysis
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Message Area */}
//       <div className="flex-1 overflow-hidden" ref={containerRef}>
//         <ChatMessageList
//           messages={messages}
//           onCheckNearbyStores={handleCheckNearbyStores}
//         />
//       </div>

//       {/* Pharmacy Section Modal */}
//       {showPharmacySection && (
//         <PharmacySection
//           medicineName={selectedMedicineForPharmacy}
//           onClose={() => setShowPharmacySection(false)}
//         />
//       )}

//       {/* Input Area */}
//       <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

//       {/* AI Status Indicator */}
//       {isLoading && (
//         <div className="fixed bottom-24 right-6 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg z-40">
//           <div className="flex items-center gap-2 text-sm">
//             <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
//             Gemini AI Processing...
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




// "use client";

// import { useState, useRef, useEffect } from "react";
// import type { Message } from "@/lib/types";
// import { ChatInput } from "./ChatInput";
// import { ChatMessageList } from "./ChatMessageList";
// import { handleSymptomAnalysis } from "@/actions/chatActions";
// import { useToast } from "@/hooks/use-toast";
// import { PharmacySection } from "./PharmacySection";
// import { Button } from "@/components/ui/button";
// import { Bot, AlertTriangle } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// const initialBotMessage: Message = {
//   id: "initial-bot",
//   sender: "bot",
//   text: "Hello! I'm your MediQuery AI assistant.\n\nI use Google Gemini AI to analyze your symptoms and recommend proper medicines.\n\nI recommend real medicines available in Indian pharmacies!\n\nHow are you feeling today? Please describe your symptoms in detail.",
//   timestamp: new Date(),
// };

// // New state to manage the conversation flow
// type ConversationState = "awaitingSymptoms" | "awaitingDetails" | "readyForAnalysis";

// export function ChatInterface() {
//   const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPharmacySection, setShowPharmacySection] = useState(false);
//   const [selectedMedicineForPharmacy, setSelectedMedicineForPharmacy] = useState<string | null>(null);
//   const [conversationState, setConversationState] = useState<ConversationState>("awaitingSymptoms");
//   const [initialSymptoms, setInitialSymptoms] = useState<string>("");
//   const { toast } = useToast();
//   const messageIdCounterRef = useRef(0);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   const generateUniqueId = () => {
//     messageIdCounterRef.current += 1;
//     return `msg-${messageIdCounterRef.current}`;
//   };

//   const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
//     setMessages((prev) => [
//       ...prev,
//       { ...message, id: generateUniqueId(), timestamp: new Date() },
//     ]);
//   };

//   const handleSendMessage = async (text: string) => {
//     if (!text.trim()) return;

//     addMessage({ sender: "user", text });
//     setIsLoading(true);
//     setShowPharmacySection(false);
//     setSelectedMedicineForPharmacy(null);

//     const thinkingMessageId = generateUniqueId();
//     setMessages((prev) => [
//       ...prev,
//       { id: thinkingMessageId, sender: "bot", isLoading: true, timestamp: new Date() },
//     ]);

//     if (conversationState === "awaitingSymptoms") {
//       // Step 1: User provides initial symptoms. Store them and ask for more details.
//       setInitialSymptoms(text);
//       setConversationState("awaitingDetails");

//       setMessages((prev) => prev.filter((m) => m.id !== thinkingMessageId));
//       setIsLoading(false);

//       addMessage({
//         sender: "bot",
//         text: "Thank you. To provide a better analysis, please tell me the following details:\n\n- How long have you had these symptoms?\n- What is your age and gender?\n- Are you experiencing anything else unusual?",
//       });

//     } else if (conversationState === "awaitingDetails") {
//       // Step 2: User provides detailed information. Combine with initial symptoms and send to AI.
//       const fullSymptoms = `${initialSymptoms}\n\nAdditional Details:\n${text}`;

//       try {
//         const result = await handleSymptomAnalysis(fullSymptoms);

//         setMessages((prev) => prev.filter((m) => m.id !== thinkingMessageId));
//         setIsLoading(false);

//         if ("error" in result) {
//           addMessage({ sender: "system", text: `AI Error: ${result.error}` });
//           toast({
//             title: "Gemini AI Error",
//             description: result.error,
//             variant: "destructive",
//           });
//         } else if (result.medicineSuggestions?.length) {
//           let responseText = "**Gemini AI Analysis Complete!**\n\n";

//           if (result.generalAdvice) {
//             responseText += `**General Advice:** ${result.generalAdvice}\n\n`;
//           }

//           if (result.redFlags) {
//             responseText += `**Warning Signs:** ${result.redFlags}\n\n`;
//           }

//           responseText += "**AI Recommended Medicines:**";

//           addMessage({
//             sender: "bot",
//             text: responseText,
//             suggestions: result.medicineSuggestions
//           });

//           if (result.disclaimer) {
//             setTimeout(() => {
//               addMessage({
//                 sender: "system",
//                 text: `${result.disclaimer}`
//               });
//             }, 1000);
//           }
//         } else {
//           addMessage({
//             sender: "bot",
//             text: "Gemini AI couldn't find specific medicine suggestions for your symptoms. Try rephrasing or provide more specific details.\n\nRemember: I'm just an AI assistant, not a real doctor.",
//           });
//         }
//       } catch (error) {
//         setIsLoading(false);
//         setMessages((prev) => prev.filter((m) => m.id !== thinkingMessageId));

//         addMessage({
//           sender: "system",
//           text: "Something went wrong with Gemini AI. Please try again or try later.",
//         });

//         toast({
//           title: "Connection Error",
//           description: "Gemini AI service temporarily unavailable",
//           variant: "destructive",
//         });
//       }

//       // Reset the conversation state for the next session
//       setConversationState("awaitingSymptoms");
//     }
//   };

//   const handleCheckNearbyStores = (medicineName: string) => {
//     setSelectedMedicineForPharmacy(medicineName);
//     setShowPharmacySection(true);
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-6xl mx-auto bg-gradient-to-br from-blue-50 via-white to-green-50">
//       <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white p-4 shadow-xl">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Avatar>
//               <AvatarFallback className="bg-white text-blue-600">
//                 <Bot className="h-6 w-6" />
//               </AvatarFallback>
//             </Avatar>
//             <div>
//               <h1 className="text-xl font-bold">MediQuery AI</h1>
//               <p className="text-sm text-blue-100">Powered by Google Gemini • Real Medicine Recommendations</p>
//             </div>
//           </div>
//           <div className="text-right text-sm">
//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-1 text-green-200">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                 <span>Gemini Connected</span>
//               </div>
//             </div>
//             <div className="text-xs text-blue-200 mt-1">
//               Real-time AI Medicine Analysis
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="flex-1 overflow-hidden" ref={containerRef}>
//         <ChatMessageList
//           messages={messages}
//           onCheckNearbyStores={handleCheckNearbyStores}
//         />
//       </div>
//       {showPharmacySection && (
//         <PharmacySection
//           medicineName={selectedMedicineForPharmacy}
//           onClose={() => setShowPharmacySection(false)}
//         />
//       )}
//       <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
//       {isLoading && (
//         <div className="fixed bottom-24 right-6 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg z-40">
//           <div className="flex items-center gap-2 text-sm">
//             <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
//             Gemini AI Processing...
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




"use client";

import { useState, useRef } from "react";
import type { Message } from "@/lib/types";
import { ChatInput } from "./ChatInput";
import { ChatMessageList } from "./ChatMessageList";
import { handleSymptomAnalysis } from "@/actions/chatActions";
import { useToast } from "@/hooks/use-toast";
import { PharmacySection } from "./PharmacySection";
import { Button } from "@/components/ui/button";
import { Bot, AlertTriangle, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AgeSelector } from "./AgeSelector";
import { GenderSelector } from "./GenderSelector";

const initialBotMessage: Message = {
  id: "initial-bot",
  sender: "bot",
  text: "Hello! I'm your MediQuery AI assistant.\n\n How are you feeling today?",
  timestamp: new Date(),
};

type ConversationState = "awaitingSymptoms" | "awaitingAge" | "awaitingGender" | "awaitingDetails" | "readyForAnalysis";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPharmacySection, setShowPharmacySection] = useState(false);
  const [selectedMedicineForPharmacy, setSelectedMedicineForPharmacy] = useState<string | null>(null);
  const [conversationState, setConversationState] = useState<ConversationState>("awaitingSymptoms");

  // State to hold collected user data
  const [collectedData, setCollectedData] = useState({
    symptoms: "",
    age: "",
    gender: "",
    otherDetails: "",
  });

  const { toast } = useToast();
  const messageIdCounterRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const generateUniqueId = () => {
    messageIdCounterRef.current += 1;
    return `msg-${messageIdCounterRef.current}`;
  };

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    setMessages((prev) => [
      ...prev,
      { ...message, id: generateUniqueId(), timestamp: new Date() },
    ]);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    addMessage({ sender: "user", text });
    setIsLoading(true);

    switch (conversationState) {
      case "awaitingSymptoms":
        setCollectedData(prev => ({ ...prev, symptoms: text }));
        setIsLoading(false);
        setConversationState("awaitingAge");
        addMessage({ sender: "bot", text: "Thank you. Please tell me your age." });
        break;

      case "awaitingDetails":
        const finalPrompt = `
         **Symptoms:** ${collectedData.symptoms}
         **Age:** ${collectedData.age}
         **Gender:** ${collectedData.gender}
         **Other Details:** ${text}
        `;

        const thinkingMessageId = generateUniqueId();
        setMessages((prev) => [
          ...prev,
          { id: thinkingMessageId, sender: "bot", isLoading: true, timestamp: new Date() },
        ]);

        // Call the AI with the complete prompt
        try {
          const result = await handleSymptomAnalysis(finalPrompt);
          setMessages((prev) => prev.filter((m) => m.id !== thinkingMessageId));
          setIsLoading(false);

          if ("error" in result) {
            addMessage({ sender: "system", text: `AI Error: ${result.error}` });
            toast({
              title: "Gemini AI Error",
              description: result.error,
              variant: "destructive",
            });
          } else if (result.medicineSuggestions?.length) {
            let responseText = "**Gemini AI Analysis Complete!**\n\n";

            if (result.generalAdvice) {
              responseText += `**General Advice:** ${result.generalAdvice}\n\n`;
            }

            if (result.redFlags) {
              responseText += `**Warning Signs:** ${result.redFlags}\n\n`;
            }

            responseText += "**AI Recommended Medicines:**";

            addMessage({
              sender: "bot",
              text: responseText,
              suggestions: result.medicineSuggestions
            });

            if (result.disclaimer) {
              setTimeout(() => {
                addMessage({
                  sender: "system",
                  text: `${result.disclaimer}`
                });
              }, 1000);
            }
          } else {
            addMessage({
              sender: "bot",
              text: "Gemini AI couldn't find specific medicine suggestions for your symptoms. Try rephrasing or provide more specific details.\n\nRemember: I'm just an AI assistant, not a real doctor.",
            });
          }
        } catch (error) {
          setIsLoading(false);
          setMessages((prev) => prev.filter((m) => m.id !== thinkingMessageId));

          addMessage({
            sender: "system",
            text: "Something went wrong with Gemini AI. Please try again or try later.",
          });

          toast({
            title: "Connection Error",
            description: "Gemini AI service temporarily unavailable",
            variant: "destructive",
          });
        }

        // Reset the conversation state for the next session
        setConversationState("awaitingSymptoms");
        setCollectedData({ symptoms: "", age: "", gender: "", otherDetails: "" });
        break;
    }
  };

  const handleAgeSelect = (age: string) => {
    setCollectedData(prev => ({ ...prev, age }));
    addMessage({ sender: "user", text: `Age: ${age}` });
    setConversationState("awaitingGender");
    addMessage({ sender: "bot", text: "Thank you. Now, please tell me your gender." });
  };

  const handleGenderSelect = (gender: string) => {
    setCollectedData(prev => ({ ...prev, gender }));
    addMessage({ sender: "user", text: `Gender: ${gender}` });
    setConversationState("awaitingDetails");
    addMessage({ sender: "bot", text: "Thank you. Are you experiencing anything else unusual?" });
  };

  const handleCheckNearbyStores = (medicineName: string) => {
    setSelectedMedicineForPharmacy(medicineName);
    setShowPharmacySection(true);
  };

  return (
    <div className="flex flex-col h-[80vh] w-full mx-auto bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-0" ref={containerRef}>
        <ChatMessageList
          messages={messages}
          onCheckNearbyStores={handleCheckNearbyStores}
        />
      </div>

      {/* Pharmacy Section Modal */}
      {showPharmacySection && (
        <PharmacySection
          medicineName={selectedMedicineForPharmacy}
          onClose={() => setShowPharmacySection(false)}
        />
      )}

      <div className="w-full flex flex-col items-center p-4">
        {conversationState === "awaitingAge" && (
          <AgeSelector onSelectAge={handleAgeSelect} />
        )}
        {conversationState === "awaitingGender" && (
          <GenderSelector onSelectGender={handleGenderSelect} />
        )}
        {["awaitingSymptoms", "awaitingDetails"].includes(conversationState) && (
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}