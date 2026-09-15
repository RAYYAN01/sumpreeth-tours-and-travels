"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { PackageView } from "@/lib/site";
import {
  PACKAGE_STATE_LABELS,
  PACKAGE_STATE_ORDER,
  PACKAGE_CATEGORY_LABELS,
  PACKAGE_CATEGORY_ORDER,
  type PackageState,
  type PackageCategory,
} from "@/lib/constants";
import PackageCard from "./PackageCard";

type Sort = "popular" | "duration";

/** Reads `?state=`/`?category=` client-side so the page itself can stay
 * fully static instead of being forced into per-request server rendering
 * just to read the query string for a deep link from the header nav. */
function useInitialFilters(): {
  initialState: "ALL" | PackageState;
  initialCategory: "ALL" | PackageCategory;
} {
  const searchParams = useSearchParams();
  const state = searchParams.get("state");
  const category = searchParams.get("category");
  const initialState: "ALL" | PackageState = (PACKAGE_STATE_ORDER as string[]).includes(
    state ?? "",
  )
    ? (state as PackageState)
    : "ALL";
  const initialCategory: "ALL" | PackageCategory = (
    PACKAGE_CATEGORY_ORDER as string[]
  ).includes(category ?? "")
    ? (category as PackageCategory)
    : "ALL";
  return { initialState, initialCategory };
}

export default function PackagesView({
  packages,
  whatsappNumber,
}: {
  packages: PackageView[];
  whatsappNumber: string;
}) {
  const { initialState, initialCategory } = useInitialFilters();
  const [q, setQ] = useState("");
  const [state, setState] = useState<"ALL" | PackageState>(initialState);
  const [category, setCategory] = useState<"ALL" | PackageCategory>(initialCategory);
  const [sort, setSort] = useState<Sort>("popular");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = packages.filter((p) => {
      if (state !== "ALL" && p.state !== state) return false;
      if (category !== "ALL" && !p.category.includes(category)) return false;
      if (
        query &&
        !`${p.title} ${p.destination} ${p.route}`.toLowerCase().includes(query)
      )
        return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "duration") return a.durationDays - b.durationDays;
      // "popular": featured, then popular, then explicit sortOrder
      return (
        Number(b.featured) - Number(a.featured) ||
        Number(b.popular) - Number(a.popular) ||
        a.sortOrder - b.sortOrder
      );
    });
    return list;
  }, [packages, q, state, category, sort]);

  const featured = packages.filter((p) => p.featured).slice(0, 3);
  const showFeatured =
    featured.length > 0 && state === "ALL" && category === "ALL" && !q.trim();

  return (
    <div>
      {/* Search + filters */}
      <div className="card flex flex-col gap-4 p-4 sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a destination — Coorg, Ooty, Munnar, Goa…"
            aria-label="Search tour packages"
            className="field-input pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={state}
            onChange={(e) => setState(e.target.value as "ALL" | PackageState)}
            aria-label="Filter by state"
            className="field-input w-auto min-w-[9rem] flex-1 sm:flex-none"
          >
            <option value="ALL">All states</option>
            {PACKAGE_STATE_ORDER.map((s) => (
              <option key={s} value={s}>
                {PACKAGE_STATE_LABELS[s]}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "ALL" | PackageCategory)}
            aria-label="Filter by category"
            className="field-input w-auto min-w-[9rem] flex-1 sm:flex-none"
          >
            <option value="ALL">All categories</option>
            {PACKAGE_CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>
                {PACKAGE_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort packages"
            className="field-input w-auto min-w-[9rem] flex-1 sm:flex-none"
          >
            <option value="popular">Sort: Popular first</option>
            <option value="duration">Sort: Shortest trip first</option>
          </select>
        </div>
      </div>

      {/* Featured strip */}
      {showFeatured && (
        <div className="mt-10">
          <h2 className="eyebrow mb-4">Featured packages</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PackageCard key={p.id} pkg={p} whatsappNumber={whatsappNumber} />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="eyebrow">
            {showFeatured ? "All packages" : `${filtered.length} package${filtered.length === 1 ? "" : "s"}`}
          </h2>
        </div>
        {filtered.length === 0 ? (
          <div className="card p-10 text-center text-sm text-muted">
            No packages match these filters yet — try a different destination,
            or{" "}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-forest-700 hover:underline dark:text-forest-200"
            >
              ask us on WhatsApp
            </a>{" "}
            for a custom itinerary.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PackageCard key={p.id} pkg={p} whatsappNumber={whatsappNumber} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
