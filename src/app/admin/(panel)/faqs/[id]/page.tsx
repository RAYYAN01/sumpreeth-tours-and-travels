import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageTitle, Panel } from "@/components/admin/ui";
import { deleteFaqAction } from "../actions";
import FaqForm from "../FaqForm";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.faqItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <>
      <PageTitle title="Edit FAQ" />
      <Panel>
        <FaqForm item={item} />
      </Panel>

      <Panel className="mt-6">
        <h2 className="mb-2 font-semibold text-slate-900">Delete</h2>
        <form action={deleteFaqAction}>
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Delete FAQ
          </button>
        </form>
      </Panel>
    </>
  );
}
