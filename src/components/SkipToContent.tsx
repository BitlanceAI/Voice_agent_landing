"use client";

export default function SkipToContent() {
  return (
    <button
      type="button"
      onClick={() => {
        document.getElementById("main-content")?.scrollIntoView({ behavior: "smooth" });
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-xl focus:bg-white/10 focus:px-4 focus:py-2 focus:text-white focus:ring-2 focus:ring-primary"
    >
      Skip to content
    </button>
  );
}

