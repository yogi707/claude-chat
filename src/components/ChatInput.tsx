import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "../lib/utils";

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

function ChatInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type a message..." 
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              "w-full resize-none rounded-lg border border-gray-300 px-4 py-3 pr-12",
              "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
              "text-sm leading-relaxed"
            )}
            style={{ 
              minHeight: "48px",
              maxHeight: "120px"
            }}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg transition-colors",
            "bg-blue-500 text-white hover:bg-blue-600",
            "disabled:bg-gray-300 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          )}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
