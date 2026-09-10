import { describe, it, expect } from "vitest";
import {
  enquiryInputSchema,
  vehicleSchema,
  parseFeatures,
} from "@/lib/validation";
import { rupees, perKm, distanceLabel } from "@/lib/format";

describe("enquiryInputSchema", () => {
  const base = {
    name: "Anita R",
    phone: "+91 94486 48898",
    serviceType: "ONE_WAY",
    pickupLocation: "Jayanagar",
  };

  it("accepts a minimal valid enquiry", () => {
    const parsed = enquiryInputSchema.safeParse(base);
    expect(parsed.success).toBe(true);
  });

  it("rejects a short name", () => {
    const parsed = enquiryInputSchema.safeParse({ ...base, name: "A" });
    expect(parsed.success).toBe(false);
  });

  it("rejects an invalid service type", () => {
    const parsed = enquiryInputSchema.safeParse({
      ...base,
      serviceType: "SPACESHIP",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects letters in the phone number", () => {
    const parsed = enquiryInputSchema.safeParse({ ...base, phone: "call me" });
    expect(parsed.success).toBe(false);
  });
});

describe("vehicleSchema", () => {
  it("coerces blank rate fields to null", () => {
    const parsed = vehicleSchema.safeParse({
      name: "Toyota Etios",
      category: "CAR",
      seats: "4+1",
      features: "AC\nGPS",
      imageUrl: "https://example.com/a.jpg",
      sortOrder: "1",
      isActive: "true",
      oneWayRate: "1200",
      roundTripPerKm: "",
      minKmPerDay: "",
      driverBata: "",
      localPackageRate: "",
      localExtraPerKm: "",
      localExtraPerHr: "",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.oneWayRate).toBe(1200);
      expect(parsed.data.roundTripPerKm).toBeNull();
    }
  });

  const baseVehicle = {
    name: "Toyota Etios",
    category: "CAR",
    seats: "4+1",
    features: "AC",
    sortOrder: "1",
    isActive: "true",
    oneWayRate: "",
    roundTripPerKm: "",
    minKmPerDay: "",
    driverBata: "",
    localPackageRate: "",
    localExtraPerKm: "",
    localExtraPerHr: "",
  };

  it("accepts a site-relative image path", () => {
    const parsed = vehicleSchema.safeParse({
      ...baseVehicle,
      imageUrl: "/images/fleet/IMG-20260901-WA0040.jpg",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects a non-image, non-URL image reference", () => {
    const parsed = vehicleSchema.safeParse({
      ...baseVehicle,
      imageUrl: "not-a-path",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("parseFeatures", () => {
  it("splits on newlines and commas and trims", () => {
    expect(parseFeatures("AC, GPS\n  Luggage space \n\n")).toEqual([
      "AC",
      "GPS",
      "Luggage space",
    ]);
  });
});

describe("format helpers", () => {
  it("formats rupees with Indian grouping", () => {
    expect(rupees(250000)).toBe("₹2,50,000");
    expect(rupees(null)).toBe("—");
  });
  it("formats per-km", () => {
    expect(perKm(17)).toBe("₹17/km");
  });
  it("formats distance", () => {
    expect(distanceLabel(260)).toBe("~260 km from Bangalore");
    expect(distanceLabel(null)).toBe("");
  });
});
