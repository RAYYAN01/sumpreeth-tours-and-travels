"use client";

import { Trash2 } from "lucide-react";

/**
 * Submit button for a delete server action, guarded by a native confirm().
 * Render it INSIDE a <form action={deleteAction}> that carries the id.
 * `children` is the visible label (optional — icon only if omitted).
 */
export default function DeleteButton({
  confirmText = "Delete this item? This cannot be undone.",
  ariaLabel = "Delete",
  className = "inline-flex items-center gap-1 rounded-md bg-white px-2 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50",
  children,
}: {
  confirmText?: string;
  ariaLabel?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      aria-label={ariaLabel}
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className={className}
    >
      <Trash2 className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}
