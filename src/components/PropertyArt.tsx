/** Lightweight SVG "photo" placeholder so the prototype needs no external images. */
export default function PropertyArt({ hue, kind, bhk, className = '' }: { hue: number; kind: 'owner' | 'builder'; bhk: number; className?: string }) {
  const h2 = (hue + 40) % 360;
  const id = `g${hue}${bhk}${kind}`;
  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`hsl(${h2} 70% 86%)`} />
          <stop offset="1" stopColor={`hsl(${hue} 60% 94%)`} />
        </linearGradient>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 30% 98%)`} />
          <stop offset="1" stopColor={`hsl(${hue} 18% 84%)`} />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#sky${id})`} />
      <circle cx="330" cy="60" r="26" fill={`hsl(${h2} 90% 75%)`} opacity=".7" />
      {kind === 'builder' ? (
        <g>
          <rect x="70" y="40" width="90" height="200" rx="4" fill={`url(#b${id})`} />
          <rect x="175" y="70" width="110" height="170" rx="4" fill={`url(#b${id})`} />
          <rect x="295" y="110" width="60" height="130" rx="4" fill={`url(#b${id})`} opacity=".9" />
          {Array.from({ length: 9 }).map((_, r) => Array.from({ length: 3 }).map((_, c) => (
            <rect key={`a${r}${c}`} x={82 + c * 26} y={54 + r * 20} width="16" height="10" rx="2" fill={`hsl(${hue} 40% ${r % 3 === 0 ? 60 : 72}%)`} />
          )))}
          {Array.from({ length: 7 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => (
            <rect key={`b${r}${c}`} x={187 + c * 25} y={84 + r * 21} width="15" height="11" rx="2" fill={`hsl(${hue} 40% ${c % 2 ? 62 : 74}%)`} />
          )))}
        </g>
      ) : (
        <g>
          <polygon points="90,120 200,55 310,120" fill={`hsl(${hue} 45% 45%)`} />
          <rect x="105" y="118" width="190" height="122" rx="3" fill={`url(#b${id})`} />
          <rect x="182" y="170" width="36" height="70" rx="3" fill={`hsl(${hue} 35% 40%)`} />
          {[125, 240].map((x) => <rect key={x} x={x} y="140" width="36" height="30" rx="3" fill={`hsl(${hue} 50% 70%)`} />)}
          {bhk > 2 && <rect x="125" y="190" width="36" height="28" rx="3" fill={`hsl(${hue} 50% 70%)`} />}
        </g>
      )}
      <ellipse cx="40" cy="236" rx="40" ry="22" fill="hsl(140 40% 45%)" opacity=".85" />
      <ellipse cx="372" cy="240" rx="44" ry="24" fill="hsl(150 40% 40%)" opacity=".8" />
      <rect y="236" width="400" height="24" fill="hsl(140 25% 72%)" />
    </svg>
  );
}
