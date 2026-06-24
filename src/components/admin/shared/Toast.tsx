"use client";

export default function Toast({
  message,
  type = "success",
}: {
  message: string;
  type?: "success" | "error";
}) {
  if (!message) return null;
  return (
    <p
      className={`text-sm px-4 py-3 rounded-md ${
        type === "error" ? "text-red-400 bg-red-400/10" : "text-sage bg-sage-dim"
      }`}
    >
      {message}
    </p>
  );
}
