"use client";

import { useMemo, useState } from "react";
import {
  SERVICE_TYPE_LABELS,
  SERVICE_TYPE_ORDER,
  type ServiceType,
} from "@/lib/constants";
import { buildWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";

type Variant = "widget" | "page";

type Props = {
  variant: Variant;
  whatsappNumber: string;
  sourcePage: string;
  defaultServiceType?: ServiceType;
  defaultDrop?: string;
  defaultMessage?: string;
};

type FieldErrors = Partial<Record<string, string[]>>;

const DROP_HIDDEN_FOR: ServiceType[] = ["LOCAL"];

export default function EnquiryForm({
  variant,
  whatsappNumber,
  sourcePage,
  defaultServiceType = "ONE_WAY",
  defaultDrop = "",
  defaultMessage = "",
}: Props) {
  const [serviceType, setServiceType] = useState<ServiceType>(defaultServiceType);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupLocation, setPickup] = useState("");
  const [dropLocation, setDrop] = useState(defaultDrop);
  const [pickupAt, setPickupAt] = useState("");
  const [message, setMessage] = useState(defaultMessage);
  const [company, setCompany] = useState(""); // honeypot

  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">(
    "idle",
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<string | null>(null);

  const dropVisible = !DROP_HIDDEN_FOR.includes(serviceType);

  // Earliest bookable time = now (local), so the picker can't offer past slots.
  const minDateTime = useMemo(
    () =>
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16),
    [],
  );

  const focusFirstError = (e: FieldErrors) => {
    const order = [
      "name",
      "phone",
      "pickupLocation",
      "dropLocation",
      "pickupAt",
      "message",
    ];
    const first = order.find((k) => e[k]?.length);
    if (first) document.getElementById(first)?.focus();
  };

  const clientValidate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (name.trim().length < 2) e.name = ["Please enter your name"];
    if (!/^[\d+\-\s()]{7,20}$/.test(phone.trim()))
      e.phone = ["Enter a valid phone number"];
    if (pickupLocation.trim().length < 2)
      e.pickupLocation = ["Enter a pickup location"];
    return e;
  };

  const payload = useMemo(
    () => ({
      name: name.trim(),
      phone: phone.trim(),
      serviceType,
      pickupLocation: pickupLocation.trim(),
      dropLocation: dropVisible ? dropLocation.trim() : "",
      pickupAt: pickupAt.trim(),
      message: message.trim(),
      sourcePage,
      company,
    }),
    [
      name,
      phone,
      serviceType,
      pickupLocation,
      dropVisible,
      dropLocation,
      pickupAt,
      message,
      sourcePage,
      company,
    ],
  );

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    setNotice(null);
    const localErrors = clientValidate();
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      focusFirstError(localErrors);
      return;
    }
    setErrors({});
    setStatus("submitting");

    const wa = whatsappLink(whatsappNumber, buildWhatsAppMessage(payload));

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 422 && data.fieldErrors) {
        setErrors(data.fieldErrors as FieldErrors);
        focusFirstError(data.fieldErrors as FieldErrors);
        setStatus("error");
        return;
      }

      if (!res.ok) {
        // Saving failed — still let the customer reach us on WhatsApp.
        setStatus("done");
        setNotice(
          "We could not log your enquiry just now, but WhatsApp is opening so you can message us directly.",
        );
      } else {
        setStatus("done");
        setNotice("Thanks! Opening WhatsApp with your trip details…");
      }
    } catch {
      setStatus("done");
      setNotice(
        "Network issue on our side — WhatsApp is opening so you can still message us.",
      );
    }

    window.open(wa, "_blank", "noopener,noreferrer");
  }

  const err = (k: string) => errors[k]?.[0];

  return (
    <form
      onSubmit={handleSubmit}
      className={
        variant === "widget"
          ? "rounded-2xl bg-surface/95 p-4 shadow-card ring-1 ring-black/5 backdrop-blur sm:p-6"
          : "card p-6 sm:p-8"
      }
      noValidate
    >
      {variant === "widget" && (
        <h2 className="mb-4 text-lg font-semibold text-ink">
          Quick enquiry
        </h2>
      )}

      {/* Service type — tabs for the widget, select for the page form */}
      {variant === "widget" ? (
        <div
          className="mb-4 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Service type"
        >
          {SERVICE_TYPE_ORDER.map((st) => (
            <button
              key={st}
              type="button"
              role="tab"
              aria-selected={serviceType === st}
              onClick={() => setServiceType(st)}
              className={`rounded-full px-4 py-2.5 text-xs font-semibold transition-colors ${
                serviceType === st
                  ? "bg-forest-600 text-white"
                  : "bg-forest-50 dark:bg-white/[0.04] text-bodytext hover:bg-forest-100 dark:hover:bg-white/[0.08]"
              }`}
            >
              {SERVICE_TYPE_LABELS[st]}
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-4">
          <label htmlFor="serviceType" className="field-label">
            Service type
          </label>
          <select
            id="serviceType"
            className="field-input"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as ServiceType)}
          >
            {SERVICE_TYPE_ORDER.map((st) => (
              <option key={st} value={st}>
                {SERVICE_TYPE_LABELS[st]}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">
            Name <span aria-hidden className="text-red-600">*</span>
          </label>
          <input
            id="name"
            className="field-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={!!err("name")}
          />
          {err("name") && <p className="field-error">{err("name")}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="field-label">
            Phone <span aria-hidden className="text-red-600">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            className="field-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            autoComplete="tel"
            required
            aria-required="true"
            aria-invalid={!!err("phone")}
          />
          {err("phone") && <p className="field-error">{err("phone")}</p>}
        </div>
        <div>
          <label htmlFor="pickupLocation" className="field-label">
            Pickup location <span aria-hidden className="text-red-600">*</span>
          </label>
          <input
            id="pickupLocation"
            className="field-input"
            value={pickupLocation}
            onChange={(e) => setPickup(e.target.value)}
            autoComplete="address-level2"
            required
            aria-required="true"
            aria-invalid={!!err("pickupLocation")}
          />
          {err("pickupLocation") && (
            <p className="field-error">{err("pickupLocation")}</p>
          )}
        </div>
        {dropVisible && (
          <div>
            <label htmlFor="dropLocation" className="field-label">
              Drop location
            </label>
            <input
              id="dropLocation"
              className="field-input"
              value={dropLocation}
              onChange={(e) => setDrop(e.target.value)}
            />
          </div>
        )}
        <div>
          <label htmlFor="pickupAt" className="field-label">
            Pickup date &amp; time
          </label>
          <input
            id="pickupAt"
            type="datetime-local"
            className="field-input"
            min={minDateTime}
            value={pickupAt}
            onChange={(e) => setPickupAt(e.target.value)}
          />
        </div>
        <div className={dropVisible ? "sm:col-span-2" : ""}>
          <label htmlFor="message" className="field-label">
            Message <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="message"
            rows={variant === "widget" ? 2 : 4}
            className="field-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      {/* Honeypot — hidden from real users */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px]">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="btn-accent mt-5 w-full"
        disabled={status === "submitting"}
      >
        {status === "submitting"
          ? "Sending…"
          : status === "done"
            ? "Reopen WhatsApp"
            : "Book Now on WhatsApp"}
      </button>

      {notice && (
        <p
          className="mt-3 rounded-lg bg-forest-50 dark:bg-white/[0.04] px-3 py-2 text-sm text-ink"
          role="status"
        >
          {notice}
        </p>
      )}
      <p className="mt-3 text-center text-xs text-forest-500 dark:text-forest-400">
        We reply 24/7. No spam — your details are only used for this booking.
      </p>
    </form>
  );
}
