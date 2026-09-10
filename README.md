# Sumpreeth Tours and Travels — website + admin portal

A Next.js (App Router) site for a Bangalore-based cab & outstation travel
company, with a password-protected `/admin` portal for staff.

- **Public site:** Home, Fleet, Destination, About, Contact
- **Enquiry flow:** the hero booking widget and the Contact form save every
  enquiry to the database **and** open WhatsApp with the trip details pre-filled
- **Admin portal:** enquiries (status, notes, CSV export), fleet & pricing,
  destinations, testimonials, FAQs, and all site content — single shared login

## Tech

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Prisma · PostgreSQL ·
`jose` sessions · Swiper · Vitest · Playwright. Deploys to Vercel.

---

## 1. Local setup

```bash
npm install
cp .env.example .env
```

Then edit `.env`:

| Variable | What to put |
|---|---|
| `DATABASE_URL` | A Postgres connection string. Quick local option: `docker run --name sumpreeth-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16` then `postgresql://postgres:postgres@localhost:5432/sumpreeth` |
| `SESSION_SECRET` | Run `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `ADMIN_PASSWORD_HASH` | Leave the placeholder for now — the seed script (next step) prints a real hash to paste in |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for local |

Create the schema and load real content (fleet pricing, ~48 destinations,
testimonials, FAQs, business details):

```bash
npx prisma migrate dev --name init
npm run seed
```

The seed prints:

```
Default admin password: sumpreeth@admin
ADMIN_PASSWORD_HASH=$2a$10$....
```

Copy that `ADMIN_PASSWORD_HASH` value into `.env` (the seed also stores the hash
in the database, so login works either way). Change the password later from
**Admin → Settings**.

Run it:

```bash
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin  (password: `sumpreeth@admin`)

---

## 2. Everyday admin tasks

| Task | Where |
|---|---|
| See new booking enquiries, mark contacted/booked, add notes | **Enquiries** |
| Download enquiries as a spreadsheet | **Enquiries → Export CSV** |
| Change a per-km rate or one-way fare | **Fleet → (vehicle) → Edit** |
| Add a vehicle / bus | **Fleet → New vehicle** |
| Add or edit a destination | **Destinations** |
| Add a customer review | **Testimonials** |
| Edit hero text, About story, phone/WhatsApp/email, map, trust numbers | **Site content** |
| Change the admin password | **Settings** |

Edits appear on the public site within a few seconds (pages are cached and
refreshed on save).

---

## 3. Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Create a Postgres database (Vercel Storage → Postgres, or https://neon.tech)
   and copy its connection string.
3. In the Vercel project **Settings → Environment Variables** add:
   `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD_HASH`, `NEXT_PUBLIC_SITE_URL`
   (your real domain, no trailing slash).
4. Deploy. The build runs `prisma migrate deploy` automatically.
5. Seed the production database once, from your machine, with the production
   `DATABASE_URL` exported:  `npm run seed`

---

## 4. Tests

```bash
npm test          # unit tests (WhatsApp message builder, validation, formatting)
npm run test:e2e  # Playwright — needs a running, seeded dev server
```

---

## 5. Project layout

```
prisma/schema.prisma       data model
prisma/seed.ts             real content: fleet, destinations, testimonials, FAQ
src/app/(site)/            public pages + shared layout (header/footer/floating buttons)
src/app/admin/login/       staff login
src/app/admin/(panel)/     protected admin screens + their server actions
src/app/api/enquiry/       public POST endpoint that stores enquiries
src/components/site/        public UI (booking widget, cards, carousel, ...)
src/components/admin/       admin UI primitives (forms, tables, badges)
src/lib/                    db, session/auth, validation, whatsapp, caching helpers
src/middleware.ts          guards /admin
```

## Notes

- **Images** are Unsplash URLs chosen as sensible defaults. Replace any of them
  per record from the admin portal (each fleet/destination/testimonial has an
  Image URL field), or swap the constants in `prisma/seed.ts` before seeding.
- **Single admin login** is intentional (one office password). Multi-user
  accounts, image uploads, a fare calculator, a blog and a Kannada toggle were
  scoped out of v1.
- **Rate limiting** is in-memory (fine for one Vercel instance). For heavy
  traffic move `src/lib/rate-limit.ts` to Upstash/Redis.
