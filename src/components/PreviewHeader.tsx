import { X, Code, Eye } from "lucide-react";

interface PreviewHeaderProps {
  activeTab: "code" | "preview";
  onTabChange: (tab: "code" | "preview") => void;
  onClose: () => void;
}

function PreviewHeader({ activeTab, onTabChange, onClose }: PreviewHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
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
  );
}

export default PreviewHeader;
