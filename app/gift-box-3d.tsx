"use client";

import { useState, type CSSProperties } from "react";

const TAPS_TO_OPEN = 3;
const SURPRISES = ["💖", "🌻", "🐱"];

const BODY = "absolute left-0 top-[40px] h-[72px] w-28";
const STRIP =
  "absolute inset-y-0 left-1/2 w-5 -translate-x-1/2 bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-300";

type GiftBox3DProps = {
  onOpen?: () => void;
};

export default function GiftBox3D({ onOpen }: GiftBox3DProps) {
  const [taps, setTaps] = useState(0);
  const opened = taps >= TAPS_TO_OPEN;

  function handleClick() {
    if (opened) return;
    const next = taps + 1;
    setTaps(next);
    if (next >= TAPS_TO_OPEN) onOpen?.();
  }

  const shake =
    taps > 0 && !opened
      ? taps % 2
        ? "animate-gift-shake-a"
        : "animate-gift-shake-b"
      : "";

  const fade = `transition-opacity duration-500 delay-500 ${
    opened ? "opacity-0" : ""
  }`;
  const lid = `absolute inset-0 ${fade}`;
  const lidTop = `absolute -top-12 left-0 h-[120px] w-[120px] ${fade}`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {opened &&
          SURPRISES.map((emoji, i) => (
            <span
              key={emoji}
              className="animate-surprise-pop pointer-events-none absolute left-1/2 top-8 z-20 text-2xl"
              style={
                {
                  animationDelay: `${0.3 + i * 0.12}s`,
                  "--sx": `${(i - 1) * 46}px`,
                } as CSSProperties
              }
            >
              {emoji}
            </span>
          ))}

        <button
          type="button"
          onClick={handleClick}
          aria-label={opened ? "Kado sudah terbuka" : "Ketuk kado"}
          className={`block [perspective:900px] ${shake}`}
        >
          <div
            className={`relative h-28 w-28 transition-transform duration-700 [transform-style:preserve-3d] ${
              opened
                ? "[transform:rotateX(-34deg)_rotateY(28deg)]"
                : "animate-gift-spin"
            }`}
          >
            <div
              className={`${BODY} bg-gradient-to-b from-red-500 to-red-600 [transform:translateZ(56px)]`}
            >
              <span className={STRIP} />
            </div>
            <div
              className={`${BODY} bg-gradient-to-b from-red-600 to-red-700 [transform:rotateY(180deg)_translateZ(56px)]`}
            >
              <span className={STRIP} />
            </div>
            <div
              className={`${BODY} bg-gradient-to-b from-rose-600 to-rose-700 [transform:rotateY(90deg)_translateZ(56px)]`}
            >
              <span className={STRIP} />
            </div>
            <div
              className={`${BODY} bg-gradient-to-b from-rose-600 to-rose-700 [transform:rotateY(-90deg)_translateZ(56px)]`}
            >
              <span className={STRIP} />
            </div>
            <div className="absolute left-0 top-5 h-28 w-28 bg-rose-950 [transform:rotateX(90deg)_translateZ(35px)]" />
            <div className="absolute left-0 top-5 h-28 w-28 bg-red-800 [transform:rotateX(-90deg)_translateZ(36px)]" />

            <div
              className={`absolute -left-1 top-4 h-6 w-[120px] transition-transform duration-700 ease-out [transform-style:preserve-3d] ${
                opened ? "[transform:translate(64px,-96px)_rotateZ(32deg)]" : ""
              }`}
            >
              <div
                className={`${lid} bg-gradient-to-b from-red-400 to-red-500 [transform:translateZ(60px)]`}
              >
                <span className={STRIP} />
              </div>
              <div
                className={`${lid} bg-gradient-to-b from-red-500 to-red-600 [transform:rotateY(180deg)_translateZ(60px)]`}
              >
                <span className={STRIP} />
              </div>
              <div
                className={`${lid} bg-gradient-to-b from-rose-500 to-rose-600 [transform:rotateY(90deg)_translateZ(60px)]`}
              >
                <span className={STRIP} />
              </div>
              <div
                className={`${lid} bg-gradient-to-b from-rose-500 to-rose-600 [transform:rotateY(-90deg)_translateZ(60px)]`}
              >
                <span className={STRIP} />
              </div>
              <div
                className={`${lidTop} bg-red-900 [transform:rotateX(-90deg)_translateZ(12px)]`}
              />
              <div
                className={`${lidTop} bg-red-400 [transform:rotateX(90deg)_translateZ(12px)]`}
              >
                <span className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-300" />
                <span className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 bg-gradient-to-b from-amber-300 via-yellow-100 to-amber-300" />
                <span
                  className="absolute left-1/2 top-1/2 h-9 w-12 rounded-[50%] border-[5px] border-amber-300 bg-amber-200/40"
                  style={{ transform: "translate(-112%, -50%) rotate(-28deg)" }}
                />
                <span
                  className="absolute left-1/2 top-1/2 h-9 w-12 rounded-[50%] border-[5px] border-amber-300 bg-amber-200/40"
                  style={{ transform: "translate(12%, -50%) rotate(28deg)" }}
                />
                <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-md bg-amber-400 shadow" />
              </div>
            </div>
          </div>
        </button>
      </div>

      {!opened && (
        <>
          <div className="mt-12 flex gap-1.5">
            {Array.from({ length: TAPS_TO_OPEN }, (_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i < taps ? "bg-rose-500" : "bg-rose-200"
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-xs font-medium text-zinc-500">
            Ketuk {TAPS_TO_OPEN - taps}x lagi untuk membuka kado
          </p>
        </>
      )}

      {opened && (
        <div className="animate-coupon-flip mt-12 max-w-[16rem] rounded-xl border-2 border-dashed border-rose-300 bg-rose-50 px-4 py-2 text-center text-xs font-semibold text-rose-600 shadow-sm">
          1 tiket traktir gratis dan kado di hari Sabtu
        </div>
      )}
    </div>
  );
}
