import { cn } from "../lib/utils";
import { formatResponse } from "../utils/formatter";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
  onViewArtifact?: (snippetIndex: number) => void;
}

function ChatMessage({
  content,
  role,
  timestamp,
  isStreaming,
  onViewArtifact,
}: ChatMessageProps) {
  const isUser = role === "user";
  const isEmpty = content.trim() === "";
  const showLoadingIndicator = isStreaming && isEmpty;

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2 shadow-sm",
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-900"
        )}
      >
        {showLoadingIndicator ? (
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div
                className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  isUser ? "bg-blue-200" : "bg-gray-400"
                )}
              ></div>
              <div
                className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  isUser ? "bg-blue-200" : "bg-gray-400"
                )}
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  isUser ? "bg-blue-200" : "bg-gray-400"
                )}
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span
              className={cn(
                "text-sm",
                isUser ? "text-blue-100" : "text-gray-500"
              )}
            >
              AI is thinking...
            </span>
          </div>
        ) : (
          <div className="text-sm leading-relaxed">
            {formatResponse(content, onViewArtifact)}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <p
            className={cn(
              "text-xs opacity-70",
              isUser ? "text-blue-100" : "text-gray-500"
            )}
          >
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
