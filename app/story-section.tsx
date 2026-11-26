"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import PhotoFrame from "./photo-frame";

// Isi path foto di sini setelah foto ditaruh di public/foto, misal "/foto/cerita-1.jpg".
const STORY_PHOTOS: (string | undefined)[] = [
  "/foto/IMG_0937_Original.JPG",
  "/foto/IMG-20261024-WA0014_Original.JPG",
  "/foto/foto6.jpeg",
  "/foto/IMG-20261024-WA0074_Original.JPG",
  "/foto/IMG-20261024-WA0097_Original.JPG",
];

const CHAPTERS = [
  {
    title: "Pertemuan",
    poem: "Awalnya kita cuma dua orang yang kebetulan bertemu,\ntapi lama-lama aku sadar,\nkebetulan itu hal terbaik yang pernah terjadi padaku.",
  },
  {
    title: "Tawa",
    poem: "Tawamu sederhana,\ntapi entah kenapa\nbikin aku betah lama-lama di dekatmu.",
  },
  {
    title: "Genggaman",
    poem: "Hangat tanganmu cukup\nuntuk mengusir dingin\nyang lama tinggal di dadaku.",
  },
  {
    title: "Rindu",
    poem: "Kalau kita sedang jauh,\naku sering tiba-tiba kepikiran kamu,\nlalu sadar aku sedang tersenyum sendiri.",
  },
  {
    title: "Hari Ini",
    poem: "Hari ini kamu bertambah umur,\ndan aku bertambah alasan\nuntuk bersyukur pernah menemukanmu.",
  },
];

const DOA = [
  "Semoga kamu selalu ingat, kamu tak perlu jadi sempurna untuk dicintai, karena bagiku kamu sudah lebih dari cukup.",
  "Semoga semua lelah yang kamu simpan sendirian pelan-pelan reda, dan kamu tahu ada aku yang mau mendengarkan.",
  "Terima kasih sudah bertahan di hari-hari yang berat. Aku bangga padamu, lebih dari yang bisa kutulis.",
  "Semoga di usia 24 kamu dikelilingi orang-orang yang menyayangimu, dan semoga aku yang paling lama tinggal.",
  "Apa pun yang terjadi nanti, aku di sini. Aku akan bersamamu, setiap saat.",
];

const LETTER = [
  "Untuk Dayang, perempuan yang menjadi musim semi dalam kalenderku,",
  "Usiamu bertambah, namun bagiku kau tetap pagi yang selalu baru, selalu hangat, dan selalu kunanti.",
  "Jika cinta adalah bahasa, kaulah satu-satunya kata yang tak ingin kuterjemahkan. Aku bukan pujangga, tetapi di dekatmu kalimat datang sendiri, berbaris seperti burung-burung pulang ke sarang.",
  "Semoga umurmu sepanjang sabar yang kau titipkan padaku, semoga bahagiamu seluas langit yang kita pandangi bersama, dan semoga di setiap tiupan lilin, doa-doamu menemukan jalan pulang.",
  "Biarkan aku menjadi bahu tempat lelahmu bersandar, dan menjadi peta saat kau ingin tahu arah menuju rumah.",
  "Selamat ulang tahun, sayang. Seluruh hatiku milikmu, hari ini dan di setiap hari sesudahnya.",
];

function Reveal({
  children,
  className = "",
  unfold = false,
}: {
  children: ReactNode;
  className?: string;
  unfold?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShown(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${
        unfold
          ? `origin-top duration-1000 ${
              shown
                ? "[transform:perspective(900px)_rotateX(0deg)] opacity-100"
                : "[transform:perspective(900px)_rotateX(-80deg)] opacity-0"
            }`
          : `duration-700 ${
              shown ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function StorySection() {
  return (
    <section
      id="cerita"
      className="relative z-10 mx-auto w-full max-w-sm px-4 pb-40 pt-16"
    >
      <Reveal className="text-center">
        <h2 className="font-display text-6xl font-bold text-white drop-shadow-[0_3px_0_rgba(159,18,57,0.55)]">
          Cerita Kita
        </h2>
        <p className="mt-2 text-base text-white/90">
          bait-bait kecil yang kutulis untukmu
        </p>
      </Reveal>

      <ol className="relative ml-3 mt-10 space-y-10 border-l-2 border-dashed border-white/70 pl-6">
        {CHAPTERS.map((chapter, i) => (
          <li key={chapter.title} className="relative">
            <span className="absolute -left-[1.97rem] top-2 h-3 w-3 rounded-full bg-white ring-2 ring-rose-300" />
            <Reveal unfold>
              <div
                className={`paper relative rounded-md p-4 ${
                  i % 2 ? "rotate-1" : "-rotate-1"
                }`}
              >
                <PhotoFrame
                  src={STORY_PHOTOS[i]}
                  alt={chapter.title}
                  className="mx-auto aspect-square w-64 max-w-full rounded-2xl"
                />
                <p className="font-display mt-3 text-3xl font-bold text-rose-600">
                  {chapter.title}
                </p>
                <p className="mt-1 whitespace-pre-line text-base leading-6 text-zinc-700">
                  {chapter.poem}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal className="mt-16 text-center">
        <h2 className="font-display text-5xl font-bold text-white drop-shadow-[0_3px_0_rgba(159,18,57,0.55)]">
          Doaku Untuk Kamu
        </h2>
      </Reveal>
      <div className="mt-6 space-y-3">
        {DOA.map((line, i) => (
          <Reveal key={i}>
            <div className="paper rounded-md px-5 py-4 text-center">
              <p className="font-display text-2xl leading-7 text-rose-600">
                {line}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal unfold className="mt-16">
        <div className="paper relative -rotate-1 rounded-md p-6">
          <div className="font-display mt-2 space-y-3 text-2xl leading-7 text-zinc-800">
            {LETTER.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <p className="font-display mt-5 text-right text-2xl font-bold text-rose-600">
            Sahal
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-10 text-center">
        <a
          href="#top"
          className="inline-block rounded-full bg-white px-6 py-2.5 text-sm font-bold text-rose-600 shadow-lg shadow-rose-900/25 transition-transform active:scale-95"
        >
          Kembali ke atas
        </a>
      </Reveal>
    </section>
  );
}
