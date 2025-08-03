import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";

function NewChatScreen() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const { actions } = useChatContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Generate a new UUID for chat ID
    const chatId = crypto.randomUUID();

    // Create a chat title from the first message (truncated)
    const title = input.length > 50 ? input.substring(0, 47) + "..." : input;

    // Create the chat
    actions.createChat(chatId, title);
    actions.setCurrentChat(chatId);

    // Navigate to the chat page
    navigate(`/chat/${chatId}`, { state: { initialMessage: input } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background p-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to Chat
          </h1>
          <p className="text-xl text-muted-foreground">
            Start a conversation with AI. Ask anything you'd like to know.
          </p>
        </div>

        {/* Suggested prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            "Explain quantum computing in simple terms",
            "Help me write a professional email",
            "Create a plan for learning React",
            "Suggest a healthy meal plan for the week",
          ].map((prompt, index) => (
            <Card
              key={index}
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50"
              onClick={() => setInput(prompt)}
            >
              <CardContent className="p-4">
                <span className="text-sm text-card-foreground">{prompt}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Input form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                  className="min-h-[120px] resize-none"
                  autoFocus
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                  {input.length} characters
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={!input.trim()} size="lg">
                  Start Chat
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Your conversations are processed securely.
            <br />
            Type your question above to begin.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewChatScreen;
