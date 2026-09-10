import { ChevronDown } from "lucide-react";

type Item = { id: string; question: string; answer: string };

export default function FaqAccordion({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <div className="divide-y divide-line rounded-2xl bg-surface ring-1 ring-black/5">
      {items.map((f) => (
        <details key={f.id} className="group px-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {f.question}
            <ChevronDown className="h-5 w-5 shrink-0 text-forest-500 dark:text-forest-400 transition-transform group-open:rotate-180" />
          </summary>
          <p className="pb-4 text-sm text-bodytext">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
