"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/fleet", label: "Fleet" },
  { href: "/destination", label: "Destination" },
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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "bg-page/95 shadow-sm backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          aria-label="Sumpreeth Tours and Travels — home"
          className="flex items-center"
        >
          <span className="inline-flex rounded-lg bg-white p-1 shadow-sm ring-1 ring-black/5">
            <Image
              src="/logo.png"
              alt="Sumpreeth Tours and Travels"
              width={512}
              height={512}
              priority
              className="h-10 w-auto sm:h-12"
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  solid
                    ? active
                      ? "bg-forest-100 dark:bg-white/[0.08] text-ink"
                      : "text-bodytext hover:bg-forest-50 dark:hover:bg-white/[0.04]"
                    : active
                      ? "bg-surface/20 text-white"
                      : "text-white/90 hover:bg-surface/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle light={!solid} />
          <a
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
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
            className="btn-accent hidden px-5 py-2.5 sm:inline-flex"
          >
            Book Now
          </a>
          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden ${
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

      {/* Mobile full-screen menu */}
      {open && (
        <div className="fixed inset-0 top-16 z-40 overflow-y-auto bg-page md:hidden">
          <nav className="container-page flex flex-col gap-1 py-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-lg font-semibold text-ink hover:bg-forest-50 dark:hover:bg-white/[0.04]"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent mt-4"
            >
              Book Now on WhatsApp
            </a>
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="btn-outline mt-2">
              Call {phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
