import type { Message } from "../context/ChatContext";

function PreviewPanel({ selectedMessage }: { selectedMessage: Message }) {
  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Message Header */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedMessage.role === "user"
                  ? "User Message"
                  : "Assistant Response"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {selectedMessage.timestamp.toLocaleDateString()} at{" "}
                {selectedMessage.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                selectedMessage.role === "user"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {selectedMessage.role === "user" ? "User" : "Assistant"}
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Message Content
          </h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedMessage.content}
            </p>
          </div>
        </div>

        {/* Message Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {selectedMessage.content.length}
            </div>
            <div className="text-sm text-gray-600">Characters</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {selectedMessage.content.split(" ").length}
            </div>
            <div className="text-sm text-gray-600">Words</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {selectedMessage.content.split("\n").length}
            </div>
            <div className="text-sm text-gray-600">Lines</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewPanel;
