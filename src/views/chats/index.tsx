import { useState } from "react";
import ChatPanel from "../../components/ChatPanel";
import ChatPreview from "../../components/ChatPreview";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

function ChatModule() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleMessageSelect = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleMessageClose = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="flex flex-row bg-gray-100 h-screen">
      <ChatPanel onMessageSelect={handleMessageSelect} />
      {selectedMessage && (
        <ChatPreview 
          selectedMessage={selectedMessage} 
          onClose={handleMessageClose}
        />
      )}
    </div>
  );
}

export default ChatModule;
