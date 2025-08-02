import { useState } from "react";
import ChatDisplay from "./ChatDisplay";
import ChatInput from "./ChatInput";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatPanelProps {
  onMessageSelect?: (message: Message) => void;
}

function ChatPanel({ onMessageSelect }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thank you for your message! This is a simulated response.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      <div className="flex-1 flex flex-col min-h-0">
        <ChatDisplay messages={messages} onMessageSelect={onMessageSelect} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default ChatPanel;
