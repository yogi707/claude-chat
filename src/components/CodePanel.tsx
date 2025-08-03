import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import type { Message } from "../context/ChatContext";
import { normalizeLanguage } from "../utils/codeExtractor";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";

function CodePanel({
  selectedMessage,
  initialSnippetIndex = 0,
}: {
  selectedMessage: Message;
  initialSnippetIndex?: number;
}) {
  const [selectedSnippetIndex, setSelectedSnippetIndex] =
    useState(initialSnippetIndex);

  // Update selected snippet when initialSnippetIndex changes
  React.useEffect(() => {
    setSelectedSnippetIndex(initialSnippetIndex);
  }, [initialSnippetIndex, selectedMessage.id]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.warn("Failed to copy to clipboard:", err);
    }
  };

  const hasCodeSnippets =
    selectedMessage.codeSnippets && selectedMessage.codeSnippets.length > 0;

  if (!hasCodeSnippets) {
    // Fallback to JSON view for messages without code snippets
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
        codeSnippets: "None detected",
      },
    };

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

  const codeSnippets = selectedMessage.codeSnippets!;
  const currentSnippet = codeSnippets[selectedSnippetIndex];
  const normalizedLanguage = normalizeLanguage(currentSnippet.language);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header with snippet selector and metadata */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">
            Code Snippets ({codeSnippets.length})
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(currentSnippet.content)}
            className="h-8"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
        </div>

        {/* Snippet selector */}
        {codeSnippets.length > 1 && (
          <div className="flex gap-2 mb-3">
            {codeSnippets.map((snippet, index) => (
              <Button
                key={snippet.id}
                variant={index === selectedSnippetIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSnippetIndex(index)}
                className="h-7 text-xs"
              >
                {snippet.language} ({snippet.content.split("\n").length} lines)
              </Button>
            ))}
          </div>
        )}

        {/* Current snippet info */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">{currentSnippet.language}</span>
          {currentSnippet.startLine && (
            <span>
              {" "}
              • Lines {currentSnippet.startLine}-{currentSnippet.endLine}
            </span>
          )}
          <span> • {currentSnippet.content.split("\n").length} lines</span>
          <span> • {currentSnippet.content.length} characters</span>
        </div>
      </div>

      {/* Code editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={normalizedLanguage}
          value={currentSnippet.content}
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
            selectOnLineNumbers: true,
            glyphMargin: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            smoothScrolling: true,
            cursorBlinking: "solid",
            renderLineHighlight: "none",
            hover: {
              enabled: true,
              delay: 300,
            },
            suggest: {
              showWords: false,
            },
          }}
        />
      </div>
    </div>
  );
}

export default CodePanel;
