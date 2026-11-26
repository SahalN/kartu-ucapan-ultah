"use client";

import { useState } from "react";
import { Arrow } from "./aesthetic-arrow";

type IntroEnvelopeProps = {
  onOpen: () => void;
};

export default function IntroEnvelope({ onOpen }: IntroEnvelopeProps) {
  const [opening, setOpening] = useState(false);
  const [hidden, setHidden] = useState(false);

  function open() {
    if (opening) return;
    setOpening(true);
    onOpen();
    window.setTimeout(() => setHidden(true), 1600);
  }

  if (hidden) return null;

  return (
    <div
      data-no-burst
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-gradient-to-br from-red-500 via-rose-500 to-pink-400 px-6 transition-opacity duration-700 ${
        opening ? "pointer-events-none opacity-0 delay-700" : ""
      }`}
    >
      <p className="font-display animate-letter-bounce mb-10 text-center text-4xl font-bold text-white drop-shadow-[0_2px_0_rgba(159,18,57,0.5)]">
        Ada surat cinta untukmu, sayang
      </p>

      <button
        type="button"
        onClick={open}
        aria-label="Buka amplop"
        className={`relative h-40 w-64 [perspective:800px] ${
          opening ? "" : "animate-envelope-wiggle"
        }`}
      >
        <div className="absolute inset-0 rounded-xl bg-rose-200 shadow-2xl shadow-rose-900/40" />
        <div
          className={`font-display absolute inset-x-4 bottom-2 top-3 z-10 flex items-start justify-center rounded-lg bg-white pt-4 text-xl font-bold text-rose-600 shadow transition-transform delay-300 duration-700 ease-out ${
            opening ? "-translate-y-24" : ""
          }`}
        >
          Happy Birthday!
        </div>
        <div className="absolute inset-0 z-20 rounded-xl bg-rose-100 [clip-path:polygon(0_0,50%_55%,100%_0,100%_100%,0_100%)]" />
        <div
          className={`absolute inset-x-0 top-0 h-[60%] origin-top bg-rose-300 transition-transform duration-500 [clip-path:polygon(0_0,100%_0,50%_100%)] ${
            opening ? "z-0 [transform:rotateX(180deg)]" : "z-30"
          }`}
        />
        <span
          className={`absolute left-1/2 top-[52%] z-40 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 text-lg shadow-md transition-all duration-300 ${
            opening ? "scale-0 opacity-0" : ""
          }`}
        >
          ❤️
        </span>
      </button>

      <div className="mt-4 flex items-center gap-2 text-white/90">
        <Arrow dir="up" className="animate-arrow-up text-5xl" />
        <p className="font-display text-2xl font-bold">
          Ketuk amplopnya untuk membuka
        </p>
      </div>
    </div>
  );
}
