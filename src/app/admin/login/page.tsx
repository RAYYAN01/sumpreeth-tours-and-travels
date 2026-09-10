import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin portal",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
