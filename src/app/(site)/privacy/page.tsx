import Link from "next/link";
import { getSiteSettings } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/site/PageHeader";
import Section from "@/components/site/Section";

export const metadata = pageMeta({
  title: "Privacy & Cookie Policy",
  description:
    "How Sumpreeth Tours and Travels collects, uses and protects the details you share when booking a cab, your rights under India's DPDP Act 2023, and the cookies and local storage this website uses.",
  path: "/privacy",
});

export const revalidate = 86400;

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const updated = "10 September 2026";
  const mail = (
    <a href={`mailto:${settings.email}`}>{settings.email}</a>
  );
  const tel = (
    <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}>{settings.phone}</a>
  );

  return (
    <>
      <PageHeader
        trail={[["Privacy & cookies", "/privacy"]]}
        eyebrow="Legal"
        title="Privacy & Cookie Policy"
        intro={`How we handle the details you share with us, and what this website stores on your device. Last updated ${updated}.`}
      />

      <Section className="prose-legal">
        <h2>1. Who we are</h2>
        <p>
          Sumpreeth Tours and Travels (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a
          Bengaluru-based cab and outstation travel service. For the purposes of
          the Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;)
          we are the <strong>Data Fiduciary</strong> for the personal data
          described below. You can reach us at {mail} or {tel}, or by post at{" "}
          {settings.address}.
        </p>

        <h2>2. What personal data we collect</h2>
        <p>When you send an enquiry through this website, we collect only what you enter into the form:</p>
        <ul>
          <li><span>Your name and phone number.</span></li>
          <li><span>The type of service, pickup and drop locations, and preferred date and time.</span></li>
          <li><span>Any message you choose to add.</span></li>
        </ul>
        <p>
          Our server also records, for a short period, the IP address of enquiry
          submissions and limits how many can be sent from one address per hour.
          This is used solely to prevent spam and abuse and is discarded
          automatically. We use no advertising or cross-site tracking, and we do
          not build profiles of visitors. If — and only if — you allow it in the
          consent banner, we load Google Analytics to see, in aggregate, which
          pages and services people use (see section 4).
        </p>

        <h2>3. Purpose and lawful basis</h2>
        <p>
          We process your enquiry details to prepare your quote, arrange and
          follow up on your trip, and keep basic records of the bookings we
          handle. Our lawful bases under the DPDP Act are your{" "}
          <strong>consent</strong>, given when you submit the enquiry form, and
          the <strong>legitimate uses</strong> of responding to a request you
          have voluntarily made. Anti-spam IP handling relies on our legitimate
          use of keeping the service secure and available.
        </p>

        <h2>4. Cookies and local storage</h2>
        <p>
          By default this website uses only strictly necessary storage. When you
          first visit, a banner lets you accept or reject the optional items. Your
          choice is saved in your browser&apos;s local storage (not a cookie) and
          can be changed at any time from the{" "}
          <button type="button" data-consent-open>Cookie settings</button> link in
          the footer.
        </p>
        <ul>
          <li>
            <span>
              <strong>Strictly necessary</strong> — security and load-balancing
              at our host, and a single sign-in cookie set only if a staff member
              logs in to the private admin area. Not set for ordinary visitors.
            </span>
          </li>
          <li>
            <span>
              <strong>Preferences (optional)</strong> — a small value that
              remembers whether you chose light or dark mode. It never leaves your
              device.
            </span>
          </li>
          <li>
            <span>
              <strong>Google Maps (optional)</strong> — the map on our{" "}
              <Link href="/contact">Contact</Link> page loads from Google only
              after you allow it; Google may then set its own cookies under its
              own privacy terms.
            </span>
          </li>
          <li>
            <span>
              <strong>Analytics (optional)</strong> — if you accept it, Google
              Analytics 4 is loaded with IP anonymisation to measure aggregate
              page and feature usage. It sets its own cookies. It is never loaded
              if you reject non-essential storage, and you can withdraw consent
              any time from{" "}
              <button type="button" data-consent-open>Cookie settings</button>.
            </span>
          </li>
        </ul>

        <h2>5. Who we share it with</h2>
        <p>
          We do not sell your personal data. We share it only as needed to
          provide the service:
        </p>
        <ul>
          <li><span>The driver assigned to your booking, for trip details.</span></li>
          <li>
            <span>
              WhatsApp / Meta, if you use the &ldquo;Book on WhatsApp&rdquo;
              option — your message is then handled under WhatsApp&apos;s own
              terms.
            </span>
          </li>
          <li><span>Google Maps, only if you load the map on the Contact page.</span></li>
          <li><span>Authorities or advisors where we are required to by law.</span></li>
        </ul>
        <p>
          We do not transfer your data outside India except through the
          third-party services named above, which you choose to use.
        </p>

        <h2>6. How long we keep it</h2>
        <p>
          Enquiry records are kept while we arrange and follow up on your trip and
          for a reasonable period afterwards for our own accounting and dispute
          records, after which they are deleted or anonymised. Anti-spam IP data
          is kept for at most a few hours.
        </p>

        <h2>7. Your rights as a Data Principal</h2>
        <p>Under the DPDP Act you may, by contacting us using the details in section 1:</p>
        <ul>
          <li><span>Ask for access to a summary of the personal data we hold about you and how it is processed.</span></li>
          <li><span>Ask us to correct or complete inaccurate or incomplete data.</span></li>
          <li><span>Ask us to erase your data where it is no longer needed.</span></li>
          <li><span>Withdraw a consent you previously gave (this does not affect processing already carried out).</span></li>
          <li><span>Nominate another person to exercise these rights in the event of your death or incapacity.</span></li>
          <li><span>Raise a grievance with us, and if unresolved, complain to the Data Protection Board of India.</span></li>
        </ul>
        <p>
          We aim to respond to any request within 30 days. Please help us verify
          your identity so we do not disclose your data to the wrong person.
        </p>

        <h2>8. Children&apos;s data</h2>
        <p>
          This website and our booking process are intended for adults. We do not
          knowingly collect personal data of anyone under 18 without the consent
          of a parent or lawful guardian. If you believe a child&apos;s data has
          been shared with us, contact us and we will delete it.
        </p>

        <h2>9. How we protect your data</h2>
        <p>
          Access to enquiry records is limited to authorised staff and protected
          by a password-based login. The website is served over HTTPS with modern
          security headers, and submissions are rate-limited and screened for
          spam. No system is perfectly secure, but we take reasonable technical
          and organisational measures to safeguard your information.
        </p>

        <h2>10. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. The &ldquo;last
          updated&rdquo; date at the top of the page shows when it last changed.
        </p>

        <h2>11. Contact and grievance officer</h2>
        <p>
          For any question, request or complaint about your personal data,
          contact our grievance officer at {mail} or {tel}. If you are not
          satisfied with our response, you may escalate to the Data Protection
          Board of India.
        </p>

        <p>
          <Link href="/contact">Back to contact &amp; booking →</Link>
        </p>
      </Section>
    </>
  );
}
