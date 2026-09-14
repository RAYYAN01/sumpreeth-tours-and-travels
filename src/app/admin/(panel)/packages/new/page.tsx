import { PageTitle, Panel } from "@/components/admin/ui";
import PackageForm from "../PackageForm";

export default function NewPackagePage() {
  return (
    <>
      <PageTitle title="New tour package" />
      <Panel>
        <PackageForm />
      </Panel>
    </>
  );
}
