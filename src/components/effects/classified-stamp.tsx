// A "CLASSIFIED" or "기밀" stamp overlay
// Rotated slightly (-12deg), red/amber border, uppercase text
// Appears on blind deal cards
export function ClassifiedStamp({ level }: { level: number }) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none z-30">
      <div className="border-2 border-red-500/60 rounded px-4 py-1.5">
        <span className="text-red-500/70 font-mono font-bold text-sm tracking-[0.3em] uppercase">
          CLASSIFIED
        </span>
      </div>
      <div className="text-center mt-1">
        <span className="text-red-500/40 font-mono text-[10px] tracking-wider">
          인증 등급 {level} 이상
        </span>
      </div>
    </div>
  )
}
