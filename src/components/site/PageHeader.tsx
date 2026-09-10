import Image from "next/image";
import Breadcrumbs from "./Breadcrumbs";

export default function PageHeader({
  title,
  intro,
  eyebrow,
  image,
  imageAlt,
  trail,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  /** Optional background photo behind the title (darkened for legibility). */
  image?: string;
  imageAlt?: string;
  /** Breadcrumb trail after Home; renders a nav + BreadcrumbList JSON-LD. */
  trail?: [string, string][];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-900 pt-28 text-white sm:pt-36">
      {image && (
        <Image
          src={image}
          alt={imageAlt ?? ""}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
      )}
      {/* Dark wash so white text stays readable over any photo */}
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 ${
          image
            ? "bg-gradient-to-r from-forest-900/95 via-forest-900/80 to-forest-900/55"
            : "bg-forest-900"
        }`}
      />
      {/* subtle route-line dot motif */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="container-page relative pb-16">
        {trail && (
          <div className="mb-5 [&_a:hover]:text-white [&_a]:text-white/70 [&_[aria-current]]:text-white [&_svg]:text-white/40">
            <Breadcrumbs trail={trail} />
          </div>
        )}
        {eyebrow && (
          <p className="mb-3 text-eyebrow font-bold uppercase text-saffron-300">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-h1 font-extrabold !text-white">{title}</h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-lead text-forest-100/85">{intro}</p>
        )}
      </div>
    </section>
  );
}
