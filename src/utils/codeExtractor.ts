import type { CodeSnippet } from "../context/ChatContext";

/**
 * Extracts code snippets from markdown text
 * @param text - The markdown text to parse
 * @returns Array of extracted code snippets
 */
export function extractCodeSnippets(text: string): CodeSnippet[] {
  if (!text) return [];

  const lines = text.split("\n");
  const codeSnippets: CodeSnippet[] = [];
  
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLanguage = "";
  let startLine = 0;
  let snippetCounter = 0;

  lines.forEach((line, index) => {
    // Handle code blocks
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        // Starting a code block
        inCodeBlock = true;
        codeLanguage = line.replace("```", "").trim();
        codeContent = [];
        startLine = index + 1; // Start after the opening fence
      } else {
        // Ending a code block
        inCodeBlock = false;
        
        // Create code snippet if we have content
        if (codeContent.length > 0) {
          const snippet: CodeSnippet = {
            id: `snippet_${Date.now()}_${snippetCounter++}`,
            language: codeLanguage || "text",
            content: codeContent.join("\n"),
            startLine,
            endLine: index - 1, // End before the closing fence
          };
          codeSnippets.push(snippet);
        }
        
        // Reset for next code block
        codeContent = [];
        codeLanguage = "";
      }
      return;
    }

    // Collect code content when inside a code block
    if (inCodeBlock) {
      codeContent.push(line);
    }
  });

  return codeSnippets;
}

/**
 * Detects the programming language from various language identifiers
 * @param language - The language string from markdown fence
 * @returns Normalized language identifier for Monaco Editor
 */
export function normalizeLanguage(language: string): string {
  if (!language) return "text";
  
  const lang = language.toLowerCase().trim();
  
  // Language mappings for Monaco Editor
  const languageMap: Record<string, string> = {
    // JavaScript variants
    "js": "javascript",
    "jsx": "javascript",
    "node": "javascript",
    "nodejs": "javascript",
    
    // TypeScript variants
    "ts": "typescript",
    "tsx": "typescript",
    
    // Python variants
    "py": "python",
    "python3": "python",
    
    // Web technologies
    "html": "html",
    "htm": "html",
    "css": "css",
    "scss": "scss",
    "sass": "sass",
    "less": "less",
    
    // Shell/Bash
    "sh": "shell",
    "bash": "shell",
    "zsh": "shell",
    "fish": "shell",
    
    // Database
    "sql": "sql",
    "mysql": "sql",
    "postgresql": "sql",
    "postgres": "sql",
    
    // Configuration
    "json": "json",
    "yaml": "yaml",
    "yml": "yaml",
    "xml": "xml",
    "toml": "toml",
    
    // Other languages
    "java": "java",
    "cpp": "cpp",
    "c++": "cpp",
    "c": "c",
    "cs": "csharp",
    "csharp": "csharp",
    "php": "php",
    "ruby": "ruby",
    "rb": "ruby",
    "go": "go",
    "rust": "rust",
    "rs": "rust",
    "swift": "swift",
    "kotlin": "kotlin",
    "kt": "kotlin",
    "scala": "scala",
    "r": "r",
    "matlab": "matlab",
    "perl": "perl",
    "lua": "lua",
    "dart": "dart",
    
    // Markup/Documentation
    "markdown": "markdown",
    "md": "markdown",
    "tex": "latex",
    "latex": "latex",
    
    // Build/Config files
    "dockerfile": "dockerfile",
    "makefile": "makefile",
    "make": "makefile",
  };
  
  return languageMap[lang] || lang || "text";
}

/**
 * Checks if a message contains any code snippets
 * @param text - The message text to check
 * @returns Boolean indicating if code snippets are present
 */
export function hasCodeSnippets(text: string): boolean {
  if (!text) return false;
  return text.includes("```");
}

/**
 * Gets a summary of code snippets in a message
 * @param codeSnippets - Array of code snippets
 * @returns Human-readable summary
 */
export function getCodeSnippetsSummary(codeSnippets: CodeSnippet[]): string {
  if (!codeSnippets || codeSnippets.length === 0) {
    return "No code snippets";
  }
  
  if (codeSnippets.length === 1) {
    const snippet = codeSnippets[0];
    const lines = snippet.content.split("\n").length;
    return `1 ${snippet.language} snippet (${lines} lines)`;
  }
  
  const languages = [...new Set(codeSnippets.map(s => s.language))];
  const totalLines = codeSnippets.reduce((sum, s) => sum + s.content.split("\n").length, 0);
  
  return `${codeSnippets.length} snippets (${languages.join(", ")}) - ${totalLines} lines total`;
}