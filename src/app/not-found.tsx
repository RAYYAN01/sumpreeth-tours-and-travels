import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-page px-4 text-center">
      <div className="max-w-md">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-h1 font-extrabold text-ink">
          We can&apos;t find that page
        </h1>
        <p className="mt-4 text-bodytext">
          The link may be old or mistyped. Let&apos;s get you back on the road.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Go to homepage
          </Link>
          <Link href="/fleet" className="btn-outline">
            Browse the fleet
          </Link>
        </div>
      </div>
    </main>
  );
}
