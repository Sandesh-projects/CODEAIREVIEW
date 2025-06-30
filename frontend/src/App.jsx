import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Sparkles,
  Loader2,
  Send,
  User,
  Bot,
  MessageSquare,
  Trash2,
} from "lucide-react";

function App() {
  const [currentMessage, setCurrentMessage] = useState(""); // For the chat input
  const [messages, setMessages] = useState([]); // Stores chat history: [{ type: 'user' | 'ai', content: '...', timestamp: '...' }]
  const [chatLoading, setChatLoading] = useState(false); // For the chat input loading spinner
  const messagesEndRef = useRef(null); // Ref for scrolling to the latest message in the chat
  const chatInputRef = useRef(null); // Ref for the chat text area

  // Scroll to the bottom of the chat only when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]); // Dependency on messages ensures scroll on new message

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || chatLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: currentMessage,
      timestamp: new Date().toLocaleTimeString(),
      isExpanded: false, // Initialize as not expanded
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setCurrentMessage(""); // Clear the input

    setChatLoading(true);

    try {
      const codeContent = userMessage.content; // Treat the entire message as code for review

      const response = await axios.post(
        "https://codeaireview.onrender.com/ai/get-review",
        {
          code: codeContent,
        }
      );
      const aiResponseContent =
        response.data.suggestion || "No suggestion received.";
      const newAiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: aiResponseContent,
        timestamp: new Date().toLocaleTimeString(),
        isExpanded: false, // Initialize as not expanded
      };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
    } catch (error) {
      console.error("Error during AI interaction:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "❌ Error processing your request. Please try again.",
        timestamp: new Date().toLocaleTimeString(),
        isExpanded: false, // Initialize as not expanded
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
    setChatLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentMessage("");
  };

  const toggleMessageExpansion = (id) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, isExpanded: !msg.isExpanded } : msg
      )
    );
  };

  // This is the combined render function for all messages in the chat panel
  const renderMessageContent = (msg) => {
    // For AI messages, use ReactMarkdown with SyntaxHighlighter
    if (msg.type === "ai") {
      return (
        <div className="prose prose-invert prose-purple max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  // Block code (with language specified)
                  <div className="rounded-lg overflow-x-auto border border-slate-600/50 my-4">
                    {" "}
                    {/* Changed to overflow-x-auto */}
                    <SyntaxHighlighter
                      language={match[1]}
                      style={oneDark}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        background: "rgba(15, 23, 42, 0.8)",
                        padding: "1em", // Add padding to the code block itself
                        // Removed whiteSpace and wordBreak from here for horizontal scroll
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily: "monospace", // Ensure monospace font
                        },
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  // Inline code
                  <code
                    className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30 text-sm"
                    style={{
                      whiteSpace: "pre-wrap", // Keep wrapping for inline code
                      wordBreak: "break-all", // Break long words for inline code
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-slate-600/50">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-slate-200 mb-3 mt-6">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-medium text-slate-300 mb-2 mt-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-slate-300 mb-4 leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-2">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-slate-300">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-500/10 rounded-r-lg mb-4">
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="text-purple-300 font-semibold">
                  {children}
                </strong>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {children}
                </a>
              ),
            }}
          >
            {msg.content}
          </ReactMarkdown>
        </div>
      );
    }
    // For user messages (which could be plain text or code)
    const MAX_LINES = 3; // Max lines to show before truncating
    const contentLines = msg.content.split("\n");
    const isTruncated =
      contentLines.length > MAX_LINES || msg.content.length > 200; // Also truncate if very long single line

    return (
      <div className="relative">
        <p
          className={`text-slate-200 whitespace-pre-wrap ${
            msg.isExpanded ? "" : "line-clamp-3"
          }`}
          // Adding word-break for user messages too, in case they paste long un-breakable strings
          style={{ wordBreak: "break-word" }}
        >
          {msg.content}
        </p>
        {isTruncated && (
          <button
            onClick={() => toggleMessageExpansion(msg.id)}
            className="text-purple-300 hover:underline text-sm mt-1 block"
          >
            {msg.isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background SVG dots */}
      <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-20'></div>

      {/* Main Content - Takes full width and height */}
      <div className="relative z-10 w-full h-screen flex justify-center items-center">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-1 w-full h-full max-w-full max-h-full">
          {/* AI Assistant Container (takes whole width and height of its parent) */}
          <div className="w-full flex flex-col">
            {/* Transparent Gradient Overlay for Title */}
            <div className="absolute top-0 left-0 w-full p-6 pb-4 bg-gradient-to-b from-slate-800/90 to-transparent z-20">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                AI Code Review Chat
              </h1>
            </div>

            {/* Chat Header (moved down to accommodate the overlay title) */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-700/50 mt-[70px]"></div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.length === 0 && !chatLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-600/30 text-center max-w-md">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                    <h3 className="text-lg font-medium text-slate-300 mb-2">
                      Start a Conversation
                    </h3>
                    <p className="text-sm text-slate-400">
                      I'm ready to review your code! Just paste it in the input
                      area below.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-[80%] ${
                          // This max-w applies to the entire message bubble
                          message.type === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === "user"
                              ? "bg-purple-600 ml-3"
                              : "bg-emerald-600 mr-3"
                          }`}
                        >
                          {message.type === "user" ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.type === "user"
                              ? "bg-purple-600 text-white"
                              : "bg-slate-700/80 text-slate-200"
                          }`}
                          style={{ overflowWrap: "break-word" }}
                        >
                          <div className="prose prose-sm max-w-none">
                            {renderMessageContent(message)}
                          </div>
                          <div
                            className={`text-xs mt-2 opacity-70 ${
                              message.type === "user"
                                ? "text-purple-200"
                                : "text-slate-400"
                            }`}
                          >
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="flex flex-row">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600 mr-3">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-slate-700/80 rounded-2xl px-4 py-3">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-6 pt-4 border-t border-slate-700/50">
              <div className="flex space-x-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    ref={chatInputRef}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Paste your code here for review (Ctrl+V or Cmd+V)" // More descriptive
                    className="w-full p-4 pr-20 bg-slate-900/80 border border-slate-600/50 rounded-xl text-base text-slate-200 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 min-h-[60px]" // Larger padding, font, min-height
                    rows="3" // Default to 3 rows
                    disabled={chatLoading}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                    Shift+Enter for new line
                    <br />
                    Enter to send
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || chatLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px] h-[44px]"
                >
                  {chatLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
