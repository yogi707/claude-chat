import { useEffect, type RefObject } from "react";
import ChatDisplay from "./ChatDisplay";
import ChatInput from "./ChatInput";
import { useChatContext, type Message } from "../context/ChatContext";

interface ChatPanelProps {
  chatId: string;
  onMessageSelect?: (message: Message) => void;
  initialMessage?: RefObject<string>;
}

interface StreamChunk {
  text: string;
  model: string;
  done: boolean;
  error: string | null;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

function ChatPanel({
  chatId,
  onMessageSelect,
  initialMessage,
}: ChatPanelProps) {
  const { state, actions } = useChatContext();
  const currentChat = actions.getCurrentChat();
  const messages = currentChat?.messages || [];
  const isStreaming = state.isStreaming;

  // Handle initial message from new chat screen
  useEffect(() => {
    if (initialMessage?.current && messages.length === 0) {
      const messageToSend = initialMessage.current;
      initialMessage.current = ""; // Clear immediately to prevent re-sending
      handleSendMessage(messageToSend);
    }
  }, [initialMessage, messages.length]);

  const handleStreamingResponse = async (query: string) => {
    const response = await fetch("http://localhost:8000/api/v1/query/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({
        query,
        conversation_id: chatId,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("Failed to get response reader");
    }

    // Create placeholder message for streaming content
    const assistantMessageId = (Date.now() + 1).toString();
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isStreaming: true,
    };

    actions.addMessage(chatId, initialAssistantMessage);

    let accumulatedContent = "";
    let modelInfo = "";
    let finalUsage = undefined;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim() === "") continue;

          // Handle SSE format - look for lines that start with "data: "
          let jsonData = line;
          if (line.startsWith("data: ")) {
            jsonData = line.substring(6); // Remove "data: " prefix
          }

          // Skip if it's not a data line or empty
          if (jsonData.trim() === "") continue;

          try {
            const data: StreamChunk = JSON.parse(jsonData);

            // Handle error in chunk
            if (data.error) {
              throw new Error(data.error);
            }

            // Add text content to accumulated content
            if (data.text) {
              accumulatedContent += data.text;
            }

            // Store model info (will be the same for all chunks)
            if (data.model) {
              modelInfo = data.model;
            }

            // Store usage info if present (typically in final chunk)
            if (data.usage) {
              finalUsage = data.usage;
            }

            // Update the message content in real-time
            actions.updateMessage(chatId, assistantMessageId, {
              content: accumulatedContent,
              model: modelInfo,
              ...(finalUsage && { usage: finalUsage }),
              isStreaming: !data.done, // Stop streaming when done
            });

            // If this is the final chunk, we can break
            if (data.done) {
              break;
            }
          } catch (parseError) {
            console.warn("Failed to parse chunk:", jsonData, parseError);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    actions.addMessage(chatId, userMessage);
    actions.setStreaming(true);

    try {
      await handleStreamingResponse(content);
    } catch (error) {
      console.error("Streaming API call failed:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I'm having trouble connecting to the server. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      };

      actions.addMessage(chatId, errorMessage);
    } finally {
      actions.setStreaming(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      <div className="flex-1 flex flex-col min-h-0">
        <ChatDisplay messages={messages} onMessageSelect={onMessageSelect} />
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isStreaming}
          placeholder={
            isStreaming ? "AI is responding..." : "Type a message..."
          }
        />
      </div>
    </div>
  );
}

export default ChatPanel;
