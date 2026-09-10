"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** e.g. "50,000+", "12+", "180+" — digits are animated, suffix kept. */
  value: string;
  label: string;
};

function splitValue(v: string): { target: number; prefix: string; suffix: string } {
  const match = v.match(/([^\d]*)([\d,]+)(.*)/);
  if (!match) return { target: 0, prefix: "", suffix: v };
  return {
    prefix: match[1] ?? "",
    target: Number((match[2] ?? "0").replace(/,/g, "")),
    suffix: match[3] ?? "",
  };
}

export default function Counter({ value, label }: Props) {
  const { target, prefix, suffix } = splitValue(value);
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const duration = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(target);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-3xl font-extrabold text-ink sm:text-4xl">
        {prefix}
        {display.toLocaleString("en-IN")}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-forest-600 dark:text-forest-300">{label}</div>
    </div>
  );
}
