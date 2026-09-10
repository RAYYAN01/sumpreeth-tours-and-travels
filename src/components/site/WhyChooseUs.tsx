import {
  ShieldCheck,
  Navigation,
  BadgeIndianRupee,
  Leaf,
  SprayCan,
  Headset,
  CarFront,
} from "lucide-react";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "Drivers we actually vet",
    body: "Address verification, a medical check-up, a driving-skill test and behavioural training before anyone gets behind the wheel.",
  },
  {
    icon: Navigation,
    title: "Every trip is tracked",
    body: "GPS on every cab and tempo traveller — you and your family can follow the route end to end.",
  },
  {
    icon: BadgeIndianRupee,
    title: "The quote is the fare",
    body: "Per-km and package rates fixed up front. No surge, no “extra” at the end, GST invoice on request.",
  },
  {
    icon: SprayCan,
    title: "Cleaned between every trip",
    body: "Cabins wiped down and sanitised before each booking, not once a week.",
  },
  {
    icon: Leaf,
    title: "Greener where we can",
    body: "Green-fuel vehicles on the routes that support them, to keep trip emissions down.",
  },
  {
    icon: Headset,
    title: "A person answers, 24/7",
    body: "Call or WhatsApp at 2 pm or 2 am — someone picks up and sorts it.",
  },
  {
    icon: CarFront,
    title: "Right-sized for the group",
    body: "Sedan for two, Innova for the family, 12–16 seater or a bus when the whole office travels.",
  },
];

export default function WhyChooseUs({
  years,
  trips,
}: {
  years: string;
  trips: string;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[4fr_7fr] lg:gap-16">
      <div className="reveal lg:sticky lg:top-28 lg:self-start">
        <p className="eyebrow">Why choose us</p>
        <h2 className="mt-3 text-h2 font-bold">
          Safety-first travel, every single trip
        </h2>
        <p className="mt-4 max-w-md text-bodytext">
          We are a small Bangalore operator, not an app. That means the same
          checks on every driver, the same fare you were quoted, and a phone
          number that a human answers.
        </p>
        <p className="mt-6 text-sm font-semibold text-ink">
          {years} years on the road · {trips} trips completed
        </p>
      </div>

      <ul className="reveal-stagger divide-y divide-line">
        {POINTS.map(({ icon: Icon, title, body }, i) => (
          <li
            key={title}
            className={`reveal flex gap-4 py-4 ${
              i === 0 ? "rounded-xl bg-forest-50 dark:bg-white/[0.04] px-4" : "px-1"
            }`}
          >
            <Icon
              className="mt-0.5 h-5 w-5 shrink-0 text-forest-600 dark:text-forest-300"
              strokeWidth={1.75}
            />
            <p className="text-[15px] leading-relaxed text-ink">
              <span className="font-bold text-ink">{title}.</span> {body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
