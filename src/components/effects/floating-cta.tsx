"use client";

import { useState, useEffect } from "react";
import { MessageSquareHeart } from "lucide-react";

export function FloatingCTA() {
  const [visible, setVisible] = useState(true);

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

  function handleClick() {
    const el = document.getElementById("inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label="문의하기"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-white/[0.15] bg-gradient-to-r from-blue-600/90 to-indigo-600/90 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 backdrop-blur-xl transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-blue-500/30 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <MessageSquareHeart className="h-4 w-4" />
      문의하기
    </button>
  );
}
