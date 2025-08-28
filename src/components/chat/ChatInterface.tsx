// "use client";

// import { useState, useRef } from "react";
// import type { Message } from "@/lib/types";
// import { ChatInput } from "./ChatInput";
// import { ChatMessageList } from "./ChatMessageList";
// import { handleSymptomAnalysis } from "@/actions/chatActions";
// import { useToast } from "@/hooks/use-toast";
// import { PharmacySection } from "./PharmacySection";
// import { AgeSelector } from "./AgeSelector";
// import { GenderSelector } from "./GenderSelector";

// const initialBotMessage: Message = {
//   id: "initial-bot",
//   sender: "bot",
//   text: "Hello! I'm your MediQuery AI assistant.\n\n How are you feeling today?",
//   timestamp: new Date(),
// };

// type ConversationState = "awaitingSymptoms" | "awaitingAge" | "awaitingGender" | "awaitingDetails" | "readyForAnalysis";

// export function ChatInterface() {
//   const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPharmacySection, setShowPharmacySection] = useState(false);
//   const [selectedMedicineForPharmacy, setSelectedMedicineForPharmacy] = useState<string | null>(null);
//   const [conversationState, setConversationState] = useState<ConversationState>("awaitingSymptoms");

//   // State to hold collected user data
//   const [collectedData, setCollectedData] = useState({
//     symptoms: "",
//     age: "",
//     gender: "",
//     otherDetails: "",
//   });

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

//     switch (conversationState) {
//       case "awaitingSymptoms":
//         setCollectedData(prev => ({ ...prev, symptoms: text }));
//         setIsLoading(false);
//         setConversationState("awaitingAge");
//         addMessage({ sender: "bot", text: "Thank you. Please tell me your age." });
//         break;

//       case "awaitingDetails":
//         const finalPrompt = `
//          **Symptoms:** ${collectedData.symptoms}
//          **Age:** ${collectedData.age}
//          **Gender:** ${collectedData.gender}
//          **Other Details:** ${text}
//         `;

//         const thinkingMessageId = generateUniqueId();
//         setMessages((prev) => [
//           ...prev,
//           { id: thinkingMessageId, sender: "bot", isLoading: true, timestamp: new Date() },
//         ]);

//         // Call the AI with the complete prompt
//         try {
//           const result = await handleSymptomAnalysis(finalPrompt);
//           setMessages((prev) => prev.filter((m) => m.id !== thinkingMessageId));
//           setIsLoading(false);

//           if ("error" in result) {
//             addMessage({ sender: "system", text: `AI Error: ${result.error}` });
//             toast({
//               title: "Gemini AI Error",
//               description: result.error,
//               variant: "destructive",
//             });
//           } else if (result.medicineSuggestions?.length) {
//             let responseText = "**Gemini AI Analysis Complete!**\n\n";

//             if (result.generalAdvice) {
//               responseText += `**General Advice:** ${result.generalAdvice}\n\n`;
//             }

//             if (result.redFlags) {
//               responseText += `**Warning Signs:** ${result.redFlags}\n\n`;
//             }

//             responseText += "**AI Recommended Medicines:**";

//             addMessage({
//               sender: "bot",
//               text: responseText,
//               suggestions: result.medicineSuggestions
//             });

//             if (result.disclaimer) {
//               setTimeout(() => {
//                 addMessage({
//                   sender: "system",
//                   text: `${result.disclaimer}`
//                 });
//               }, 1000);
//             }
//           } else {
//             addMessage({
//               sender: "bot",
//               text: "Gemini AI couldn't find specific medicine suggestions for your symptoms. Try rephrasing or provide more specific details.\n\nRemember: I'm just an AI assistant, not a real doctor.",
//             });
//           }
//         } catch (error) {
//           setIsLoading(false);
//           setMessages((prev) => prev.filter((m) => m.id !== thinkingMessageId));

//           addMessage({
//             sender: "system",
//             text: "Something went wrong with Gemini AI. Please try again or try later.",
//           });

//           toast({
//             title: "Connection Error",
//             description: "Gemini AI service temporarily unavailable",
//             variant: "destructive",
//           });
//         }

//         // Reset the conversation state for the next session
//         setConversationState("awaitingSymptoms");
//         setCollectedData({ symptoms: "", age: "", gender: "", otherDetails: "" });
//         break;
//     }
//   };

//   const handleAgeSelect = (age: string) => {
//     setCollectedData(prev => ({ ...prev, age }));
//     addMessage({ sender: "user", text: `Age: ${age}` });
//     setConversationState("awaitingGender");
//     addMessage({ sender: "bot", text: "Thank you. Now, please tell me your gender." });
//   };

//   const handleGenderSelect = (gender: string) => {
//     setCollectedData(prev => ({ ...prev, gender }));
//     addMessage({ sender: "user", text: `Gender: ${gender}` });
//     setConversationState("awaitingDetails");
//     addMessage({ sender: "bot", text: "Thank you. Are you experiencing anything else unusual?" });
//   };

//   const handleCheckNearbyStores = (medicineName: string) => {
//     setSelectedMedicineForPharmacy(medicineName);
//     setShowPharmacySection(true);
//   };

//   return (
//     <div className="flex flex-col h-[80vh] w-full mx-auto bg-gradient-to-br from-blue-50 via-white to-green-50">
//       {/* Message Area */}
//       <div className="flex-1 overflow-y-auto p-0" ref={containerRef}>
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

//       <div className="w-full flex flex-col items-center p-4">
//         {conversationState === "awaitingAge" && (
//           <AgeSelector onSelectAge={handleAgeSelect} />
//         )}
//         {conversationState === "awaitingGender" && (
//           <GenderSelector onSelectGender={handleGenderSelect} />
//         )}
//         {["awaitingSymptoms", "awaitingDetails"].includes(conversationState) && (
//           <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
//         )}
//       </div>
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
import { AgeSelector } from "./AgeSelector";
import { GenderSelector } from "./GenderSelector";
import { TreatmentPreferenceSelector } from "./TreatmentPreferenceSelector";

const initialBotMessage: Message = {
  id: "initial-bot",
  sender: "bot",
  text: "Hello! I'm your MediQuery AI assistant.\n\n How are you feeling today?",
  timestamp: new Date(),
};

type ConversationState = "awaitingSymptoms" | "awaitingAge" | "awaitingGender" | "awaitingTreatmentPreference" | "awaitingDetails" | "readyForAnalysis";

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
    treatmentPreference: "",
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
         **Treatment Preference:** ${collectedData.treatmentPreference}
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
          } else if (result.medicineSuggestions?.length || result.homeRemedies?.length) {
            let responseText = "**Gemini AI Analysis Complete!**\n\n";

            if (result.generalAdvice) {
              responseText += `**General Advice:** ${result.generalAdvice}\n\n`;
            }

            if (result.redFlags) {
              responseText += `**Warning Signs:** ${result.redFlags}\n\n`;
            }

            // Show medicine suggestions if preference is medicine or both
            if ((collectedData.treatmentPreference === "medicine" || collectedData.treatmentPreference === "both") && result.medicineSuggestions?.length) {
              responseText += "**AI Recommended Medicines:**";
              addMessage({
                sender: "bot",
                text: responseText,
                suggestions: result.medicineSuggestions
              });
              responseText = ""; // Clear for next message
            }

            // Show home remedies if preference is home_remedies or both
            if ((collectedData.treatmentPreference === "home_remedies" || collectedData.treatmentPreference === "both") && result.homeRemedies?.length) {
              const homeRemedyText = collectedData.treatmentPreference === "home_remedies" ? responseText + "**Natural Home Remedies:**" : "**Natural Home Remedies:**";
              setTimeout(() => {
                addMessage({
                  sender: "bot",
                  text: homeRemedyText,
                  homeRemedies: result.homeRemedies
                });
              }, collectedData.treatmentPreference === "both" ? 1500 : 0);
            }

            if (result.disclaimer) {
              setTimeout(() => {
                addMessage({
                  sender: "system",
                  text: `${result.disclaimer}`
                });
              }, 2000);
            }
          } else {
            addMessage({
              sender: "bot",
              text: "Gemini AI couldn't find specific suggestions for your symptoms. Try rephrasing or provide more specific details.\n\nRemember: I'm just an AI assistant, not a real doctor.",
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
        setCollectedData({ symptoms: "", age: "", gender: "", treatmentPreference: "", otherDetails: "" });
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
    setConversationState("awaitingTreatmentPreference");
    addMessage({ sender: "bot", text: "What type of treatment would you prefer?" });
  };

  const handleTreatmentPreferenceSelect = (preference: string) => {
    const preferenceLabels = {
      "medicine": "Medicine Recommendations",
      "home_remedies": "Home Remedies",
      "both": "Both Medicine & Home Remedies"
    };
    
    setCollectedData(prev => ({ ...prev, treatmentPreference: preference }));
    addMessage({ sender: "user", text: `Treatment Preference: ${preferenceLabels[preference as keyof typeof preferenceLabels]}` });
    setConversationState("awaitingDetails");
    addMessage({ sender: "bot", text: "Perfect! Are you experiencing anything else unusual or any additional details you'd like to share?" });
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
        {conversationState === "awaitingTreatmentPreference" && (
          <TreatmentPreferenceSelector onSelectPreference={handleTreatmentPreferenceSelect} />
        )}
        {["awaitingSymptoms", "awaitingDetails"].includes(conversationState) && (
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}