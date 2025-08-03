import { type ReactNode } from "react";
import Sidebar from "./Sidebar";

interface ChatLayoutProps {
  children: ReactNode;
}

function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}

export default ChatLayout;