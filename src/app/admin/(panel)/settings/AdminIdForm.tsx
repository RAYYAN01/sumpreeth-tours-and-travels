"use client";

import { useActionState } from "react";
import { changeAdminIdAction } from "./actions";
import { emptyResult, SubmitButton, FormNotice, Text } from "@/components/admin/form";

export default function AdminIdForm({ current }: { current: string }) {
  const [state, action] = useActionState(changeAdminIdAction, emptyResult);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="max-w-md space-y-4">
      <Text
        name="adminId"
        label="Login ID"
        defaultValue={current}
        error={fe.adminId}
        hint="Used together with the password on the sign-in screen."
        required
      />
      <FormNotice result={state} />
      <SubmitButton>Update ID</SubmitButton>
    </form>
  );
}
