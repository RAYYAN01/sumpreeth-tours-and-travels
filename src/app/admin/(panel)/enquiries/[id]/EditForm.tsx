"use client";

import { useActionState } from "react";
import { updateEnquiryAction } from "../actions";
import {
  emptyResult,
  SubmitButton,
  FormNotice,
  Select,
  Textarea,
} from "@/components/admin/form";
import {
  ENQUIRY_STATUS_LABELS,
  ENQUIRY_STATUS_ORDER,
  type EnquiryStatus,
} from "@/lib/constants";

export default function EditForm({
  id,
  status,
  adminNotes,
}: {
  id: string;
  status: EnquiryStatus;
  adminNotes: string | null;
}) {
  const [state, action] = useActionState(updateEnquiryAction, emptyResult);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <Select
        name="status"
        label="Status"
        defaultValue={status}
        options={ENQUIRY_STATUS_ORDER.map((s) => ({
          value: s,
          label: ENQUIRY_STATUS_LABELS[s],
        }))}
      />
      <Textarea
        name="adminNotes"
        label="Internal notes"
        defaultValue={adminNotes}
        rows={5}
        hint="Only visible to staff."
      />
      <FormNotice result={state} />
      <SubmitButton>Save changes</SubmitButton>
    </form>
  );
}
