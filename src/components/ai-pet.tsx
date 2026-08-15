"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const messages = [
  "Chào bạn! Mình là Nexi ✨",
  "Cần tìm Prompt? Thử thanh search nhé.",
  "Mỗi ngày học một chút, tiến rất xa 🚀",
];
const HIDDEN_UNTIL_KEY = "ainext-nexi-hidden-until";
const INTRO_SEEN_KEY = "ainext-nexi-intro-seen";
const HIDE_DURATION_MS = 90 * 24 * 60 * 60 * 1_000;

export function AiPet() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const hideRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [reacting, setReacting] = useState(false);

  useEffect(() => {
    const hiddenUntil = Number(localStorage.getItem(HIDDEN_UNTIL_KEY) ?? 0);
    if (hiddenUntil > Date.now()) {
      setHidden(true);
      setReady(true);
      return;
    }
    localStorage.removeItem(HIDDEN_UNTIL_KEY);
    setReady(true);

    let intro: number | undefined;
    let hide: number | undefined;
    if (!sessionStorage.getItem(INTRO_SEEN_KEY)) {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      intro = window.setTimeout(() => setOpen(true), 2_400);
      hide = window.setTimeout(() => setOpen(false), 6_200);
    }

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
      if (intro) window.clearTimeout(intro);
      if (hide) window.clearTimeout(hide);
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
    hideRef.current = window.setTimeout(() => setOpen(false), 4_200);
  }

  function dismiss() {
    localStorage.setItem(HIDDEN_UNTIL_KEY, String(Date.now() + HIDE_DURATION_MS));
    setOpen(false);
    setHidden(true);
  }

  if (!ready || hidden) return null;
  return <div ref={rootRef} className={`ai-pet ${open ? "is-open" : ""} ${reacting ? "is-reacting" : ""}`}>
    <div className="ai-pet-bubble" role="status" aria-live="polite"><span className="ai-pet-message">{messages[messageIndex]}</span><button type="button" className="ai-pet-dismiss" onClick={dismiss} aria-label="Ẩn Nexi trong 90 ngày"><X size={13}/></button><span aria-hidden="true"/></div>
    <button type="button" className="ai-pet-button" onClick={react} onPointerEnter={() => setOpen(true)} onPointerLeave={() => !reacting && setOpen(false)} aria-label="Chào Nexi, linh vật AINextGen">
      <span className="ai-pet-rings" aria-hidden="true"/><span className="ai-pet-antenna" aria-hidden="true"><i/></span>
      <span className="ai-pet-body" aria-hidden="true"><span className="ai-pet-glass"><i className="ai-pet-eye"/><i className="ai-pet-eye"/><b className="ai-pet-mouth"/></span><span className="ai-pet-monogram">NG</span></span>
    </button>
  </div>;
}
