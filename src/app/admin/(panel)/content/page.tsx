import { prisma } from "@/lib/db";
import { PageTitle, Panel } from "@/components/admin/ui";
import ContentForm from "./ContentForm";
import { seedSettingsIfMissing } from "./ensure";

export const dynamic = "force-dynamic";

export default async function ContentAdminPage() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  if (!settings) settings = await seedSettingsIfMissing();

  return (
    <>
      <PageTitle
        title="Site content"
        subtitle="Text and details shown across the public website"
      />
      <Panel>
        <ContentForm settings={settings} />
      </Panel>
    </>
  );
}
