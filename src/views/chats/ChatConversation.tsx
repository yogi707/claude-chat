import { useState, type RefObject } from "react";
import { ResizableBox } from "react-resizable";
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
  const [selectedSnippetIndex, setSelectedSnippetIndex] = useState<number>(0);
  
  const handleMessageSelect = (message: Message, snippetIndex?: number) => {
    setSelectedMessage(message);
    setSelectedSnippetIndex(snippetIndex || 0);
  };

  const handleMessageClose = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="flex flex-row bg-gray-100 h-screen">
      {selectedMessage ? (
        <>
          {/* Resizable Chat Panel */}
          <ResizableBox
            width={600}
            height={Infinity}
            minConstraints={[300, Infinity]}
            maxConstraints={[1000, Infinity]}
            resizeHandles={['e']}
            className="flex-shrink-0"
          >
            <div className="h-full">
              <ChatPanel
                chatId={chatId!}
                onMessageSelect={(message, snippetIndex) => handleMessageSelect(message, snippetIndex)}
                initialMessage={initialMessage}
              />
            </div>
          </ResizableBox>
          
          {/* Chat Preview - takes remaining space */}
          <div className="flex-1 min-w-0">
            <ChatPreview
              selectedMessage={selectedMessage}
              onClose={handleMessageClose}
              initialSnippetIndex={selectedSnippetIndex}
            />
          </div>
        </>
      ) : (
        <div className="flex-1">
          <ChatPanel
            chatId={chatId!}
            onMessageSelect={(message, snippetIndex) => handleMessageSelect(message, snippetIndex)}
            initialMessage={initialMessage}
          />
        </div>
      )}
    </div>
  );
}

export default ChatConversation;
