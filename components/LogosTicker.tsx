"use client";

const logos = [
  // Minimal abstract SVG marks for neutrality
  ({ key: 'orb', svg: (
    <svg width="100" height="22" viewBox="0 0 100 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="9" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2"/>
      <path d="M2 11C8 6 14 6 20 11" stroke="currentColor" strokeOpacity="0.6"/>
      <text x="30" y="15" fill="currentColor" fillOpacity="0.7" fontWeight="600" fontSize="14">OrbiSys</text>
    </svg>
  )}),
  ({ key: 'stack', svg: (
    <svg width="110" height="22" viewBox="0 0 110 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="16" height="4" rx="2" fill="currentColor" fillOpacity="0.5"/>
      <rect x="2" y="9" width="16" height="4" rx="2" fill="currentColor" fillOpacity="0.4"/>
      <rect x="2" y="15" width="16" height="4" rx="2" fill="currentColor" fillOpacity="0.3"/>
      <text x="26" y="15" fill="currentColor" fillOpacity="0.7" fontWeight="600" fontSize="14">StackNorth</text>
    </svg>
  )}),
  ({ key: 'delta', svg: (
    <svg width="100" height="22" viewBox="0 0 100 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 18L12 4L20 18H4Z" stroke="currentColor" strokeOpacity="0.6"/>
      <text x="30" y="15" fill="currentColor" fillOpacity="0.7" fontWeight="600" fontSize="14">DeltaGrid</text>
    </svg>
  )}),
  ({ key: 'quant', svg: (
    <svg width="110" height="22" viewBox="0 0 110 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 16C6 10 10 6 15 6C20 6 22 13 26 16" stroke="currentColor" strokeOpacity="0.6"/>
      <text x="30" y="15" fill="currentColor" fillOpacity="0.7" fontWeight="600" fontSize="14">QuantWorks</text>
    </svg>
  )}),
  ({ key: 'aurora', svg: (
    <svg width="110" height="22" viewBox="0 0 110 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7"/>
        </linearGradient>
      </defs>
      <path d="M2 11 Q 10 2 18 11 T 34 11" stroke="url(#g1)"/>
      <text x="38" y="15" fill="currentColor" fillOpacity="0.7" fontWeight="600" fontSize="14">AuroraBI</text>
    </svg>
  )}),
  ({ key: 'forge', svg: (
    <svg width="100" height="22" viewBox="0 0 100 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="14" height="10" rx="2" stroke="currentColor" strokeOpacity="0.6"/>
      <text x="24" y="15" fill="currentColor" fillOpacity="0.7" fontWeight="600" fontSize="14">ForgeOps</text>
    </svg>
  )}),
];

export default function LogosTicker() {
  const items = [...logos, ...logos];
  return (
    <div className="ticker" style={{ color: 'var(--muted)' }}>
      <div className="ticker-track">
        {items.map((it, i) => (
          <div key={`${it.key}-${i}`} style={{ opacity: 0.9 }}>{it.svg}</div>
        ))}
      </div>
    </div>
  );
}
