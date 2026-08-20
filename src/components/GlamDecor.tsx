import { useEffect, useMemo, useState } from "react";

type Piece = {
  left: number;
  delay: number;
  duration: number;
  size: number;
  kind: "star" | "flower" | "sparkle";
  drift: number;
  opacity: number;
};

function StarShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0c.6 6.3 5.7 11.4 12 12-6.3.6-11.4 5.7-12 12-.6-6.3-5.7-11.4-12-12C6.3 11.4 11.4 6.3 12 0Z" />
    </svg>
  );
}

function FlowerShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <g>
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="12" cy="6.4" rx="3.1" ry="5.1" transform={`rotate(${deg} 12 12)`} />
        ))}
      </g>
      <circle cx="12" cy="12" r="2.4" className="text-gold" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function SparkleShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden="true">
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

const round = (n: number) => Math.round(n * 100) / 100;

function makePieces(count: number, seed: number): Piece[] {
  const kinds: Piece["kind"][] = ["star", "flower", "sparkle"];
  return Array.from({ length: count }, (_, i) => {
    const r = (n: number) => {
      const x = Math.sin((i + 1) * (n + seed) * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };
    return {
      left: round(r(1) * 100),
      delay: round(r(2) * 14),
      duration: round(13 + r(3) * 12),
      size: round(10 + r(4) * 18),
      kind: kinds[Math.floor(r(5) * 3)] as Piece["kind"],
      drift: round((r(6) - 0.5) * 90),
      opacity: round(0.25 + r(7) * 0.5),
    };
  });
}

export function GlamDecor() {
  const pieces = useMemo(() => makePieces(22, 3), []);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* soft aura blobs on the sides */}
      <span className="decor-aura left-[-18%] top-[8%] animate-aura-slow" />
      <span className="decor-aura right-[-20%] top-[38%] animate-aura-slower" />
      <span className="decor-aura left-[-14%] bottom-[4%] animate-aura-slow" />

      {/* side vines of flowers */}
      <div className="absolute left-1 top-1/2 hidden -translate-y-1/2 flex-col gap-10 sm:flex">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="text-blush animate-sway"
            style={{ animationDelay: `${i * 0.8}s`, opacity: 0.55 }}
          >
            <FlowerShape className="h-6 w-6" />
          </span>
        ))}
      </div>
      <div className="absolute right-1 top-1/3 hidden flex-col gap-10 sm:flex">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="text-blush animate-sway-rev"
            style={{ animationDelay: `${i * 0.6}s`, opacity: 0.55 }}
          >
            <StarShape className="h-5 w-5" />
          </span>
        ))}
      </div>

      {/* floating pieces */}
      {mounted && pieces.map((p, i) => (
        <span
          key={i}
          className="decor-float"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: `${-p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        >
          <span className="block h-full w-full animate-twinkle">
            {p.kind === "star" && <StarShape className="h-full w-full text-gold" />}
            {p.kind === "flower" && <FlowerShape className="h-full w-full text-blush" />}
            {p.kind === "sparkle" && <SparkleShape className="h-full w-full text-gold" />}
          </span>
        </span>
      ))}
    </div>
  );
}
