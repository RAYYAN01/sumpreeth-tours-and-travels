/**
 * Google Maps embed for the Contact page. The site uses only strictly
 * necessary / functional storage and shows no consent banner, so the map loads
 * for all visitors; Google may set its own cookies under its own terms (see the
 * Privacy & Cookie Policy).
 */
export default function MapEmbed({ src, title }: { src: string; title: string }) {
  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="h-64 w-full border-0"
    />
  );
}
