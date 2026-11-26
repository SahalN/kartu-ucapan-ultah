"use client";

import { useEffect, useRef, useState } from "react";
import { Arrow } from "./aesthetic-arrow";
import PhotoFrame from "./photo-frame";

const CANDLE_COUNT = 3;
const STORAGE_KEY = "doa-ulang-tahun-dayang";
// Isi nomor WhatsApp Sahal, boleh format "0812-3456-7890" atau "6281234567890". Kosong berarti WhatsApp membuka pilihan kontak.
const WHATSAPP_NUMBER = "081804693793";
const WISH_TEXT = "Ini doa ulang tahunku untuk Sahal";
const PREFERRED_MIME = ["audio/mp4", "audio/ogg;codecs=opus", "audio/webm;codecs=opus"];

function whatsappNumber() {
  const digits = WHATSAPP_NUMBER.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}

const SPRINKLES = [
  { left: "14%", top: "45%", color: "bg-sky-400" },
  { left: "32%", top: "65%", color: "bg-emerald-400" },
  { left: "52%", top: "50%", color: "bg-red-500" },
  { left: "70%", top: "68%", color: "bg-amber-400" },
  { left: "84%", top: "48%", color: "bg-rose-500" },
];

type MicState = "off" | "recording" | "unsupported" | "denied";
type Recording = { src: string; ext: string };

type BirthdayCakeProps = {
  photo?: string;
  onAllBlown?: () => void;
  onCut?: () => void;
};

function extensionFor(mime: string) {
  if (mime.includes("mp4")) return "m4a";
  if (mime.includes("ogg")) return "ogg";
  return "webm";
}

function CakeTiers() {
  return (
    <>
      <div className="relative h-10 w-32 overflow-hidden rounded-t-xl bg-amber-100">
        <div className="absolute inset-x-0 top-0 h-3 bg-pink-300" />
        {SPRINKLES.map((s, i) => (
          <span
            key={i}
            className={`absolute h-1 w-2.5 rounded-full ${s.color}`}
            style={{ left: s.left, top: s.top, rotate: `${i * 37}deg` }}
          />
        ))}
      </div>
      <div className="relative h-14 w-44 overflow-hidden rounded-t-xl bg-rose-400">
        <div className="absolute inset-x-0 top-0 h-3 bg-white" />
        <div className="absolute inset-x-0 top-3 flex justify-around">
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className={`w-4 rounded-b-full bg-white ${i % 2 ? "h-4" : "h-2.5"}`}
            />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-1.5 flex items-center justify-center gap-2 text-lg leading-none">
          <span className="font-display text-4xl font-bold text-white drop-shadow-[0_2px_0_rgba(159,18,57,0.6)]">
            24
          </span>
        </div>
      </div>
    </>
  );
}

const BAR_HEIGHTS = [40, 70, 50, 90, 60, 100, 55, 80, 45, 75, 35, 65];
const STEPS = ["Doa", "Lilin padam", "Potong"];

function MiniPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else audio.play().catch(() => {});
  }

  return (
    <div className="flex items-center gap-3">
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setTime(0);
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Jeda rekaman" : "Putar rekaman"}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-600 shadow-md shadow-rose-300 transition-transform active:scale-90"
      >
        {playing ? (
          <span className="flex gap-1">
            <span className="h-3.5 w-1 rounded-sm bg-white" />
            <span className="h-3.5 w-1 rounded-sm bg-white" />
          </span>
        ) : (
          <span className="ml-0.5 block h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-white" />
        )}
      </button>
      <div className="flex h-7 flex-1 items-end justify-between gap-0.5">
        {BAR_HEIGHTS.map((h, i) => (
          <span
            key={i}
            className={`block w-1 origin-bottom rounded-full ${
              playing ? "animate-eq bg-rose-500" : "bg-rose-300"
            }`}
            style={{ height: `${h}%`, animationDelay: `${(i % 5) * 0.12}s` }}
          />
        ))}
      </div>
      <span className="w-12 shrink-0 text-right text-xs font-semibold text-rose-600">
        {Math.floor(time)} dtk
      </span>
    </div>
  );
}

export default function BirthdayCake({
  photo,
  onAllBlown,
  onCut,
}: BirthdayCakeProps) {
  const [lit, setLit] = useState<boolean[]>(() =>
    Array(CANDLE_COUNT).fill(true)
  );
  const [cut, setCut] = useState(false);
  const [micState, setMicState] = useState<MicState>("off");
  const [level, setLevel] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [recording, setRecording] = useState<Recording | null>(null);
  const [justRecorded, setJustRecorded] = useState(false);
  const [shareFile, setShareFile] = useState<File | null>(null);
  const [shareNote, setShareNote] = useState("");
  const litRef = useRef(lit);
  const sessionRef = useRef<((save: boolean) => void) | null>(null);
  const allOut = lit.every((isLit) => !isLit);

  useEffect(() => {
    const load = window.setTimeout(() => {
      try {
        const src = localStorage.getItem(STORAGE_KEY);
        if (src) {
          const mime = src.slice(5, src.indexOf(";"));
          setRecording({ src, ext: extensionFor(mime) });
        }
      } catch {}
    }, 0);
    return () => {
      window.clearTimeout(load);
      sessionRef.current?.(false);
    };
  }, []);

  useEffect(() => {
    if (!recording) return;
    let cancelled = false;
    fetch(recording.src)
      .then((res) => res.blob())
      .then((blob) => {
        if (cancelled) return;
        setShareFile(
          new File([blob], `doa-ulang-tahun-dayang.${recording.ext}`, {
            type: blob.type,
          })
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [recording]);

  function openWhatsAppWithDownload() {
    if (!recording) return;
    const link = document.createElement("a");
    link.href = recording.src;
    link.download = `doa-ulang-tahun-dayang.${recording.ext}`;
    link.click();
    window.open(
      `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(
        WISH_TEXT
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
    setShareNote(
      `Rekaman sudah diunduh ke folder Unduhan dengan nama doa-ulang-tahun-dayang.${recording.ext}. WhatsApp tidak bisa menerima file lewat link, jadi di chat yang terbuka klik ikon klip, pilih Dokumen, lalu pilih file itu.`
    );
  }

  function shareToWhatsApp() {
    if (!recording) return;
    if (shareFile && navigator.canShare?.({ files: [shareFile] })) {
      navigator
        .share({ files: [shareFile], title: "Doa ulang tahun", text: WISH_TEXT })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          openWhatsAppWithDownload();
        });
      return;
    }
    openWhatsAppWithDownload();
  }

  function extinguish(i: number) {
    const current = litRef.current;
    if (!current[i]) return;
    const next = current.map((isLit, j) => (j === i ? false : isLit));
    litRef.current = next;
    setLit(next);
    if (next.every((isLit) => !isLit)) onAllBlown?.();
  }

  function blowOutAll() {
    for (let i = 0; i < CANDLE_COUNT; i++) {
      window.setTimeout(() => extinguish(i), i * 450);
    }
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicState("unsupported");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.fftSize);

      let shouldSave = true;
      let recorder: MediaRecorder | null = null;
      if (typeof MediaRecorder !== "undefined") {
        const chunks: Blob[] = [];
        const mimeType = PREFERRED_MIME.find((type) =>
          MediaRecorder.isTypeSupported(type)
        );
        recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };
        recorder.onstop = () => {
          if (!shouldSave || chunks.length === 0) return;
          const mime = recorder?.mimeType || "audio/webm";
          const reader = new FileReader();
          reader.onloadend = () => {
            const src = reader.result as string;
            setRecording({ src, ext: extensionFor(mime) });
            try {
              localStorage.setItem(STORAGE_KEY, src);
            } catch {}
          };
          reader.readAsDataURL(new Blob(chunks, { type: mime }));
        };
        recorder.start();
      }

      let raf = 0;
      const listen = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) {
          const x = (v - 128) / 128;
          sum += x * x;
        }
        setLevel(Math.sqrt(sum / data.length));
        raf = requestAnimationFrame(listen);
      };
      raf = requestAnimationFrame(listen);
      const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);

      sessionRef.current = (save: boolean) => {
        shouldSave = save;
        cancelAnimationFrame(raf);
        window.clearInterval(timer);
        if (recorder && recorder.state !== "inactive") recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        void ctx.close();
        sessionRef.current = null;
        setMicState("off");
        setLevel(0);
      };
      setSeconds(0);
      setMicState("recording");
    } catch {
      setMicState("denied");
    }
  }

  function finishRecording() {
    sessionRef.current?.(true);
    setJustRecorded(true);
    window.setTimeout(blowOutAll, 600);
  }

  function cancelRecording() {
    sessionRef.current?.(false);
  }

  function cutCake() {
    if (!allOut || cut) return;
    setCut(true);
    onCut?.();
  }

  function reset() {
    const fresh: boolean[] = Array(CANDLE_COUNT).fill(true);
    litRef.current = fresh;
    setLit(fresh);
    setCut(false);
    setJustRecorded(false);
  }

  const lean = Math.min(level * 6, 1);

  const activeStep = cut ? 3 : allOut ? 2 : 0;
  const BUBBLE =
    "mt-2 flex w-full max-w-[17rem] flex-col items-center gap-1.5 rounded-2xl bg-rose-50/90 px-3 py-2.5 text-center ring-1 ring-rose-100";
  const PRIMARY =
    "rounded-full bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-rose-300 transition-transform active:scale-95";

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex flex-col items-center">
        <div className="pointer-events-none absolute left-1/2 top-10 h-28 w-52 -translate-x-1/2 rounded-full bg-rose-200/70 blur-2xl" />
        <div
          className={`relative z-10 -mb-0.5 flex gap-6 transition-all duration-500 ${
            cut ? "-translate-y-4 opacity-0" : ""
          }`}
        >
          {lit.map((isLit, i) => (
            <button
              key={i}
              type="button"
              onClick={() => extinguish(i)}
              disabled={!isLit}
              aria-label={isLit ? `Padamkan lilin ${i + 1}` : `Lilin ${i + 1} padam`}
              className="flex flex-col items-center px-1 transition-transform active:scale-90"
            >
              <span className="relative flex h-6 w-4 items-end justify-center">
                {isLit ? (
                  <span
                    className="block origin-bottom transition-transform duration-100"
                    style={{
                      transform: `skewX(${-lean * 35}deg) scaleY(${1 - lean * 0.5})`,
                    }}
                  >
                    <span className="animate-flame block h-5 w-3 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_14px_5px_rgba(251,191,36,0.55)]" />
                  </span>
                ) : (
                  <span className="animate-smoke block h-3 w-3 rounded-full bg-zinc-300/80" />
                )}
              </span>
              <span className="h-1.5 w-0.5 bg-zinc-700" />
              <span className="h-9 w-2.5 rounded-sm bg-[repeating-linear-gradient(45deg,#f9a8d4_0_4px,#ffffff_4px_8px)] shadow-sm" />
            </button>
          ))}
        </div>

        {cut && (
          <div className="animate-photo-rise absolute left-1/2 top-1 z-20 -ml-10 w-20 rounded-sm bg-white p-1 pb-4 shadow-xl shadow-rose-900/40">
            <PhotoFrame src={photo} alt="Foto kenangan" className="aspect-square w-full" />
            <span className="font-display absolute inset-x-0 bottom-0.5 text-center text-sm font-bold leading-none text-rose-500">
              24
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={cutCake}
          disabled={!allOut || cut}
          aria-label="Potong kue"
          className={`relative h-24 w-44 ${
            allOut && !cut ? "animate-cake-wiggle" : ""
          }`}
        >
          <div
            className={`absolute inset-0 flex origin-bottom flex-col items-center justify-end transition-transform duration-700 [clip-path:inset(0_50%_0_0)] ${
              cut ? "-translate-x-3 -rotate-6" : ""
            }`}
          >
            <CakeTiers />
          </div>
          <div
            aria-hidden
            className={`absolute inset-0 flex origin-bottom flex-col items-center justify-end transition-transform duration-700 [clip-path:inset(0_0_0_50%)] ${
              cut ? "translate-x-3 rotate-6" : ""
            }`}
          >
            <CakeTiers />
          </div>
          {cut && (
            <span className="animate-knife-cut pointer-events-none absolute left-1/2 top-0 h-20 w-1 rounded-full bg-zinc-400 shadow" />
          )}
        </button>

        <div className="h-3 w-52 rounded-full bg-zinc-200 shadow-md" />
      </div>

      <ol className="mt-3 flex items-center gap-1.5">
        {STEPS.map((label, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <li
              key={label}
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
                done
                  ? "bg-rose-500 text-white"
                  : active
                    ? "bg-white text-rose-600 ring-2 ring-rose-400"
                    : "bg-rose-100 text-rose-300"
              }`}
            >
              <span>{i + 1}</span>
              {label}
            </li>
          );
        })}
      </ol>

      {!allOut && micState !== "recording" && (
        <div className={BUBBLE}>
          <p className="font-display text-2xl font-bold leading-none text-rose-600">
            Make a wish dulu
          </p>
          <p className="text-xs leading-4 text-zinc-600">
            Pejamkan mata dan ucapkan doamu lewat mic, nanti lilinnya padam sendiri
          </p>
          <button type="button" onClick={startRecording} className={PRIMARY}>
            Ucapkan doa lewat mic
          </button>
          <p className="text-[11px] text-zinc-500">
            atau ketuk lilinnya satu per satu
          </p>
          {micState === "unsupported" && (
            <p className="text-[11px] text-rose-500">
              Mic butuh koneksi HTTPS, jadi ketuk lilinnya saja ya
            </p>
          )}
          {micState === "denied" && (
            <p className="text-[11px] text-rose-500">
              Izin mic ditolak, ketuk lilinnya saja ya
            </p>
          )}
        </div>
      )}

      {micState === "recording" && (
        <div className={BUBBLE}>
          <p className="flex items-center gap-1.5 text-sm font-bold text-rose-600">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
            Merekam doamu ({seconds} dtk)
          </p>
          <p className="text-xs text-zinc-600">Ucapkan doamu sekarang</p>
          <div className="h-1.5 w-36 overflow-hidden rounded-full bg-rose-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 to-red-500 transition-[width] duration-75"
              style={{ width: `${Math.min(level / 0.12, 1) * 100}%` }}
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={finishRecording} className={PRIMARY}>
              Selesai, padamkan lilin
            </button>
            <button
              type="button"
              onClick={cancelRecording}
              className="rounded-full border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {allOut && !cut && (
        <div className={BUBBLE}>
          <Arrow dir="up" className="animate-arrow-up text-3xl text-rose-500" />
          <p className="font-display text-2xl font-bold leading-none text-rose-600">
            Sekarang potong kuenya
          </p>
          <p className="text-xs leading-4 text-zinc-600">
            {justRecorded
              ? "Doamu sudah tersimpan dan lilin padam. Ketuk kue di atas untuk memotongnya"
              : "Semua lilin padam. Ketuk kue di atas untuk memotongnya"}
          </p>
        </div>
      )}

      {cut && (
        <div className={BUBBLE}>
          <p className="font-display text-2xl font-bold leading-none text-rose-600">
            Selamat makan
          </p>
          <p className="text-xs text-zinc-600">Semoga semua doamu terkabul</p>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-white"
          >
            Ulangi dari awal
          </button>
        </div>
      )}

      {recording && micState !== "recording" && (
        <div className="mt-2 w-full max-w-[17rem] rounded-2xl bg-white/90 p-3 shadow-sm ring-1 ring-rose-100">
          <p className="mb-2 text-xs font-bold text-rose-600">Doamu tersimpan</p>
          <MiniPlayer src={recording.src} />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={shareToWhatsApp}
              className="flex-1 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-700/30 transition-transform active:scale-95"
            >
              Kirim ke Sahal lewat WhatsApp
            </button>
            <a
              href={recording.src}
              download={`doa-ulang-tahun-dayang.${recording.ext}`}
              className="rounded-full border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
            >
              Unduh
            </a>
          </div>
          {shareNote && (
            <p className="mt-2 text-center text-[11px] leading-4 text-zinc-600">
              {shareNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
