"use client";

import { useActionState } from "react";
import { changePasswordAction } from "./actions";
import {
  emptyResult,
  SubmitButton,
  FormNotice,
  Text,
} from "@/components/admin/form";

export default function PasswordForm() {
  const [state, action] = useActionState(changePasswordAction, emptyResult);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="max-w-md space-y-4">
      <Text
        name="currentPassword"
        label="Current password"
        type="password"
        error={fe.currentPassword}
        required
      />
      <Text
        name="newPassword"
        label="New password"
        type="password"
        error={fe.newPassword}
        hint="At least 8 characters."
        required
      />
      <Text
        name="confirmPassword"
        label="Confirm new password"
        type="password"
        error={fe.confirmPassword}
        required
      />
      <FormNotice result={state} />
      <SubmitButton>Update password</SubmitButton>
    </form>
  );
}
