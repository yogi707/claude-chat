import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import { Button } from "./ui/button";
import { Plus, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const { state } = useChatContext();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleNewChat = () => {
    navigate("/chat/new");
  };

  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const chatList = Object.entries(state.chats)
    .map(([id, chat]) => ({
      id,
      title: chat.title,
      lastMessage:
        chat.messages[chat.messages.length - 1]?.timestamp || new Date(),
    }))
    .sort((a, b) => b.lastMessage.getTime() - a.lastMessage.getTime());

  return (
    <div
      className={`bg-card border-r border-border flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat
          </h2>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <MessageSquare className="h-5 w-5 text-card-foreground" />
          </div>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={handleNewChat}
          className={`w-full transition-all duration-300 ${
            isCollapsed ? "justify-center px-0" : "justify-start gap-2"
          }`}
          variant="outline"
          title={isCollapsed ? "New Chat" : undefined}
        >
          <Plus className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && "New Chat"}
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {chatList.length > 0
            ? chatList.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className={`w-full text-left rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground ${
                    state.currentChatId === chat.id
                      ? "bg-primary"
                      : "text-card-foreground"
                  } ${isCollapsed ? "p-2 justify-center" : "p-3"}`}
                  title={isCollapsed ? chat.title : undefined}
                >
                  {isCollapsed ? (
                    <div className="flex justify-center">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                  ) : (
                    <div>
                      <div className="truncate text-sm font-medium">
                        {chat.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {chat.lastMessage.toLocaleString()}
                      </div>
                    </div>
                  )}
                </button>
              ))
            : !isCollapsed && (
                <div className="text-center text-muted-foreground text-sm p-4">
                  No chats yet. Start a new conversation!
                </div>
              )}
        </div>
      </div>

      {/* Toggle Button at Bottom */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={toggleSidebar}
          variant="outline"
          size="sm"
          className={`transition-all duration-300 ${
            isCollapsed
              ? "w-full h-8 p-0 justify-center"
              : "w-full h-8 justify-center"
          }`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
