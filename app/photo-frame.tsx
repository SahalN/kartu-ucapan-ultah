import Image from "next/image";

type PhotoFrameProps = {
  src?: string;
  alt: string;
  className?: string;
  position?: string;
};

export default function PhotoFrame({
  src,
  alt,
  className = "",
  position = "50% 35%",
}: PhotoFrameProps) {
  return (
    <div className={`relative shrink-0 overflow-hidden bg-rose-50 ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 90vw, 360px"
          className="object-cover"
          style={{ objectPosition: position }}
          draggable={false}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-[inherit] border-2 border-dashed border-rose-300 bg-rose-50/80 text-rose-400">
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Foto di sini
          </span>
        </div>
      )}
    </div>
  );
}
