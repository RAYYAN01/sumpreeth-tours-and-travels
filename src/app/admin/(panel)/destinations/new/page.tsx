import { PageTitle, Panel } from "@/components/admin/ui";
import DestinationForm from "../DestinationForm";

export default function NewDestinationPage() {
  return (
    <>
      <PageTitle title="New destination" />
      <Panel>
        <DestinationForm />
      </Panel>
    </>
  );
}
