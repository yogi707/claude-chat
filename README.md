# Claude Chat Application

A modern, real-time chat application built with React, TypeScript, and Tailwind CSS. Features AI-powered conversations with code snippet extraction, syntax highlighting, and a collapsible sidebar for navigation.

## 🚀 Features

- **Real-time AI Chat**: Stream responses from AI with Server-Sent Events
- **Code Snippet Extraction**: Automatically detects and displays code blocks from responses
- **Syntax Highlighting**: Monaco Editor integration with 50+ language support
- **Collapsible Sidebar**: Minified sidebar for better space utilization
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Light Theme Only**: Forced light theme regardless of system preferences
- **Resizable Interface**: Adjustable panels between chat and code preview
- **Chat History**: Persistent chat sessions with conversation management

## 📁 Project Structure

```
claude-chat/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx              # Shadcn Button component
│   │   │   ├── card.tsx                # Shadcn Card component
│   │   │   └── textarea.tsx            # Shadcn Textarea component
│   │   ├── ChatDisplay.tsx             # Message list display
│   │   ├── ChatInput.tsx               # Message input component
│   │   ├── ChatLayout.tsx              # HOC layout wrapper
│   │   ├── ChatMessage.tsx             # Individual message component
│   │   ├── ChatPanel.tsx               # Main chat interface
│   │   ├── ChatPreview.tsx             # Code preview panel
│   │   ├── CodePanel.tsx               # Monaco Editor code viewer
│   │   ├── NewChatScreen.tsx           # New chat creation screen
│   │   ├── NotFound.tsx                # 404 error page
│   │   └── Sidebar.tsx                 # Collapsible navigation sidebar
│   ├── context/
│   │   └── ChatContext.tsx             # Global state management
│   ├── lib/
│   │   └── utils.ts                    # Utility functions
│   ├── utils/
│   │   ├── codeExtractor.ts            # Code block extraction logic
│   │   └── formatter.tsx               # Markdown to JSX formatter
│   ├── views/
│   │   └── chats/
│   │       ├── index.tsx               # Chat route handler
│   │       └── ChatConversation.tsx    # Chat conversation layout
│   ├── App.tsx                         # Main application component
│   ├── main.tsx                        # Application entry point
│   └── index.css                       # Global styles and theme
├── index.html                          # HTML template
├── package.json                        # Dependencies and scripts
└── README.md                           # This file
```

## 🛣️ Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Redirect | Redirects to `/chat/new` |
| `/chat/new` | `NewChatScreen` | Create new chat interface |
| `/chat/:chatId` | `ChatModule` | Active chat conversation |
| `*` | `NotFound` | 404 error page |

## 🔧 Key Components

### Core Components

- **`ChatLayout`**: HOC that wraps all chat routes with sidebar navigation
- **`Sidebar`**: Collapsible navigation with chat list and new chat button
- **`ChatPanel`**: Main chat interface with message display and input
- **`CodePanel`**: Monaco Editor for syntax-highlighted code viewing
- **`ChatPreview`**: Resizable code preview panel

### UI Components

- **`ChatDisplay`**: Renders list of messages with infinite scroll
- **`ChatMessage`**: Individual message bubble with timestamp and actions
- **`ChatInput`**: Text input with send functionality and keyboard shortcuts
- **`NewChatScreen`**: Landing page with suggested prompts

### Utility Components

- **`ChatContext`**: Global state management using React Context + useReducer
- **`codeExtractor`**: Regex-based markdown code block extraction
- **`formatter`**: Converts markdown text to React JSX elements

## 🌊 Application Flow

### 1. New Chat Creation
```
User visits / → Redirects to /chat/new → NewChatScreen
↓
User types message → Creates new chat with UUID → Navigates to /chat/{id}
↓
Initial message sent to API → Streaming response begins
```

### 2. Chat Conversation
```
/chat/{id} → ChatModule → Loads existing messages from API
↓
ChatLayout wraps with Sidebar → Chat history displayed
↓
User sends message → Streaming API call → Real-time response
↓
Code extraction → Monaco Editor display → Artifact buttons
```

### 3. Code Snippet Workflow
```
AI Response → Markdown parsing → Code block detection
↓
Extract language & content → Create CodeSnippet objects
↓
Display "View Artifacts" buttons → Click → Monaco Editor preview
↓
Syntax highlighting → Copy functionality → Multiple snippet navigation
```

## 🔄 Data Flow

### State Management
- **Context API**: Global chat state with useReducer
- **Actions**: `addMessage`, `updateMessage`, `createChat`, `setCurrentChat`
- **Persistence**: Chat data stored in memory (can be extended to localStorage)

### API Integration
- **Endpoint**: `http://localhost:8000/api/v1/query/stream`
- **Method**: POST with Server-Sent Events
- **Load Messages**: `http://localhost:8000/api/v1/conversation/{id}`
- **Real-time**: Streaming responses with accumulation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd claude-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint for code quality |

## 🛠️ Development

### Adding New Components
1. Create component in appropriate folder (`/components` or `/views`)
2. Export from component file
3. Import and use in parent components
4. Add to routing if needed in `App.tsx`

### Styling Guidelines
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Pre-built components with consistent design
- **Light Theme**: Forced light theme - no dark mode support
- **Responsive**: Mobile-first approach with responsive utilities

### API Integration
- **Streaming**: Use Server-Sent Events for real-time responses
- **Error Handling**: Graceful fallbacks for API failures
- **Loading States**: Show appropriate loading indicators

## 🎨 Customization

### Theme Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;        /* Primary button color */
  --primary-foreground: 210 40% 98%;    /* Primary button text */
  --background: 0 0% 100%;              /* Page background */
  --foreground: 222.2 84% 4.9%;         /* Text color */
}
```

### Adding Languages
Add language mappings in `src/utils/codeExtractor.ts`:
```typescript
const languageMap: Record<string, string> = {
  "your-lang": "monaco-editor-lang",
  // ...
};
```

## 📱 Features in Detail

### Sidebar
- **Collapsible**: Toggle between full and minified views
- **Chat List**: Sorted by recent activity
- **New Chat**: Quick access button
- **Active State**: Highlights current conversation

### Code Handling
- **Extraction**: Regex-based markdown parsing
- **Languages**: 50+ programming languages supported
- **Preview**: Monaco Editor with syntax highlighting
- **Navigation**: Multiple snippets per message

### Responsive Design
- **Mobile**: Optimized for touch interfaces
- **Desktop**: Full-featured with resizable panels
- **Adaptive**: Smooth transitions between screen sizes

## 🐛 Troubleshooting

### Common Issues

**Chat not loading**
- Ensure backend API is running on `http://localhost:8000`
- Check browser console for CORS errors

**Dark mode appearing**
- Clear browser cache and refresh
- Check if browser extensions are forcing dark mode

**Code not highlighting**
- Verify language is supported in `codeExtractor.ts`
- Check Monaco Editor loading in browser dev tools

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React**: UI framework
- **Tailwind CSS**: Styling framework
- **Shadcn UI**: Component library
- **Monaco Editor**: Code editor
- **Lucide React**: Icon library
- **React Router**: Navigation