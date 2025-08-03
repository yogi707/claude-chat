import { useState, type RefObject } from "react";
import ChatPanel from "../../components/ChatPanel";
import ChatPreview from "../../components/ChatPreview";
import { type Message } from "../../context/ChatContext";

function ChatConversation({
  chatId,
  initialMessage,
}: {
  chatId: string;
  initialMessage?: RefObject<string>;
}) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const handleMessageSelect = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleMessageClose = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="flex flex-row bg-gray-100 h-screen">
      <ChatPanel
        chatId={chatId!}
        onMessageSelect={handleMessageSelect}
        initialMessage={initialMessage}
      />
      {selectedMessage && (
        <ChatPreview
          selectedMessage={selectedMessage}
          onClose={handleMessageClose}
        />
      )}
    </div>
  );
}

export default ChatConversation;
