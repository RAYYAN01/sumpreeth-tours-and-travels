# Vercel Deployment Hardening Checklist

Hosting target: **Vercel only** (no Cloudflare in front). Work through this
before pointing the real domain at the deployment.

## 1. Environment variables

- [ ] `SESSION_SECRET` — 48+ random bytes, set for **Production** only
      (different value from Preview/Development).
- [ ] `ADMIN_PASSWORD_HASH` — real bcrypt hash, Production only.
- [ ] `DATABASE_URL` — production database, not the local one.
- [ ] `NEXT_PUBLIC_SITE_URL` — `https://<canonical host>` (no trailing slash).
- [ ] `NEXT_PUBLIC_CANONICAL_HOST` — bare host, e.g. `sumpreethtoursandtravels.com`.
- [ ] Confirm no secret is prefixed `NEXT_PUBLIC_` (those ship to the browser).

## 2. Domain & DNS

- [ ] Add the apex domain and `www` in Vercel; set the **apex** as primary and
      let Vercel 308-redirect `www` → apex (the middleware also enforces this).
- [ ] Keep `NEXT_PUBLIC_CANONICAL_HOST` equal to the primary domain.
- [ ] At the DNS provider add a **CAA** record: `0 issue "letsencrypt.org"`
      (Vercel's CA). Add `0 iodef "mailto:info@sumpreethtoursandtravels.com"`.
- [ ] Enable **DNSSEC** at the registrar if supported.
- [ ] After go-live, submit the domain to <https://hstspreload.org/> — the app
      already sends `Strict-Transport-Security: … ; preload`.
- [ ] If email is sent from the domain, publish SPF + DMARC (`p=quarantine` to
      start) and DKIM for the provider.

## 3. Vercel project settings

- [ ] **Deployment Protection → Vercel Authentication**: ON for *Preview* and
      *Development* (keep Production public). This keeps unfinished work and the
      `/admin` area of previews behind Vercel SSO.
- [ ] **Git → Production Branch**: `main` only. Disable automatic production
      deploys from other branches.
- [ ] **Git → Ignored Build Step** or branch rules so random branches don't
      spin up public preview URLs unnecessarily.
- [ ] Turn **off** "Automatically expose System Environment Variables" unless
      needed.
- [ ] Set the **Node.js version** explicitly (match local).

## 4. Vercel Firewall / WAF

- [ ] Enable the **managed ruleset**.
- [ ] Add a **rate limit rule** mirroring the in-app burst limiter
      (~40 req / 10 s per IP on `/(.*)`), action: challenge or deny.
- [ ] Add a rule to deny `POST` to `/api/enquiry` above ~10/min per IP
      (in-app limit is 8/hour; this is a coarse backstop).
- [ ] Block the hostile paths the middleware already 403s (`*/wp-login.php`,
      `*/.env`, `*/.git/*`, `*/xmlrpc.php`) at the edge so they never hit a
      function.
- [ ] Keep **Attack Challenge Mode** one toggle away for incidents.

## 5. Headers (already in `next.config.mjs`, verify in prod)

- [ ] `Strict-Transport-Security` present with `preload`.
- [ ] `Content-Security-Policy-Report-Only` present — watch the browser console
      / a report endpoint for a week, then rename to `Content-Security-Policy`
      (enforcing) and, ideally, move `script-src` to a nonce (Phase 5 follow-up
      in the spec).
- [ ] `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
      `Permissions-Policy` present on all routes.
- [ ] `/admin` and `/api` return `Cache-Control: no-store` and
      `X-Robots-Tag: noindex`.

## 6. App-level checks

- [ ] `/robots.txt` disallows `/admin` and `/api`; `Host` + `Sitemap` lines
      point at the canonical URL.
- [ ] `/sitemap.xml` lists only canonical `https://` URLs.
- [ ] `/.well-known/security.txt` resolves and the `Expires` date is in the
      future (regenerates per request/build).
- [ ] Log in to `/admin`, confirm the session cookie is
      `__Host-sumpreeth_admin`, `Secure`, `HttpOnly`, `SameSite=Lax`, and that
      it silently refreshes when < 30 min remain.
- [ ] 404 and 500 render the branded pages.

## 7. Dependencies & monitoring

- [ ] Enable Dependabot / `npm audit` in CI.
- [ ] Turn on Vercel Log Drains or at least check Runtime Logs after launch.
- [ ] Set up an uptime check (e.g. cron hitting `/` and `/api/enquiry` OPTIONS).
