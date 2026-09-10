"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import PasswordInput from "@/components/admin/PasswordInput";
import {
  loginAction,
  requestResetAction,
  resetPasswordAction,
  type LoginState,
  type ResetRequestState,
  type ResetState,
} from "./actions";

type Mode = "login" | "request" | "reset";

export default function LoginForm() {
  const from = useSearchParams().get("from") ?? "/admin";
  const [mode, setMode] = useState<Mode>("login");
  const [resetOk, setResetOk] = useState(false);

  const [loginState, loginSubmit, loginPending] = useActionState<
    LoginState,
    FormData
  >(loginAction, {});
  const [reqState, reqSubmit, reqPending] = useActionState<
    ResetRequestState,
    FormData
  >(requestResetAction, {});
  const [resState, resSubmit, resPending] = useActionState<ResetState, FormData>(
    resetPasswordAction,
    {},
  );

  useEffect(() => {
    if (reqState.sent) setMode("reset");
  }, [reqState.sent]);
  useEffect(() => {
    if (resState.done) {
      setResetOk(true);
      setMode("login");
    }
  }, [resState.done]);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="inline-flex rounded-xl bg-white p-2 shadow-sm ring-1 ring-black/5">
          <Image
            src="/logo.png"
            alt=""
            width={512}
            height={512}
            priority
            className="h-12 w-auto"
          />
        </span>
        <h1 className="mt-4 text-h3 font-bold text-ink">Admin portal</h1>
        <p className="mt-1 text-sm text-muted">Sumpreeth Tours and Travels</p>
      </div>

      <div className="card p-6 sm:p-8">
        {resetOk && mode === "login" && (
          <p className="mb-4 flex items-center gap-2 rounded-xl bg-forest-50 px-3 py-2 text-sm text-forest-800 dark:bg-forest-900/40 dark:text-forest-100">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Password updated. Sign in with your new password.
          </p>
        )}

        {/* ---------------- Sign in ---------------- */}
        {mode === "login" && (
          <form action={loginSubmit} className="space-y-4">
            <input type="hidden" name="from" value={from} />
            <div>
              <label htmlFor="id" className="field-label">
                ID
              </label>
              <input
                id="id"
                name="id"
                autoComplete="username"
                autoFocus
                required
                className="field-input"
              />
            </div>
            <PasswordInput
              id="password"
              name="password"
              label="Password"
              autoComplete="current-password"
              required
            />
            <label className="flex items-center gap-2 text-sm text-bodytext">
              <input
                type="checkbox"
                name="remember"
                value="1"
                className="h-4 w-4 accent-forest-600"
              />
              Remember me on this device
            </label>

            {loginState.error && (
              <p className="field-error" role="alert">
                {loginState.error}
              </p>
            )}

            <button
              type="submit"
              disabled={loginPending}
              className="btn-primary w-full"
            >
              {loginPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {loginPending ? "Signing in…" : "Sign in"}
            </button>

            <button
              type="button"
              onClick={() => setMode("request")}
              className="block w-full text-center text-sm font-medium text-forest-700 hover:underline dark:text-forest-200"
            >
              Forgot password?
            </button>
          </form>
        )}

        {/* ---------------- Request a code ---------------- */}
        {mode === "request" && (
          <form action={reqSubmit} className="space-y-4">
            <p className="text-sm text-bodytext">
              We&apos;ll email a 6-digit one-time code to the admin email on
              file. It expires in 10 minutes.
            </p>
            {reqState.error && (
              <p className="field-error" role="alert">
                {reqState.error}
              </p>
            )}
            <button
              type="submit"
              disabled={reqPending}
              className="btn-primary w-full"
            >
              {reqPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {reqPending ? "Sending…" : "Send code"}
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className="block w-full text-center text-sm font-medium text-forest-700 hover:underline dark:text-forest-200"
            >
              Back to sign in
            </button>
          </form>
        )}

        {/* ---------------- Enter code + new password ---------------- */}
        {mode === "reset" && (
          <form action={resSubmit} className="space-y-4">
            <p className="text-sm text-bodytext">
              Enter the code we emailed and choose a new password.
            </p>
            <div>
              <label htmlFor="code" className="field-label">
                6-digit code
              </label>
              <input
                id="code"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                maxLength={6}
                required
                autoFocus
                className="field-input tracking-[0.4em]"
              />
            </div>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              label="New password"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm new password"
              autoComplete="new-password"
              minLength={8}
              required
            />
            {resState.error && (
              <p className="field-error" role="alert">
                {resState.error}
              </p>
            )}
            <button
              type="submit"
              disabled={resPending}
              className="btn-primary w-full"
            >
              {resPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {resPending ? "Updating…" : "Set new password"}
            </button>
            <button
              type="button"
              onClick={() => setMode("request")}
              className="block w-full text-center text-sm font-medium text-forest-700 hover:underline dark:text-forest-200"
            >
              Didn&apos;t get a code? Resend
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
