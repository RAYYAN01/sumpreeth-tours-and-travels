import { PageTitle, Panel } from "@/components/admin/ui";
import FaqForm from "../FaqForm";

export default function NewFaqPage() {
  return (
    <>
      <PageTitle title="New FAQ" />
      <Panel>
        <FaqForm />
      </Panel>
    </>
  );
}
