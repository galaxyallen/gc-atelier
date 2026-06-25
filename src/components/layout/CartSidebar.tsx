"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

type CheckoutProfile = {
  name: string;
  email: string;
  phone: string | null;
};

export default function CartSidebar({ onLoginClick }: { onLoginClick?: () => void }) {
  const { data: session, status } = useSession();
  const { items, isOpen, toggle, remove, total, clear } = useCartStore();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "confirm" | "login" | "done">("cart");
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<CheckoutProfile | null>(null);

  const isLoggedIn = status === "authenticated" && session?.user?.userType === "customer";

  const handleClose = () => {
    toggle();
    setCheckoutStep("cart");
    setError("");
  };

  useEffect(() => {
    if (isLoggedIn && checkoutStep === "login") {
      setCheckoutStep("confirm");
      setError("");
    }
  }, [isLoggedIn, checkoutStep]);

  useEffect(() => {
    if (checkoutStep !== "confirm" || !isLoggedIn) return;

    if (session?.user) {
      setProfile({
        name: session.user.name,
        email: session.user.email,
        phone: null,
      });
    }

    fetch("/api/account")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json() as Promise<CheckoutProfile>;
      })
      .then((data) => setProfile(data))
      .catch(() => setError("Unable to load your profile. Please try again."));
  }, [checkoutStep, isLoggedIn, session?.user]);

  const runCheckout = async () => {
    setCheckingOut(true);
    setError("");

    const payload = {
      items: items.map((item) => ({ productId: item.id, quantity: 1 })),
    };

    try {
      const paymentRes = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (paymentRes.ok) {
        const result = await paymentRes.json();
        if (result.url) {
          clear();
          window.location.href = result.url;
          return;
        }
      }

      if (paymentRes.status === 401) {
        setCheckoutStep("login");
        throw new Error("Please sign in to checkout.");
      }

      const err = await paymentRes.json().catch(() => ({}));
      throw new Error(
        (err as { error?: string }).error ||
          "Online payment failed. Please try again or contact us.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  const handleProceed = () => {
    setError("");
    if (isLoggedIn) {
      setCheckoutStep("confirm");
    } else {
      setCheckoutStep("login");
    }
  };

  return (
    <>
      <div
        className={`cart-overlay${isOpen ? " open" : ""}`}
        onClick={handleClose}
        role="presentation"
      />
      <div className={`cart-panel${isOpen ? " open" : ""}`}>
        <div className="cart-head">
          <span className="cart-title">
            {checkoutStep === "cart"
              ? "Your cart"
              : checkoutStep === "confirm"
                ? "Checkout"
                : checkoutStep === "login"
                  ? "Sign in"
                  : "Order placed"}
          </span>
          <button type="button" className="cart-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="cart-body">
          {checkoutStep === "done" ? (
            <div className="cart-empty" style={{ paddingTop: 40 }}>
              <p style={{ fontFamily: "var(--fd)", fontSize: 20, color: "var(--sage-l)", marginBottom: 8 }}>
                Thank you!
              </p>
              <p style={{ fontSize: 13, color: "var(--fg2)", marginBottom: 16 }}>Order {orderNumber} placed.</p>
              <button type="button" className="cart-checkout" onClick={handleClose}>
                Continue shopping
              </button>
            </div>
          ) : checkoutStep === "login" ? (
            <div style={{ paddingTop: 16 }}>
              {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <p style={{ fontSize: 14, color: "var(--fg2)", marginBottom: 16, lineHeight: 1.6 }}>
                Sign in to checkout with your saved profile. Your name, email and phone will be used automatically.
              </p>
              <button type="button" className="cart-checkout" onClick={onLoginClick}>
                Sign in / Register
              </button>
              <button
                type="button"
                onClick={() => setCheckoutStep("cart")}
                style={{ width: "100%", fontSize: 12, color: "var(--fg3)", marginTop: 12, background: "none" }}
              >
                ← Back to cart
              </button>
            </div>
          ) : checkoutStep === "confirm" ? (
            <div style={{ paddingTop: 8 }}>
              {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg3)", marginBottom: 12 }}>
                Shipping to
              </p>
              {profile ? (
                <div className="cart-checkout-profile">
                  <p className="cart-checkout-name">{profile.name}</p>
                  <p className="cart-checkout-line">{profile.email}</p>
                  {profile.phone ? (
                    <p className="cart-checkout-line">{profile.phone}</p>
                  ) : (
                    <p className="cart-checkout-hint">
                      No phone on file.{" "}
                      <Link href="/account" className="text-sage" onClick={handleClose}>
                        Add in account
                      </Link>
                    </p>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "var(--fg3)" }}>Loading your profile…</p>
              )}
              <p style={{ fontSize: 14, color: "var(--fg3)", marginTop: 20 }}>
                Total: <strong style={{ color: "var(--fg)" }}>{formatPrice(total())}</strong>
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="cart-empty">Your cart is empty.</div>
          ) : (
            items.map((item, i) => (
              <div key={`${item.id}-${i}`} className="cart-item">
                <div className="cart-item-img">IMG</div>
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">{formatPrice(item.price)}</p>
                  <button type="button" className="cart-item-rm" onClick={() => remove(i)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {checkoutStep === "cart" && items.length > 0 && (
          <div className="cart-foot">
            <div className="cart-total">
              <span>Total</span>
              <span>{formatPrice(total())}</span>
            </div>
            <button type="button" className="cart-checkout" onClick={handleProceed}>
              Proceed to checkout
            </button>
          </div>
        )}

        {checkoutStep === "confirm" && (
          <div className="cart-foot">
            <button
              type="button"
              className="cart-checkout"
              disabled={checkingOut || !profile}
              onClick={() => void runCheckout()}
            >
              {checkingOut ? "Processing..." : "Pay securely"}
            </button>
            <button
              type="button"
              onClick={() => setCheckoutStep("cart")}
              style={{ width: "100%", fontSize: 12, color: "var(--fg3)", marginTop: 12, background: "none" }}
            >
              ← Back to cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
