"use client";

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
    <aside className="flex w-full shrink-0 flex-col gap-1 border-b border-slate-200 bg-white p-3 md:h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="px-2 py-3">
        <p className="font-heading text-sm font-extrabold text-forest-800">
          Sumpreeth
        </p>
        <p className="text-xs text-slate-500">Admin portal</p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {LINKS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-forest-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-2 flex flex-col gap-0.5 border-t border-slate-200 pt-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          <ExternalLink className="h-4 w-4" />
          View website
        </a>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
