import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "Staff login" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
