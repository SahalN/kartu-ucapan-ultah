"use client";

import {
  Children,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { SwipeArrows } from "./aesthetic-arrow";

const SWIPE_THRESHOLD = 90;
const DRAG_START_DISTANCE = 8;

type SwipeDeckProps = {
  children: ReactNode;
};

export default function SwipeDeck({ children }: SwipeDeckProps) {
  const cards = Children.toArray(children);
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const dragX = useRef(0);
  const draggingRef = useRef(false);

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    startX.current = e.clientX;
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    // Capture only once it's a real drag, so taps still reach buttons inside cards.
    if (!draggingRef.current) {
      if (Math.abs(dx) < DRAG_START_DISTANCE) return;
      draggingRef.current = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    dragX.current = dx;
    setDrag(dx);
  }

  function endDrag() {
    startX.current = null;
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    const dx = dragX.current;
    if (dx > SWIPE_THRESHOLD) {
      setIndex((i) => (i - 1 + cards.length) % cards.length);
    } else if (dx < -SWIPE_THRESHOLD) {
      setIndex((i) => (i + 1) % cards.length);
    }
    dragX.current = 0;
    setDrag(0);
  }

  return (
    <div
      data-no-burst
      className="mx-auto flex w-full max-w-sm flex-col items-center"
    >
      <div
        className="relative h-[74dvh] max-h-[660px] min-h-[560px] w-full touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        {cards.map((card, i) => {
          let offset = i - index;
          if (offset > cards.length / 2) offset -= cards.length;
          if (offset < -cards.length / 2) offset += cards.length;
          if (Math.abs(offset) > 1) return null;
          const isActive = offset === 0;
          const translate = isActive ? drag : offset * 36;
          const rotate = isActive ? drag / 18 : offset * 4;
          const scale = isActive ? 1 : 0.93;

          return (
            <div
              key={i}
              aria-hidden={!isActive}
              className={`absolute inset-0 ${
                isActive && dragging
                  ? ""
                  : "transition-[transform,opacity] duration-300 ease-out"
              } ${isActive ? "" : "pointer-events-none"}`}
              style={{
                transform: `translateX(${translate}px) rotate(${rotate}deg) scale(${scale})`,
                zIndex: cards.length - Math.abs(offset),
                opacity: isActive ? 1 : 0.75,
              }}
            >
              {card}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-1">
        {cards.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Kartu ${i + 1}`}
            className="p-1"
          >
            <span
              className={`block h-2 rounded-full transition-all ${
                i === index ? "w-5 bg-white" : "w-2 bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>
      <div className="mt-1 flex items-center gap-2 text-white/90">
        <p className="text-sm font-medium">Geser kartu ke kiri atau kanan yahh</p>
      </div>
    </div>
  );
}
