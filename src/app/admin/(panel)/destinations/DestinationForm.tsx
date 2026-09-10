"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { Destination } from "@prisma/client";
import { saveDestinationAction } from "./actions";
import {
  DESTINATION_CATEGORY_LABELS,
  DESTINATION_CATEGORY_ORDER,
} from "@/lib/constants";
import {
  emptyResult,
  SubmitButton,
  FormNotice,
  Text,
  Textarea,
  Select,
  Checkbox,
} from "@/components/admin/form";

export default function DestinationForm({ dest }: { dest?: Destination }) {
  const [state, action] = useActionState(saveDestinationAction, emptyResult);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5">
      {dest && <input type="hidden" name="id" value={dest.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Text name="name" label="Name" defaultValue={dest?.name} error={fe.name} required />
        <Select
          name="category"
          label="Category"
          defaultValue={dest?.category ?? DESTINATION_CATEGORY_ORDER[0]}
          error={fe.category}
          options={DESTINATION_CATEGORY_ORDER.map((k) => ({
            value: k,
            label: DESTINATION_CATEGORY_LABELS[k],
          }))}
        />
        <Text name="imageUrl" label="Image URL" defaultValue={dest?.imageUrl} error={fe.imageUrl} required />
        <Text name="distanceKm" label="Distance from Bangalore (km)" type="number" defaultValue={dest?.distanceKm} error={fe.distanceKm} />
      </div>

      <Textarea
        name="description"
        label="Description"
        defaultValue={dest?.description}
        error={fe.description}
        rows={3}
        hint="One or two sentences."
      />

      <div className="flex items-end gap-6">
        <Text name="sortOrder" label="Sort order" type="number" defaultValue={dest?.sortOrder ?? 0} error={fe.sortOrder} />
        <Checkbox name="isActive" label="Active" defaultChecked={dest ? dest.isActive : true} />
      </div>

      <FormNotice result={state} />

      <div className="flex gap-2">
        <SubmitButton>{dest ? "Save destination" : "Create destination"}</SubmitButton>
        <Link
          href="/admin/destinations"
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
