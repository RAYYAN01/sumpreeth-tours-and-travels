"use client";

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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-1 bg-gradient-to-b from-forest-800 to-forest-900 p-3 text-forest-100 md:h-screen md:w-64 md:p-4">
      <div className="flex items-center gap-3 px-1 py-3">
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
        {LINKS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-saffron-400 bg-white/[0.14] text-white"
                  : "border-transparent text-forest-100/80 hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  active ? "text-saffron-300" : "text-forest-200/70"
                }`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-2 flex flex-col gap-1 border-t border-white/10 pt-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-forest-100/80 hover:bg-white/[0.07] hover:text-white"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          View website
        </a>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-forest-100/80 hover:bg-white/[0.07] hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
