"use client";

import { useEffect, useRef, useState } from "react";

const messages = [
  "Chào bạn! Mình là Nexi ✨",
  "Cần tìm Prompt? Thử thanh search nhé.",
  "Mỗi ngày học một chút, tiến rất xa 🚀",
];

export function AiPet() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const hideRef = useRef<number | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [reacting, setReacting] = useState(false);

  useEffect(() => {
    const intro = window.setTimeout(() => setOpen(true), 900);
    const hide = window.setTimeout(() => setOpen(false), 5000);
    const follow = (event: PointerEvent) => {
      if (!rootRef.current || !window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        const bounds = rootRef.current?.getBoundingClientRect();
        if (!bounds || !rootRef.current) return;
        const dx = event.clientX - (bounds.left + bounds.width / 2);
        const dy = event.clientY - (bounds.top + bounds.height / 2);
        const distance = Math.max(1, Math.hypot(dx, dy));
        rootRef.current.style.setProperty("--pet-eye-x", `${Math.max(-4, Math.min(4, dx / distance * 4))}px`);
        rootRef.current.style.setProperty("--pet-eye-y", `${Math.max(-3, Math.min(3, dy / distance * 3))}px`);
      });
    };
    window.addEventListener("pointermove", follow, { passive: true });
    return () => {
      window.clearTimeout(intro); window.clearTimeout(hide);
      window.removeEventListener("pointermove", follow);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (hideRef.current) window.clearTimeout(hideRef.current);
    };
  }, []);

  function react() {
    setMessageIndex((value) => (value + 1) % messages.length);
    setOpen(true); setReacting(true);
    window.setTimeout(() => setReacting(false), 520);
    if (hideRef.current) window.clearTimeout(hideRef.current);
    hideRef.current = window.setTimeout(() => setOpen(false), 4200);
  }

  return <div ref={rootRef} className={`ai-pet ${open ? "is-open" : ""} ${reacting ? "is-reacting" : ""}`}>
    <div className="ai-pet-bubble" role="status" aria-live="polite">{messages[messageIndex]}<span aria-hidden="true"/></div>
    <button type="button" className="ai-pet-button" onClick={react} onPointerEnter={() => setOpen(true)} onPointerLeave={() => !reacting && setOpen(false)} aria-label="Chào Nexi, linh vật AINextGen">
      <span className="ai-pet-rings" aria-hidden="true"/><span className="ai-pet-antenna" aria-hidden="true"><i/></span>
      <span className="ai-pet-body" aria-hidden="true"><span className="ai-pet-glass"><i className="ai-pet-eye"/><i className="ai-pet-eye"/><b className="ai-pet-mouth"/></span><span className="ai-pet-monogram">NG</span></span>
    </button>
  </div>;
}
