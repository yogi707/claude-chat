import { createContext, useContext, useReducer, type ReactNode } from "react";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  isStreaming?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatState {
  chats: Record<string, Chat>;
  currentChatId: string | null;
  isStreaming: boolean;
}

type ChatAction =
  | { type: "CREATE_CHAT"; payload: { chatId: string; title: string } }
  | { type: "SET_CURRENT_CHAT"; payload: string }
  | { type: "ADD_MESSAGE"; payload: { chatId: string; message: Message } }
  | {
      type: "UPDATE_MESSAGE";
      payload: { chatId: string; messageId: string; updates: Partial<Message> };
    }
  | { type: "SET_STREAMING"; payload: boolean }
  | { type: "CLEAR_CURRENT_CHAT" };

const initialState: ChatState = {
  chats: {},
  currentChatId: null,
  isStreaming: false,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "CREATE_CHAT": {
      const newChat: Chat = {
        id: action.payload.chatId,
        title: action.payload.title,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.payload.chatId]: newChat,
        },
      };
    }

    case "SET_CURRENT_CHAT":
      return {
        ...state,
        currentChatId: action.payload,
      };

    case "ADD_MESSAGE": {
      const { chatId, message } = action.payload;
      if (!state.chats[chatId]) return state;

      return {
        ...state,
        chats: {
          ...state.chats,
          [chatId]: {
            ...state.chats[chatId],
            messages: [...state.chats[chatId].messages, message],
            updatedAt: new Date(),
          },
        },
      };
    }

    case "UPDATE_MESSAGE": {
      const { messageId, updates } = action.payload;
      const targetChat = state.chats[action.payload.chatId];
      if (!targetChat) return state;

      return {
        ...state,
        chats: {
          ...state.chats,
          [action.payload.chatId]: {
            ...targetChat,
            messages: targetChat.messages.map((msg) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
            updatedAt: new Date(),
          },
        },
      };
    }

    case "SET_STREAMING":
      return {
        ...state,
        isStreaming: action.payload,
      };

    case "CLEAR_CURRENT_CHAT":
      return {
        ...state,
        currentChatId: null,
      };

    default:
      return state;
  }
}

interface ChatContextType {
  state: ChatState;
  actions: {
    createChat: (chatId: string, title: string) => void;
    setCurrentChat: (chatId: string) => void;
    addMessage: (chatId: string, message: Message) => void;
    updateMessage: (
      chatId: string,
      messageId: string,
      updates: Partial<Message>
    ) => void;
    setStreaming: (isStreaming: boolean) => void;
    clearCurrentChat: () => void;
    getCurrentChat: () => Chat | null;
  };
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const actions = {
    createChat: (chatId: string, title: string) => {
      dispatch({ type: "CREATE_CHAT", payload: { chatId, title } });
    },
    setCurrentChat: (chatId: string) => {
      dispatch({ type: "SET_CURRENT_CHAT", payload: chatId });
    },
    addMessage: (chatId: string, message: Message) => {
      dispatch({ type: "ADD_MESSAGE", payload: { chatId, message } });
    },
    updateMessage: (
      chatId: string,
      messageId: string,
      updates: Partial<Message>
    ) => {
      dispatch({
        type: "UPDATE_MESSAGE",
        payload: { chatId, messageId, updates },
      });
    },
    setStreaming: (isStreaming: boolean) => {
      dispatch({ type: "SET_STREAMING", payload: isStreaming });
    },
    clearCurrentChat: () => {
      dispatch({ type: "CLEAR_CURRENT_CHAT" });
    },
    getCurrentChat: (): Chat | null => {
      return state.currentChatId
        ? state.chats[state.currentChatId] || null
        : null;
    },
  };

  return (
    <ChatContext.Provider value={{ state, actions }}>
      {children}
    </ChatContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
