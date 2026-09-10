import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type Props = {
  /** Ordered [label, relative path] pairs, starting AFTER Home. */
  trail: [string, string][];
};

/**
 * Visible breadcrumb trail + matching BreadcrumbList JSON-LD. Always prepends
 * Home. The last item renders as plain text (current page).
 */
export default function Breadcrumbs({ trail }: Props) {
  const full: [string, string][] = [["Home", "/"], ...trail];

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(full)),
        }}
      />
      <ol className="flex flex-wrap items-center gap-1.5">
        {full.map(([label, path], i) => {
          const last = i === full.length - 1;
          return (
            <li key={path} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight aria-hidden className="h-3.5 w-3.5 shrink-0" />
              )}
              {last ? (
                <span aria-current="page" className="font-medium text-bodytext">
                  {label}
                </span>
              ) : (
                <Link href={path} className="hover:text-ink">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
