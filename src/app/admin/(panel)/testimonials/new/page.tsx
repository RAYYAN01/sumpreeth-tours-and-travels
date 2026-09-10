import { PageTitle, Panel } from "@/components/admin/ui";
import TestimonialForm from "../TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <>
      <PageTitle title="New testimonial" />
      <Panel>
        <TestimonialForm />
      </Panel>
    </>
  );
}
