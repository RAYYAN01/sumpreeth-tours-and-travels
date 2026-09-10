import { PageTitle, Panel } from "@/components/admin/ui";
import PasswordForm from "./PasswordForm";
import { currentPasswordSource } from "./actions";

export const dynamic = "force-dynamic";

const SOURCE_TEXT = {
  database: "The admin password is currently set from the Settings screen (stored hashed in the database).",
  environment: "The admin password currently comes from the ADMIN_PASSWORD_HASH environment variable. Changing it here will override that.",
  none: "No admin password is configured yet. Set one now or run the seed script.",
};

export default async function SettingsPage() {
  const source = await currentPasswordSource();

  return (
    <>
      <PageTitle
        title="Settings"
        subtitle="Admin account for the whole office (single shared login)"
      />
      <Panel>
        <h2 className="font-semibold text-slate-900">Change password</h2>
        <p className="mt-1 mb-5 text-sm text-slate-500">{SOURCE_TEXT[source]}</p>
        <PasswordForm />
      </Panel>
    </>
  );
}
