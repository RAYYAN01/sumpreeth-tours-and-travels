import Link from "next/link";
import { getSiteSettings } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/site/PageHeader";
import Section from "@/components/site/Section";

export const metadata = pageMeta({
  title: "Terms of Service",
  description:
    "Booking, pricing, cancellation and liability terms for cab and outstation travel arranged through Sumpreeth Tours and Travels.",
  path: "/terms",
});

export const revalidate = 86400;

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const updated = "10 September 2026";

  return (
    <>
      <PageHeader
        trail={[["Terms of service", "/terms"]]}
        eyebrow="Legal"
        title="Terms of Service"
        intro={`The terms on which we arrange your trip. Last updated ${updated}.`}
      />

      <Section className="prose-legal">
        <h2>1. Bookings</h2>
        <p>
          An enquiry through this website or on WhatsApp is a request, not a
          confirmed booking. Your trip is confirmed only when we acknowledge it
          with a driver and vehicle assignment. Please share accurate pickup and
          drop details; changes may affect availability and price.
        </p>

        <h2>2. Pricing</h2>
        <p>
          Rates shown on the site are indicative and current at the time of
          publishing. The fare confirmed for your booking is the one that
          applies. Unless stated otherwise, tolls, parking, inter-state permits,
          state entry taxes and applicable GST are charged at actuals in addition
          to the fare. Outstation trips are subject to a minimum running per day
          and a driver allowance (bata) as quoted.
        </p>

        <h2>3. Payment</h2>
        <p>
          Payment terms are as agreed at the time of confirmation. A GST invoice
          is available on request.
        </p>

        <h2>4. Cancellation and changes</h2>
        <p>
          Tell us as early as possible if you need to cancel or change a
          confirmed trip. Cancellations made close to the pickup time, or
          no-shows, may attract a charge to cover the driver and vehicle already
          committed. Waiting beyond the agreed free waiting time may be charged.
        </p>

        <h2>5. Your responsibilities</h2>
        <ul>
          <li><span>Carry valid ID as required for inter-state travel and certain destinations.</span></li>
          <li><span>Do not ask the driver to exceed lawful speed, seating or load limits.</span></li>
          <li><span>Smoking, alcohol consumption and any illegal activity in the vehicle are not permitted.</span></li>
          <li><span>You are responsible for the cost of any damage to the vehicle caused by you or your party beyond normal use.</span></li>
        </ul>

        <h2>6. Our responsibilities and liability</h2>
        <p>
          We will take reasonable care to provide a clean, roadworthy vehicle and
          a vetted driver, and to run trips to the agreed schedule. We are not
          liable for delays or losses caused by events beyond our reasonable
          control — traffic, weather, road closures, breakdowns, strikes or acts
          of authorities. Where a vehicle becomes unavailable we will try to
          provide a suitable replacement. Our total liability for any claim
          arising from a booking is limited to the fare paid for that booking.
          Nothing in these terms limits liability that cannot be limited under
          law.
        </p>

        <h2>7. Lost property</h2>
        <p>
          Tell us promptly if you leave belongings in a vehicle. We will help
          recover them but cannot guarantee return and are not responsible for
          items left behind.
        </p>

        <h2>8. Privacy</h2>
        <p>
          We handle your personal data as described in our{" "}
          <Link href="/privacy">Privacy &amp; Cookie Policy</Link>.
        </p>

        <h2>9. Governing law</h2>
        <p>
          These terms are governed by the laws of India, and the courts at
          Bengaluru, Karnataka have jurisdiction over any dispute.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions about these terms? Contact us at{" "}
          <a href={`mailto:${settings.email}`}>{settings.email}</a> or{" "}
          <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}>
            {settings.phone}
          </a>
          .
        </p>

        <p>
          <Link href="/contact">Back to contact &amp; booking →</Link>
        </p>
      </Section>
    </>
  );
}
