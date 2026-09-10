import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// SQLite stores enum-like columns as plain strings.
type VehicleCategory = "CAR" | "TEMPO_TRAVELLER" | "BUS";
type DestinationCategory =
  | "HILL_STATION"
  | "HERITAGE"
  | "PILGRIMAGE"
  | "NATURE_FALLS"
  | "MAJOR_CITY"
  | "OUTSTATION_GETAWAY";

const prisma = new PrismaClient();

/**
 * Real fleet photos supplied by the client, served from /public/images/fleet.
 * Destination scenery still uses stable Unsplash CDN images (no local photos
 * for those). The admin portal lets staff replace any image per record.
 */
const FLEET = "/images/fleet";
/** Build a public path for one client photo, e.g. p(40) -> /images/fleet/IMG-20260901-WA0040.jpg */
const p = (n: number) => `${FLEET}/IMG-20260901-WA00${n}.jpg`;

/**
 * Reference exterior photos used only where the client did not supply a
 * front/exterior shot of that exact model. Genuine India-market cars, number
 * plates removed, from Wikimedia Commons (see public/images/fleet/CREDITS.txt).
 * - Swift Dzire: Maruti Suzuki Swift Dzire (India).
 * - Toyota Innova: Toyota Innova Crysta (India).
 */
const STOCK = {
  sedanFront: `${FLEET}/stock-dzire.jpg`,
  mpvFront: `${FLEET}/stock-innova.jpg`,
};

/**
 * Client photos grouped by the real vehicle they show. First entry in each
 * list is used as the fleet-card cover.
 */
const PHOTOS = {
  etios: [40, 41, 25, 23, 24, 22, 26, 42].map(p),
  ertiga: [39, 27, 37, 29, 33].map(p),
  dzire: [STOCK.sedanFront, p(24), p(42)],
  innova: [STOCK.mpvFront, p(28)],
  crysta: [38, 34, 30, 31, 32, 35, 36].map(p),
  tempo12: [55, 54, 46, 49, 60, 62].map(p),
  tempo16: [58, 59, 56, 57, 52, 53, 51].map(p),
  urbania: [47, 48].map(p),
  bus: [45, 43, 44, 61, 50].map(p),
};

const IMG = {
  // Real client photo used as the homepage hero background.
  hero: p(58),
};

/**
 * Real photo per destination, served from public/images/destinations.
 * Every file here is used exactly once so no image repeats on a page.
 */
const DEST_DIR = "/images/destinations";
const DEST_IMG: Record<string, string> = {
  // Hill stations
  "Madikeri / Coorg": `${DEST_DIR}/coorg-getaway.webp`,
  Chikmagalur: `${DEST_DIR}/chikmagalur-coffee-trails.webp`,
  Sakleshpur: `${DEST_DIR}/sakleshpur-western-ghats-trail.webp`,
  "Chikkaballapura (Nandi region)": `${DEST_DIR}/nandi-hills-sunrise-trip.webp`,
  Ooty: `${DEST_DIR}/ooty-coonoor-hill-tour.webp`,
  Kodaikanal: `${DEST_DIR}/kodaikanal-hill-escape.webp`,
  Munnar: `${DEST_DIR}/munnar-tea-garden-trail.webp`,
  // Heritage & culture
  Hampi: `${DEST_DIR}/hampi-heritage-trail.webp`,
  "Bangalore Palace": `${DEST_DIR}/bangalore-palace.jpg`,
  Mysore: `${DEST_DIR}/mysore-heritage-day-tour.webp`,
  // Pilgrimage
  Dharmasthala: `${DEST_DIR}/dharmasthala-kukke-pilgrimage.webp`,
  Tirupati: `${DEST_DIR}/tirupati-pilgrimage-tour.webp`,
  Mantralaya: `${DEST_DIR}/mantralaya-pilgrimage-tour.webp`,
  Rameswaram: `${DEST_DIR}/rameshwaram-pilgrimage-tour.webp`,
  // Nature & falls
  "Shivanasamudra Falls": `${DEST_DIR}/shivanasamudra.jpg`,
  Wayanad: `${DEST_DIR}/wayanad-nature-escape.webp`,
  // Coast & beaches
  Gokarna: `${DEST_DIR}/gokarna-beach-getaway.webp`,
  Goa: `${DEST_DIR}/goa-beach-holiday.webp`,
  Pondicherry: `${DEST_DIR}/pondicherry-heritage-beach-tour.webp`,
  Kanyakumari: `${DEST_DIR}/kanyakumari-tour.webp`,
  "Trivandrum & Kovalam": `${DEST_DIR}/trivandrum-kovalam-beach-tour.webp`,
  "Alleppey (Kerala Backwaters)": `${DEST_DIR}/kerala-backwaters-tour.webp`,
};

/**
 * Category fallback scenery for destinations that have no photo of their own
 * (they appear only in the text list, never as an image card). Staff can
 * override any record's image from the admin portal.
 */
const destImageFor = (category: DestinationCategory): string => {
  switch (category) {
    case "HILL_STATION":
      return `${DEST_DIR}/chikmagalur-coffee-trails.webp`;
    case "HERITAGE":
      return `${DEST_DIR}/hampi-heritage-trail.webp`;
    case "PILGRIMAGE":
      return `${DEST_DIR}/dharmasthala-kukke-pilgrimage.webp`;
    case "NATURE_FALLS":
      return `${DEST_DIR}/shivanasamudra.jpg`;
    case "MAJOR_CITY":
      return `${DEST_DIR}/hero-bangalore.webp`;
    case "OUTSTATION_GETAWAY":
      return `${DEST_DIR}/goa-beach-holiday.webp`;
    default:
      return `${DEST_DIR}/goa-beach-holiday.webp`;
  }
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function main() {
  const DEFAULT_ADMIN_PASSWORD = "sumpreeth@admin";
  const hash = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10);

  // ---------------------------------------------------------------------
  // Site settings
  // ---------------------------------------------------------------------
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    // Refresh only the hero image on re-seed so admin text edits are preserved.
    update: { heroImageUrl: IMG.hero },
    create: {
      id: "singleton",
      heroHeadline: "Reliable Cabs & Outstation Travel Across Karnataka, 24/7",
      heroSubheadline:
        "Sumpreeth Tours and Travels rents cars, tempo travellers and buses for airport runs, local errands, and multi-day road trips — covering every major city and interior town across Karnataka, plus South India.",
      heroImageUrl: IMG.hero,
      aboutStory:
        "Sumpreeth Tours and Travels is a Bangalore-based cab and outstation travel service focused on reliable, comfortable, and safe rides — one-way, round trip, airport transfers, local rentals, and multi-day tour packages. From a single airport pickup to a week-long temple circuit, families, solo travellers and corporates book us with confidence, any hour of the day.",
      aboutPromise:
        "Timeliness, cleanliness, safety, and professionalism on every trip — with transparent pricing and no hidden charges.",
      trustYears: "12+",
      trustTrips: "50,000+",
      trustCities: "180+",
      ctaBannerText: "Plan your next trip with Sumpreeth Tours and Travels",
      phone: "+91 94486 48898",
      whatsappNumber: "919448648898",
      email: "info@sumpreethtoursandtravels.com",
      address: "Bangalore – 560078, Karnataka, India",
      hours: "Open all days · 24/7",
      mapEmbedUrl:
        "https://www.google.com/maps?q=Bangalore%20560078&output=embed",
      adminPasswordHash: hash,
    },
  });

  // ---------------------------------------------------------------------
  // Fleet
  // ---------------------------------------------------------------------
  const vehicles = [
    {
      name: "Toyota Etios",
      category: "CAR" as VehicleCategory,
      seats: "4+1",
      features: ["AC", "3 large bags", "Comfortable sedan", "GPS-enabled"],
      photos: PHOTOS.etios,
      sortOrder: 1,
      oneWayRate: 1200,
      oneWayNote: "starting fare",
      roundTripPerKm: 12,
      minKmPerDay: 300,
      driverBata: 400,
      roundTripNote: "min 300 km/day · ₹400 driver bata",
      localPackageRate: 2500,
      localExtraPerKm: 14,
      localExtraPerHr: 150,
    },
    {
      name: "Swift Dzire",
      category: "CAR" as VehicleCategory,
      seats: "4+1",
      features: ["AC", "3 large bags", "Comfortable sedan", "GPS-enabled"],
      // No Dzire photos supplied — stock plate-free sedan front + representative interiors.
      photos: PHOTOS.dzire,
      sortOrder: 2,
      oneWayRate: 1200,
      oneWayNote: "starting fare",
      roundTripPerKm: 12,
      minKmPerDay: 300,
      driverBata: 400,
      roundTripNote: "min 300 km/day · ₹400 driver bata",
      localPackageRate: 2500,
      localExtraPerKm: 14,
      localExtraPerHr: 150,
    },
    {
      // Kept in the DB (real photos + estimated rates) but hidden from the
      // public fleet, which now mirrors the standard 7-vehicle Bangalore roster.
      name: "Maruti Ertiga",
      category: "CAR" as VehicleCategory,
      seats: "6+1",
      features: ["AC", "3 large bags", "7-seater MPV", "GPS-enabled"],
      photos: PHOTOS.ertiga,
      sortOrder: 30,
      isActive: false,
      oneWayRate: 1800,
      oneWayNote: "+ toll",
      roundTripPerKm: 15,
      minKmPerDay: 300,
      driverBata: 400,
      roundTripNote: "min 300 km/day · ₹400 driver bata",
      localPackageRate: 2900,
      localExtraPerKm: 16,
      localExtraPerHr: 200,
    },
    {
      name: "Toyota Innova",
      category: "CAR" as VehicleCategory,
      seats: "7+1",
      features: ["AC", "5 large bags", "Spacious SUV", "GPS-enabled"],
      photos: PHOTOS.innova,
      sortOrder: 4,
      oneWayRate: 2200,
      oneWayNote: "+ toll",
      roundTripPerKm: 17,
      minKmPerDay: 300,
      driverBata: 400,
      roundTripNote: "min 300 km/day · ₹400 driver bata",
      localPackageRate: 3200,
      localExtraPerKm: 18,
      localExtraPerHr: 250,
    },
    {
      name: "Innova Crysta",
      category: "CAR" as VehicleCategory,
      seats: "7+1",
      features: ["AC", "5 large bags", "Premium SUV", "GPS-enabled"],
      photos: PHOTOS.crysta,
      sortOrder: 5,
      oneWayRate: 2400,
      oneWayNote: "+ toll",
      roundTripPerKm: 18,
      minKmPerDay: 300,
      driverBata: 400,
      roundTripNote: "min 300 km/day · ₹400 driver bata",
      localPackageRate: 3500,
      localExtraPerKm: 18,
      localExtraPerHr: 250,
    },
    {
      name: "Tempo Traveller (12+1)",
      category: "TEMPO_TRAVELLER" as VehicleCategory,
      seats: "12+1",
      features: ["AC", "Push-back seats", "Large luggage boot", "GPS-enabled"],
      photos: PHOTOS.tempo12,
      sortOrder: 6,
      roundTripPerKm: 20,
      minKmPerDay: 300,
      driverBata: 500,
      roundTripNote: "min 300 km/day · ₹500 driver bata",
    },
    {
      name: "Mini Bus",
      category: "BUS" as VehicleCategory,
      seats: "12+1",
      features: [
        "AC",
        "Push-back seats",
        "Large luggage boot",
        "GPS-enabled",
      ],
      photos: PHOTOS.bus,
      sortOrder: 7,
      roundTripPerKm: 30,
      minKmPerDay: 300,
      driverBata: 600,
      roundTripNote: "min 300 km/day · ₹600 driver bata",
    },
    {
      name: "Force Urbania",
      category: "TEMPO_TRAVELLER" as VehicleCategory,
      seats: "16+1",
      features: [
        "AC",
        "Premium 16-seater van",
        "Reclining captain seats",
        "GPS-enabled",
      ],
      photos: PHOTOS.urbania,
      sortOrder: 8,
      roundTripPerKm: 38,
      minKmPerDay: 300,
      driverBata: 800,
      roundTripNote: "min 300 km/day · ₹800 driver bata",
    },
    {
      // Hidden from the public fleet (kept for its real photos & data).
      name: "Tempo Traveller (16+1)",
      category: "TEMPO_TRAVELLER" as VehicleCategory,
      seats: "16+1",
      features: ["AC", "Push-back seats", "Large luggage boot", "GPS-enabled"],
      photos: PHOTOS.tempo16,
      sortOrder: 31,
      isActive: false,
      roundTripPerKm: 28,
      minKmPerDay: 300,
      driverBata: 500,
      roundTripNote: "min 300 km/day · ₹500 driver bata",
    },
  ];

  for (const { photos, ...v } of vehicles) {
    // SQLite has no scalar lists — features & images are stored as JSON strings.
    const data = {
      ...v,
      slug: slugify(v.name),
      features: JSON.stringify(v.features),
      imageUrl: photos[0],
      images: JSON.stringify(photos.slice(1)),
    };
    const existing = await prisma.vehicle.findFirst({ where: { name: v.name } });
    if (existing) {
      await prisma.vehicle.update({ where: { id: existing.id }, data });
    } else {
      await prisma.vehicle.create({ data });
    }
  }
  // Drop any vehicle no longer in the roster (e.g. an old "Mini Bus / Coach").
  await prisma.vehicle.deleteMany({
    where: { name: { notIn: vehicles.map((v) => v.name) } },
  });

  // ---------------------------------------------------------------------
  // Destinations
  // ---------------------------------------------------------------------
  type DestSeed = {
    name: string;
    category: DestinationCategory;
    description: string;
    distanceKm?: number;
  };

  const destinations: DestSeed[] = [
    // Hill stations
    { name: "Madikeri / Coorg", category: "HILL_STATION", description: "Misty coffee estates, waterfalls and valley viewpoints in the Western Ghats.", distanceKm: 260 },
    { name: "Chikmagalur", category: "HILL_STATION", description: "Karnataka's coffee land with trekking trails up to Mullayanagiri, the state's highest peak.", distanceKm: 245 },
    { name: "Savandurga Hills", category: "HILL_STATION", description: "One of Asia's largest monolithic hills, a popular day trip for hikes and sunrise views.", distanceKm: 55 },
    { name: "Bilikal Rangaswamy Betta", category: "HILL_STATION", description: "Forest hill shrine near Kanakapura with panoramic ridge-line views.", distanceKm: 90 },
    { name: "Chikkaballapura (Nandi region)", category: "HILL_STATION", description: "Gateway to Nandi Hills, Skandagiri and cool early-morning drives from the city.", distanceKm: 60 },
    { name: "Sakleshpur", category: "HILL_STATION", description: "Misty Western Ghats hill town on the Bengaluru–Mangaluru route, with coffee estates and the scenic Green Route railway.", distanceKm: 220 },

    // Heritage & culture
    { name: "Hampi", category: "HERITAGE", description: "UNESCO World Heritage ruins of the Vijayanagara Empire spread across a boulder landscape.", distanceKm: 340 },
    { name: "Chitradurga", category: "HERITAGE", description: "The seven-walled hill fort of the Nayakas, wrapped in dramatic rock formations.", distanceKm: 200 },
    { name: "Shravanabelagola", category: "HERITAGE", description: "Towering monolithic statue of Bahubali atop Vindhyagiri, a major Jain pilgrimage site.", distanceKm: 145 },
    { name: "Srirangapatna", category: "HERITAGE", description: "Island fortress town of Tipu Sultan with palaces, temples and riverside history.", distanceKm: 125 },
    { name: "Bangalore Palace", category: "HERITAGE", description: "Tudor-style royal residence of the Wadiyars in the heart of the city.", distanceKm: 5 },
    { name: "Bijapur (Vijayapura)", category: "HERITAGE", description: "Home of the Gol Gumbaz and grand Adil Shahi monuments of the Deccan.", distanceKm: 530 },
    { name: "Bagalkot / Badami-Aihole belt", category: "HERITAGE", description: "Cave temples and early Chalukyan rock architecture around Badami.", distanceKm: 460 },
    { name: "Channapatna", category: "HERITAGE", description: "The 'toy town' famous for lacquered wooden toys, an easy stop on the Mysore road.", distanceKm: 60 },

    // Pilgrimage
    { name: "Dharmasthala", category: "PILGRIMAGE", description: "Renowned Manjunatha temple town in Dakshina Kannada, open to all faiths.", distanceKm: 295 },
    { name: "Kukke Subramanya", category: "PILGRIMAGE", description: "Ancient serpent-deity temple set against the forested Kumara Parvatha.", distanceKm: 280 },
    { name: "Sringeri", category: "PILGRIMAGE", description: "Sharada Peetham on the banks of the Tunga, founded by Adi Shankaracharya.", distanceKm: 330 },
    { name: "Udupi", category: "PILGRIMAGE", description: "Krishna Matha temple town, also the birthplace of Udupi cuisine.", distanceKm: 400 },
    { name: "Murudeshwar", category: "PILGRIMAGE", description: "Giant Shiva statue on a headland jutting into the Arabian Sea.", distanceKm: 460 },
    { name: "Tirupati", category: "PILGRIMAGE", description: "Sri Venkateswara temple at Tirumala, one of the world's most-visited shrines.", distanceKm: 250 },
    { name: "Mantralaya", category: "PILGRIMAGE", description: "Sri Raghavendra Swamy Mutt on the banks of the Tungabhadra, just across the Andhra border near Raichur.", distanceKm: 340 },
    { name: "Rameswaram", category: "PILGRIMAGE", description: "Island temple town of the Ramanathaswamy shrine and Pamban bridge, one of the Char Dham sites.", distanceKm: 620 },

    // Nature & falls
    { name: "Shivanasamudra Falls", category: "NATURE_FALLS", description: "Twin segmented falls on the Kaveri — Gaganachukki and Bharachukki.", distanceKm: 135 },
    { name: "Lalbagh Botanical Garden", category: "NATURE_FALLS", description: "240-acre heritage garden with a glass house and 200-year-old trees, inside Bangalore.", distanceKm: 6 },
    { name: "Cubbon Park", category: "NATURE_FALLS", description: "Central green lung of Bangalore, ideal for a relaxed morning stop.", distanceKm: 3 },
    { name: "Gokarna", category: "NATURE_FALLS", description: "Temple town and a string of quiet crescent beaches on the Karnataka coast.", distanceKm: 480 },

    // Major cities
    { name: "Mysore", category: "MAJOR_CITY", description: "Palace city with Chamundi Hills, Brindavan Gardens and a rich royal legacy.", distanceKm: 145 },
    { name: "Mangalore", category: "MAJOR_CITY", description: "Coastal commercial hub with beaches, temples and Mangalorean cuisine.", distanceKm: 350 },
    { name: "Hassan", category: "MAJOR_CITY", description: "Base for the Hoysala temples of Belur and Halebeedu.", distanceKm: 185 },
    { name: "Shivamogga", category: "MAJOR_CITY", description: "'Gateway to the Malnad' and the Jog Falls region.", distanceKm: 275 },
    { name: "Hubli–Dharwad", category: "MAJOR_CITY", description: "North Karnataka's twin-city commercial and cultural centre.", distanceKm: 410 },
    { name: "Belgaum (Belagavi)", category: "MAJOR_CITY", description: "Fort city near the Maharashtra border with a pleasant climate.", distanceKm: 500 },
    { name: "Davanagere", category: "MAJOR_CITY", description: "Central Karnataka hub, famous for its benne dosa.", distanceKm: 260 },
    { name: "Tumkur", category: "MAJOR_CITY", description: "Fast-growing city on the Bangalore–Pune highway, near Devarayanadurga.", distanceKm: 70 },
    { name: "Hospet (Hosapete)", category: "MAJOR_CITY", description: "The road and rail base for visiting Hampi.", distanceKm: 320 },
    { name: "Ballari (Bellary)", category: "MAJOR_CITY", description: "Historic fort city of the mining belt in eastern Karnataka.", distanceKm: 305 },
    { name: "Raichur", category: "MAJOR_CITY", description: "Doab city between the Krishna and Tungabhadra with a medieval fort.", distanceKm: 410 },
    { name: "Mandya", category: "MAJOR_CITY", description: "Sugarcane heartland on the Bangalore–Mysore corridor.", distanceKm: 100 },
    { name: "Kushal Nagar", category: "MAJOR_CITY", description: "Town near Coorg with the Namdroling (Golden) Monastery at Bylakuppe.", distanceKm: 245 },

    // Outstation getaways (South India)
    { name: "Ooty", category: "OUTSTATION_GETAWAY", description: "The 'Queen of the Nilgiris' — tea gardens, lake and toy train.", distanceKm: 270 },
    { name: "Kodaikanal", category: "OUTSTATION_GETAWAY", description: "Tamil Nadu hill station around a star-shaped lake and pine forests.", distanceKm: 465 },
    { name: "Munnar", category: "OUTSTATION_GETAWAY", description: "Rolling Kerala tea country with Eravikulam National Park nearby.", distanceKm: 490 },
    { name: "Wayanad", category: "OUTSTATION_GETAWAY", description: "Kerala's forested plateau with caves, waterfalls and wildlife.", distanceKm: 290 },
    { name: "Coimbatore", category: "OUTSTATION_GETAWAY", description: "Industrial gateway city at the foot of the Western Ghats.", distanceKm: 360 },
    { name: "Chennai", category: "OUTSTATION_GETAWAY", description: "Tamil Nadu's capital on the Coromandel Coast.", distanceKm: 350 },
    { name: "Trichy (Tiruchirappalli)", category: "OUTSTATION_GETAWAY", description: "Rockfort city and the vast Srirangam temple complex.", distanceKm: 490 },
    { name: "Madurai", category: "OUTSTATION_GETAWAY", description: "Temple city built around the Meenakshi Amman shrine.", distanceKm: 435 },
    { name: "Pondicherry", category: "OUTSTATION_GETAWAY", description: "French-quarter streets, seafront promenade and Auroville.", distanceKm: 410 },
    { name: "Hyderabad", category: "OUTSTATION_GETAWAY", description: "Telangana's capital — Charminar, Golconda and Hussain Sagar.", distanceKm: 570 },
    { name: "Vijayawada", category: "OUTSTATION_GETAWAY", description: "Andhra Pradesh city on the Krishna river, near Amaravati.", distanceKm: 660 },
    { name: "Kanyakumari", category: "OUTSTATION_GETAWAY", description: "India's southern tip where three seas meet — sunrise and sunset over water.", distanceKm: 690 },
    { name: "Goa", category: "OUTSTATION_GETAWAY", description: "Beaches, Portuguese-era churches and easy nightlife on the Konkan coast.", distanceKm: 560 },
    { name: "Alleppey (Kerala Backwaters)", category: "OUTSTATION_GETAWAY", description: "Houseboat cruises through the palm-fringed backwater canals of Alappuzha.", distanceKm: 590 },
    { name: "Trivandrum & Kovalam", category: "OUTSTATION_GETAWAY", description: "Kerala's capital with the Padmanabhaswamy temple and the crescent beaches of Kovalam.", distanceKm: 715 },
  ];

  let order = 0;
  for (const d of destinations) {
    order += 1;
    const slug = slugify(d.name);
    const data = {
      name: d.name,
      slug,
      category: d.category,
      description: d.description,
      distanceKm: d.distanceKm ?? null,
      imageUrl: DEST_IMG[d.name] ?? destImageFor(d.category),
      sortOrder: order,
      isActive: true,
    };
    await prisma.destination.upsert({
      where: { slug },
      update: data,
      create: data,
    });
  }

  // ---------------------------------------------------------------------
  // Testimonials
  // ---------------------------------------------------------------------
  const testimonials = [
    {
      authorName: "Anitha R.",
      location: "Jayanagar, Bangalore",
      rating: 5,
      quote:
        "Booked a 4 am airport drop and the driver was waiting 15 minutes early. Clean Dzire, courteous driver, fare exactly as quoted. This is now our family's default cab.",
      sortOrder: 1,
    },
    {
      authorName: "Prakash Kamath",
      location: "Mangalore",
      rating: 5,
      quote:
        "Did a 3-day Coorg–Chikmagalur round trip in an Innova Crysta. The driver knew every viewpoint and homestay road. Transparent per-km billing at the end, no surprises.",
      sortOrder: 2,
    },
    {
      authorName: "Sowmya & friends",
      location: "Whitefield, Bangalore",
      rating: 5,
      quote:
        "16-seater tempo traveller for a Dharmasthala–Kukke–Udupi trip. Comfortable push-back seats and the group stayed together the whole way. Highly recommend for temple tours.",
      sortOrder: 3,
    },
    {
      authorName: "Ravikumar N.",
      location: "Corporate travel desk",
      rating: 5,
      quote:
        "We use Sumpreeth for guest pickups and outstation client visits. Invoices arrive on time and drivers are always presentable. Reliable partner for business travel.",
      sortOrder: 4,
    },
    {
      authorName: "Deepa Menon",
      location: "HSR Layout, Bangalore",
      rating: 5,
      quote:
        "Needed a one-way drop to a village near Hassan that other operators refused. Sumpreeth arranged it the same evening at a fair rate. Genuinely covers the interior.",
      sortOrder: 5,
    },
    {
      authorName: "Imran S.",
      location: "Indiranagar, Bangalore",
      rating: 5,
      quote:
        "Local 8hr/80km package for a day of running around the city. Driver was patient through every stop and the car was spotless and sanitised. Great value.",
      sortOrder: 6,
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { authorName: t.authorName, quote: t.quote },
    });
    if (!existing) await prisma.testimonial.create({ data: t });
  }

  // ---------------------------------------------------------------------
  // FAQ
  // ---------------------------------------------------------------------
  const faqs = [
    {
      question: "Do you operate 24/7?",
      answer:
        "Yes. We run round-the-clock for airport transfers, outstation trips and local bookings. Call or WhatsApp any time on +91 94486 48898.",
      sortOrder: 1,
    },
    {
      question: "Can I book a one-way outstation trip?",
      answer:
        "Yes. Both one-way and round-trip options are available. One-way is billed as a flat fare (plus toll where applicable); round trips are billed per km with a minimum km per day and driver bata.",
      sortOrder: 2,
    },
    {
      question: "Are drivers background-checked?",
      answer:
        "Yes. Every driver goes through address verification, a medical check-up, driving-skill testing and communication and behavioural training before joining. All vehicles are GPS-enabled.",
      sortOrder: 3,
    },
    {
      question: "Do you provide invoices for businesses?",
      answer:
        "Yes. GST invoices are available for corporate and business travel. Ask for monthly billing if you have regular requirements.",
      sortOrder: 4,
    },
    {
      question: "Do you serve villages and smaller towns, not just major cities?",
      answer:
        "Yes. We cover Karnataka's interior towns and villages on custom routes. Share your pickup and drop points and we will arrange the trip.",
      sortOrder: 5,
    },
  ];

  for (const f of faqs) {
    const existing = await prisma.faqItem.findFirst({
      where: { question: f.question },
    });
    if (!existing) await prisma.faqItem.create({ data: f });
  }

  console.log("Seed complete.");
  console.log(`Default admin password: ${DEFAULT_ADMIN_PASSWORD}`);
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
