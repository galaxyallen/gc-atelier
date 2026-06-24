export const paymentStatusLabels: Record<string, string> = {
  PENDING: "Pending payment",
  PAID: "Paid",
  REFUNDED: "Refunded",
  FAILED: "Failed",
};

export const orderStatusLabels: Record<string, string> = {
  PENDING: "Processing",
  CONFIRMED: "Confirmed",
  PRODUCING: "In production",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function formatOrderDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
