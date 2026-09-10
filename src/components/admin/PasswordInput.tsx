"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Password field with a show/hide toggle. Drop-in for a plain <input>.
 */
export default function PasswordInput({
  id,
  name,
  label,
  autoComplete = "current-password",
  required,
  autoFocus,
  minLength,
  className = "field-input pr-11",
}: {
  id?: string;
  name: string;
  label: string;
  autoComplete?: string;
  required?: boolean;
  autoFocus?: boolean;
  minLength?: number;
  className?: string;
}) {
  const generated = useId();
  const inputId = id ?? `${name}-${generated}`;
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={inputId} className="field-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          autoFocus={autoFocus}
          minLength={minLength}
          className={className}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          tabIndex={-1}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-ink"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
