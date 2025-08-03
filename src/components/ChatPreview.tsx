import { useState, useEffect } from "react";
import PreviewPanel from "./PreviewPanel";
import CodePanel from "./CodePanel";
import PreviewHeader from "./PreviewHeader";
import type { Message } from "../context/ChatContext";

export interface ChatPreviewProps {
  selectedMessage: Message;
  onClose: () => void;
  initialSnippetIndex?: number;
}

function ChatPreview({ selectedMessage, onClose, initialSnippetIndex }: ChatPreviewProps) {
  const hasCodeSnippets = selectedMessage.codeSnippets && selectedMessage.codeSnippets.length > 0;
  const [activeTab, setActiveTab] = useState<"code" | "preview">(hasCodeSnippets ? "code" : "preview");
  
  // Update default tab when message changes
  useEffect(() => {
    setActiveTab(hasCodeSnippets ? "code" : "preview");
  }, [selectedMessage.id, hasCodeSnippets]);

  return (
    <div className="flex-1 bg-white border-l border-gray-200 flex flex-col h-full">
      <PreviewHeader 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={onClose}
        selectedMessage={selectedMessage}
      />

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "preview" ? (
          <PreviewPanel selectedMessage={selectedMessage} />
        ) : (
          <CodePanel 
            selectedMessage={selectedMessage} 
            initialSnippetIndex={initialSnippetIndex}
          />
        )}
      </div>
    </div>
  );
}

export default ChatPreview;
