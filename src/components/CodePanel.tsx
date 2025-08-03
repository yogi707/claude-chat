import Editor from "@monaco-editor/react";
import type { Message } from "../context/ChatContext";

function CodePanel({ selectedMessage }: { selectedMessage: Message }) {
  // Prepare the JSON data for the Monaco Editor
  const jsonData = {
    id: selectedMessage.id,
    content: selectedMessage.content,
    role: selectedMessage.role,
    timestamp: selectedMessage.timestamp.toISOString(),
    ...(selectedMessage.model && { model: selectedMessage.model }),
    ...(selectedMessage.usage && { usage: selectedMessage.usage }),
    metadata: {
      characterCount: selectedMessage.content.length,
      wordCount: selectedMessage.content.split(" ").length,
      lineCount: selectedMessage.content.split("\n").length,
    },
  };

  // Convert to formatted JSON string
  const formattedJson = JSON.stringify(jsonData, null, 2);

  return (
    <div className="h-full bg-gray-900">
      <Editor
        height="100%"
        defaultLanguage="json"
        value={formattedJson}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          folding: true,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderWhitespace: "selection",
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
}

export default CodePanel;