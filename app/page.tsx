"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Sender = "USER" | "MOKA";

interface DbMessage {
  id: number;
  text: string;
  sender: Sender;
  createdAt: string;
}

interface UiMessage {
  // Use string so we can handle both DB ids (number) and optimistic ids
  id: string;
  sender: Sender;
  text: string;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const AI_NAME = "モカ";
const AI_AVATAR = "🐱";

// Shown only when the DB is empty (first visit ever)
const WELCOME_MESSAGE: UiMessage = {
  id: "welcome",
  sender: "MOKA",
  text: `やあ！ぼく${AI_NAME}だよ。いま英語圏のスーパーにいるんだけど、困ってて…😢\n\nレジで店員さんに何か聞かれたんだけど、なんて言えばよかったのかな？英語で教えてくれる？`,
  createdAt: new Date(),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatTime(date: Date): string {
  return date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toUiMessage(msg: DbMessage): UiMessage {
  return {
    id: String(msg.id),
    sender: msg.sender,
    text: msg.text,
    createdAt: new Date(msg.createdAt),
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e8dfd0] flex items-center justify-center text-base select-none">
        {AI_AVATAR}
      </div>
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

function ChatBubble({ message }: { message: UiMessage }) {
  const isUser = message.sender === "USER";

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1 px-4">
        <div className="flex items-end gap-2">
          <span className="text-xs text-[#a89a87] mb-1 flex-shrink-0">
            {formatTime(message.createdAt)}
          </span>
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
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e8dfd0] flex items-center justify-center text-base select-none">
          {AI_AVATAR}
        </div>
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
            {formatTime(message.createdAt)}
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
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // --------------------------------------------------------------------------
  // Load conversation history from DB on mount
  // --------------------------------------------------------------------------
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/chat");
        if (!res.ok) throw new Error("Failed to load history");
        const data: DbMessage[] = await res.json();

        if (data.length === 0) {
          // First visit: show welcome message (not persisted)
          setMessages([WELCOME_MESSAGE]);
        } else {
          setMessages(data.map(toUiMessage));
        }
      } catch (e) {
        console.error(e);
        setMessages([WELCOME_MESSAGE]);
      } finally {
        setIsLoadingHistory(false);
      }
    }
    loadHistory();
  }, []);

  // Scroll to bottom on new messages / typing state change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // --------------------------------------------------------------------------
  // Auto-resize textarea
  // --------------------------------------------------------------------------
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      e.target.style.height = "auto";
      e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    },
    []
  );

  // --------------------------------------------------------------------------
  // Send message → POST /api/chat → show Moka reply
  // --------------------------------------------------------------------------
  const sendMessage = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isSending) return;

    // 1. Optimistically add user message
    const userMsg: UiMessage = {
      id: `optimistic-${Date.now()}`,
      sender: "USER",
      text,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsSending(true);

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    // 2. Show typing indicator after short delay
    const typingTimer = setTimeout(() => setIsTyping(true), 300);

    try {
      // 3. Call API (intentional minimum 1.5 s delay for UX)
      const [res] = await Promise.all([
        fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }),
        new Promise((r) => setTimeout(r, 1500)),
      ]);

      clearTimeout(typingTimer);
      setIsTyping(false);

      if (!res.ok) throw new Error("API error");

      const mokaMsg: DbMessage = await res.json();
      setMessages((prev) => [...prev, toUiMessage(mokaMsg)]);
    } catch (err) {
      console.error(err);
      clearTimeout(typingTimer);
      setIsTyping(false);
      // Show a fallback error bubble
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "MOKA",
          text: "ごめん、うまく繋がらなかったみたい…もう一回試してみてくれる？",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }, [inputValue, isSending]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  return (
    <div className="flex flex-col h-[100dvh] bg-[#f0ece4] overflow-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 pt-3 pb-3 bg-[#fdfbf7] border-b border-[#e8dfd0] shadow-sm z-10">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-[#e8dfd0] flex items-center justify-center text-xl select-none">
            {AI_AVATAR}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#fdfbf7]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#3d3530] text-base leading-tight truncate">
            {AI_NAME}
          </p>
          <p className="text-xs text-[#a89a87] leading-tight mt-0.5">
            英語圏のスーパーで困り中 🛒
          </p>
        </div>
        <div className="flex-shrink-0 bg-[#d4a574]/20 text-[#8d7b68] text-xs font-medium px-2.5 py-1 rounded-full">
          Day 1
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Chat log — scrollable                                               */}
      {/* ------------------------------------------------------------------ */}
      <main className="flex-1 overflow-y-auto chat-scroll py-4 flex flex-col gap-4">
        {isLoadingHistory ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-[#a89a87] dot-1" />
              <span className="w-2 h-2 rounded-full bg-[#a89a87] dot-2" />
              <span className="w-2 h-2 rounded-full bg-[#a89a87] dot-3" />
            </div>
          </div>
        ) : (
          messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)
        )}

        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} className="h-1" />
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* Input area                                                           */}
      {/* ------------------------------------------------------------------ */}
      <footer className="flex-shrink-0 bg-[#fdfbf7] border-t border-[#e8dfd0] px-3 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-[#f5f1e8] rounded-2xl border border-[#d4c4b0] focus-within:border-[#8d7b68] focus-within:ring-2 focus-within:ring-[#8d7b68]/20 transition-all duration-150">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="英語フレーズを教えてあげよう…"
              rows={1}
              disabled={isSending || isLoadingHistory}
              className="w-full resize-none bg-transparent text-base text-[#3d3530] placeholder-[#c0b4a6] px-4 py-3 rounded-2xl outline-none leading-relaxed disabled:opacity-50"
              style={{ maxHeight: "120px", overflowY: "auto" }}
            />
          </div>

          {/* Send button — 44×44 px tap target */}
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isSending || isLoadingHistory}
            aria-label="送信"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150
              bg-[#5b9c6a] text-white shadow-md
              hover:bg-[#4e8a5d] active:scale-95
              disabled:bg-[#c0b4a6] disabled:shadow-none disabled:cursor-not-allowed"
          >
            {isSending ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 translate-x-px" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-[#c0b4a6] mt-2 leading-none">
          Enterで送信 · Shift+Enterで改行
        </p>
      </footer>
    </div>
  );
}
