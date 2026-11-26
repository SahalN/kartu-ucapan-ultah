"use client";

import { useRef, useState } from "react";

const VIDEO_ID = "q6on6wvbvwk";
const NOTES = ["♪", "♫", "♬"];

type MusicPlayerProps = {
  started: boolean;
  onStart: () => void;
};

function Equalizer({ paused }: { paused: boolean }) {
  return (
    <span className="flex h-4 items-end gap-0.5">
      {[0, 0.2, 0.4, 0.1].map((delay, i) => (
        <span
          key={i}
          className="animate-eq block h-4 w-1 origin-bottom rounded-full bg-rose-500"
          style={{
            animationDelay: `${delay}s`,
            animationPlayState: paused ? "paused" : "running",
          }}
        />
      ))}
    </span>
  );
}

const PILL =
  "flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-rose-600 shadow-lg shadow-rose-900/20 transition-transform hover:bg-white active:scale-95";

export default function MusicPlayer({ started, onStart }: MusicPlayerProps) {
  const [paused, setPaused] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function togglePause() {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: paused ? "playVideo" : "pauseVideo",
        args: [],
      }),
      "https://www.youtube.com"
    );
    setPaused((p) => !p);
  }

  return (
    <div
      data-no-burst
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-2"
    >
      {started && (
        <div className="animate-player-in origin-bottom-right rounded-2xl bg-white/95 p-2 shadow-xl shadow-rose-900/25 ring-2 ring-white/70">
          <div className="flex items-center gap-2 px-1">
            <span
              className="animate-spin-slow block h-7 w-7 shrink-0 rounded-full bg-[radial-gradient(circle,#f43f5e_0_20%,#18181b_22%_45%,#3f3f46_47%_52%,#18181b_54%_100%)] shadow"
              style={{ animationPlayState: paused ? "paused" : "running" }}
            />
            <div className="w-24 overflow-hidden">
              <p
                className="animate-marquee w-max whitespace-nowrap text-[11px] font-semibold text-rose-600"
                style={{ animationPlayState: paused ? "paused" : "running" }}
              >
                {paused ? "Dijeda" : "Sedang diputar"} • Sal Priadi •{" "}
                {paused ? "Dijeda" : "Sedang diputar"} • Sal Priadi •&nbsp;
              </p>
            </div>
            <Equalizer paused={paused} />
          </div>
          <div
            className={`overflow-hidden transition-[height,margin] duration-300 ${
              showVideo ? "mt-2 h-[101px]" : "mt-0 h-0"
            }`}
          >
            <iframe
              ref={iframeRef}
              width="180"
              height="101"
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&playlist=${VIDEO_ID}&loop=1&playsinline=1&enablejsapi=1`}
              title="Lagu Sal Priadi"
              allow="autoplay; encrypted-media; picture-in-picture"
              className="block rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="relative flex gap-2">
        {started && !paused &&
          NOTES.map((note, i) => (
            <span
              key={note}
              className="animate-note-float pointer-events-none absolute -top-2 left-4 text-lg font-bold text-white drop-shadow"
              style={{ animationDelay: `${i * 0.7}s` }}
            >
              {note}
            </span>
          ))}

        {!started ? (
          <>
            <span className="absolute inset-0 animate-ping rounded-full bg-white/60" />
            <button type="button" onClick={onStart} className={`${PILL} relative`}>
              <span className="animate-note-bounce inline-block">♪</span>
              Putar Lagu
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setShowVideo((v) => !v)}
              aria-pressed={!showVideo}
              className={PILL}
            >
              {showVideo ? "Sembunyikan" : "Tampilkan"}
            </button>
            <button type="button" onClick={togglePause} className={PILL}>
              {paused ? "Lanjut" : "Jeda"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
