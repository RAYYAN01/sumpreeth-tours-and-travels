import Link from "next/link";
import { ENQUIRY_STATUS_LABELS, type EnquiryStatus } from "@/lib/constants";

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-forest-900">
          <span className="mr-2 inline-block h-4 w-1.5 -translate-y-0.5 rounded-full bg-saffron-500 align-middle" />
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-sm text-forest-700/70">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-white p-5 shadow-sm ring-1 ring-forest-900/[0.06] ${className}`}
    >
      {children}
    </div>
  );
}

export function PanelHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 font-semibold text-forest-900">
      <span className="h-3.5 w-1 rounded-full bg-forest-500" />
      {children}
    </h2>
  );
}

/** Colourful KPI tile for the dashboard. */
const STAT_TONES = {
  saffron: "bg-saffron-50 ring-saffron-200/70 text-saffron-700",
  forest: "bg-forest-50 ring-forest-200/70 text-forest-700",
  emerald: "bg-emerald-50 ring-emerald-200/70 text-emerald-700",
  sky: "bg-sky-50 ring-sky-200/70 text-sky-700",
} as const;

export function StatCard({
  label,
  value,
  href,
  tone = "forest",
  icon,
}: {
  label: string;
  value: React.ReactNode;
  href: string;
  tone?: keyof typeof STAT_TONES;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-xl p-5 ring-1 transition-transform hover:-translate-y-0.5 ${STAT_TONES[tone]}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium opacity-90">{label}</p>
        {icon && <span className="opacity-70">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-forest-900">
        {value}
      </p>
    </Link>
  );
}

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  NEW: "bg-sky-100 text-sky-800",
  CONTACTED: "bg-amber-100 text-amber-800",
  BOOKED: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-slate-200 text-slate-600",
};

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {ENQUIRY_STATUS_LABELS[status]}
    </span>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const cls =
    variant === "ghost"
      ? "bg-forest-50 hover:bg-forest-100 text-forest-800 ring-1 ring-forest-200"
      : "bg-forest-600 hover:bg-forest-700 text-white shadow-sm";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${cls}`}
    >
      {children}
    </Link>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-forest-300 bg-forest-50/40 p-10 text-center text-sm text-forest-700/70">
      {children}
    </div>
  );
}
