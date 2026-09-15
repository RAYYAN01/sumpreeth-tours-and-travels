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
type PackageStateSeed =
  | "KARNATAKA"
  | "KERALA"
  | "TAMIL_NADU"
  | "ANDHRA_PRADESH"
  | "TELANGANA"
  | "GOA"
  | "PUDUCHERRY";

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
      adminId: "admin",
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
    /** Shorter alias for SEO titles when `name` carries a long parenthetical. */
    shortName?: string;
    category: DestinationCategory;
    state: PackageStateSeed;
    description: string;
    distanceKm?: number;
    highlights: string[];
    packageSlug?: string;
  };

  const destinations: DestSeed[] = [
    // Hill stations
    { name: "Madikeri / Coorg", category: "HILL_STATION", state: "KARNATAKA", description: "Misty coffee estates, waterfalls and valley viewpoints in the Western Ghats.", distanceKm: 260, packageSlug: "bangalore-to-coorg", highlights: ["Abbey Falls and Raja's Seat viewpoint", "Dubare Elephant Camp on the Kaveri", "Namdroling Golden Temple at Kushalnagar"] },
    { name: "Chikmagalur", category: "HILL_STATION", state: "KARNATAKA", description: "Karnataka's coffee land with trekking trails up to Mullayanagiri, the state's highest peak.", distanceKm: 245, packageSlug: "bangalore-to-chikmagalur", highlights: ["Mullayanagiri, Karnataka's highest peak", "Baba Budangiri hill shrine", "Working coffee estate stays"] },
    { name: "Savandurga Hills", category: "HILL_STATION", state: "KARNATAKA", description: "One of Asia's largest monolithic hills, a popular day trip for hikes and sunrise views.", distanceKm: 55, highlights: ["One of Asia's largest monolithic hills", "Popular sunrise trek close to the city", "A base for local rock-climbing groups"] },
    { name: "Bilikal Rangaswamy Betta", category: "HILL_STATION", state: "KARNATAKA", description: "Forest hill shrine near Kanakapura with panoramic ridge-line views.", distanceKm: 90, highlights: ["Forest hill shrine near Kanakapura", "Ridge-line views over the Cauvery valley", "A quieter day-trek away from crowded trails"] },
    { name: "Chikkaballapura (Nandi region)", shortName: "Nandi Hills", category: "HILL_STATION", state: "KARNATAKA", description: "Gateway to Nandi Hills, Skandagiri and cool early-morning drives from the city.", distanceKm: 60, highlights: ["Nandi Hills sunrise viewpoint", "Skandagiri night trekking", "Bhoga Nandeeswara Temple, one of Karnataka's oldest"] },
    { name: "Sakleshpur", category: "HILL_STATION", state: "KARNATAKA", description: "Misty Western Ghats hill town on the Bengaluru–Mangaluru route, with coffee estates and the scenic Green Route railway.", distanceKm: 220, packageSlug: "bangalore-to-sakleshpur", highlights: ["Manjarabad Fort's star-shaped ramparts", "The historic Green Route railway trail", "Western Ghats coffee-estate stays"] },

    // Heritage & culture
    { name: "Hampi", category: "HERITAGE", state: "KARNATAKA", description: "UNESCO World Heritage ruins of the Vijayanagara Empire spread across a boulder landscape.", distanceKm: 340, packageSlug: "bangalore-to-hampi", highlights: ["Virupaksha Temple and the Vittala stone chariot", "Boulder-strewn Vijayanagara ruins", "Hemakuta Hill sunset point"] },
    { name: "Chitradurga", category: "HERITAGE", state: "KARNATAKA", description: "The seven-walled hill fort of the Nayakas, wrapped in dramatic rock formations.", distanceKm: 200, highlights: ["Seven-walled Nayaka-era hill fort", "Dramatic rock bastions and hidden step-wells", "The Onake Obavva cave, tied to a local legend"] },
    { name: "Shravanabelagola", category: "HERITAGE", state: "KARNATAKA", description: "Towering monolithic statue of Bahubali atop Vindhyagiri, a major Jain pilgrimage site.", distanceKm: 145, highlights: ["57-foot Bahubali monolith atop Vindhyagiri", "Major Jain pilgrimage centre", "Mahamastakabhisheka festival held every 12 years"] },
    { name: "Srirangapatna", category: "HERITAGE", state: "KARNATAKA", description: "Island fortress town of Tipu Sultan with palaces, temples and riverside history.", distanceKm: 125, highlights: ["Tipu Sultan's island fortress and Summer Palace", "Sri Ranganathaswamy Temple", "Close to Ranganathittu Bird Sanctuary"] },
    { name: "Bangalore Palace", category: "HERITAGE", state: "KARNATAKA", description: "Tudor-style royal residence of the Wadiyars in the heart of the city.", distanceKm: 5, highlights: ["Tudor-style royal residence of the Wadiyars", "Antique furniture and royal portrait galleries", "Popular concert and event lawns"] },
    { name: "Bijapur (Vijayapura)", category: "HERITAGE", state: "KARNATAKA", description: "Home of the Gol Gumbaz and grand Adil Shahi monuments of the Deccan.", distanceKm: 530, highlights: ["Gol Gumbaz, one of the world's largest domes", "Ibrahim Rauza's Indo-Islamic architecture", "Adil Shahi-era forts and mosques"] },
    { name: "Bagalkot / Badami-Aihole belt", shortName: "Badami-Aihole", category: "HERITAGE", state: "KARNATAKA", description: "Cave temples and early Chalukyan rock architecture around Badami.", distanceKm: 460, highlights: ["Badami's rock-cut cave temples", "Aihole's early Chalukyan temple cluster", "Pattadakal, a UNESCO World Heritage site nearby"] },
    { name: "Channapatna", category: "HERITAGE", state: "KARNATAKA", description: "The 'toy town' famous for lacquered wooden toys, an easy stop on the Mysore road.", distanceKm: 60, highlights: ["The 'toy town' famous for lacquered wooden toys", "Roadside workshops open to visitors", "A handy stop on the Bangalore–Mysore highway"] },

    // Pilgrimage
    { name: "Dharmasthala", category: "PILGRIMAGE", state: "KARNATAKA", description: "Renowned Manjunatha temple town in Dakshina Kannada, open to all faiths.", distanceKm: 295, highlights: ["Sri Manjunatha Temple, open to all faiths", "Free community meals (Bhojanshala) for pilgrims", "Manjusha Museum of art and antiques"] },
    { name: "Kukke Subramanya", category: "PILGRIMAGE", state: "KARNATAKA", description: "Ancient serpent-deity temple set against the forested Kumara Parvatha.", distanceKm: 280, highlights: ["Ancient serpent-deity (Naga) temple", "Set against the forested Kumara Parvatha peak", "Popular for Sarpa Samskara rituals"] },
    { name: "Sringeri", category: "PILGRIMAGE", state: "KARNATAKA", description: "Sharada Peetham on the banks of the Tunga, founded by Adi Shankaracharya.", distanceKm: 330, highlights: ["Sharada Peetham founded by Adi Shankaracharya", "Vidyashankara Temple on the Tunga riverbank", "Gateway to the Kudremukh forest range"] },
    { name: "Udupi", category: "PILGRIMAGE", state: "KARNATAKA", description: "Krishna Matha temple town, also the birthplace of Udupi cuisine.", distanceKm: 400, highlights: ["Krishna Matha and its famous Kanakana Kindi window", "Birthplace of Udupi cuisine", "Close to Malpe and St. Mary's Island beaches"] },
    { name: "Murudeshwar", category: "PILGRIMAGE", state: "KARNATAKA", description: "Giant Shiva statue on a headland jutting into the Arabian Sea.", distanceKm: 460, highlights: ["One of the world's tallest Shiva statues", "A headland temple jutting into the Arabian Sea", "Ropeway ride to the Raja Gopura viewpoint"] },
    { name: "Tirupati", category: "PILGRIMAGE", state: "ANDHRA_PRADESH", description: "Sri Venkateswara temple at Tirumala, one of the world's most-visited shrines.", distanceKm: 250, packageSlug: "bangalore-to-tirupati", highlights: ["Sri Venkateswara Temple at Tirumala", "One of the world's most-visited pilgrimage sites", "Scenic ghat-road drive up the seven hills"] },
    { name: "Mantralaya", category: "PILGRIMAGE", state: "ANDHRA_PRADESH", description: "Sri Raghavendra Swamy Mutt on the banks of the Tungabhadra, just across the Andhra border near Raichur.", distanceKm: 340, highlights: ["Sri Raghavendra Swamy Mutt on the Tungabhadra", "Brindavana samadhi shrine", "A popular day pilgrimage near the Karnataka border"] },
    { name: "Rameswaram", category: "PILGRIMAGE", state: "TAMIL_NADU", description: "Island temple town of the Ramanathaswamy shrine and Pamban bridge, one of the Char Dham sites.", distanceKm: 620, packageSlug: "bangalore-to-kanyakumari-rameswaram", highlights: ["Ramanathaswamy Temple's famous pillared corridor", "Pamban Bridge over the sea", "Dhanushkodi's ghost-town coastline"] },

    // Nature & falls
    { name: "Shivanasamudra Falls", category: "NATURE_FALLS", state: "KARNATAKA", description: "Twin segmented falls on the Kaveri — Gaganachukki and Bharachukki.", distanceKm: 135, highlights: ["Twin falls — Gaganachukki and Bharachukki — on the Kaveri", "Best seen just after the monsoon", "Close to Srirangapatna and Somnathpur"] },
    { name: "Lalbagh Botanical Garden", category: "NATURE_FALLS", state: "KARNATAKA", description: "240-acre heritage garden with a glass house and 200-year-old trees, inside Bangalore.", distanceKm: 6, highlights: ["240-acre heritage garden with a glass house", "200-year-old trees and a rock over 3,000 million years old", "Flower shows during Republic Day and Independence Day"] },
    { name: "Cubbon Park", category: "NATURE_FALLS", state: "KARNATAKA", description: "Central green lung of Bangalore, ideal for a relaxed morning stop.", distanceKm: 3, highlights: ["Central green lung of Bangalore", "Century-old rain trees and walking trails", "The State Central Library and High Court nearby"] },
    { name: "Gokarna", category: "NATURE_FALLS", state: "KARNATAKA", description: "Temple town and a string of quiet crescent beaches on the Karnataka coast.", distanceKm: 480, packageSlug: "bangalore-to-gokarna", highlights: ["Mahabaleshwar Temple darshan", "Om Beach, Kudle Beach and Half Moon Beach", "A quieter coastal alternative to Goa"] },

    // Major cities
    { name: "Mysore", category: "MAJOR_CITY", state: "KARNATAKA", description: "Palace city with Chamundi Hills, Brindavan Gardens and a rich royal legacy.", distanceKm: 145, packageSlug: "bangalore-to-mysore", highlights: ["Illuminated Mysore Palace", "Chamundi Hills temple", "Brindavan Gardens musical fountain"] },
    { name: "Mangalore", category: "MAJOR_CITY", state: "KARNATAKA", description: "Coastal commercial hub with beaches, temples and Mangalorean cuisine.", distanceKm: 350, highlights: ["Panambur and Tannirbhavi beaches", "Historic coastal temples", "Well-known Mangalorean seafood cuisine"] },
    { name: "Hassan", category: "MAJOR_CITY", state: "KARNATAKA", description: "Base for the Hoysala temples of Belur and Halebeedu.", distanceKm: 185, highlights: ["Base for the Hoysala temples of Belur and Halebeedu", "Intricate stone carving up close", "Gateway to Sakleshpur and Sringeri"] },
    { name: "Shivamogga", category: "MAJOR_CITY", state: "KARNATAKA", description: "'Gateway to the Malnad' and the Jog Falls region.", distanceKm: 275, highlights: ["'Gateway to the Malnad' hill region", "Close to Jog Falls, India's second-highest falls", "Tyavarekoppa Lion & Tiger Reserve nearby"] },
    { name: "Hubli–Dharwad", category: "MAJOR_CITY", state: "KARNATAKA", description: "North Karnataka's twin-city commercial and cultural centre.", distanceKm: 410, highlights: ["North Karnataka's twin-city commercial hub", "Famous Dharwad peda sweet", "Old-town heritage streets around Unkal Lake"] },
    { name: "Belgaum (Belagavi)", category: "MAJOR_CITY", state: "KARNATAKA", description: "Fort city near the Maharashtra border with a pleasant climate.", distanceKm: 500, highlights: ["Belgaum Fort near the Maharashtra border", "Pleasant year-round climate", "Kamal Basti's Jain architecture"] },
    { name: "Davanagere", category: "MAJOR_CITY", state: "KARNATAKA", description: "Central Karnataka hub, famous for its benne dosa.", distanceKm: 260, highlights: ["Famous for its benne (butter) dosa", "Central Karnataka trading hub", "Close to the Kondajji forest range"] },
    { name: "Tumkur", category: "MAJOR_CITY", state: "KARNATAKA", description: "Fast-growing city on the Bangalore–Pune highway, near Devarayanadurga.", distanceKm: 70, highlights: ["Devarayanadurga hill temple nearby", "Siddaganga Mutt, a well-known education centre", "On the Bangalore–Pune highway"] },
    { name: "Hospet (Hosapete)", category: "MAJOR_CITY", state: "KARNATAKA", description: "The road and rail base for visiting Hampi.", distanceKm: 320, highlights: ["The road and rail base for visiting Hampi", "Tungabhadra Dam and gardens nearby", "Kamalapura's Archaeological Museum"] },
    { name: "Ballari (Bellary)", category: "MAJOR_CITY", state: "KARNATAKA", description: "Historic fort city of the mining belt in eastern Karnataka.", distanceKm: 305, highlights: ["Historic fort city of the mining belt", "Gandhi Nagar market and old-town bazaars", "Close to the Hampi heritage zone"] },
    { name: "Raichur", category: "MAJOR_CITY", state: "KARNATAKA", description: "Doab city between the Krishna and Tungabhadra with a medieval fort.", distanceKm: 410, highlights: ["Doab city between the Krishna and Tungabhadra", "Medieval Raichur Fort", "Historic mosques and temples side by side"] },
    { name: "Mandya", category: "MAJOR_CITY", state: "KARNATAKA", description: "Sugarcane heartland on the Bangalore–Mysore corridor.", distanceKm: 100, highlights: ["Sugarcane heartland on the Bangalore–Mysore corridor", "Close to the Krishna Raja Sagara (KRS) dam", "A convenient stop en route to Coorg or Mysore"] },
    { name: "Kushal Nagar", category: "MAJOR_CITY", state: "KARNATAKA", description: "Town near Coorg with the Namdroling (Golden) Monastery at Bylakuppe.", distanceKm: 245, highlights: ["Namdroling (Golden) Monastery at Bylakuppe", "Gateway town to Coorg", "Dubare elephant camp nearby"] },

    // Outstation getaways (South India)
    { name: "Ooty", category: "OUTSTATION_GETAWAY", state: "TAMIL_NADU", description: "The 'Queen of the Nilgiris' — tea gardens, lake and toy train.", distanceKm: 270, packageSlug: "bangalore-to-ooty", highlights: ["Ooty Lake boating", "Doddabetta Peak viewpoint", "Nilgiri tea estates and the toy train route"] },
    { name: "Kodaikanal", category: "OUTSTATION_GETAWAY", state: "TAMIL_NADU", description: "Tamil Nadu hill station around a star-shaped lake and pine forests.", distanceKm: 465, packageSlug: "bangalore-to-kodaikanal", highlights: ["Star-shaped Kodai Lake", "Coaker's Walk and Pillar Rocks viewpoints", "Pine forests and Bryant Park"] },
    { name: "Munnar", category: "OUTSTATION_GETAWAY", state: "KERALA", description: "Rolling Kerala tea country with Eravikulam National Park nearby.", distanceKm: 490, packageSlug: "bangalore-to-munnar", highlights: ["Rolling tea gardens as far as the eye can see", "Eravikulam National Park's Nilgiri Tahr", "Top Station viewpoint on the Kerala–TN border"] },
    { name: "Wayanad", category: "OUTSTATION_GETAWAY", state: "KERALA", description: "Kerala's forested plateau with caves, waterfalls and wildlife.", distanceKm: 290, packageSlug: "bangalore-to-wayanad", highlights: ["Edakkal Caves' prehistoric rock carvings", "Banasura Sagar Dam", "Soochipara and Meenmutty waterfalls"] },
    { name: "Coimbatore", category: "OUTSTATION_GETAWAY", state: "TAMIL_NADU", description: "Industrial gateway city at the foot of the Western Ghats.", distanceKm: 360, highlights: ["Industrial gateway at the foot of the Western Ghats", "A base for Ooty and Valparai hill trips", "Marudamalai temple and Isha Yoga Center nearby"] },
    { name: "Chennai", category: "OUTSTATION_GETAWAY", state: "TAMIL_NADU", description: "Tamil Nadu's capital on the Coromandel Coast.", distanceKm: 350, highlights: ["Marina Beach, one of the world's longest urban beaches", "Kapaleeshwarar Temple in Mylapore", "Fort St. George's colonial history"] },
    { name: "Trichy (Tiruchirappalli)", shortName: "Trichy", category: "OUTSTATION_GETAWAY", state: "TAMIL_NADU", description: "Rockfort city and the vast Srirangam temple complex.", distanceKm: 490, highlights: ["Rockfort Temple perched on an ancient outcrop", "The vast Srirangam temple complex nearby", "Rock-cut cave temples with Pallava-era carvings"] },
    { name: "Madurai", category: "OUTSTATION_GETAWAY", state: "TAMIL_NADU", description: "Temple city built around the Meenakshi Amman shrine.", distanceKm: 435, highlights: ["Meenakshi Amman Temple's towering gopurams", "Thirumalai Nayakkar Mahal palace", "One of India's oldest continuously inhabited cities"] },
    { name: "Pondicherry", category: "OUTSTATION_GETAWAY", state: "PUDUCHERRY", description: "French-quarter streets, seafront promenade and Auroville.", distanceKm: 410, packageSlug: "bangalore-to-pondicherry", highlights: ["French Quarter's colonial streets", "Auroville and the Matrimandir", "Promenade and Paradise beaches"] },
    { name: "Hyderabad", category: "OUTSTATION_GETAWAY", state: "TELANGANA", description: "Telangana's capital — Charminar, Golconda and Hussain Sagar.", distanceKm: 570, highlights: ["Charminar and the old-city bazaars", "Golconda Fort's acoustic engineering", "Hussain Sagar lake and the Buddha statue"] },
    { name: "Vijayawada", category: "OUTSTATION_GETAWAY", state: "ANDHRA_PRADESH", description: "Andhra Pradesh city on the Krishna river, near Amaravati.", distanceKm: 660, highlights: ["Kanaka Durga Temple on Indrakeeladri hill", "Prakasam Barrage across the Krishna river", "Undavalli cave temples nearby"] },
    { name: "Kanyakumari", category: "OUTSTATION_GETAWAY", state: "TAMIL_NADU", description: "India's southern tip where three seas meet — sunrise and sunset over water.", distanceKm: 690, packageSlug: "bangalore-to-kanyakumari-rameswaram", highlights: ["Vivekananda Rock Memorial", "Thiruvalluvar Statue", "Sunrise and sunset where three seas meet"] },
    { name: "Goa", category: "OUTSTATION_GETAWAY", state: "GOA", description: "Beaches, Portuguese-era churches and easy nightlife on the Konkan coast.", distanceKm: 560, packageSlug: "bangalore-to-goa", highlights: ["Baga, Calangute and Palolem beaches", "Basilica of Bom Jesus in Old Goa", "Fort Aguada and Portuguese-era churches"] },
    { name: "Alleppey (Kerala Backwaters)", shortName: "Alleppey", category: "OUTSTATION_GETAWAY", state: "KERALA", description: "Houseboat cruises through the palm-fringed backwater canals of Alappuzha.", distanceKm: 590, highlights: ["Houseboat cruises through palm-fringed canals", "Kerala's 'Venice of the East'", "Alappuzha Beach and lighthouse"] },
    { name: "Trivandrum & Kovalam", shortName: "Trivandrum", category: "OUTSTATION_GETAWAY", state: "KERALA", description: "Kerala's capital with the Padmanabhaswamy temple and the crescent beaches of Kovalam.", distanceKm: 715, highlights: ["Padmanabhaswamy Temple", "Kovalam's crescent lighthouse beach", "Napier Museum and Kerala capital sights"] },
  ];

  let order = 0;
  for (const d of destinations) {
    order += 1;
    const slug = slugify(d.name);
    const short = d.shortName ?? d.name;
    const data = {
      name: d.name,
      slug,
      category: d.category,
      state: d.state,
      description: d.description,
      distanceKm: d.distanceKm ?? null,
      highlights: JSON.stringify(d.highlights),
      packageSlug: d.packageSlug ?? null,
      imageUrl: DEST_IMG[d.name] ?? destImageFor(d.category),
      sortOrder: order,
      isActive: true,
      seoTitle: `Bangalore to ${short} Cab — One Way & Round Trip`,
      seoDescription: `Book a one-way or round-trip cab from Bangalore to ${short} — vetted drivers, transparent fares. ${d.description}`,
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

  // ---------------------------------------------------------------------
  // Tours & Packages (Tier 1 — Bangalore-origin South India routes)
  // ---------------------------------------------------------------------
  type PkgSeed = {
    title: string;
    destination: string;
    route: string;
    state: string;
    category: string[];
    durationDays: number;
    durationNights: number;
    startingPrice: number;
    shortDescription: string;
    description: string;
    featuredImage: string;
    itinerary: { day: number; title: string; description: string }[];
    inclusions: string[];
    exclusions: string[];
    vehicleOptions: string[];
    pickupLocations: string[];
    tags: string[];
    faq: { question: string; answer: string }[];
    featured?: boolean;
    popular?: boolean;
    sortOrder: number;
    /** Shorter title for the SEO <title> tag when `title` is unusually long. */
    seoTitle?: string;
  };

  const STD_INCLUSIONS = [
    "Vehicle & driver for the full itinerary",
    "Fuel and driver allowance (bata)",
    "All sightseeing drives listed in the itinerary",
  ];
  const STD_EXCLUSIONS = [
    "Hotel / homestay accommodation",
    "Meals",
    "Entry tickets, camera fees and activity charges",
    "Tolls, parking, permits and state taxes (charged at actuals)",
  ];
  const PILGRIM_INCLUSIONS = [
    "Vehicle & driver for the full itinerary",
    "Fuel and driver allowance (bata)",
    "Waiting time at temples as per itinerary",
  ];

  const packages: PkgSeed[] = [
    {
      title: "Bangalore to Coorg Tour Package",
      destination: "Coorg",
      route: "Bangalore → Coorg",
      state: "KARNATAKA",
      category: ["WEEKEND", "FAMILY", "HONEYMOON"],
      durationDays: 3,
      durationNights: 2,
      startingPrice: 9500,
      shortDescription:
        "A misty coffee-country weekend — waterfalls, plantations, Dubare's elephants and Madikeri's old fort, all within a comfortable 5-hour drive.",
      description:
        "Coorg (Kodagu) is Karnataka's most popular hill getaway — rolling coffee estates, cool weather most of the year, and a slower pace than the city. This package covers Madikeri town, Abbey Falls, Raja's Seat and the Dubare elephant camp, with your own vehicle and driver for the whole trip so you're not tied to bus timings.",
      featuredImage: "/images/destinations/coorg-getaway.webp",
      itinerary: [
        { day: 1, title: "Bangalore → Madikeri", description: "Depart early morning; scenic drive via Mysore/Kushalnagar through coffee estates. Check in, evening at Raja's Seat for sunset." },
        { day: 2, title: "Madikeri sightseeing", description: "Abbey Falls, Omkareshwara Temple, Madikeri Fort, and the Dubare Elephant Camp for an interaction with the resident herd." },
        { day: 3, title: "Madikeri → Bangalore", description: "Visit a working coffee plantation and Golden Temple (Namdroling Monastery) at Kushalnagar on the drive back." },
      ],
      inclusions: STD_INCLUSIONS,
      exclusions: STD_EXCLUSIONS,
      vehicleOptions: ["Sedan", "SUV", "Tempo Traveller"],
      pickupLocations: ["Any location in Bangalore", "Kempegowda International Airport"],
      tags: ["Abbey Falls", "Raja's Seat", "Dubare Elephant Camp", "Namdroling Golden Temple", "Coffee plantation walk"],
      faq: [
        { question: "Is 3 days enough for Coorg?", answer: "Yes — it covers Madikeri town, the main waterfalls and Dubare comfortably. Add a day if you also want Talacauvery and Nagarhole." },
        { question: "What's the best time to visit?", answer: "October to May is best for sightseeing; June–September is monsoon season with heavy rain but very green scenery." },
      ],
      featured: true,
      popular: true,
      sortOrder: 1,
    },
    {
      title: "Bangalore to Ooty Tour Package",
      destination: "Ooty",
      route: "Bangalore → Ooty",
      state: "TAMIL_NADU",
      category: ["FAMILY", "HONEYMOON"],
      durationDays: 3,
      durationNights: 2,
      startingPrice: 10500,
      shortDescription:
        "The Queen of Hill Stations — tea gardens, the toy train route through Coonoor, botanical gardens and a boat ride on Ooty Lake.",
      description:
        "Ooty in the Nilgiris is a classic family hill-station trip from Bangalore, usually combined with Coonoor's tea estates and viewpoints. Cool weather year-round, well-paved roads and plenty for both couples and kids.",
      featuredImage: "/images/destinations/ooty-coonoor-hill-tour.webp",
      itinerary: [
        { day: 1, title: "Bangalore → Ooty", description: "Drive via Mysore and Bandipur/Mudumalai forest — watch for wildlife on the ghat road. Evening at leisure in Ooty." },
        { day: 2, title: "Ooty sightseeing", description: "Botanical Gardens, Ooty Lake boating, Doddabetta Peak viewpoint, and a stop at a tea factory." },
        { day: 3, title: "Coonoor and return", description: "Sim's Park and Dolphin's Nose viewpoint at Coonoor, then drive back to Bangalore." },
      ],
      inclusions: STD_INCLUSIONS,
      exclusions: STD_EXCLUSIONS,
      vehicleOptions: ["Sedan", "SUV", "Tempo Traveller"],
      pickupLocations: ["Any location in Bangalore"],
      tags: ["Ooty Lake", "Doddabetta Peak", "Botanical Gardens", "Sim's Park, Coonoor", "Nilgiri tea estates"],
      faq: [
        { question: "Can we combine Ooty with Mysore?", answer: "Yes, since the route already passes Mysore — a half-day stop at Mysore Palace on the way is a common add-on." },
        { question: "Do we need permits for the forest stretch?", answer: "No permit is needed to drive through; the forest checkpost may enforce a night driving ban (roughly 9pm–6am) inside Bandipur/Mudumalai." },
      ],
      popular: true,
      sortOrder: 2,
    },
    {
      title: "Bangalore to Mysore Day Tour",
      destination: "Mysore",
      route: "Bangalore → Mysore",
      state: "KARNATAKA",
      category: ["FAMILY", "WEEKEND"],
      durationDays: 1,
      durationNights: 0,
      startingPrice: 3200,
      shortDescription:
        "A full day covering Mysore Palace, Chamundi Hills and Srirangapatna — comfortably done and back to Bangalore the same night.",
      description:
        "Mysore is close enough for a single-day round trip (about 3 hours each way) and packs in the city's heritage highlights: the illuminated Mysore Palace, Chamundi Hills temple, and the Tipu Sultan-era sites at Srirangapatna.",
      featuredImage: "/images/destinations/mysore-heritage-day-tour.webp",
      itinerary: [
        { day: 1, title: "Bangalore → Mysore → Bangalore", description: "Early start; Srirangapatna (Ranganathaswamy Temple, Tipu's Summer Palace) → Mysore Palace → Chamundi Hills → Brindavan Gardens on the way back." },
      ],
      inclusions: STD_INCLUSIONS,
      exclusions: STD_EXCLUSIONS,
      vehicleOptions: ["Sedan", "SUV", "Tempo Traveller"],
      pickupLocations: ["Any location in Bangalore"],
      tags: ["Mysore Palace", "Chamundi Hills", "Srirangapatna", "Brindavan Gardens"],
      faq: [
        { question: "Is Mysore Palace open every day?", answer: "Yes, except a few public holidays — check current timings before you leave, as the interior closes earlier than the grounds." },
        { question: "Can we extend this to an overnight trip?", answer: "Yes — ask us to add a night in Mysore to also cover Somnathpur temple and the illuminated palace on Sunday evening." },
      ],
      popular: true,
      sortOrder: 3,
    },
    {
      title: "Bangalore to Chikmagalur Tour Package",
      destination: "Chikmagalur",
      route: "Bangalore → Chikmagalur",
      state: "KARNATAKA",
      category: ["WEEKEND", "ADVENTURE"],
      durationDays: 2,
      durationNights: 1,
      startingPrice: 6800,
      shortDescription:
        "Karnataka's coffee capital — Mullayanagiri peak, Baba Budangiri and coffee-estate homestays, all in a quick weekend window.",
      description:
        "Chikmagalur suits a short weekend better than Coorg if you'd rather trek a bit — Mullayanagiri is Karnataka's highest peak and an easy climb, with views across the Western Ghats.",
      featuredImage: "/images/destinations/chikmagalur-coffee-trails.webp",
      itinerary: [
        { day: 1, title: "Bangalore → Chikmagalur", description: "Drive in, check in, evening at a coffee estate viewpoint or Hebbe Falls (seasonal)." },
        { day: 2, title: "Mullayanagiri & return", description: "Sunrise at Mullayanagiri peak, Baba Budangiri hill shrine, then drive back to Bangalore by evening." },
      ],
      inclusions: STD_INCLUSIONS,
      exclusions: STD_EXCLUSIONS,
      vehicleOptions: ["Sedan", "SUV"],
      pickupLocations: ["Any location in Bangalore"],
      tags: ["Mullayanagiri Peak", "Baba Budangiri", "Hebbe Falls", "Coffee estate trails"],
      faq: [
        { question: "Is Mullayanagiri difficult to climb?", answer: "No — a vehicle can go most of the way; the final stretch is a short, easy walk suitable for most fitness levels." },
      ],
      sortOrder: 4,
    },
    {
      title: "Bangalore to Wayanad Tour Package",
      destination: "Wayanad",
      route: "Bangalore → Wayanad",
      state: "KERALA",
      category: ["ADVENTURE", "WILDLIFE", "FAMILY"],
      durationDays: 3,
      durationNights: 2,
      startingPrice: 14500,
      shortDescription:
        "Kerala's green, misty district — Edakkal Caves, Chembra Peak, Banasura Sagar Dam and a shot at spotting wildlife en route through Bandipur-Mudumalai-Wayanad.",
      description:
        "Wayanad is reached through three back-to-back wildlife sanctuaries, so the drive itself is part of the experience. Once there, it's caves, waterfalls, a heart-shaped lake and genuinely cool weather.",
      featuredImage: "/images/destinations/wayanad-nature-escape.webp",
      itinerary: [
        { day: 1, title: "Bangalore → Wayanad", description: "Drive via Mysore, Bandipur and Mudumalai forests (watch for elephants). Evening at leisure near Kalpetta or Sulthan Bathery." },
        { day: 2, title: "Caves, dam and falls", description: "Edakkal Caves (prehistoric rock carvings), Banasura Sagar Dam, and Soochipara or Meenmutty waterfalls depending on season." },
        { day: 3, title: "Chembra Peak & return", description: "Morning trek towards the heart-shaped Chembra Peak lake (permit/guide arranged locally, subject to forest department availability), then drive back to Bangalore." },
      ],
      inclusions: STD_INCLUSIONS,
      exclusions: STD_EXCLUSIONS,
      vehicleOptions: ["Sedan", "SUV", "Tempo Traveller"],
      pickupLocations: ["Any location in Bangalore"],
      tags: ["Edakkal Caves", "Chembra Peak", "Banasura Sagar Dam", "Soochipara Falls"],
      faq: [
        { question: "Is a forest permit needed?", answer: "No permit for the drive-through; there's a night driving restriction through the Bandipur–Mudumalai stretch, so we time the journey around it." },
      ],
      popular: true,
      sortOrder: 5,
    },
    {
      title: "Bangalore to Munnar Tour Package",
      destination: "Munnar",
      route: "Bangalore → Munnar",
      state: "KERALA",
      category: ["HONEYMOON", "FAMILY"],
      durationDays: 4,
      durationNights: 3,
      startingPrice: 17500,
      shortDescription:
        "Kerala's tea-garden capital — rolling green hills, Eravikulam National Park, Mattupetty Dam and the Top Station viewpoint, on a relaxed 4-day trip.",
      description:
        "Munnar is a longer drive from Bangalore (around 8-9 hours) so this package builds in a comfortable pace — tea estates, wildlife sanctuary, dams and viewpoints spread across two full days rather than rushed into one.",
      featuredImage: "/images/destinations/munnar-tea-garden-trail.webp",
      itinerary: [
        { day: 1, title: "Bangalore → Munnar", description: "Long scenic drive through Kerala's Western Ghats; check in by evening." },
        { day: 2, title: "Tea gardens & wildlife", description: "Tea Museum, Eravikulam National Park (home to the Nilgiri Tahr), and Mattupetty Dam." },
        { day: 3, title: "Top Station & Kundala", description: "Top Station viewpoint on the Kerala–Tamil Nadu border, Kundala Lake, and local spice/tea shopping." },
        { day: 4, title: "Munnar → Bangalore", description: "Drive back with a stop at a scenic Western Ghats viewpoint en route." },
      ],
      inclusions: STD_INCLUSIONS,
      exclusions: STD_EXCLUSIONS,
      vehicleOptions: ["Sedan", "SUV", "Tempo Traveller"],
      pickupLocations: ["Any location in Bangalore"],
      tags: ["Eravikulam National Park", "Mattupetty Dam", "Top Station", "Tea Museum", "Kundala Lake"],
      faq: [
        { question: "How long is the drive from Bangalore?", answer: "Roughly 8-9 hours one way, which is why we spread this trip across 4 days instead of a rushed weekend." },
      ],
      featured: true,
      sortOrder: 6,
    },
    {
      title: "Bangalore to Goa Tour Package",
      destination: "Goa",
      route: "Bangalore → Goa",
      state: "GOA",
      category: ["WEEKEND", "HONEYMOON", "GROUP"],
      durationDays: 4,
      durationNights: 3,
      startingPrice: 18500,
      shortDescription:
        "North and South Goa beaches, Old Goa's Portuguese churches, and free time to relax — with your own vehicle so you're never dependent on rented scooters.",
      description:
        "This package covers Goa's must-see churches and beaches at your own pace, with the vehicle and driver on standby for the length of the trip rather than a fixed bus-tour schedule.",
      featuredImage: "/images/destinations/goa-beach-holiday.webp",
      itinerary: [
        { day: 1, title: "Bangalore → Goa", description: "Overnight or early-morning drive depending on preference; check in and relax at the beach in the evening." },
        { day: 2, title: "North Goa", description: "Baga, Calangute and Candolim beaches, Fort Aguada, and the Saturday Night Market (seasonal)." },
        { day: 3, title: "South Goa & Old Goa", description: "Basilica of Bom Jesus and Se Cathedral in Old Goa, then Colva or Palolem beach in the south." },
        { day: 4, title: "Goa → Bangalore", description: "Leisurely morning, then drive back to Bangalore." },
      ],
      inclusions: STD_INCLUSIONS,
      exclusions: STD_EXCLUSIONS,
      vehicleOptions: ["SUV", "Tempo Traveller", "Mini Bus"],
      pickupLocations: ["Any location in Bangalore"],
      tags: ["Baga Beach", "Fort Aguada", "Basilica of Bom Jesus", "Palolem Beach", "Old Goa churches"],
      faq: [
        { question: "Is this a self-drive package?", answer: "No — a driver is included for the entire trip; you don't need to rent bikes or self-drive cars in Goa." },
      ],
      featured: true,
      popular: true,
      sortOrder: 7,
    },
    {
      title: "Bangalore to Gokarna Tour Package",
      destination: "Gokarna",
      route: "Bangalore → Gokarna",
      state: "KARNATAKA",
      category: ["WEEKEND", "PILGRIMAGE"],
      durationDays: 3,
      durationNights: 2,
      startingPrice: 11000,
      shortDescription:
        "A quieter beach alternative to Goa — the Mahabaleshwar Temple, Om Beach and Kudle Beach, with a laid-back small-town feel.",
      description:
        "Gokarna combines a pilgrimage stop at the Mahabaleshwar Temple with some of Karnataka's most scenic beaches, popular with travellers who want sand and quiet without Goa's crowds.",
      featuredImage: "/images/destinations/gokarna-beach-getaway.webp",
      itinerary: [
        { day: 1, title: "Bangalore → Gokarna", description: "Drive in via Shimoga/Sagara; check in, evening at Gokarna main beach." },
        { day: 2, title: "Temple & beaches", description: "Mahabaleshwar Temple darshan in the morning, then Om Beach, Kudle Beach and Half Moon Beach." },
        { day: 3, title: "Gokarna → Bangalore", description: "Morning at leisure, then drive back to Bangalore." },
      ],
      inclusions: PILGRIM_INCLUSIONS,
      exclusions: STD_EXCLUSIONS,
      vehicleOptions: ["Sedan", "SUV", "Tempo Traveller"],
      pickupLocations: ["Any location in Bangalore"],
      tags: ["Mahabaleshwar Temple", "Om Beach", "Kudle Beach", "Half Moon Beach"],
      faq: [
        { question: "Is Gokarna good for a family trip?", answer: "Yes — the temple and main beach are easy for families; Om Beach and Kudle are better suited to younger travellers who want to trek between coves." },
      ],
      sortOrder: 8,
    },
    {
      title: "Bangalore to Hampi Tour Package",
      destination: "Hampi",
      route: "Bangalore → Hampi",
      state: "KARNATAKA",
      category: ["HERITAGE", "GROUP"],
      durationDays: 2,
      durationNights: 1,
      startingPrice: 8500,
      shortDescription:
        "A UNESCO World Heritage site — the ruins of the Vijayanagara Empire, the Virupaksha Temple and the iconic stone chariot.",
      description:
        "Hampi's boulder-strewn landscape and centuries-old temple ruins make it one of Karnataka's most photographed heritage sites — a compact 2-day trip is enough to see the highlights.",
      featuredImage: "/images/destinations/hampi-heritage-trail.webp",
      itinerary: [
        { day: 1, title: "Bangalore → Hampi", description: "Drive in via Chitradurga; evening at Hemakuta Hill for sunset over the ruins." },
        { day: 2, title: "Hampi ruins & return", description: "Virupaksha Temple, Vittala Temple (stone chariot), Lotus Mahal and Elephant Stables, then drive back to Bangalore." },
      ],
      inclusions: STD_INCLUSIONS,
      exclusions: STD_EXCLUSIONS,
      vehicleOptions: ["Sedan", "SUV", "Tempo Traveller"],
      pickupLocations: ["Any location in Bangalore"],
      tags: ["Virupaksha Temple", "Vittala Temple Stone Chariot", "Lotus Mahal", "Hemakuta Hill sunset"],
      faq: [
        { question: "Can this be done as a 1-day trip?", answer: "It's a long drive (around 6 hours each way), so we recommend at least one overnight stay to see the ruins properly rather than rushing back the same day." },
      ],
      popular: true,
      sortOrder: 9,
    },
    {
      title: "Bangalore to Tirupati Tour Package",
      destination: "Tirupati",
      route: "Bangalore → Tirupati",
      state: "ANDHRA_PRADESH",
      category: ["PILGRIMAGE"],
      durationDays: 2,
      durationNights: 1,
      startingPrice: 6500,
      shortDescription:
        "Darshan at the Tirumala Venkateswara Temple, one of the world's most-visited pilgrimage sites, with a comfortable overnight stay.",
      description:
        "A well-worn pilgrimage route from Bangalore — this package handles the drive up the Tirumala ghat road and back so your family can focus on the darshan and temple town rather than travel logistics.",
      featuredImage: "/images/destinations/tirupati-pilgrimage-tour.webp",
      itinerary: [
        { day: 1, title: "Bangalore → Tirumala", description: "Drive to Tirupati and up the ghat road to Tirumala; check in and rest ahead of darshan." },
        { day: 2, title: "Darshan & return", description: "Sri Venkateswara Temple darshan (timing depends on the token/seva booked), then drive back to Bangalore." },
      ],
      inclusions: PILGRIM_INCLUSIONS,
      exclusions: STD_EXCLUSIONS,
      vehicleOptions: ["Sedan", "SUV", "Tempo Traveller"],
      pickupLocations: ["Any location in Bangalore"],
      tags: ["Tirumala Venkateswara Temple", "Tirupati temple town", "Ghat road drive"],
      faq: [
        { question: "Do you help with darshan tickets?", answer: "We handle travel only — darshan slots/sevas should be booked in advance via the TTD website, and we plan the drive around your booked time." },
      ],
      popular: true,
      sortOrder: 10,
    },
    {
      title: "Bangalore to Sakleshpur Tour Package",
      destination: "Sakleshpur",
      route: "Bangalore → Sakleshpur",
      state: "KARNATAKA",
      category: ["WEEKEND", "ADVENTURE"],
      durationDays: 2,
      durationNights: 1,
      startingPrice: 6000,
      shortDescription:
        "A quick Western Ghats escape — Manjarabad Fort's star-shaped ramparts, coffee estates, and the historic Green Route railway trek trail.",
      description:
        "Sakleshpur is one of the closest genuine hill getaways to Bangalore, popular for a quick weekend of coffee estates and moderate trekking without a long drive.",
      featuredImage: "/images/destinations/sakleshpur-western-ghats-trail.webp",
      itinerary: [
        { day: 1, title: "Bangalore → Sakleshpur", description: "Drive in via Hassan; visit Manjarabad Fort, evening at a coffee estate." },
        { day: 2, title: "Green Route & return", description: "Short trek/walk along the old Green Route railway trail (seasonal, subject to local access), then drive back to Bangalore." },
      ],
      inclusions: STD_INCLUSIONS,
      exclusions: STD_EXCLUSIONS,
      vehicleOptions: ["Sedan", "SUV"],
      pickupLocations: ["Any location in Bangalore"],
      tags: ["Manjarabad Fort", "Green Route railway trail", "Coffee estate stay"],
      faq: [
        { question: "Is the Green Route trek included?", answer: "The drive and drop to the trailhead is included; the trek/trek permit itself is arranged locally and isn't a fixed part of every date." },
      ],
      sortOrder: 11,
    },
    {
      title: "Bangalore to Kodaikanal Tour Package",
      destination: "Kodaikanal",
      route: "Bangalore → Kodaikanal",
      state: "TAMIL_NADU",
      category: ["HONEYMOON", "FAMILY"],
      durationDays: 3,
      durationNights: 2,
      startingPrice: 11500,
      shortDescription:
        "The 'Princess of Hill Stations' — Kodai Lake, Coaker's Walk, Pillar Rocks and Bryant Park, in cool Palani Hills weather.",
      description:
        "Kodaikanal offers a quieter, less commercial alternative to Ooty, with a star-shaped lake at its centre and several short viewpoint walks suited to families and couples alike.",
      featuredImage: "/images/destinations/kodaikanal-hill-escape.webp",
      itinerary: [
        { day: 1, title: "Bangalore → Kodaikanal", description: "Drive in via Dindigul; evening boating at Kodai Lake." },
        { day: 2, title: "Kodaikanal sightseeing", description: "Coaker's Walk, Pillar Rocks, Bryant Park, and Pine Forest." },
        { day: 3, title: "Kodaikanal → Bangalore", description: "Visit Silver Cascade Falls on the way down, then drive back." },
      ],
      inclusions: STD_INCLUSIONS,
      exclusions: STD_EXCLUSIONS,
      vehicleOptions: ["Sedan", "SUV", "Tempo Traveller"],
      pickupLocations: ["Any location in Bangalore"],
      tags: ["Kodai Lake", "Coaker's Walk", "Pillar Rocks", "Silver Cascade Falls"],
      faq: [
        { question: "Is Kodaikanal cold year-round?", answer: "It's cool most of the year and can get quite cold December–February — carry warm layers regardless of season." },
      ],
      sortOrder: 12,
    },
    {
      title: "Bangalore to Pondicherry Tour Package",
      destination: "Pondicherry",
      route: "Bangalore → Pondicherry",
      state: "PUDUCHERRY",
      category: ["WEEKEND", "HONEYMOON"],
      durationDays: 3,
      durationNights: 2,
      startingPrice: 12000,
      shortDescription:
        "The French Quarter's colonial streets, Auroville, Promenade Beach and Paradise Beach — a distinctly different coastal weekend.",
      description:
        "Pondicherry's French colonial heritage and laid-back beach town character make it a popular couples' weekend, easily combined with Auroville's meditation township on the way.",
      featuredImage: "/images/destinations/pondicherry-heritage-beach-tour.webp",
      itinerary: [
        { day: 1, title: "Bangalore → Pondicherry", description: "Drive in via Krishnagiri/Villupuram; evening walk along Promenade Beach and the French Quarter." },
        { day: 2, title: "Auroville & beaches", description: "Auroville and the Matrimandir viewpoint, then Paradise Beach (boat access) in the afternoon." },
        { day: 3, title: "Pondicherry → Bangalore", description: "Morning at leisure in the French Quarter, then drive back to Bangalore." },
      ],
      inclusions: STD_INCLUSIONS,
      exclusions: STD_EXCLUSIONS,
      vehicleOptions: ["Sedan", "SUV", "Tempo Traveller"],
      pickupLocations: ["Any location in Bangalore"],
      tags: ["French Quarter", "Auroville", "Promenade Beach", "Paradise Beach"],
      faq: [
        { question: "Do we need a boat ticket for Paradise Beach?", answer: "Yes, a short boat ride from Chunnambar boat house is the only way in — tickets are bought locally and aren't included in the package price." },
      ],
      sortOrder: 13,
    },
    {
      title: "Bangalore to Kanyakumari & Rameswaram Tour Package",
      seoTitle: "Kanyakumari & Rameswaram Tour — Itinerary & Booking",
      destination: "Kanyakumari & Rameswaram",
      route: "Bangalore → Kanyakumari → Rameswaram",
      state: "TAMIL_NADU",
      category: ["PILGRIMAGE", "GROUP"],
      durationDays: 4,
      durationNights: 3,
      startingPrice: 19500,
      shortDescription:
        "India's southernmost tip and the sacred Ramanathaswamy Temple — the Vivekananda Rock Memorial, Thiruvalluvar Statue and Pamban Bridge in one trip.",
      description:
        "This combines two of South India's most significant pilgrimage and landmark destinations into a single road trip — long drives, but a genuinely once-in-a-while itinerary many families do only once.",
      featuredImage: "/images/destinations/kanyakumari-tour.webp",
      itinerary: [
        { day: 1, title: "Bangalore → Kanyakumari", description: "Long drive south; check in by evening." },
        { day: 2, title: "Kanyakumari sightseeing", description: "Vivekananda Rock Memorial, Thiruvalluvar Statue, and the sunrise/sunset point where three seas meet." },
        { day: 3, title: "Kanyakumari → Rameswaram", description: "Drive to Rameswaram; evening darshan at Ramanathaswamy Temple." },
        { day: 4, title: "Rameswaram → Bangalore", description: "Pamban Bridge and Dhanushkodi ghost town visit, then the drive back to Bangalore (or overnight break en route)." },
      ],
      inclusions: PILGRIM_INCLUSIONS,
      exclusions: STD_EXCLUSIONS,
      vehicleOptions: ["SUV", "Tempo Traveller", "Mini Bus"],
      pickupLocations: ["Any location in Bangalore"],
      tags: ["Vivekananda Rock Memorial", "Ramanathaswamy Temple", "Pamban Bridge", "Dhanushkodi"],
      faq: [
        { question: "Is this a very long drive?", answer: "Yes — Kanyakumari and Rameswaram are both roughly 700+ km from Bangalore, so this is best suited to travellers comfortable with long road-trip days or willing to add an extra night." },
      ],
      featured: true,
      sortOrder: 14,
    },
  ];

  for (const pkg of packages) {
    const baseSlug = slugify(pkg.title.replace(/ Tour Package| Day Tour/g, ""));
    const existing = await prisma.tourPackage.findFirst({
      where: { title: pkg.title },
    });
    if (existing) continue;
    await prisma.tourPackage.create({
      data: {
        title: pkg.title,
        slug: baseSlug,
        origin: "Bangalore",
        destination: pkg.destination,
        route: pkg.route,
        state: pkg.state,
        region: "SOUTH_INDIA",
        category: JSON.stringify(pkg.category),
        durationDays: pkg.durationDays,
        durationNights: pkg.durationNights,
        startingPrice: pkg.startingPrice,
        priceType: "PER_PACKAGE",
        shortDescription: pkg.shortDescription,
        description: pkg.description,
        featuredImage: pkg.featuredImage,
        gallery: JSON.stringify([]),
        itinerary: JSON.stringify(pkg.itinerary),
        inclusions: JSON.stringify(pkg.inclusions),
        exclusions: JSON.stringify(pkg.exclusions),
        vehicleOptions: JSON.stringify(pkg.vehicleOptions),
        pickupLocations: JSON.stringify(pkg.pickupLocations),
        tags: JSON.stringify(pkg.tags),
        faq: JSON.stringify(pkg.faq),
        featured: pkg.featured ?? false,
        popular: pkg.popular ?? false,
        isActive: true,
        sortOrder: pkg.sortOrder,
        seoTitle: pkg.seoTitle ?? `${pkg.title} — Itinerary & Booking`,
        seoDescription: pkg.shortDescription,
        seoKeywords: [
          `${pkg.destination} tour package`,
          `Bangalore to ${pkg.destination} cab`,
          `${pkg.destination} one way taxi`,
          `one way sedan Bangalore to ${pkg.destination}`,
        ].join(", "),
      },
    });
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
