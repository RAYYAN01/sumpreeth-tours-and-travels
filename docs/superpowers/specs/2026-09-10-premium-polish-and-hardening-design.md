# Sumpreeth Tours & Travels — Premium Polish + Hardening

**Date:** 2026-09-10
**Branch:** `premium-polish-hardening`
**Hosting target:** Vercel (single project, no Cloudflare layer)
**Design direction:** Elevate the existing forest-green / saffron brand — no palette change, no redesign.

## Goal

Take a competently-built but visually uneven site to a launch-ready,
senior-developer standard: consistent typographic scale and spacing
rhythm, unified card/button components, complete SEO/GEO metadata and
internal linking, India DPDP-aligned privacy + a real consent banner,
and a Vercel-appropriate security/performance layer (headers, HTTPS
canonicalisation, rate limiting, caching, session hardening).

Work ships in five phases; each phase is independently deployable and
mixes polish + infra so the site improves evenly. Phase 6 is reserved
for the user.

## Constraints

- Next.js 16 (App Router). Consult `node_modules/next/dist/docs/` before
  using any framework API; heed deprecation notices.
- Keep the existing semantic colour-token system (`--c-*` in
  `globals.css`, mapped in `tailwind.config.ts`). Dark mode must keep
  working in every change.
- SQLite + Prisma; single Vercel instance assumption for the in-memory
  rate limiter (documented, swappable for Upstash later).
- No new heavy dependencies. `next/font` replaces the raw Google Fonts
  `<link>`. Consent banner is hand-rolled (no CMP vendor).
- Preserve all current content, routes, and admin behaviour.

---

## Phase 1 — Foundations (type scale, spacing rhythm, header, footer, security headers)

### 1a. Typographic scale
- Add a fluid type scale to `tailwind.config.ts` `fontSize` using
  `clamp()`: `display`, `h1`, `h2`, `h3`, `h4`, `lead`, `base`, `sm`,
  `xs`, each with paired `lineHeight` and `letterSpacing`.
- `globals.css` base layer: set default margins/`text-wrap: balance`
  for `h1–h4`, `text-wrap: pretty` + `max-width` for prose paragraphs.
- Replace hand-picked sizes (`text-4xl … lg:text-6xl` on the hero,
  `text-2xl sm:text-3xl` in `SectionHeading`, `text-3xl … lg:text-5xl`
  in `PageHeader`) with the scale tokens.
- Add a `.prose-legal` component class for the privacy page rhythm.

### 1b. Spacing rhythm
- Introduce a `<Section>` primitive (`src/components/site/Section.tsx`):
  props `bleed` (`page` | `surface` | `forest`), `size` (`sm` | `md` |
  `lg`), optional `id`. Emits one standard vertical padding pair
  (`py-16 sm:py-20 lg:py-28` for `md`) + `container-page`.
- Replace ad-hoc `py-16 lg:py-24` / `py-20` / `mt-24` usages on the
  home page, fleet, destination, about, contact, gallery.
- Standardise the gap scale for card grids (`gap-6 lg:gap-8`) and
  section-heading-to-grid spacing (`mt-10 lg:mt-14`).
- Footer top margin comes from the last `<Section>`, not `mt-24`.

### 1c. Header
- Restore the wordmark: logo image + `Sumpreeth Tours and Travels` as
  styled text (font-heading, two lines on `lg`, single wrap on mobile),
  plus a muted micro-tagline (`Bangalore · Karnataka · South India`)
  visible from `lg`.
- Keep transparent-over-hero / solid-on-scroll behaviour; make sure the
  wordmark colour switches with `solid`.
- Nav: refine active pill, add `aria-current`, ensure focus-visible
  ring on every interactive element. Add `Gallery` to the nav.
- Reduce layout shift: fixed header height token shared with the
  `main` `scroll-mt`.

### 1d. Footer
- Tighten the 4-column grid spacing, align heading treatment with the
  new scale, consistent link hover, add the wordmark + NAP block, add
  `Privacy` / `Terms` / `Sitemap` row. Keep `Staff login`.

### 1e. Security headers (`next.config.mjs`)
- Add `async headers()` applying to all routes:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN` (plus CSP `frame-ancestors`)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(self), browsing-topics=()`
  - `X-DNS-Prefetch-Control: on`
  - `Content-Security-Policy` (report-only first): `default-src 'self'`;
    allow `img-src` self + `images.unsplash.com` + `plus.unsplash.com`
    + `data:`; `frame-src` Google Maps; `style-src 'self' 'unsafe-inline'
    fonts.googleapis.com`; `font-src 'self' fonts.gstatic.com`;
    `script-src 'self' 'unsafe-inline'` (Next inline bootstrap) — nonce
    upgrade deferred to Phase 5.
  - `poweredByHeader: false`, `compress: true`.
- Admin routes additionally get `X-Robots-Tag: noindex, nofollow`.

**Phase 1 acceptance:** `npm run build` clean; header wordmark visible
light + dark, hero + scrolled; one spacing rhythm across pages; all
security headers present in `curl -I` of `next start`.

---

## Phase 2 — Components (cards, buttons, forms, rate card)

### 2a. Card system
- Extend `.card` and add `.card-interactive`, `.card-media`,
  `.card-body`, `.card-foot` component classes in `globals.css` so
  every card shares radius (`rounded-2xl`), ring, shadow, and a
  consistent `p-5 sm:p-6` body with a `border-line` footer divider.
- Refactor `VehicleCard`, `DestinationCard`, testimonial card, bento
  tiles, FAQ items, the rate card, and the enquiry widget shell onto
  these classes. Equal-height grids everywhere (`h-full` + flex col).
- Hover: single treatment — `-translate-y-0.5` + `shadow-card-hover`,
  `motion-reduce` disabled.

### 2b. Button system
- Add `.btn-sm` / `.btn-lg` size modifiers and an `.btn-ghost`
  variant; guarantee 44px min tap target on all sizes; align icon gap.
- Audit every `<a>`/`<button>` styled ad-hoc (Header phone link, card
  WhatsApp FAB, "Details" affordance) and move to button/utility
  classes or a shared `IconButton`.
- `:focus-visible` ring consistent (`outline-forest-600` light /
  `outline-forest-300` dark).

### 2c. Rate card (fleet detail — matches the screenshot)
- New `RateCard` component: titled panel, grouped rows (Outstation /
  Local / Charges), right-aligned values with `tabular-nums`,
  hairline row dividers, muted footnotes block, and a primary CTA +
  call button beneath. Feeds per-vehicle Product JSON-LD in Phase 3.

### 2d. Forms
- Standardise `.field-label` / `.field-input` / `.field-hint` /
  `.field-error` spacing (label→input `mt-1.5`, field→field `gap-4`).
- Apply to `EnquiryForm` and the admin `form.tsx` primitives.
- Error summary region with `role="alert"` on submit failure.

**Phase 2 acceptance:** visual pass of every card type in light + dark;
buttons consistent; rate card renders from real vehicle data; forms
keyboard + screen-reader sane.

---

## Phase 3 — Routing, internal linking, SEO / GEO / meta

### 3a. Per-route metadata
- Every route exports `title` (≤60 chars) + `description` (140–158
  chars) + `alternates.canonical` + `openGraph` + `twitter`.
- Home page gains its own `metadata` (currently inherits root only)
  with canonical `/`.
- `fleet/[slug]` `generateMetadata` includes vehicle name, seats,
  starting price, canonical `/fleet/<slug>`.
- Add `metadataBase` already set; add `alternates.canonical` per page;
  add `robots` (index/follow) explicitly on public pages.

### 3b. Internal linking
- Add `Gallery` to header nav (Phase 1) and keep in footer.
- `fleet/[slug]`: "Related vehicles" (same category) + "Popular
  routes for this vehicle" linking `/destination` items.
- `destination` list: each card already links to `/contact?...`; add a
  reciprocal "Vehicles for this trip" strip linking `/fleet`.
- `about` + `contact`: contextual links to `/fleet` and `/destination`.
- Breadcrumbs component on all non-home pages + `BreadcrumbList`
  JSON-LD.
- Audit every `<a href>` that should be `<Link>`; ensure no orphan
  pages (gallery, privacy reachable from nav/footer).

### 3c. Structured data
- Promote layout JSON-LD from `TaxiService` to `LocalBusiness` +
  `TaxiService` graph with `geo` (lat/lng), `openingHoursSpecification`,
  `areaServed` list, `sameAs` (social URLs), `priceRange`.
- `fleet/[slug]`: `Product` + `Offer` (INR, starting fare) + `Vehicle`.
- `contact`: `FAQPage` from the FAQ data.
- All non-home pages: `BreadcrumbList`.

### 3d. GEO / local
- `sitemap.ts`: real `lastModified`, per-type `priority` +
  `changeFrequency`; include `fleet/[slug]` and `destination` detail
  URLs if present.
- `robots.ts`: confirm `Disallow: /admin`, add `Host` + `Sitemap`.
- `<html lang="en-IN">`; `openGraph.locale` already `en_IN`.
- NAP (name / address / phone) string centralised in `lib/site` and
  rendered identically in header, footer, contact, JSON-LD.

**Phase 3 acceptance:** each URL has unique title/description/canonical;
Rich Results test passes for LocalBusiness, Product, FAQPage,
BreadcrumbList; sitemap + robots valid; no orphan routes.

---

## Phase 4 — Consent, DPDP privacy, rate limiting, caching

### 4a. Consent banner
- `src/components/site/ConsentBanner.tsx` (client): fixed bottom card,
  "Accept all" / "Reject non-essential" / "Preferences" with a small
  category list (Necessary — always on; Preferences — theme; Maps —
  Google embed on Contact). Choice persisted to `localStorage`
  (`stt_consent` = `{v, choices, ts}`) — no cookie set for the banner
  itself so it stays "necessary only" until a choice is made.
- `lib/consent.ts`: typed getter/setter + `hasConsent(category)`.
- Gate the Contact-page Google Maps `<iframe>` behind `hasConsent
  ("maps")` with an inline placeholder + "Load map" button.
- Footer "Cookie settings" link re-opens the banner
  (`window.dispatchEvent`).
- Respect it before writing the theme value? Theme is a legitimate
  preference / functional need — keep it but disclose; banner's
  "Reject" still allows strictly-functional storage, matching the
  policy text.

### 4b. DPDP-aligned privacy policy
- Rewrite `privacy/page.tsx` for the Digital Personal Data Protection
  Act, 2023: lawful basis (consent + legitimate use for the booking
  you request), Data Principal rights (access, correction, erasure,
  grievance redressal, nominate), grievance officer contact block,
  retention schedule, no cross-border transfer beyond WhatsApp/Meta &
  Google Maps (named), children's data statement, security practices.
- Replace the "no banner shown" paragraph with the new consent model.
- Add a short `/terms` page (carriage terms, cancellation, liability,
  tolls/permits at actuals) linked from footer.
- Use the `.prose-legal` rhythm from Phase 1.

### 4c. Rate-limit hardening
- `lib/rate-limit.ts`: add a `headers()` helper returning
  `RateLimit-*` + `Retry-After`; keep fixed window.
- Apply to **every** mutating entry point: `api/enquiry` (exists),
  admin `login` (exists), plus all admin server actions that write
  (`fleet/actions`, `destinations/actions`, `faqs/actions`,
  `testimonials/actions`, `content/actions`, `enquiries/actions`,
  `settings/actions`) via a shared `guardMutation()` wrapper keyed by
  session + IP.
- `api/enquiry`: add `RateLimit-*` headers on success too.
- Consistent 429 JSON shape.

### 4d. Caching + performance
- Replace the Google Fonts `<link>` in `src/app/layout.tsx` with
  `next/font/google` (Inter + Sora), wired to the existing
  `--font-heading` / `--font-body` variables; drop the preconnect.
- Audit `revalidate`: home `300`, fleet/destination `600`, privacy/
  terms `86400`, contact `3600` — make explicit and consistent; add
  `export const dynamic = 'force-static'` where no per-request data.
- `next.config.mjs`: `headers()` adds `Cache-Control:
  public, s-maxage=<n>, stale-while-revalidate=86400` for the static
  marketing routes; `no-store` for `/admin` + `/api`.
- Image audit: every `next/image` has correct `sizes`; hero uses
  `priority`; gallery uses lazy + blur where feasible.
- `optimizePackageImports: ['lucide-react']`.

**Phase 4 acceptance:** banner blocks Maps until accepted and persists;
privacy + terms live and linked; rate limiting returns 429 with headers
on all write paths; Lighthouse ≥ 95 perf / 100 best-practices on home +
fleet; fonts self-hosted via `next/font`.

---

## Phase 5 — Edge, sessions, HTTPS enforcement, domain protection (Vercel)

### 5a. HTTPS + canonical host
- `middleware.ts`: redirect `http→https` (`x-forwarded-proto`) and
  non-canonical host → `NEXT_PUBLIC_CANONICAL_HOST` (apex vs www
  decided by user; default apex) with 308, skipping `localhost` and
  Vercel preview domains.
- Keep HSTS `preload` from Phase 1; document submitting to hstspreload.org.

### 5b. Edge protection
- Extend `middleware.ts` (already edge) with a lightweight request
  filter before the admin check: block obviously hostile paths
  (`/wp-login.php`, `/.env`, `/.git`, `xmlrpc.php`, common shell
  probes), disallowed methods (`TRACE`/`TRACK`), and empty/known-bad
  user agents on `POST`. Return 403 text.
- Per-IP burst limiter at the edge (in-memory, `20 req / 10s`) for
  non-static paths, `429` + `Retry-After`. Documented single-instance
  caveat.
- Expand `matcher` from `/admin/:path*` to all routes except
  `_next/static`, `_next/image`, `favicon`, assets.
- Pass a `x-pathname` / geo header (`x-vercel-ip-country`) through for
  downstream use.

### 5c. Session hardening + session cache
- Cookie name: `__Host-sumpreeth_admin` in production (no `Domain`,
  `Path=/`, `Secure`), fall back to the current name in dev.
- `SameSite=Lax` kept (admin login redirect flow), `httpOnly`,
  `secure` always in prod, add `priority: 'high'`.
- Shorten `SESSION_MAX_AGE` to 2h with a sliding refresh: middleware
  re-issues the cookie when < 30min remain (verify → re-sign).
- "Session-based cache": memoise `verifySessionToken` per request with
  `React.cache` for server components, and a tiny in-middleware LRU
  (token → {valid, exp}) so repeated edge hits in one navigation don't
  re-verify. Documented.

### 5d. Domain protection (config + code)
- `docs/deploy/vercel-hardening.md` checklist: Deployment Protection
  (Vercel Authentication) on Preview + `production` bypass; disable
  automatic Git branch deploys to production; env-var scoping;
  `NEXT_PUBLIC_*` audit; CAA DNS records for the CA; DNSSEC; SPF/DMARC
  if email; enable Vercel WAF managed ruleset + rate rules mirroring
  5b; Attack Challenge mode toggle note.
- `app/not-found.tsx` + `app/error.tsx` branded pages.
- `security.txt` at `app/.well-known/security.txt/route.ts`.
- `SECURITY.md` with disclosure contact.
- Add `NEXT_PUBLIC_CANONICAL_HOST`, `SESSION_SECRET` (already),
  `ADMIN_*` to `.env.example` with comments.

**Phase 5 acceptance:** http and wrong-host both 308 to canonical
https; hostile probe paths 403 at the edge; burst limiter trips;
session cookie is `__Host-` in prod and refreshes; 404/500 branded;
`/.well-known/security.txt` served; hardening checklist committed.

---

## Testing strategy

- `npm run build` must stay green after every phase.
- `npm test` (vitest) — extend `tests/unit` for `rate-limit` headers,
  `lib/consent`, canonical-host logic (pure function extracted from
  middleware).
- `npm run test:e2e` (Playwright) — add specs: header wordmark
  visible; consent banner accept/reject persists + gates map;
  security headers present; http→https/though-host redirect (mock
  headers); 404 page renders.
- Manual: Lighthouse home + fleet; Rich Results test; dark-mode sweep.

## Rollout

One PR per phase into `premium-polish-hardening`, squash-merged after
build + tests pass. Deploy preview per phase. Phase 6 defined by user
after Phase 5 preview review.
