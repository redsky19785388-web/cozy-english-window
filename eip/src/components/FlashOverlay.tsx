"use client";

interface FlashOverlayProps {
  active: boolean;
  message: string;
}

export default function FlashOverlay({ active, message }: FlashOverlayProps) {
  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] pointer-events-none flex items-center justify-center"
      style={{ animation: "flash-overlay 1.4s ease-out forwards" }}
    >
      {/* Red flash */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(192, 57, 43, 0.25)",
          animation: "flash-overlay 1.4s ease-out forwards",
        }}
      />

      {/* Message text */}
      <div
        className="relative z-10 text-center px-8"
        style={{
          animation: "flash-overlay 1.2s ease-out forwards",
          animationDelay: "0.1s",
        }}
      >
        <div
          className="text-red-400 text-2xl md:text-4xl font-black tracking-widest uppercase"
          style={{
            fontFamily: "var(--font-serif-jp, 'Noto Serif JP', serif)",
            textShadow: "0 0 30px rgba(231, 76, 60, 1), 0 0 60px rgba(231, 76, 60, 0.5)",
          }}
        >
          {message}
        </div>
      </div>

      {/* Border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-red-600 opacity-70" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-red-600 opacity-70" />
    </div>
  );
}
