import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site";
import PageHeader from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Privacy & Cookie Policy",
  description:
    "How Sumpreeth Tours and Travels handles the details you share when booking a cab, and the cookies and local storage the website uses.",
};

export const revalidate = 3600;

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const updated = "September 2026";

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy & Cookie Policy"
        intro={`How we handle the details you share with us, and what this website stores on your device. Last updated ${updated}.`}
      />

      <section className="container-page max-w-3xl py-16">
        <div className="space-y-10 text-sm leading-relaxed text-bodytext">
          <div>
            <h2 className="text-lg font-bold text-ink">Who we are</h2>
            <p className="mt-2">
              Sumpreeth Tours and Travels is a Bangalore-based cab and outstation
              travel service. For any question about this policy or your data,
              contact us at{" "}
              <a
                href={`mailto:${settings.email}`}
                className="font-medium text-forest-700 hover:underline dark:text-forest-200"
              >
                {settings.email}
              </a>{" "}
              or{" "}
              <a
                href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                className="font-medium text-forest-700 hover:underline dark:text-forest-200"
              >
                {settings.phone}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink">
              What we collect when you enquire
            </h2>
            <p className="mt-2">
              When you send an enquiry through this website, we collect only what
              you type into the form: your name, phone number, the type of
              service, pickup and drop locations, preferred date and time, and
              any message. We use these details solely to prepare your quote and
              arrange your trip.
            </p>
            <p className="mt-2">
              On submitting the form, your browser also opens WhatsApp with the
              same trip details pre-filled so you can send them to us directly.
              Messages you send on WhatsApp are handled by WhatsApp / Meta under
              their own privacy terms.
            </p>
            <p className="mt-2">
              To keep out spam, our server briefly records the IP address of
              enquiry submissions and limits how many can be sent from one
              address per hour. This is deleted automatically.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink">
              Cookies &amp; local storage
            </h2>
            <p className="mt-2">
              This website does <strong>not</strong> use advertising, analytics
              or third-party tracking cookies. What it does use:
            </p>
            <ul className="mt-3 space-y-2">
              <li className="flex gap-2">
                <span aria-hidden className="text-saffron-600">
                  •
                </span>
                <span>
                  <strong>Theme preference</strong> — a small value stored in
                  your browser&apos;s local storage to remember whether you chose
                  light or dark mode. It never leaves your device.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="text-saffron-600">
                  •
                </span>
                <span>
                  <strong>Staff login session</strong> — a single strictly
                  necessary cookie set only if a staff member signs in to the
                  private admin area. It is not set for ordinary visitors.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="text-saffron-600">
                  •
                </span>
                <span>
                  <strong>Google Maps</strong> — the map on our{" "}
                  <Link
                    href="/contact"
                    className="font-medium text-forest-700 hover:underline dark:text-forest-200"
                  >
                    Contact
                  </Link>{" "}
                  page is embedded from Google, which may set its own cookies
                  when the map loads. See Google&apos;s privacy policy for
                  details.
                </span>
              </li>
            </ul>
            <p className="mt-3">
              Because we only use strictly necessary and preference storage, no
              cookie consent banner is shown. You can clear this site&apos;s
              storage at any time from your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink">
              How long we keep enquiry details
            </h2>
            <p className="mt-2">
              Enquiry records are kept while we arrange and follow up on your
              trip, and for a reasonable period afterwards for our own records.
              You can ask us to delete your details at any time using the contact
              information above.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink">Sharing</h2>
            <p className="mt-2">
              We do not sell your information. Trip details are shared only with
              the driver assigned to your booking. We may disclose information if
              required by law.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink">Your choices</h2>
            <p className="mt-2">
              You can contact us to access, correct or delete the details you
              have shared, or to raise a concern about how they are used.
            </p>
          </div>
        </div>

        <p className="mt-12 text-sm">
          <Link
            href="/contact"
            className="font-semibold text-forest-700 hover:text-ink dark:text-forest-200"
          >
            Back to contact &amp; booking →
          </Link>
        </p>
      </section>
    </>
  );
}
