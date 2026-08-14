"use client";

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

export function PremiumHeroCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = cardRef.current;
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
    card.style.setProperty("--pointer-x", `${x * 100}%`);
    card.style.setProperty("--pointer-y", `${y * 100}%`);
    card.style.setProperty("--card-rx", `${(0.5 - y) * 8}deg`);
    card.style.setProperty("--card-ry", `${(x - 0.5) * 11}deg`);
    card.dataset.active = "true";
  }

  function resetPointer() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--pointer-x", "50%");
    card.style.setProperty("--pointer-y", "50%");
    card.style.setProperty("--card-rx", "0deg");
    card.style.setProperty("--card-ry", "0deg");
    delete card.dataset.active;
  }

  return <div className="hero-card-stage relative hidden min-h-80 md:block">
    <div ref={cardRef} onPointerMove={handlePointerMove} onPointerLeave={resetPointer} className="hero-feature-card premium-hero-card card absolute inset-0 overflow-hidden p-7 text-white" aria-label="AINextGen Black Knowledge Pass">
      <div className="hero-card-grid" aria-hidden="true"/><div className="hero-card-scan" aria-hidden="true"/><div className="hero-card-spotlight" aria-hidden="true"/>
      <span className="hero-card-node hero-card-node-a" aria-hidden="true"/><span className="hero-card-node hero-card-node-b" aria-hidden="true"/><span className="hero-card-node hero-card-node-c" aria-hidden="true"/>
      <div className="premium-card-watermark" aria-hidden="true">NG</div>
      <div className="relative z-10 flex h-full min-h-[264px] flex-col">
        <div className="flex items-start justify-between gap-4"><div><p className="premium-card-kicker">AINEXTGEN</p><p className="mt-1 text-[11px] font-semibold tracking-[.18em] text-white/40">BLACK KNOWLEDGE PASS</p></div><span className="premium-card-edition">POWER EDITION</span></div>
        <div className="mt-7 flex items-center justify-between"><div className="premium-card-chip" aria-hidden="true"><span/><span/><span/><span/></div><div className="premium-card-contactless" aria-hidden="true"><i/><i/><i/></div></div>
        <div className="mt-auto"><p className="text-[11px] font-bold uppercase tracking-[.2em] text-white/40">Lộ trình tuần này</p><h2 className="mt-2 max-w-md text-2xl font-black tracking-[-.035em] text-white lg:text-3xl">Từ người mới đến AI power user</h2><div className="mt-5 flex items-end justify-between gap-4"><div><p className="premium-card-number">07 · 03 · 12 · AI</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[.16em] text-white/40">Bài học · Workflow · Prompt mẫu</p></div><div className="premium-card-mark" aria-hidden="true">NG</div></div></div>
      </div>
    </div>
  </div>;
}
