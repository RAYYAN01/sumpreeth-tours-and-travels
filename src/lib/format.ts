export function rupees(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function perKm(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return `₹${amount}/km`;
}

export function distanceLabel(km: number | null | undefined): string {
  if (km === null || km === undefined) return "";
  return `~${km.toLocaleString("en-IN")} km from Bangalore`;
}

const DATE_FMT = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return DATE_FMT.format(d);
}

const DATE_ONLY_FMT = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" });

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return DATE_ONLY_FMT.format(d);
}
