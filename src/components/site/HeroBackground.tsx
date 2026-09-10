"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Full-bleed hero background. Plays a muted, looping clip on capable devices and
 * falls back to the poster image for reduced-motion, data-saver, or if the
 * video can't play.
 */
export default function HeroBackground({
  video,
  poster,
  alt,
}: {
  video: string;
  poster: string;
  alt: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    // @ts-expect-error - non-standard but widely supported
    const saveData = navigator.connection?.saveData === true;
    setShowVideo(!media.matches && !saveData);

    const onChange = () => setShowVideo(!media.matches && !saveData);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!showVideo || !ref.current) return;
    const el = ref.current;
    el.muted = true;
    const p = el.play();
    if (p && typeof p.catch === "function") p.catch(() => setShowVideo(false));
  }, [showVideo]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-forest-900">
      <Image
        src={poster}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {showVideo && (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          src={video}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setShowVideo(false)}
        />
      )}
    </div>
  );
}
