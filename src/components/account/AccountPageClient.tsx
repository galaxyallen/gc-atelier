"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { formatOrderDate, orderStatusLabels, paymentStatusLabels } from "@/lib/order-labels";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export type AccountOrder = {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  shipping: number;
  paymentStatus: string;
  orderStatus: string;
  trackingNo: string | null;
  createdAt: string | Date;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: { name: string; sku?: string };
  }[];
};

export type AccountUser = {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  createdAt: string | Date;
  orders: AccountOrder[];
};

type Tab = "profile" | "cart" | "orders";

export default function AccountPageClient({ initialUser }: { initialUser: AccountUser }) {
  const { update } = useSession();
  const [user, setUser] = useState(initialUser);
  const [tab, setTab] = useState<Tab>("profile");
  const [name, setName] = useState(initialUser.name);
  const [phone, setPhone] = useState(initialUser.phone ?? "");
  const [company, setCompany] = useState(initialUser.company ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const cartItems = useCartStore((s) => s.items);
  const cartTotal = useCartStore((s) => s.total());
  const setCartOpen = useCartStore((s) => s.setOpen);
  const removeFromCart = useCartStore((s) => s.remove);

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, company }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setUser((prev) => ({ ...prev, ...data }));
      await update({ name: data.name });
      setMessage("Profile updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "cart", label: `Cart (${cartItems.length})` },
    { id: "orders", label: `Orders (${user.orders.length})` },
  ];

  return (
    <main className="page-wrap account-page">
      <p className="eyebrow" style={{ marginBottom: 16 }}>
        My account
      </p>
      <h1 className="account-page-title">{user.name}</h1>

      <nav className="account-tabs" aria-label="Account sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`account-tab${tab === t.id ? " active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "profile" && (
        <section className="account-card" id="profile">
          <h2 className="account-card-title">Edit profile</h2>
          <p className="account-hint">Phone helps us contact you about shipping and orders.</p>
          <form onSubmit={handleSaveProfile} className="account-form">
            {error && <p className="account-error">{error}</p>}
            {message && <p className="account-success">{message}</p>}
            <div className="account-field">
              <label htmlFor="account-email">Email</label>
              <input id="account-email" value={user.email} disabled className="account-input account-input-disabled" />
            </div>
            <div className="account-field">
              <label htmlFor="account-name">Name</label>
              <input
                id="account-name"
                className="account-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="account-field">
              <label htmlFor="account-phone">Phone</label>
              <input
                id="account-phone"
                className="account-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="account-field">
              <label htmlFor="account-company">Company (optional)</label>
              <input
                id="account-company"
                className="account-input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="account-field">
              <label>Member since</label>
              <p className="account-static">{formatOrderDate(user.createdAt)}</p>
            </div>
            <button type="submit" className="account-save-btn" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </section>
      )}

      {tab === "cart" && (
        <section className="account-card" id="cart">
          <h2 className="account-card-title">Current cart</h2>
          {cartItems.length === 0 ? (
            <p className="account-empty">
              Your cart is empty.{" "}
              <Link href="/shop" className="text-sage hover:underline">
                Browse the shop
              </Link>
            </p>
          ) : (
            <>
              <ul className="account-cart-list">
                {cartItems.map((item, i) => (
                  <li key={`${item.id}-${i}`} className="account-cart-item">
                    <div>
                      <p className="account-cart-name">{item.name}</p>
                      <p className="account-cart-price">{formatPrice(item.price)}</p>
                    </div>
                    <button type="button" className="account-cart-remove" onClick={() => removeFromCart(i)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="account-cart-foot">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <button
                type="button"
                className="account-save-btn"
                onClick={() => setCartOpen(true)}
              >
                Checkout
              </button>
            </>
          )}
        </section>
      )}

      {tab === "orders" && (
        <section className="account-card" id="orders">
          <h2 className="account-card-title">Order history</h2>
          {user.orders.length === 0 ? (
            <p className="account-empty">
              You haven&apos;t placed any orders yet.{" "}
              <Link href="/shop" className="text-sage hover:underline">
                Browse the shop
              </Link>
            </p>
          ) : (
            <ul className="account-orders">
              {user.orders.map((order) => (
                <li key={order.id} className="account-order">
                  <div className="account-order-head">
                    <div>
                      <Link href={`/account/orders/${order.orderNumber}`} className="account-order-no">
                        {order.orderNumber}
                      </Link>
                      <p className="account-order-date">{formatOrderDate(order.createdAt)}</p>
                    </div>
                    <p className="account-order-total">{formatPrice(order.total)}</p>
                  </div>
                  <div className="account-order-badges">
                    <span className="account-badge">{paymentStatusLabels[order.paymentStatus]}</span>
                    <span className="account-badge account-badge-muted">
                      {orderStatusLabels[order.orderStatus]}
                    </span>
                  </div>
                  <ul className="account-order-items">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.product.name} × {item.quantity} — {formatPrice(item.price * item.quantity)}
                      </li>
                    ))}
                  </ul>
                  {order.shipping > 0 && (
                    <p className="account-order-shipping">Shipping: {formatPrice(order.shipping)}</p>
                  )}
                  {order.trackingNo && (
                    <p className="account-order-tracking">Tracking: {order.trackingNo}</p>
                  )}
                  <Link href={`/account/orders/${order.orderNumber}`} className="account-order-link">
                    View order details →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <p style={{ marginTop: 32 }}>
        <Link href="/shop" className="btn-primary" style={{ display: "inline-block" }}>
          Continue shopping
        </Link>
      </p>
    </main>
  );
}
