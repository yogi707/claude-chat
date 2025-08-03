import { X, Code, Eye } from "lucide-react";
import type { Message } from "../context/ChatContext";
import { getCodeSnippetsSummary } from "../utils/codeExtractor";

interface PreviewHeaderProps {
  activeTab: "code" | "preview";
  onTabChange: (tab: "code" | "preview") => void;
  onClose: () => void;
  selectedMessage: Message;
}

function PreviewHeader({
  activeTab,
  onTabChange,
  onClose,
  selectedMessage,
}: PreviewHeaderProps) {
  const hasCodeSnippets =
    selectedMessage.codeSnippets && selectedMessage.codeSnippets.length > 0;
  const codeSnippetsSummary = hasCodeSnippets
    ? getCodeSnippetsSummary(selectedMessage.codeSnippets!)
    : null;

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-2">
        {/* Button Group - Left */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onTabChange("code")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "code"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Code size={16} />
            Code
            {hasCodeSnippets && (
              <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                {selectedMessage.codeSnippets!.length}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange("preview")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "preview"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Eye size={16} />
            Preview
          </button>
        </div>

        {/* Close Button - Right */}
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Code snippets summary */}
      {hasCodeSnippets && activeTab === "code" && (
        <div className="text-xs text-gray-500">{codeSnippetsSummary}</div>
      )}
    </div>
  );
}

export default PreviewHeader;
