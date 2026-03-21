"use client"

/**
 * Injects keyframe animations for deal detail page effects:
 * - breathe: breathing glow on price card accent line
 * - shine-sweep: diagonal shine sweep on hover
 */
export function PriceCardEffects() {
  return (
    <style>{`
      @keyframes breathe {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
      @keyframes shine-sweep {
        0% { transform: translateX(-100%) rotate(25deg); }
        100% { transform: translateX(200%) rotate(25deg); }
      }
      .price-card-shine {
        position: relative;
        overflow: hidden;
      }
      .price-card-shine::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 60%;
        height: 200%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.04),
          transparent
        );
        transform: translateX(-100%) rotate(25deg);
        transition: none;
        pointer-events: none;
      }
      .price-card-shine:hover::after {
        animation: shine-sweep 0.8s ease-in-out;
      }
    `}</style>
  )
}
