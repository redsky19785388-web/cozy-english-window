"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Sender = "user" | "ai";

interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const AI_NAME = "モカ";
const AI_AVATAR = "🐱";

const INITIAL_MESSAGES: Message[] = [
  {
    id: "init-1",
    sender: "ai",
    text: `やあ！ぼく${AI_NAME}だよ。いま英語圏のスーパーにいるんだけど、困ってて…😢\n\nお店の人に「袋はいりますか？」って聞かれたんだと思うんだけど、なんて返せばよかったの？`,
    timestamp: new Date(),
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatTime(date: Date): string {
  return date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createAiReply(userText: string): Message {
  return {
    id: `ai-${Date.now()}`,
    sender: "ai",
    text: `教えてくれてありがとう！明日さっそく「${userText}」って言ってみるね！😊`,
    timestamp: new Date(),
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Typing indicator shown while AI "thinks" */
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-4">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e8dfd0] flex items-center justify-center text-base select-none">
        {AI_AVATAR}
      </div>
      {/* Bubble */}
      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1 h-4">
          <span className="w-2 h-2 rounded-full bg-[#a89a87] dot-1" />
          <span className="w-2 h-2 rounded-full bg-[#a89a87] dot-2" />
          <span className="w-2 h-2 rounded-full bg-[#a89a87] dot-3" />
        </div>
      </div>
    </div>
  );
}

/** Single chat bubble */
function ChatBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1 px-4">
        <div className="flex items-end gap-2">
          {/* Timestamp */}
          <span className="text-xs text-[#a89a87] mb-1 flex-shrink-0">
            {formatTime(message.timestamp)}
          </span>
          {/* Bubble */}
          <div
            className="max-w-[72vw] bg-[#5b9c6a] text-white rounded-2xl rounded-br-md px-4 py-3 shadow-sm"
            style={{ wordBreak: "break-word" }}
          >
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {message.text}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1 px-4">
      <div className="flex items-end gap-2">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e8dfd0] flex items-center justify-center text-base select-none">
          {AI_AVATAR}
        </div>
        {/* Bubble + timestamp */}
        <div className="flex items-end gap-2">
          <div
            className="max-w-[72vw] bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm"
            style={{ wordBreak: "break-word" }}
          >
            <p className="text-base leading-relaxed text-[#3d3530] whitespace-pre-wrap">
              {message.text}
            </p>
          </div>
          <span className="text-xs text-[#a89a87] mb-1 flex-shrink-0">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function Home() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom whenever messages change or typing state changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-resize textarea
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      // Reset height first to recalculate
      e.target.style.height = "auto";
      const maxHeight = 120; // ~5 lines
      e.target.style.height =
        Math.min(e.target.scrollHeight, maxHeight) + "px";
    },
    []
  );

  const sendMessage = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isSending) return;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsSending(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    // Show typing indicator after short delay
    setTimeout(() => {
      setIsTyping(true);
    }, 300);

    // AI reply after 1.8 seconds
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, createAiReply(text)]);
      setIsSending(false);
    }, 1800);
  }, [inputValue, isSending]);

  // Submit on Enter (but Shift+Enter = newline)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    /*
     * h-[100dvh]: uses Dynamic Viewport Height — accounts for mobile browser
     * chrome (address bar) shrinking/growing, so the layout never overflows.
     */
    <div className="flex flex-col h-[100dvh] bg-[#f0ece4] overflow-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 pt-safe-top pb-3 pt-3 bg-[#fdfbf7] border-b border-[#e8dfd0] shadow-sm z-10">
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-[#e8dfd0] flex items-center justify-center text-xl select-none">
            {AI_AVATAR}
          </div>
          {/* Online dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#fdfbf7]" />
        </div>

        {/* Name & status */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#3d3530] text-base leading-tight truncate">
            {AI_NAME}
          </p>
          <p className="text-xs text-[#a89a87] leading-tight mt-0.5">
            英語圏のスーパーで困り中 🛒
          </p>
        </div>

        {/* Scenario badge */}
        <div className="flex-shrink-0 bg-[#d4a574]/20 text-[#8d7b68] text-xs font-medium px-2.5 py-1 rounded-full">
          Day 1
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Chat log — scrollable                                               */}
      {/* ------------------------------------------------------------------ */}
      <main className="flex-1 overflow-y-auto chat-scroll py-4 flex flex-col gap-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={chatEndRef} className="h-1" />
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* Input area — stays above software keyboard                          */}
      {/* ------------------------------------------------------------------ */}
      <footer className="flex-shrink-0 bg-[#fdfbf7] border-t border-[#e8dfd0] px-3 py-3 pb-safe-bottom">
        <div className="flex items-end gap-2">
          {/* Textarea */}
          <div className="flex-1 bg-[#f5f1e8] rounded-2xl border border-[#d4c4b0] focus-within:border-[#8d7b68] focus-within:ring-2 focus-within:ring-[#8d7b68]/20 transition-all duration-150">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="英語フレーズを教えてあげよう…"
              rows={1}
              disabled={isSending}
              /*
               * text-base = 16px — prevents iOS Safari from auto-zooming
               * when the input receives focus (iOS zooms for < 16px inputs).
               */
              className="w-full resize-none bg-transparent text-base text-[#3d3530] placeholder-[#c0b4a6] px-4 py-3 rounded-2xl outline-none leading-relaxed disabled:opacity-50"
              style={{ maxHeight: "120px", overflowY: "auto" }}
            />
          </div>

          {/* Send button — minimum 44×44px tap target */}
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isSending}
            aria-label="送信"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150
              bg-[#5b9c6a] text-white shadow-md
              hover:bg-[#4e8a5d] active:scale-95
              disabled:bg-[#c0b4a6] disabled:shadow-none disabled:cursor-not-allowed"
          >
            {isSending ? (
              /* Spinner */
              <svg
                className="w-5 h-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              /* Send icon */
              <svg
                className="w-5 h-5 translate-x-px"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </div>

        {/* Helper hint */}
        <p className="text-center text-xs text-[#c0b4a6] mt-2 leading-none">
          Enterで送信 · Shift+Enterで改行
        </p>
      </footer>
    </div>
  );
}
