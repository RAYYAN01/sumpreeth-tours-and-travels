"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const PACKAGE_LINKS: { href: string; label: string }[] = [
  { href: "/tours-packages", label: "All Tour Packages" },
  { href: "/tours-packages?state=KARNATAKA", label: "Karnataka Tour Packages" },
  { href: "/tours-packages?state=KERALA", label: "Kerala Tour Packages" },
  { href: "/tours-packages?state=TAMIL_NADU", label: "Tamil Nadu Tour Packages" },
  { href: "/tours-packages?state=ANDHRA_PRADESH", label: "Andhra Pradesh Tour Packages" },
  { href: "/tours-packages?state=GOA", label: "Goa Tour Packages" },
  { href: "/tours-packages?category=WEEKEND", label: "Weekend Getaways" },
  { href: "/tours-packages?category=FAMILY", label: "Family Tour Packages" },
  { href: "/tours-packages?category=HONEYMOON", label: "Honeymoon Packages" },
  { href: "/tours-packages?category=GROUP", label: "Corporate / Group Tours" },
  { href: "/tours-packages?category=CUSTOM", label: "Customized Tour Packages" },
];

const NAV: { href: string; label: string; children?: typeof PACKAGE_LINKS }[] = [
  { href: "/", label: "Home" },
  { href: "/fleet", label: "Fleet" },
  { href: "/tours-packages", label: "Tours & Packages", children: PACKAGE_LINKS },
  { href: "/destination", label: "Destination" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

type Props = {
  phone: string;
  whatsappHref: string;
};

export default function Header({ phone, whatsappHref }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Transparent over the home hero, solid everywhere else / on scroll.
  const overHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || !overHero || open;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-colors duration-300 ${
        solid
          ? "bg-page/95 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          aria-label="Sumpreeth Tours and Travels — home"
          className="flex items-center gap-3 rounded-xl"
        >
          <span className="inline-flex rounded-lg bg-white p-1 shadow-sm ring-1 ring-black/5">
            <Image
              src="/logo.png"
              alt=""
              width={512}
              height={512}
              priority
              className="h-10 w-auto sm:h-11"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={`font-heading text-base font-bold tracking-tight sm:text-lg ${
                solid ? "text-ink" : "text-white"
              }`}
            >
              Sumpreeth
            </span>
            <span
              className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px] ${
                solid ? "text-saffron-600" : "text-saffron-200"
              }`}
            >
              Tours &amp; Travels
            </span>
            <span
              className={`mt-1 hidden text-[10px] font-medium tracking-wide lg:block ${
                solid ? "text-muted" : "text-white/70"
              }`}
            >
              Bangalore · Karnataka · South India
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const linkCls = `flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
              solid
                ? active
                  ? "bg-forest-100 dark:bg-white/[0.08] text-ink"
                  : "text-bodytext hover:bg-forest-50 dark:hover:bg-white/[0.04]"
                : active
                  ? "bg-surface/20 text-white"
                  : "text-white/90 hover:bg-surface/10"
            }`;

            if (!item.children) {
              return (
                <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={linkCls}>
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.href} className="group/nav relative">
                <Link href={item.href} aria-current={active ? "page" : undefined} className={linkCls}>
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover/nav:rotate-180 group-focus-within/nav:rotate-180" />
                </Link>
                <div
                  className="invisible absolute left-0 top-full z-10 grid w-[30rem] grid-cols-2 gap-x-2 gap-y-0.5 rounded-2xl bg-surface p-3 opacity-0 shadow-card-hover ring-1 ring-black/5 transition-[opacity,visibility] duration-150 group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100 dark:ring-white/10"
                >
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="rounded-lg px-3 py-2 text-sm text-bodytext hover:bg-forest-50 hover:text-ink dark:hover:bg-white/[0.06]"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle light={!solid} />
          <a
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            data-track="call"
            className={`hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold sm:inline-flex ${
              solid
                ? "text-bodytext hover:bg-forest-50 dark:hover:bg-white/[0.04]"
                : "text-white hover:bg-surface/10"
            }`}
          >
            <Phone className="h-4 w-4" />
            <span className="hidden lg:inline">{phone}</span>
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            data-track="book-cta"
            className="btn-accent btn-shine hidden px-5 py-2.5 sm:inline-flex"
          >
            Book Now
          </a>
          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${
              solid ? "text-ink" : "text-white"
            }`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>

      {/* Mobile full-screen menu — kept as a SIBLING of <header>, not a
          child, so it can never be confined to the header's own box
          regardless of any future `filter`/`transform` on the header
          (a containing-block hazard for `position: fixed` descendants —
          this previously happened via `backdrop-blur`, since removed for
          scroll performance). Self-contained with its own header row so
          it never depends on matching the header's exact height. */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-page lg:hidden"
        >
          <div className="container-page flex h-16 items-center justify-between sm:h-20">
            <Link
              href="/"
              aria-label="Sumpreeth Tours and Travels — home"
              className="flex items-center gap-3"
              onClick={() => setOpen(false)}
            >
              <span className="inline-flex rounded-lg bg-white p-1 shadow-sm ring-1 ring-black/5">
                <Image
                  src="/logo.png"
                  alt=""
                  width={512}
                  height={512}
                  className="h-10 w-auto"
                />
              </span>
              <span className="font-heading text-base font-bold text-ink">
                Sumpreeth
              </span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-forest-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="container-page flex flex-1 flex-col gap-1 py-6">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              if (item.children) {
                return (
                  <details key={item.href} className="group/m">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold text-ink hover:bg-forest-50 [&::-webkit-details-marker]:hidden dark:hover:bg-white/[0.04]">
                      {item.label}
                      <ChevronDown className="h-5 w-5 text-forest-400 transition-transform group-open/m:rotate-180" />
                    </summary>
                    <div className="ml-2 flex flex-col gap-0.5 border-l border-line pb-1 pl-3">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="rounded-lg px-3 py-2.5 text-base text-bodytext hover:bg-forest-50 hover:text-ink dark:hover:bg-white/[0.04]"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-lg font-semibold hover:bg-forest-50 dark:hover:bg-white/[0.04] ${
                    active ? "bg-forest-50 text-ink dark:bg-white/[0.06]" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-track="book-cta"
              onClick={() => setOpen(false)}
              className="btn-accent mt-4"
            >
              Book Now on WhatsApp
            </a>
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              data-track="call"
              onClick={() => setOpen(false)}
              className="btn-outline mt-2"
            >
              Call {phone}
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
