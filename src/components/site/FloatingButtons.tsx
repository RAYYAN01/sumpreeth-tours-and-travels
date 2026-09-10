import { MessageCircle, Phone } from "lucide-react";

type Props = {
  phone: string;
  whatsappHref: string;
};

/**
 * Contact shortcuts. On desktop: two floating action buttons bottom-right.
 * On mobile: a full-width sticky bar (higher tap targets, harder to miss).
 * Both carry `data-track` so analytics can count call / WhatsApp conversions.
 */
export default function FloatingButtons({ phone, whatsappHref }: Props) {
  const tel = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <>
      {/* Desktop — floating circles */}
      <div className="fixed bottom-4 right-4 z-40 hidden flex-col gap-3 md:flex">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          data-track="whatsapp"
          aria-label="Chat with us on WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card-hover transition-transform hover:scale-105 motion-reduce:transition-none"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
        <a
          href={tel}
          data-track="call"
          aria-label={`Call ${phone}`}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-600 text-white shadow-card-hover transition-transform hover:scale-105 motion-reduce:transition-none"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>

      {/* Mobile — sticky bottom bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-surface/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a
          href={tel}
          data-track="call"
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-forest-700 dark:text-forest-200"
        >
          <Phone className="h-4 w-4" />
          Call now
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          data-track="whatsapp"
          className="flex flex-1 items-center justify-center gap-2 bg-[#25D366] py-3.5 text-sm font-semibold text-white"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </>
  );
}
