import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ChatModule from "./views/chats";
import NewChatScreen from "./components/NewChatScreen";
import NotFound from "./components/NotFound";
import { ChatProvider } from "./context/ChatContext";

function App() {
  return (
    <ChatProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/chat/new" replace />} />
          <Route path="/chat/new" element={<NewChatScreen />} />
          <Route path="/chat/:chatId" element={<ChatModule />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ChatProvider>
  );
}

export default App;
