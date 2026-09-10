"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction, type LoginState } from "./actions";

const initial: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const from = useSearchParams().get("from") ?? "/admin";

  return (
    <form
      action={formAction}
      className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg ring-1 ring-black/5"
    >
      <h1 className="text-xl font-bold text-slate-900">Staff login</h1>
      <p className="mt-1 text-sm text-slate-500">
        Sumpreeth Tours and Travels admin
      </p>

      <input type="hidden" name="from" value={from} />

      <label
        htmlFor="password"
        className="mt-6 block text-sm font-medium text-slate-700"
      >
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-200"
      />

      {state.error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-lg bg-forest-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-700 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
