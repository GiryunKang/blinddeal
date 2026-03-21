"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquareHeart } from "lucide-react";

export function FloatingCTA() {
  const [visible, setVisible] = useState(true);
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const inquirySection = document.getElementById("inquiry-section");
      if (!inquirySection) {
        setVisible(true);
        return;
      }
      const rect = inquirySection.getBoundingClientRect();
      // Hide when the inquiry section is in view
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      setVisible(!isInView);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = useCallback(() => {
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
    const el = document.getElementById("inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {/* Pulse ring keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ring-ping {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes ripple-effect {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(4); opacity: 0; }
        }
      ` }} />

      <div className="relative">
        {/* Pulse rings */}
        <span
          className="absolute inset-0 rounded-full border border-blue-500/30"
          style={{ animation: "ring-ping 3s ease-out infinite" }}
        />
        <span
          className="absolute inset-0 rounded-full border border-blue-500/20"
          style={{ animation: "ring-ping 3s ease-out 1.5s infinite" }}
        />

        {/* Actual button */}
        <button
          onClick={handleClick}
          aria-label="문의하기"
          className="relative flex items-center gap-2 overflow-hidden rounded-full border border-white/[0.15] bg-gradient-to-r from-blue-600/90 to-indigo-600/90 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 backdrop-blur-xl transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-blue-500/30"
        >
          {/* Ripple on click */}
          {ripple && (
            <span
              className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30"
              style={{ animation: "ripple-effect 0.6s ease-out forwards" }}
            />
          )}
          <MessageSquareHeart className="h-4 w-4" />
          문의하기
        </button>
      </div>
    </div>
  );
}
