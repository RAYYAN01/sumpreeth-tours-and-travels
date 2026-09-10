import { Phone, MessageCircle } from "lucide-react";
import { telLink } from "@/lib/whatsapp";

export default function CtaBanner({
  text,
  phone,
  whatsappHref,
}: {
  text: string;
  phone: string;
  whatsappHref: string;
}) {
  return (
    <section className="container-page py-16 lg:py-20">
      <div className="reveal card flex flex-col items-center gap-6 bg-gradient-to-br from-forest-700 to-forest-900 p-10 text-center text-white sm:p-14">
        <h2 className="max-w-2xl text-h2 font-bold text-white">{text}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent"
          >
            <MessageCircle className="h-4 w-4" />
            Book on WhatsApp
          </a>
          <a href={telLink(phone)} className="btn-white">
            <Phone className="h-4 w-4" />
            Call {phone}
          </a>
        </div>
      </div>
    </section>
  );
}
