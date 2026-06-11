"use client";

import { useEffect, useRef, useState } from "react";

export function PullToRefresh() {
  const startY = useRef<number | null>(null);
  const [pulling, setPulling] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const onTouchStart = (event: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = event.touches[0].clientY;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (startY.current === null || window.scrollY !== 0) return;

      const delta = event.touches[0].clientY - startY.current;
      if (delta > 12) {
        setPulling(true);
        setDistance(Math.min(delta, 96));
      }
    };

    const onTouchEnd = () => {
      if (pulling && distance > 72) {
        window.location.reload();
      }

      startY.current = null;
      setPulling(false);
      setDistance(0);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pulling, distance]);

  return (
    <div
      className={pulling ? "pull-refresh visible" : "pull-refresh"}
      style={{ transform: `translateX(-50%) translateY(${Math.max(0, distance - 46)}px)` }}
      aria-hidden="true"
    >
      {distance > 72 ? "Soltar para actualizar" : "Desliza para actualizar"}
    </div>
  );
}
