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

// `__Host-` prefix in production hardens the cookie (requires Secure, no
// Domain, Path=/). Browsers reject that prefix over plain http, so dev keeps
// the bare name.
export const SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-sumpreeth_admin"
    : "sumpreeth_admin";
export const SESSION_MAX_AGE = 60 * 60 * 2; // 2 hours
/** Slide the expiry when fewer than this many seconds remain. */
export const SESSION_REFRESH_THRESHOLD = 30 * 60; // 30 minutes
