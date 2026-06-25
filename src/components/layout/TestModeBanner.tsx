"use client";

import { isTestMode } from "@/lib/site-mode";

export default function TestModeBanner() {
  if (!isTestMode()) return null;

  return (
    <div className="test-mode-banner" role="status">
      <span>Test mode</span>
      <span className="test-mode-banner-detail">
        Site: gc-atelier.vercel.app · Payments: Stripe test cards (4242 4242 4242 4242)
      </span>
    </div>
  );
}
