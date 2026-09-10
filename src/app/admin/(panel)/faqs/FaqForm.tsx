"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { FaqItem } from "@prisma/client";
import { saveFaqAction } from "./actions";
import {
  emptyResult,
  SubmitButton,
  FormNotice,
  Text,
  Textarea,
  Checkbox,
} from "@/components/admin/form";

export default function FaqForm({ item }: { item?: FaqItem }) {
  const [state, action] = useActionState(saveFaqAction, emptyResult);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5">
      {item && <input type="hidden" name="id" value={item.id} />}

      <Text name="question" label="Question" defaultValue={item?.question} error={fe.question} required />
      <Textarea name="answer" label="Answer" defaultValue={item?.answer} error={fe.answer} rows={4} />

      <div className="flex items-end gap-6">
        <Text name="sortOrder" label="Sort order" type="number" defaultValue={item?.sortOrder ?? 0} error={fe.sortOrder} />
        <Checkbox name="isActive" label="Active" defaultChecked={item ? item.isActive : true} />
      </div>

      <FormNotice result={state} />

      <div className="flex gap-2">
        <SubmitButton>{item ? "Save FAQ" : "Create FAQ"}</SubmitButton>
        <Link
          href="/admin/faqs"
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
