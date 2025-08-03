import { useState } from "react";
import PreviewPanel from "./PreviewPanel";
import CodePanel from "./CodePanel";
import PreviewHeader from "./PreviewHeader";
import type { Message } from "../context/ChatContext";

export interface ChatPreviewProps {
  selectedMessage: Message;
  onClose: () => void;
}

function ChatPreview({ selectedMessage, onClose }: ChatPreviewProps) {
  const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");

  return (
    <div className="flex-1 bg-white border-l border-gray-200 flex flex-col h-full">
      <PreviewHeader 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={onClose}
      />

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "preview" ? (
          <PreviewPanel selectedMessage={selectedMessage} />
        ) : (
          <CodePanel selectedMessage={selectedMessage} />
        )}
      </div>
    </div>
  );
}

export default ChatPreview;
