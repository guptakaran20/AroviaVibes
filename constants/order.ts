export const ORDER_STATUS_STEPS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered"
];

export const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-amber-500", bg: "bg-amber-500/10" },
  confirmed: { label: "Confirmed", color: "text-blue-500", bg: "bg-blue-500/10" },
  processing: { label: "Processing", color: "text-indigo-500", bg: "bg-indigo-500/10" },
  shipped: { label: "Shipped", color: "text-purple-500", bg: "bg-purple-500/10" },
  delivered: { label: "Delivered", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  cancelled: { label: "Cancelled", color: "text-red-500", bg: "bg-red-500/10" },
};
