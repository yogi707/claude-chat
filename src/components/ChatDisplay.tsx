import { cn } from "../lib/utils";
import ChatMessage from "./ChatMessage";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatDisplayProps {
  messages?: Message[];
  onMessageSelect?: (message: Message) => void;
}

function ChatDisplay({ messages = [], onMessageSelect }: ChatDisplayProps) {
  // Mock messages for demo
  const demoMessages: Message[] = [
    {
      id: "1",
      content: "Hello! How can I help you today?",
      role: "assistant",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      content: "I need help with React components",
      role: "user",
      timestamp: new Date(Date.now() - 1800000),
    },
    {
      id: "3",
      content: "I'd be happy to help you with React components! What specific aspect would you like to learn about?",
      role: "assistant",
      timestamp: new Date(Date.now() - 900000),
    },
  ];

  const displayMessages = messages.length > 0 ? messages : demoMessages;

  return (
    <div className={cn(
      "flex-1 overflow-y-auto p-4 space-y-4",
      "bg-white border rounded-lg shadow-sm"
    )}>
      {displayMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>No messages yet. Start a conversation!</p>
        </div>
      ) : (
        displayMessages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            role={message.role}
            timestamp={message.timestamp}
            onClick={() => onMessageSelect?.(message)}
          />
        ))
      )}
    </div>
  );
}

export default ChatDisplay;
