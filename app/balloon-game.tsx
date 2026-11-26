"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

const SEQUENCE = ["S", "A", "H", "A", "L", "♥", "D", "A", "Y", "A", "N", "G"];
const DURATION_MS = 25000;
const RISE_SECONDS = 4;
const SPAWN_MS = 650;
const COLORS = [
  "bg-red-500",
  "bg-rose-500",
  "bg-pink-400",
  "bg-red-400",
  "bg-pink-500",
];

type Balloon = { id: number; seq: number; left: number };
type Pop = { id: number; left: number; top: number };
type Status = "idle" | "playing" | "won" | "lost";

type BalloonGameProps = {
  onWin?: () => void;
};

export default function BalloonGame({ onWin }: BalloonGameProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [collected, setCollected] = useState<boolean[]>(() =>
    Array(SEQUENCE.length).fill(false)
  );
  const [timeLeft, setTimeLeft] = useState(DURATION_MS / 1000);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const nextId = useRef(0);
  const cursor = useRef(0);
  const collectedRef = useRef(collected);
  const areaRef = useRef<HTMLDivElement>(null);
  const score = collected.filter(Boolean).length;

  useEffect(() => {
    if (status !== "playing") return;
    const endAt = Date.now() + DURATION_MS;

    const spawn = window.setInterval(() => {
      for (let step = 0; step < SEQUENCE.length; step++) {
        const seq = (cursor.current + step) % SEQUENCE.length;
        if (collectedRef.current[seq]) continue;
        cursor.current = (seq + 1) % SEQUENCE.length;
        const id = ++nextId.current;
        setBalloons((list) => [
          ...list,
          { id, seq, left: 6 + (seq / (SEQUENCE.length - 1)) * 72 },
        ]);
        return;
      }
    }, SPAWN_MS);

    const tick = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        setStatus("lost");
        setBalloons([]);
      }
    }, 250);

    return () => {
      window.clearInterval(spawn);
      window.clearInterval(tick);
    };
  }, [status]);

  function start() {
    const fresh: boolean[] = Array(SEQUENCE.length).fill(false);
    collectedRef.current = fresh;
    cursor.current = 0;
    setCollected(fresh);
    setTimeLeft(DURATION_MS / 1000);
    setBalloons([]);
    setPops([]);
    setStatus("playing");
  }

  function pop(e: PointerEvent<HTMLButtonElement>, balloon: Balloon) {
    if (status !== "playing") return;
    const area = areaRef.current?.getBoundingClientRect();
    const rect = e.currentTarget.getBoundingClientRect();
    setPops((list) => [
      ...list,
      { id: balloon.id, left: balloon.left, top: area ? rect.top - area.top : 0 },
    ]);
    window.setTimeout(
      () => setPops((list) => list.filter((p) => p.id !== balloon.id)),
      600
    );
    setBalloons((list) => list.filter((b) => b.id !== balloon.id));

    const next = collectedRef.current.map((done, i) =>
      i === balloon.seq ? true : done
    );
    collectedRef.current = next;
    setCollected(next);
    if (next.every(Boolean)) {
      setStatus("won");
      setBalloons([]);
      onWin?.();
    }
  }

  return (
    <div className="flex w-full flex-col">
      <p className="text-base font-extrabold text-rose-600">
        Pecahkan Balonnya!
      </p>
      <div className="mt-1 flex justify-center gap-0.5 text-sm font-extrabold">
        {SEQUENCE.map((letter, i) => (
          <span
            key={i}
            className={`inline-block w-4 transition-all duration-300 ${
              collected[i]
                ? "scale-125 text-rose-600"
                : "text-rose-200"
            }`}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="mt-1 flex justify-center gap-4 text-xs font-semibold text-zinc-600">
        <span>
          Balon {score}/{SEQUENCE.length}
        </span>
        <span>Waktu {timeLeft} dtk</span>
      </div>

      <div
        ref={areaRef}
        className="relative mt-2 h-72 w-full overflow-hidden rounded-2xl border-2 border-rose-100 bg-gradient-to-b from-sky-100 via-rose-50 to-pink-100"
      >
        {balloons.map((balloon) => (
          <button
            key={balloon.id}
            type="button"
            aria-label={`Pecahkan balon ${SEQUENCE[balloon.seq]}`}
            onPointerDown={(e) => pop(e, balloon)}
            onAnimationEnd={() =>
              setBalloons((list) => list.filter((b) => b.id !== balloon.id))
            }
            className="animate-balloon-rise absolute flex flex-col items-center"
            style={{
              left: `${balloon.left}%`,
              animationDuration: `${RISE_SECONDS}s`,
            }}
          >
            <span
              className={`flex h-12 w-10 items-center justify-center rounded-[50%_50%_50%_50%/45%_45%_55%_55%] text-lg font-extrabold text-white shadow-inner ${
                COLORS[balloon.seq % COLORS.length]
              }`}
            >
              {SEQUENCE[balloon.seq]}
            </span>
            <span className="h-5 w-px bg-zinc-400" />
          </button>
        ))}

        {pops.map((p) => (
          <span
            key={p.id}
            className="animate-pop-out pointer-events-none absolute text-sm font-extrabold text-rose-600"
            style={{ left: `${p.left}%`, top: p.top }}
          >
            +1
          </span>
        ))}

        {status !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white/75 p-4 text-center backdrop-blur-sm">
            {status === "idle" && (
              <>
                <p className="text-sm text-zinc-600">
                  Balonnya muncul berurutan dan membentuk nama{" "}
                  <b>SAHAL ♥ DAYANG</b>. Pecahkan semua hurufnya dalam{" "}
                  {DURATION_MS / 1000} detik!
                </p>
              </>
            )}
            {status === "won" && (
              <>
                <p className="text-sm font-bold text-rose-600">
                  SAHAL ♥ DAYANG lengkap!
                </p>
                <p className="text-xs text-zinc-600">
                  Hadiahnya 1 pelukan virtual dari Sahal
                </p>
              </>
            )}
            {status === "lost" && (
              <>
                <p className="text-sm font-bold text-rose-600">Waktu habis!</p>
                <p className="text-xs text-zinc-600">
                  Baru {score}/{SEQUENCE.length} huruf. Ayo coba lagi!
                </p>
              </>
            )}
            <button
              type="button"
              onClick={start}
              className="mt-2 rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-300 transition-colors hover:bg-rose-700"
            >
              {status === "idle" ? "Mulai" : "Main lagi"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
