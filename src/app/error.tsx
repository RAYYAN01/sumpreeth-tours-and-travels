"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-page px-4 text-center">
      <div className="max-w-md">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-3 text-h1 font-extrabold text-ink">
          That didn&apos;t load
        </h1>
        <p className="mt-4 text-bodytext">
          A temporary error stopped this page from loading. Please try again, or
          call us and we&apos;ll help you book.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <a href="/" className="btn-outline">
            Go to homepage
          </a>
        </div>
      </div>
    </main>
  );
}
