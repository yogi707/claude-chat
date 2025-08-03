import React from "react";

// Copy code to clipboard helper
const copyCodeToClipboard = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
  } catch (err) {
    console.warn('Failed to copy code to clipboard:', err);
  }
};

// Format markdown-like text to JSX elements
export const formatResponse = (
  text: string, 
  onViewArtifact?: (snippetIndex: number) => void
): React.ReactNode => {
  if (!text) return null;

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let currentListType: string | null = null;
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLanguage = "";
  let snippetIndex = 0;

  lines.forEach((line, index) => {
    // Handle code blocks
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.replace("```", "").trim();
        codeContent = [];
      } else {
        inCodeBlock = false;
        
        // Create code snippet if we have content
        if (codeContent.length > 0) {
          const currentSnippetIndex = snippetIndex++;
          
          if (onViewArtifact) {
            // Show "View Artifacts" button placeholder
            elements.push(
              <div
                key={`code-${index}`}
                className="my-4 border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
              >
                <div className="p-4 text-center">
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">{codeLanguage || "Code"}</span>
                    <span className="text-gray-400"> • {codeContent.length} lines</span>
                  </div>
                  <button
                    onClick={() => onViewArtifact(currentSnippetIndex)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    View Artifacts
                  </button>
                </div>
              </div>
            );
          } else {
            // Fallback to original code block rendering
            elements.push(
              <div
                key={`code-${index}`}
                className="my-4 border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-100 px-4 py-2 flex justify-between items-center text-sm">
                  <span className="text-gray-600">{codeLanguage || "text"}</span>
                  <button
                    onClick={() => copyCodeToClipboard(codeContent.join("\n"))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Copy
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 overflow-x-auto">
                  <code>{codeContent.join("\n")}</code>
                </pre>
              </div>
            );
          }
        }
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    // Close current list if needed
    if (
      currentList.length > 0 &&
      !line.match(/^[\*\-\+]\s/) &&
      !line.match(/^\d+\.\s/)
    ) {
      if (currentListType === "ul") {
        elements.push(
          <ul key={`list-${index}`} className="list-disc ml-6 my-2">
            {currentList}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`list-${index}`} className="list-decimal ml-6 my-2">
            {currentList}
          </ol>
        );
      }
      currentList = [];
      currentListType = null;
    }

    // Headers
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={index} className="text-3xl font-bold my-4 text-gray-800">
          {line.substring(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={index} className="text-2xl font-bold my-3 text-gray-700">
          {line.substring(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={index} className="text-xl font-bold my-2 text-gray-600">
          {line.substring(4)}
        </h3>
      );
    }
    // Lists
    else if (line.match(/^[\*\-\+]\s/)) {
      currentListType = "ul";
      currentList.push(
        <li key={`li-${index}`} className="my-1">
          {formatInlineText(line.substring(2))}
        </li>
      );
    } else if (line.match(/^\d+\.\s/)) {
      currentListType = "ol";
      currentList.push(
        <li key={`li-${index}`} className="my-1">
          {formatInlineText(line.replace(/^\d+\.\s/, ""))}
        </li>
      );
    }
    // Regular paragraphs
    else if (line.trim()) {
      elements.push(
        <p key={index} className="my-2 text-gray-700 leading-relaxed">
          {formatInlineText(line)}
        </p>
      );
    }
    // Empty lines
    else {
      elements.push(<br key={`br-${index}`} />);
    }
  });

  // Close any remaining list
  if (currentList.length > 0) {
    if (currentListType === "ul") {
      elements.push(
        <ul key="final-list" className="list-disc ml-6 my-2">
          {currentList}
        </ul>
      );
    } else {
      elements.push(
        <ol key="final-list" className="list-decimal ml-6 my-2">
          {currentList}
        </ol>
      );
    }
  }

  return elements;
};

// Format inline text (bold, italic, code)
export const formatInlineText = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let key = 0;

  // Handle inline code first
  currentText = currentText.replace(/`([^`]+)`/g, (_match, code) => {
    return `__INLINE_CODE_${key++}__${code}__INLINE_CODE_END__`;
  });

  // Handle bold text
  currentText = currentText.replace(/\*\*(.*?)\*\*/g, (_match, bold) => {
    return `__BOLD_${key++}__${bold}__BOLD_END__`;
  });

  // Handle italic text
  currentText = currentText.replace(/\*(.*?)\*/g, (_match, italic) => {
    return `__ITALIC_${key++}__${italic}__ITALIC_END__`;
  });

  // Split by markers and create elements
  const tokens = currentText.split(/(__[A-Z_]+_\d+__|__[A-Z_]+_END__)/);

  tokens.forEach((token, index) => {
    if (token.startsWith("__INLINE_CODE_") && token.endsWith("__")) {
      const code = token
        .replace(/__INLINE_CODE_\d+__/, "")
        .replace(/__INLINE_CODE_END__/, "");
      parts.push(
        <code
          key={`inline-${index}`}
          className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono"
        >
          {code}
        </code>
      );
    } else if (token.startsWith("__BOLD_") && token.endsWith("__")) {
      const bold = token
        .replace(/__BOLD_\d+__/, "")
        .replace(/__BOLD_END__/, "");
      parts.push(
        <strong key={`bold-${index}`} className="font-bold text-gray-800">
          {bold}
        </strong>
      );
    } else if (token.startsWith("__ITALIC_") && token.endsWith("__")) {
      const italic = token
        .replace(/__ITALIC_\d+__/, "")
        .replace(/__ITALIC_END__/, "");
      parts.push(
        <em key={`italic-${index}`} className="italic text-gray-600">
          {italic}
        </em>
      );
    } else if (token && !token.startsWith("__")) {
      parts.push(token);
    }
  });

  return parts;
};
