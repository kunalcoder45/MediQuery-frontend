import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BotIcon, UserIcon, AlertTriangleIcon, Loader2 } from "lucide-react";
import { MedicineCard } from "./MedicineCard";

interface ChatMessageProps {
  message: Message;
  onCheckNearbyStores: (medicineName: string) => void;
}

export function ChatMessage({ message, onCheckNearbyStores }: ChatMessageProps) {
  const isUser = message.sender === "user";
  const isBot = message.sender === "bot";
  const isSystem = message.sender === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center my-2 px-2">
        <div className="px-4 py-2 rounded-lg text-sm max-w-full sm:max-w-[80%] bg-yellow-100 text-yellow-700 border border-yellow-300 flex items-center gap-2">
          <AlertTriangleIcon className="h-4 w-4" />
          <span>{message.text}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "md:flex items-start gap-2 my-3 px-2 sm:px-4",
        isUser ? "justify-end flex" : " justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="p-0 mb-2">
          <AvatarFallback className="bg-primary text-black">
            <BotIcon className="p-1" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "px-4 py-3 rounded-xl md:w-[32%] shadow-md",

          isUser
            ? "bg-card text-card-foreground rounded-br-none border md:w-auto"
            : "bg-primary text-primary-foreground rounded-bl-none"
        )}
      >
        {message.isLoading && isBot ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Typing...</span>
          </div>
        ) : (
          <>
            {message.text && (
              <p className="whitespace-pre-wrap text-sm sm:text-base">{message.text}</p>
            )}
            <div className="w-full">
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 space-y-3">
                  {message.suggestions.map((suggestion, index) => (
                    <MedicineCard
                      key={index}
                      suggestion={suggestion}
                      onCheckNearbyStores={onCheckNearbyStores}
                    />
                  ))}
                  <p className="text-xs text-primary-foreground/80 mt-3 pt-2 border-t border-primary-foreground/20">
                    <AlertTriangleIcon className="inline h-3 w-3 mr-1" />
                    Disclaimer: This is not medical advice. Always consult a doctor before taking any medicine.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isUser && (
        <Avatar className="p-0">
          <AvatarFallback className="bg-secondary text-black">
            <UserIcon className="p-1" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
