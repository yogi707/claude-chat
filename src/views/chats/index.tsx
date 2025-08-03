import { useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useChatContext } from "../../context/ChatContext";
import ChatConversation from "./ChatConversation";

function ChatModule() {
  const { chatId } = useParams<{ chatId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { state, actions } = useChatContext();
  const initialMessageRef = useRef<string>(location.state?.initialMessage);

  useEffect(() => {
    if (!chatId) {
      navigate("/chat/new");
      return;
    }
    // Set current chat
    actions.setCurrentChat(chatId);
  }, [chatId]);

  // If chat doesn't exist, redirect to new chat
  if (chatId && !state.chats[chatId]) {
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
