import { cn } from "../lib/utils";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  onClick?: () => void;
}

function ChatMessage({ content, role, timestamp, onClick }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn(
      "flex w-full",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div 
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow",
          isUser 
            ? "bg-blue-500 text-white hover:bg-blue-600" 
            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
        )}
        onClick={onClick}
      >
        <p className="text-sm leading-relaxed">{content}</p>
        <p className={cn(
          "text-xs mt-1 opacity-70",
          isUser ? "text-blue-100" : "text-gray-500"
        )}>
          {timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
}

export default ChatMessage;
