"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { formatOrderDate, orderStatusLabels, paymentStatusLabels } from "@/lib/order-labels";
import { useCartStore } from "@/lib/store";

type AccountOrder = {
  id: string;
  orderNumber: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: { quantity: number; product: { name: string } }[];
};

type AccountData = {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  orders: AccountOrder[];
};

function displayName(session: { user?: { name?: string | null; email?: string | null } }) {
  const name = session.user?.name?.trim();
  if (name) return name;
  const email = session.user?.email;
  if (email) return email.split("@")[0];
  return "Account";
}

export default function UserMenuDropdown({
  userMenuOpen,
  setUserMenuOpen,
}: {
  userMenuOpen: boolean;
  setUserMenuOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef(false);

  const cartItems = useCartStore((s) => s.items);
  const cartTotal = useCartStore((s) => s.total());
  const setCartOpen = useCartStore((s) => s.setOpen);

  const userLabel = session?.user ? displayName(session) : "";

  useEffect(() => {
    fetchedRef.current = false;
    setAccount(null);
  }, [session?.user?.id]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const close = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [userMenuOpen, setUserMenuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;
    if (fetchedRef.current && account) return;

    setLoading(true);
    fetch("/api/account")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load account");
        return res.json() as Promise<AccountData>;
      })
      .then((data) => {
        setAccount(data);
        fetchedRef.current = true;
      })
      .catch(() => setAccount(null))
      .finally(() => setLoading(false));
  }, [userMenuOpen, account]);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    fetchedRef.current = false;
    setAccount(null);
    await signOut({ redirect: false });
    router.refresh();
  };

  const openCart = () => {
    setUserMenuOpen(false);
    setCartOpen(true);
  };

  const recentOrders = account?.orders?.slice(0, 2) ?? [];

  return (
    <div className="n-user-menu" ref={userMenuRef}>
      <button
        type="button"
        className="n-user-trigger"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        aria-expanded={userMenuOpen}
        aria-haspopup="menu"
      >
        <span className="n-user-avatar" aria-hidden>
          {userLabel.charAt(0).toUpperCase()}
        </span>
        <span className="n-user-name">{userLabel}</span>
        <span className="n-user-caret" aria-hidden>
          ▾
        </span>
      </button>

      {userMenuOpen && (
        <div className="n-user-dropdown n-user-dropdown-wide" role="menu">
          <div className="n-user-profile">
            <p className="n-user-profile-name">{account?.name || userLabel}</p>
            <p className="n-user-profile-email">{account?.email || session?.user?.email}</p>
            {account?.phone && <p className="n-user-profile-meta">{account.phone}</p>}
            {account?.company && <p className="n-user-profile-meta">{account.company}</p>}
            <Link
              href="/account"
              className="n-user-profile-edit"
              onClick={() => setUserMenuOpen(false)}
            >
              Edit profile →
            </Link>
          </div>

          <div className="n-user-section">
            <p className="n-user-section-title">Cart ({cartItems.length})</p>
            {cartItems.length === 0 ? (
              <p className="n-user-empty">Cart is empty.</p>
            ) : (
              <>
                <ul className="n-user-cart">
                  {cartItems.slice(0, 3).map((item, i) => (
                    <li key={`${item.id}-${i}`} className="n-user-cart-item">
                      <span className="n-user-cart-name">{item.name}</span>
                      <span className="n-user-cart-price">{formatPrice(item.price)}</span>
                    </li>
                  ))}
                </ul>
                <p className="n-user-cart-total">Total: {formatPrice(cartTotal)}</p>
                <button type="button" className="n-user-inline-btn" onClick={openCart}>
                  Open cart & checkout
                </button>
              </>
            )}
          </div>

          <div className="n-user-section">
            <p className="n-user-section-title">Recent orders</p>
            {loading ? (
              <p className="n-user-empty">Loading…</p>
            ) : recentOrders.length === 0 ? (
              <p className="n-user-empty">No orders yet.</p>
            ) : (
              <ul className="n-user-orders">
                {recentOrders.map((order) => (
                  <li key={order.id} className="n-user-order">
                    <Link
                      href={`/account/orders/${order.orderNumber}`}
                      className="n-user-order-link-block"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="n-user-order-head">
                        <span className="n-user-order-no">{order.orderNumber}</span>
                        <span className="n-user-order-total">{formatPrice(order.total)}</span>
                      </div>
                      <p className="n-user-order-meta">
                        {formatOrderDate(order.createdAt)} · {paymentStatusLabels[order.paymentStatus] || order.paymentStatus}
                      </p>
                      <p className="n-user-order-status">
                        {orderStatusLabels[order.orderStatus] || order.orderStatus}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="n-user-actions">
            <Link
              href="/account"
              className="n-user-dropdown-item"
              role="menuitem"
              onClick={() => setUserMenuOpen(false)}
            >
              My account
            </Link>
            <button type="button" className="n-user-dropdown-item" role="menuitem" onClick={handleSignOut}>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
