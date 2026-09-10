import { MessageCircle, Phone } from "lucide-react";

type Props = {
  phone: string;
  whatsappHref: string;
};

export default function FloatingButtons({ phone, whatsappHref }: Props) {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card-hover transition-transform hover:scale-105"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
      <a
        href={`tel:${phone.replace(/[^\d+]/g, "")}`}
        aria-label={`Call ${phone}`}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-600 text-white shadow-card-hover transition-transform hover:scale-105"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
