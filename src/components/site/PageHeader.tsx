import Image from "next/image";

export default function PageHeader({
  title,
  intro,
  eyebrow,
  image,
  imageAlt,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  /** Optional background photo behind the title (darkened for legibility). */
  image?: string;
  imageAlt?: string;
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
      <div className="container-page relative pb-14">
        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-saffron-300">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-3xl font-extrabold !text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-base text-forest-100/85 sm:text-lg">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
