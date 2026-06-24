"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";

type OrderDetail = {
  id: string;
  orderNumber: string;
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  trackingNo: string | null;
  notes: string | null;
  createdAt: string;
  customer: { name: string; email: string; phone: string | null };
  items: { id: string; quantity: number; price: number; product: { name: string } }[];
};

const orderStatuses = ["PENDING", "CONFIRMED", "PRODUCING", "SHIPPED", "DELIVERED", "CANCELLED"];
const paymentStatuses = ["PENDING", "PAID", "REFUNDED", "FAILED"];

export default function OrderDetailForm({ order }: { order: OrderDetail }) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingNo, setTrackingNo] = useState(order.trackingNo ?? "");
  const [notes, setNotes] = useState(order.notes ?? "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus, paymentStatus, trackingNo, notes }),
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } catch {
      alert("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link href="/admin/orders" className="text-xs text-fg-3 hover:text-sage mb-2 inline-block">
        ← Back to orders
      </Link>
      <h1 className="font-display text-3xl font-light mb-8">Order {order.orderNumber}</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-bg-2 border border-border rounded-lg p-6">
            <h2 className="text-sm font-medium mb-4">Customer</h2>
            <p className="text-sm">{order.customer.name}</p>
            <p className="text-sm text-fg-3">{order.customer.email}</p>
            {order.customer.phone && <p className="text-sm text-fg-3">{order.customer.phone}</p>}
          </div>

          <div className="bg-bg-2 border border-border rounded-lg p-6">
            <h2 className="text-sm font-medium mb-4">Items</h2>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b border-border last:border-0 text-sm">
                <span>{item.quantity}× {item.product.name}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="pt-4 space-y-1 text-sm">
              <div className="flex justify-between text-fg-3">
                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-fg-3">
                <span>Shipping</span><span>{formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2">
                <span>Total</span><span className="text-sage-light">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-bg-2 border border-border rounded-lg p-6 space-y-5">
          <h2 className="text-sm font-medium">Update order</h2>
          <div>
            <label className="block text-[11px] tracking-widest text-fg-3 uppercase mb-2">Order status</label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="w-full py-2 text-sm bg-transparent border-b border-border-2 outline-none focus:border-sage"
            >
              {orderStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] tracking-widest text-fg-3 uppercase mb-2">Payment status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full py-2 text-sm bg-transparent border-b border-border-2 outline-none focus:border-sage"
            >
              {paymentStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] tracking-widest text-fg-3 uppercase mb-2">Tracking number</label>
            <input
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              className="w-full py-2 text-sm bg-transparent border-b border-border-2 outline-none focus:border-sage"
            />
          </div>
          <div>
            <label className="block text-[11px] tracking-widest text-fg-3 uppercase mb-2">Internal notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full py-2 text-sm bg-transparent border-b border-border-2 outline-none focus:border-sage resize-y"
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="text-xs tracking-widest uppercase bg-sage text-bg px-8 py-3 hover:bg-sage-light transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
          <p className="text-xs text-fg-3">
            Placed {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
