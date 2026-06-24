"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

type Mode = "signin" | "register";

export default function LoginModal({
  open,
  onClose,
  onAuthSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}) {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setError("");
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    resetForm();
  };

  const router = useRouter();

  const finishCustomerAuth = () => {
    onClose();
    onAuthSuccess?.();
    router.refresh();
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      loginType: "customer",
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    finishCustomerAuth();
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      setError("请输入姓名");
      return;
    }
    if (password.length < 6) {
      setError("密码至少 6 位");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const reg = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          password,
        }),
      });
      const data = await reg.json().catch(() => ({}));

      if (!reg.ok) {
        setError((data as { error?: string }).error || "注册失败");
        setLoading(false);
        return;
      }

      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        loginType: "customer",
        redirect: false,
      });
      setLoading(false);

      if (res?.error) {
        setError("注册成功，但自动登录失败，请手动登录");
        setMode("signin");
        return;
      }

      onClose();
      finishCustomerAuth();
    } catch {
      setLoading(false);
      setError("注册失败，请稍后重试");
    }
  };

  const handleSubmit = () => {
    if (mode === "signin") void handleSignIn();
    else void handleRegister();
  };

  return (
    <div
      className={`modal-overlay${open ? " open" : ""}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-x" onClick={onClose}>
          ✕
        </button>
        <h2>{mode === "signin" ? "Welcome back" : "Create account"}</h2>
        <p>
          {mode === "signin"
            ? "Sign in to your GC Atelier account."
            : "Register to save orders and checkout faster."}
        </p>

        {error && (
          <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</p>
        )}

        {mode === "register" && (
          <>
            <div className="fg">
              <label className="fl">Name</label>
              <input
                type="text"
                className="fi"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="fg">
              <label className="fl">Phone</label>
              <input
                type="tel"
                className="fi"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p style={{ fontSize: 11, color: "var(--fg3)", marginTop: 6 }}>
                Recommended for shipping updates. Optional.
              </p>
            </div>
          </>
        )}

        <div className="fg">
          <label className="fl">Email</label>
          <input
            type="email"
            className="fi"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="fg">
          <label className="fl">Password</label>
          <input
            type="password"
            className="fi"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button type="button" className="modal-btn" onClick={handleSubmit} disabled={loading}>
          {loading
            ? mode === "signin"
              ? "Signing in..."
              : "Creating account..."
            : mode === "signin"
              ? "Sign in"
              : "Create account"}
        </button>

        <div className="modal-alt">
          {mode === "signin" ? (
            <>
              Don&apos;t have an account?{" "}
              <button type="button" className="text-sage hover:underline" onClick={() => switchMode("register")}>
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" className="text-sage hover:underline" onClick={() => switchMode("signin")}>
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
