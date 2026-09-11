"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Car,
  MapPin,
  MessageSquareQuote,
  HelpCircle,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { logoutAction } from "@/app/admin/(panel)/logout";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/fleet", label: "Fleet", icon: Car },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/content", label: "Site content", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function Logo() {
  return (
    <span className="inline-flex shrink-0 rounded-xl bg-white p-1.5 shadow-sm">
      <Image
        src="/logo.png"
        alt=""
        width={512}
        height={512}
        priority
        className="h-9 w-auto"
      />
    </span>
  );
}

function NavLinks({
  pathname,
  onNavigate,
  iconSize = "h-4 w-4",
}: {
  pathname: string;
  onNavigate?: () => void;
  iconSize?: string;
}) {
  return (
    <>
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-3 text-sm font-medium transition-colors md:py-2 ${
              active
                ? "border-saffron-400 bg-white/[0.14] text-white"
                : "border-transparent text-forest-100/80 hover:bg-white/[0.07] hover:text-white"
            }`}
          >
            <Icon
              className={`${iconSize} shrink-0 ${
                active ? "text-saffron-300" : "text-forest-200/70"
              }`}
            />
            {label}
          </Link>
        );
      })}
    </>
  );
}

function FooterLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="mt-2 flex flex-col gap-1 border-t border-white/10 pt-3">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-forest-100/80 hover:bg-white/[0.07] hover:text-white md:py-2"
      >
        <ExternalLink className="h-4 w-4 shrink-0" />
        View website
      </a>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-forest-100/80 hover:bg-white/[0.07] hover:text-white md:py-2"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </form>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on route change and lock body scroll while it's open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const current = LINKS.find(
    (l) => pathname === l.href || (!l.exact && pathname.startsWith(`${l.href}/`)),
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-gradient-to-r from-forest-800 to-forest-900 px-4 py-3 text-forest-100 md:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-sm font-semibold text-white">
            {current?.label ?? "Admin portal"}
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={open}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg hover:bg-white/[0.08]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile full-screen drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-forest-800 to-forest-900 p-3 text-forest-100 md:hidden">
          <div className="flex items-center justify-between gap-3 px-1 py-2">
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="text-sm font-semibold text-white">Admin portal</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-10 w-10 place-items-center rounded-lg hover:bg-white/[0.08]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-2 flex flex-1 flex-col gap-1 overflow-y-auto">
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} iconSize="h-5 w-5" />
          </nav>
          <FooterLinks onNavigate={() => setOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden shrink-0 flex-col gap-1 bg-gradient-to-b from-forest-800 to-forest-900 p-4 text-forest-100 md:flex md:h-screen md:w-64">
        <div className="flex items-center gap-3 px-1 py-3">
          <Logo />
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-base font-extrabold text-white">
              Sumpreeth
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-saffron-300">
              Admin portal
            </span>
          </span>
        </div>

        <nav className="mt-2 flex flex-1 flex-col gap-1">
          <NavLinks pathname={pathname} />
        </nav>

        <FooterLinks />
      </aside>
    </>
  );
}
