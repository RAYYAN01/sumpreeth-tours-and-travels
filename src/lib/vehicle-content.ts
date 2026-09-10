import type { VehicleView } from "./features";

export type VehicleGuide = {
  tagline: string;
  bestFor: string[];
  highlights: string[];
  goodToKnow: string[];
};

/**
 * Marketing copy for the public vehicle detail page, derived from the vehicle's
 * category and name. Keeps the DB lean while still giving each card a rich page.
 */
export function vehicleGuide(v: VehicleView): VehicleGuide {
  const name = v.name;

  if (v.category === "TEMPO_TRAVELLER") {
    const big = v.seats.startsWith("16");
    return {
      tagline: `Keep the whole group together in one comfortable ${v.seats} coach.`,
      bestFor: [
        "Family functions, temple tours and pilgrimage circuits",
        big ? "Large groups of 12–16 travelling together" : "Groups of 10–12 with luggage",
        "Multi-day outstation trips across Karnataka & South India",
        "Corporate offsites and team outings",
      ],
      highlights: [
        "Individual push-back reclining seats",
        "High roof — stand-up cabin, easy to move around",
        "Large rear luggage boot plus overhead racks",
        "Powerful AC with roof vents for every row",
        "Curtains, music system and charging points",
      ],
      goodToKnow: [
        "Billed per km on round trips, minimum 300 km per day",
        `${v.driverBata != null ? "₹" + v.driverBata : "Driver"} per day driver bata; tolls, parking & permits are extra`,
        "Hill routes (Coorg, Chikmagalur, Ooty) are comfortably covered",
      ],
    };
  }

  if (v.category === "BUS") {
    return {
      tagline: `A ${v.seats} bus for group outings, functions and corporate travel.`,
      bestFor: [
        "Wedding guest transport between venues",
        "Corporate outings, conferences and factory visits",
        "College and school educational tours",
        "Large pilgrimage groups",
      ],
      highlights: [
        "Push-back seats with generous legroom",
        "Full AC and a large luggage bay",
        "Public-address mic and entertainment system",
        "Experienced drivers for long highway runs",
      ],
      goodToKnow: [
        v.roundTripPerKm != null
          ? `Round trips billed at ₹${v.roundTripPerKm}/km, minimum 300 km/day`
          : "Priced per trip — share your route and dates for a quote",
        v.driverBata != null
          ? `₹${v.driverBata} per day driver bata; tolls & parking extra`
          : "Driver bata, tolls & parking are extra",
        "All-India tourist permit vehicles available",
        "Book early for wedding season and long weekends",
      ],
    };
  }

  // CAR
  const sevenSeater = v.seats.startsWith("7") || v.seats.startsWith("6");
  const premium = /crysta/i.test(name);
  const ertiga = /ertiga/i.test(name);

  return {
    tagline: sevenSeater
      ? `A spacious ${v.seats} ${premium ? "premium " : ""}ride for families and small groups.`
      : `A comfortable ${v.seats} sedan for airport runs, city trips and outstation drives.`,
    bestFor: sevenSeater
      ? [
          "Families of 4–7 with luggage",
          "Airport transfers with lots of bags",
          ertiga ? "Budget-friendly group travel" : "Weekend getaways to Coorg, Chikmagalur, Mysore",
          premium ? "Corporate and guest travel where comfort matters" : "Long outstation drives in comfort",
        ]
      : [
          "Solo travellers and couples",
          "Airport pickups and drops, any hour",
          "Local 8hr / 80km city packages",
          "One-way outstation drops on a fixed fare",
        ],
    highlights: [
      "Clean, sanitised cabin with fresh seat covers",
      premium ? "Captain seats and leather upholstery" : "AC with comfortable seating",
      sevenSeater ? "Large boot — fits 4–5 suitcases" : "Boot space for 2–3 large bags",
      "GPS-enabled and tracked for every trip",
      "Verified, background-checked driver who knows the routes",
    ],
    goodToKnow: [
      v.oneWayRate != null
        ? `One-way fixed fare from ${"₹"}${v.oneWayRate.toLocaleString("en-IN")}${v.oneWayNote ? ` ${v.oneWayNote}` : ""}`
        : "Ask us for a one-way fixed fare",
      v.roundTripPerKm != null
        ? `Round trips billed at ${"₹"}${v.roundTripPerKm}/km, minimum 300 km/day`
        : "Round trips billed per km",
      v.driverBata != null
        ? `${"₹"}${v.driverBata} driver bata per day; tolls & parking extra`
        : "Driver bata, tolls & parking are extra",
    ],
  };
}
