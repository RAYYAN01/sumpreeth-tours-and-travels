import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageTitle, Panel } from "@/components/admin/ui";
import { deleteDestinationAction } from "../actions";
import DestinationForm from "../DestinationForm";

export const dynamic = "force-dynamic";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dest = await prisma.destination.findUnique({ where: { id } });
  if (!dest) notFound();

  return (
    <>
      <PageTitle title={`Edit — ${dest.name}`} />
      <Panel>
        <DestinationForm dest={dest} />
      </Panel>

      <Panel className="mt-6">
        <h2 className="mb-2 font-semibold text-forest-900">Delete</h2>
        <form action={deleteDestinationAction}>
          <input type="hidden" name="id" value={dest.id} />
          <button
            type="submit"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Delete destination
          </button>
        </form>
      </Panel>
    </>
  );
}
