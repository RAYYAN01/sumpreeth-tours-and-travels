import { PageTitle, Panel } from "@/components/admin/ui";
import VehicleForm from "../VehicleForm";

export default function NewVehiclePage() {
  return (
    <>
      <PageTitle title="New vehicle" />
      <Panel>
        <VehicleForm />
      </Panel>
    </>
  );
}
