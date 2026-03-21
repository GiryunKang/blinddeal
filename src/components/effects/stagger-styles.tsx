"use client"

/**
 * Injects keyframe for staggered card entrance animation.
 */
export function StaggerStyles() {
  return (
    <style>{`
      @keyframes deal-card-enter {
        0% {
          opacity: 0;
          transform: translateY(16px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .deal-card-stagger {
        animation: deal-card-enter 0.5s ease-out both;
      }
    `}</style>
  )
}
