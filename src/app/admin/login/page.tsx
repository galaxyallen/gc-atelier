import { Suspense } from "react";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center text-fg-3">
          Loading...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
