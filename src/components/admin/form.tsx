"use client";

import { useFormStatus } from "react-dom";

export type ActionResult = {
  ok?: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const emptyResult: ActionResult = {};

export function SubmitButton({
  children = "Save",
  variant = "primary",
}: {
  children?: React.ReactNode;
  variant?: "primary" | "danger" | "ghost";
}) {
  const { pending } = useFormStatus();
  const cls =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : variant === "ghost"
        ? "bg-forest-50 hover:bg-forest-100 text-forest-800 ring-1 ring-forest-200"
        : "bg-forest-600 hover:bg-forest-700 text-white shadow-sm";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${cls}`}
    >
      {pending ? "Working…" : children}
    </button>
  );
}

function FieldShell({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string[];
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-forest-800">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-forest-700/60">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error[0]}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm text-forest-900 outline-none transition focus:border-forest-500 focus:ring-2 focus:ring-forest-200";

export function Text({
  name,
  label,
  defaultValue,
  error,
  hint,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  error?: string[];
  hint?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <FieldShell label={label} htmlFor={name} error={error} hint={hint}>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className={inputCls}
      />
    </FieldShell>
  );
}

export function Textarea({
  name,
  label,
  defaultValue,
  error,
  hint,
  rows = 4,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  error?: string[];
  hint?: string;
  rows?: number;
}) {
  return (
    <FieldShell label={label} htmlFor={name} error={error} hint={hint}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        className={inputCls}
      />
    </FieldShell>
  );
}

export function Select({
  name,
  label,
  options,
  defaultValue,
  error,
  hint,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  error?: string[];
  hint?: string;
}) {
  return (
    <FieldShell label={label} htmlFor={name} error={error} hint={hint}>
      <select id={name} name={name} defaultValue={defaultValue} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-forest-800">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-forest-300 accent-forest-600 focus:ring-forest-500"
      />
      {label}
    </label>
  );
}

export function FormNotice({ result }: { result: ActionResult }) {
  if (result.error) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {result.error}
      </p>
    );
  }
  if (result.ok && result.message) {
    return (
      <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
        {result.message}
      </p>
    );
  }
  return null;
}
