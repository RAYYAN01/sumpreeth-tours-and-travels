// SQLite has no enums, so these enum-like columns are plain strings in the DB.
// These union types are the single source of truth for the allowed values.
export type ServiceType =
  | "ONE_WAY"
  | "ROUND_TRIP"
  | "AIRPORT"
  | "LOCAL"
  | "TOUR_PACKAGE";

export type EnquiryStatus = "NEW" | "CONTACTED" | "BOOKED" | "CLOSED";

export type VehicleCategory = "CAR" | "TEMPO_TRAVELLER" | "BUS";

export type DestinationCategory =
  | "HILL_STATION"
  | "HERITAGE"
  | "PILGRIMAGE"
  | "NATURE_FALLS"
  | "MAJOR_CITY"
  | "OUTSTATION_GETAWAY";

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  ONE_WAY: "One Way",
  ROUND_TRIP: "Round Trip",
  AIRPORT: "Airport Cab",
  LOCAL: "Local Cab",
  TOUR_PACKAGE: "Tour Package",
};

export const SERVICE_TYPE_ORDER: ServiceType[] = [
  "ONE_WAY",
  "ROUND_TRIP",
  "AIRPORT",
  "LOCAL",
  "TOUR_PACKAGE",
];

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  BOOKED: "Booked",
  CLOSED: "Closed",
};

export const ENQUIRY_STATUS_ORDER: EnquiryStatus[] = [
  "NEW",
  "CONTACTED",
  "BOOKED",
  "CLOSED",
];

export const VEHICLE_CATEGORY_LABELS: Record<VehicleCategory, string> = {
  CAR: "Cars",
  TEMPO_TRAVELLER: "Tempo Traveller",
  BUS: "Bus / Coach",
};

export const DESTINATION_CATEGORY_LABELS: Record<DestinationCategory, string> = {
  HILL_STATION: "Hill Stations",
  HERITAGE: "Heritage & Culture",
  PILGRIMAGE: "Pilgrimage",
  NATURE_FALLS: "Nature & Falls",
  MAJOR_CITY: "Major Cities",
  OUTSTATION_GETAWAY: "Outstation Getaways",
};

export const DESTINATION_CATEGORY_ORDER: DestinationCategory[] = [
  "HILL_STATION",
  "HERITAGE",
  "PILGRIMAGE",
  "NATURE_FALLS",
  "MAJOR_CITY",
  "OUTSTATION_GETAWAY",
];

// --- Tours & Packages --------------------------------------------------------

export type PackageState =
  | "KARNATAKA"
  | "KERALA"
  | "TAMIL_NADU"
  | "ANDHRA_PRADESH"
  | "TELANGANA"
  | "GOA"
  | "PUDUCHERRY";

export const PACKAGE_STATE_LABELS: Record<PackageState, string> = {
  KARNATAKA: "Karnataka",
  KERALA: "Kerala",
  TAMIL_NADU: "Tamil Nadu",
  ANDHRA_PRADESH: "Andhra Pradesh",
  TELANGANA: "Telangana",
  GOA: "Goa",
  PUDUCHERRY: "Puducherry",
};

export const PACKAGE_STATE_ORDER: PackageState[] = [
  "KARNATAKA",
  "KERALA",
  "TAMIL_NADU",
  "ANDHRA_PRADESH",
  "TELANGANA",
  "GOA",
  "PUDUCHERRY",
];

export type PackageCategory =
  | "FAMILY"
  | "HONEYMOON"
  | "WEEKEND"
  | "ADVENTURE"
  | "PILGRIMAGE"
  | "WILDLIFE"
  | "GROUP"
  | "CORPORATE"
  | "CUSTOM";

export const PACKAGE_CATEGORY_LABELS: Record<PackageCategory, string> = {
  FAMILY: "Family Tours",
  HONEYMOON: "Honeymoon Packages",
  WEEKEND: "Weekend Getaways",
  ADVENTURE: "Adventure Tours",
  PILGRIMAGE: "Pilgrimage Tours",
  WILDLIFE: "Wildlife Tours",
  GROUP: "Group Tours",
  CORPORATE: "Corporate Tours",
  CUSTOM: "Customized Tours",
};

export const PACKAGE_CATEGORY_ORDER: PackageCategory[] = [
  "FAMILY",
  "HONEYMOON",
  "WEEKEND",
  "ADVENTURE",
  "PILGRIMAGE",
  "WILDLIFE",
  "GROUP",
  "CORPORATE",
  "CUSTOM",
];

export type PackagePriceType = "PER_PACKAGE" | "PER_PERSON";

export const PACKAGE_PRICE_TYPE_LABELS: Record<PackagePriceType, string> = {
  PER_PACKAGE: "per package",
  PER_PERSON: "per person",
};

// `__Host-` prefix in production hardens the cookie (requires Secure, no
// Domain, Path=/). Browsers reject that prefix over plain http, so dev keeps
// the bare name.
export const SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-sumpreeth_admin"
    : "sumpreeth_admin";
export const SESSION_MAX_AGE = 60 * 60 * 2; // 2 hours (default)
export const SESSION_MAX_AGE_REMEMBER = 60 * 60 * 24 * 30; // 30 days ("remember me")
/** Slide a normal session's expiry when fewer than this many seconds remain. */
export const SESSION_REFRESH_THRESHOLD = 30 * 60; // 30 minutes
/** Slide a "remember me" session when fewer than this many seconds remain. */
export const SESSION_REFRESH_THRESHOLD_REMEMBER = 60 * 60 * 24 * 7; // 7 days
