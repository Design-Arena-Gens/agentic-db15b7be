"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import ShaderBackground from './ShaderBackground';
import LogosTicker from './LogosTicker';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <ShaderBackground />
      <div className="grid-overlay" />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ height: '12svh' }} />

        <div className={clsx('card')} style={{ padding: 10, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'linear-gradient(90deg,#7aa2ff,#12d5ff)', boxShadow: '0 0 24px rgba(122,162,255,0.6)' }} />
          <span style={{ color: 'var(--muted)', fontSize: 13, letterSpacing: 0.4 }}>REMYLAR ENTERPRISE AI INFRASTRUCTURE</span>
        </div>

        <div style={{ height: 18 }} />

        <h1
          className="gradient-text"
          style={{
            fontSize: 'clamp(40px, 7.6vw, 92px)',
            lineHeight: 1.02,
            fontWeight: 800,
            letterSpacing: -1.2,
            maxWidth: 1100
          }}
        >
          Turn your enterprise data into <span style={{ display: 'inline-block', filter: 'drop-shadow(0 12px 50px rgba(18,213,255,0.3))' }}>workflow intelligence</span>.
        </h1>

        <div style={{ height: 16 }} />

        <p style={{ color: 'var(--muted)', fontSize: 18, maxWidth: 820, lineHeight: 1.6 }}>
          Remylar is the AI infrastructure layer that orchestrates retrieval, reasoning, and action?
          converting siloed data into reliable, auditable workflows. Built for privacy, scale, and control.
        </p>

        <div style={{ height: 28 }} />

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className={clsx('button', 'primary')} href="#get-started">Request a demo</a>
          <a className={clsx('button')} href="#learn">Explore the platform</a>
        </div>

        <div style={{ height: 36 }} />

        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>Trusted by data-forward enterprises</div>
            <LogosTicker />
          </div>
        </div>

        <div style={{ height: '20svh' }} />
      </div>
    </section>
  );
}
