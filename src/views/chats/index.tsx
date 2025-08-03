import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useChatContext, type Message } from "../../context/ChatContext";
import { extractCodeSnippets } from "../../utils/codeExtractor";
import ChatConversation from "./ChatConversation";

interface ConversationMessageResponse {
  query: string;
  response: string;
  timestamp: string;
}

function ChatModule() {
  const { chatId } = useParams<{ chatId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { state, actions } = useChatContext();
  const initialMessageRef = useRef<string>(location.state?.initialMessage);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [hasLoadedConversation, setHasLoadedConversation] = useState(false);

  // Load existing messages from API for existing conversations
  const loadExistingMessages = async (conversationId: string) => {
    if (hasLoadedConversation || isLoadingConversation) return;

    setIsLoadingConversation(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/conversation/${conversationId}`
      );

      if (response.ok) {
        const data = await response.json();
        const existingMessages: ConversationMessageResponse[] =
          data.messages || [];

        console.log("Loaded existing messages:", existingMessages);

        if (!existingMessages || existingMessages.length === 0) {
          console.warn("No messages found for conversation:", conversationId);
          return;
        }

        const messages: Message[] = [];
        for (const message of existingMessages) {
          const userMessage: Message = {
            id: message.timestamp + "_user",
            content: message.query,
            timestamp: new Date(message.timestamp),
            role: "user",
          };
          const assistentMessage: Message = {
            id: message.timestamp + "_assistant",
            content: message.response,
            timestamp: new Date(message.timestamp),
            role: "assistant",
          };
          // Extract code snippets for each message
          const codeSnippets = extractCodeSnippets(message.response);
          if (codeSnippets.length > 0) {
            assistentMessage.codeSnippets = codeSnippets;
          }
          messages.push(userMessage, assistentMessage);
        }
        actions.addChat(conversationId, messages);
        console.log("Added messages to chat state:", messages);
      } else if (response.status !== 404) {
        // Only log error if it's not a 404 (conversation not found)
        console.error("Failed to load existing messages:", response.status);
      }
    } catch (error) {
      console.error("Error loading existing messages:", error);
    } finally {
      setIsLoadingConversation(false);
      setHasLoadedConversation(true);
    }
  };

  useEffect(() => {
    if (!chatId) {
      navigate("/chat/new");
      return;
    }

    // Set current chat and load messages if it's an existing conversation
    actions.setCurrentChat(chatId);

    // Check if chat already exists in state, if not try to load from API
    if (!state.chats[chatId]) {
      loadExistingMessages(chatId);
    } else {
      // Chat exists in state, no need to load from API
      setHasLoadedConversation(true);
    }
  }, [chatId]);

  console.log("Chat state:", state);

  // Show loading state while fetching conversation
  if (isLoadingConversation) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  // If chat doesn't exist after loading, redirect to new chat
  if (chatId && !state.chats[chatId] && hasLoadedConversation) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Chat not found
          </h2>
          <p className="text-gray-600 mb-4">
            The chat you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/chat/new")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Start New Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <ChatConversation
      chatId={chatId as string}
      initialMessage={initialMessageRef}
    />
  );
}

export default ChatModule;
