"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Arrow } from "./aesthetic-arrow";
import BalloonGame from "./balloon-game";
import BirthdayCake from "./birthday-cake";
import CatCursor from "./cat-cursor";
import GiftBox3D from "./gift-box-3d";
import IntroEnvelope from "./intro-envelope";
import MusicPlayer from "./music-player";
import PhotoFrame from "./photo-frame";
import StorySection from "./story-section";
import SwipeDeck from "./swipe-deck";

const FRIEND_NAME = "Dayang Gita Rhalisa";
const SENDER = "Sahal";
const HEADLINE = "Happy Birthday!";

// Taruh foto di folder public/foto lalu isi path-nya, misal "/foto/1.jpg".
const PHOTOS: (string | undefined)[] = [
  "/foto/foto1.jpeg",
  "/foto/foto7.jpeg",
  "/foto/IMG-20261024-WA0055_Original.JPG",
  "/foto/foto4.jpeg",
  "/foto/foto5.jpeg",
];

// Foto yang muncul saat kue dipotong. Isi path-nya nanti, misal "/foto/kue.jpg".
const CAKE_PHOTO: string | undefined = "/foto/foto2.jpeg";

const MESSAGE =
  "Selamat bertambah umur, sayang. Semoga kamu selalu sehat, selalu tertawa, dan semua yang kamu harapkan pelan-pelan jadi nyata. Kalau boleh, aku mau ada di setiap langkahnya.";

const SENDER_MESSAGE =
  "Makasih ya, sudah sabar sama aku dan selalu bikin hariku terasa lebih hangat. I love you, sayang!";

const RISING = [
  { emoji: "💖", left: "5%", duration: "11s", delay: "0s", size: "text-xl" },
  { emoji: "🌹", left: "20%", duration: "14s", delay: "3s", size: "text-3xl" },
  { emoji: "💕", left: "38%", duration: "12s", delay: "6s", size: "text-xl" },
  { emoji: "🎈", left: "56%", duration: "15s", delay: "4s", size: "text-3xl" },
  { emoji: "💗", left: "74%", duration: "12s", delay: "8s", size: "text-2xl" },
  { emoji: "🌹", left: "92%", duration: "14s", delay: "5s", size: "text-xl" },
];

const BLOBS = [
  { className: "-left-16 top-[8%] h-64 w-64 bg-pink-200/60", delay: "0s" },
  { className: "-right-20 top-[38%] h-72 w-72 bg-red-300/50", delay: "2s" },
  { className: "left-[15%] -bottom-24 h-80 w-80 bg-rose-200/60", delay: "4s" },
];

const BUNTING_COLORS = [
  "bg-red-500",
  "bg-pink-300",
  "bg-yellow-300",
  "bg-white",
  "bg-rose-600",
  "bg-pink-400",
];

const CATS = [
  { emoji: "🐱", delay: "0s" },
  { emoji: "🐈", delay: "9s" },
];

const SUNFLOWERS = [
  { left: "4%", delay: "0s" },
  { left: "22%", delay: "0.8s" },
  { left: "70%", delay: "0.4s" },
  { left: "88%", delay: "1.2s" },
];

const CONFETTI_COLORS = [
  "#ef4444",
  "#f43f5e",
  "#f9a8d4",
  "#facc15",
  "#ffffff",
  "#fb7185",
];

const BURST_EMOJIS = ["💖", "💕"];

type ConfettiPiece = {
  id: string;
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotate: number;
};

type Burst = {
  id: number;
  x: number;
  y: number;
  pieces: { dx: number; dy: number; emoji: string }[];
};

function createConfetti(): ConfettiPiece[] {
  return Array.from({ length: 70 }, (_, i) => ({
    id: `${Date.now()}-${i}`,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2.4 + Math.random() * 1.6,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    rotate: Math.random() * 360,
  }));
}

function CardShell({ children }: { children: ReactNode }) {
  return (
    <div className="paper relative h-full w-full rounded-md">
      <div className="flex h-full w-full touch-pan-y select-none flex-col items-center overflow-y-auto overscroll-x-none rounded-md p-5 text-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="m-auto flex w-full flex-col items-center">{children}</div>
      </div>
    </div>
  );
}

export default function BirthdayCard() {
  const [confetti, setConfetti] = useState<ConfettiPiece[] | null>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const burstId = useRef(0);

  function celebrate() {
    setConfetti(createConfetti());
    window.setTimeout(() => setConfetti(null), 4200);
  }

  function handleIntroOpen() {
    setRevealed(true);
    setPlaying(true);
    celebrate();
  }

  function handleBackgroundTap(e: PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("[data-no-burst]")) return;
    const id = ++burstId.current;
    const pieces = Array.from({ length: 8 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
      const distance = 50 + Math.random() * 40;
      return {
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        emoji: BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)],
      };
    });
    setBursts((list) => [...list, { id, x: e.clientX, y: e.clientY, pieces }]);
    window.setTimeout(
      () => setBursts((list) => list.filter((b) => b.id !== id)),
      900
    );
  }

  return (
    <div
      onPointerDown={handleBackgroundTap}
      id="top"
      className="animate-bg-pan relative w-full overflow-x-clip bg-[linear-gradient(180deg,#fb7185,#f472b6,#f87171,#fb7185)] bg-[length:100%_300%]"
    >
      <CatCursor />
      <IntroEnvelope onOpen={handleIntroOpen} />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="animate-dots-scroll absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.35)_1.5px,transparent_1.5px)] [background-size:22px_22px]" />
        {BLOBS.map((blob, i) => (
          <div
            key={i}
            className={`animate-blob-float absolute rounded-full blur-3xl ${blob.className}`}
            style={{ animationDelay: blob.delay }}
          />
        ))}
        {RISING.map((item, i) => (
          <span
            key={i}
            className={`animate-rise-up absolute top-full select-none ${item.size}`}
            style={{
              left: item.left,
              animationDuration: item.duration,
              animationDelay: item.delay,
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      <div className="pointer-events-none fixed inset-x-0 top-[env(safe-area-inset-top)] z-0">
        <div className="absolute inset-x-0 top-1 h-px bg-white/80" />
        <div className="flex justify-between px-1">
          {Array.from({ length: 16 }, (_, i) => (
            <span
              key={i}
              className={`animate-flag-swing mt-1 block h-6 w-5 [clip-path:polygon(0_0,100%_0,50%_100%)] ${
                BUNTING_COLORS[i % BUNTING_COLORS.length]
              }`}
              style={{ animationDelay: `${(i % 4) * 0.3}s` }}
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-[max(3.25rem,calc(env(safe-area-inset-bottom)+2.5rem))] z-0 h-10 overflow-hidden">
        {CATS.map((cat, i) => (
          <span
            key={i}
            className="animate-cat-walk absolute bottom-0 select-none text-3xl"
            style={{ left: 0, animationDelay: cat.delay }}
          >
            {cat.emoji}
          </span>
        ))}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-0 h-10 overflow-hidden">
        {SUNFLOWERS.map((flower, i) => (
          <span
            key={i}
            className="animate-sunflower-sway absolute bottom-0 select-none text-4xl"
            style={{ left: flower.left, animationDelay: flower.delay }}
          >
            🌻
          </span>
        ))}
      </div>

      {confetti && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {confetti.map((piece) => (
            <span
              key={piece.id}
              className="animate-confetti-fall absolute top-0 block h-2.5 w-1.5 rounded-sm"
              style={{
                left: `${piece.left}%`,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                transform: `rotate(${piece.rotate}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <div className="pointer-events-none fixed inset-0 z-40">
        {bursts.map((burst) =>
          burst.pieces.map((piece, i) => (
            <span
              key={`${burst.id}-${i}`}
              className="animate-burst-fly absolute text-xl"
              style={
                {
                  left: burst.x,
                  top: burst.y,
                  "--dx": `${piece.dx}px`,
                  "--dy": `${piece.dy}px`,
                } as CSSProperties
              }
            >
              {piece.emoji}
            </span>
          ))
        )}
      </div>

      <MusicPlayer started={playing} onStart={() => setPlaying(true)} />

      <div
        className={`relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-4 pb-[max(8rem,calc(env(safe-area-inset-bottom)+7rem))] pt-[max(3rem,calc(env(safe-area-inset-top)+2.5rem))] ${
          revealed ? "animate-deck-in" : "opacity-0"
        }`}
      >
        <h2
          aria-label={HEADLINE}
          className="font-display mb-3 select-none text-5xl font-bold text-white drop-shadow-[0_3px_0_rgba(159,18,57,0.55)]"
        >
          {HEADLINE.split("").map((char, i) => (
            <span
              key={i}
              aria-hidden
              className="animate-letter-bounce inline-block"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {char === " " ? " " : char}
            </span>
          ))}
        </h2>

        <SwipeDeck>
          <CardShell>
            <PhotoFrame
              src={PHOTOS[0]}
              alt={FRIEND_NAME}
              className="h-14 w-14 rounded-full ring-4 ring-rose-100"
            />
            <h1 className="font-display mt-1 text-3xl font-bold text-rose-600">
              Selamat Ulang Tahun
            </h1>
            <p className="font-display break-words text-3xl font-bold leading-tight text-zinc-900">
              {FRIEND_NAME}
            </p>
            <div className="mt-3">
              <BirthdayCake
                photo={CAKE_PHOTO}
                onAllBlown={celebrate}
                onCut={celebrate}
              />
            </div>
          </CardShell>

          <CardShell>
            <PhotoFrame
              src={PHOTOS[1]}
              alt={FRIEND_NAME}
              className="aspect-square w-64 max-w-full rounded-2xl"
            />
            <p className="font-display mt-4 text-3xl font-bold text-rose-600">
              Untuk Cintaku
            </p>
            <p className="mx-auto mt-2 max-w-xs text-base leading-6 text-zinc-600">
              {MESSAGE}
            </p>
            <button
              type="button"
              onClick={celebrate}
              className="mt-4 rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-300 transition-colors hover:bg-rose-700"
            >
              Ini harusnya confetti
            </button>
          </CardShell>

          <CardShell>
            <BalloonGame onWin={celebrate} />
          </CardShell>

          <CardShell>
            <PhotoFrame
              src={PHOTOS[2]}
              alt={FRIEND_NAME}
              className="aspect-square w-64 max-w-full rounded-2xl"
            />
            <p className="font-display mt-3 text-2xl font-bold text-rose-500">
              Kado Spesial untukmu
            </p>
            <div className="mt-8">
              <GiftBox3D onOpen={celebrate} />
            </div>
          </CardShell>

          <CardShell>
            <PhotoFrame
              src={PHOTOS[3]}
              alt={FRIEND_NAME}
              className="mb-4 aspect-square w-64 max-w-full rounded-2xl"
            />
            <div className="flex items-end gap-3 text-5xl">
              <span className="animate-sunflower-sway inline-block">🌻</span>
              <span className="animate-cat-bob inline-block">🐱</span>
              <span
                className="animate-sunflower-sway inline-block"
                style={{ animationDelay: "0.6s" }}
              >
                🌻
              </span>
            </div>
            <p className="mx-auto mt-4 max-w-xs text-base leading-6 text-zinc-600">
              Di dekatmu, aku seperti bunga matahari yang selalu mencari terang, dan seperti kucing yang akhirnya menemukan tempat paling nyaman untuk pulang.
            </p>
          </CardShell>

          <CardShell>
            <PhotoFrame
              src={PHOTOS[4]}
              alt={`${SENDER} dan ${FRIEND_NAME}`}
              className="aspect-square w-64 max-w-full rounded-2xl"
            />
            <p className="font-display mt-3 text-3xl font-bold text-zinc-900">
              Selamat ulang tahun, sayang!
            </p>
            <p className="mx-auto mt-1 max-w-xs text-base leading-6 text-zinc-600">
              {SENDER_MESSAGE}
            </p>
            <p className="font-display mt-2 text-2xl font-bold text-rose-600">
              - Pacarmu, {SENDER} yang paling ganteng
            </p>
          </CardShell>
        </SwipeDeck>

        <a
          href="#cerita"
          data-no-burst
          className="mt-2 flex flex-col items-center text-white"
        >
          <span className="font-display text-2xl font-bold">
            Scroll ke bawah, masih ada cerita untukmu
          </span>
          <Arrow dir="down" className="mt-1 animate-bounce text-5xl" />
        </a>
      </div>

      {revealed && <StorySection />}
    </div>
  );
}
