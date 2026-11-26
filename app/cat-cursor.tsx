"use client";

import { useEffect, useRef, useState } from "react";

const MEOWS = ["Meow!", "Miaw~", "Nyaa~", "Purr~"];

type Paw = { id: number; x: number; y: number; word: string };

export default function CatCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const happyTimer = useRef<number | undefined>(undefined);
  const pawId = useRef(0);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [happy, setHappy] = useState(false);
  const [clickKey, setClickKey] = useState(0);
  const [paws, setPaws] = useState<Paw[]>([]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("cat-cursor-on");

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const el = cursorRef.current;
      if (el) el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      setVisible(true);
      const target = e.target as Element | null;
      setHovering(Boolean(target?.closest("button:not(:disabled), a, [role=button]")));
    }

    function onDown(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      setClickKey((k) => k + 1);
      setHappy(true);
      window.clearTimeout(happyTimer.current);
      happyTimer.current = window.setTimeout(() => setHappy(false), 450);

      const id = ++pawId.current;
      const word = MEOWS[Math.floor(Math.random() * MEOWS.length)];
      setPaws((list) => [...list, { id, x: e.clientX, y: e.clientY, word }]);
      window.setTimeout(
        () => setPaws((list) => list.filter((p) => p.id !== id)),
        900
      );
    }

    function onLeave() {
      setVisible(false);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("cat-cursor-on");
      window.clearTimeout(happyTimer.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {paws.map((paw) => (
        <div
          key={paw.id}
          className="absolute"
          style={{ left: paw.x, top: paw.y }}
        >
          <span className="animate-paw-stamp absolute -left-3 -top-3 text-2xl">
            🐾
          </span>
          <span className="font-display animate-meow-pop absolute left-3 -top-8 whitespace-nowrap text-2xl font-bold text-white drop-shadow-[0_2px_0_rgba(159,18,57,0.7)]">
            {paw.word}
          </span>
        </div>
      ))}

      <div
        ref={cursorRef}
        className={`absolute left-0 top-0 transition-opacity duration-150 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <span
          key={clickKey}
          className={`absolute -left-4 -top-4 block select-none text-3xl leading-none ${
            clickKey > 0 ? "animate-cat-click" : ""
          } ${hovering && !happy ? "scale-110" : ""} transition-transform duration-150`}
        >
          {happy ? "😻" : hovering ? "😺" : "🐱"}
        </span>
      </div>
    </div>
  );
}
