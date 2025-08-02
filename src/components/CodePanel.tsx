import type { Message } from "./ChatPreview";

function CodePanel({ selectedMessage }: { selectedMessage: Message }) {
  return (
    <div className="h-full p-6 overflow-y-auto bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <pre className="text-green-400 font-mono text-sm leading-relaxed">
          {`{
"id": "${selectedMessage.id}",
"content": "${selectedMessage.content.replace(/"/g, '\\"')}",
"role": "${selectedMessage.role}",
"timestamp": "${selectedMessage.timestamp.toISOString()}",
"metadata": {
"characterCount": ${selectedMessage.content.length},
"wordCount": ${selectedMessage.content.split(" ").length},
"lineCount": ${selectedMessage.content.split("\n").length}
}
}`}
        </pre>
      </div>
    </div>
  );
}

export default CodePanel;
