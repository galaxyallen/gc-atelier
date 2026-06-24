"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type InquiryDetail = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  projectType: string | null;
  budget: string | null;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
  replies: { id: string; from: string; subject: string | null; body: string; createdAt: string }[];
};

const statuses = ["NEW", "REPLIED", "QUOTED", "CONVERTED", "CLOSED"];

export default function InquiryDetailForm({ inquiry }: { inquiry: InquiryDetail }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(inquiry.status);
  const [notes, setNotes] = useState(inquiry.notes ?? "");
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error("Update failed");
      router.refresh();
    } catch {
      setError("Failed to update inquiry.");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/inquiries/${inquiry.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: replySubject, body: replyBody }),
      });
      if (!res.ok) throw new Error("Reply failed");
      setReplyBody("");
      setReplySubject("");
      setStatus("REPLIED");
      router.refresh();
    } catch {
      setError("Failed to send reply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/inquiries" className="text-xs text-fg-3 hover:text-sage mb-2 inline-block">
          ← Back to inquiries
        </Link>
        <h1 className="font-display text-3xl font-light">{inquiry.name}</h1>
        <p className="text-fg-3 text-sm mt-1">
          Received {new Date(inquiry.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-bg-2 border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-medium mb-4">Contact details</h2>
            <DetailRow label="Email" value={inquiry.email} />
            <DetailRow label="Phone" value={inquiry.phone} />
            <DetailRow label="Company" value={inquiry.company} />
            <DetailRow label="Project type" value={inquiry.projectType} />
            <DetailRow label="Budget" value={inquiry.budget} />
            <div className="pt-4 border-t border-border">
              <p className="text-[11px] tracking-widest uppercase text-fg-3 mb-2">Message</p>
              <p className="text-sm text-fg-2 leading-relaxed whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>
          </div>

          {inquiry.replies.length > 0 && (
            <div className="bg-bg-2 border border-border rounded-lg p-6">
              <h2 className="text-sm font-medium mb-4">Reply thread</h2>
              <div className="space-y-4">
                {inquiry.replies.map((r) => (
                  <div key={r.id} className="border-l-2 border-sage-border pl-4">
                    <p className="text-[11px] text-fg-3 mb-1">
                      {r.from} · {new Date(r.createdAt).toLocaleString()}
                    </p>
                    {r.subject && <p className="text-sm font-medium mb-1">{r.subject}</p>}
                    <p className="text-sm text-fg-2 whitespace-pre-wrap">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="bg-bg-2 border border-border rounded-lg p-6 space-y-5">
            <h2 className="text-sm font-medium">Update status</h2>
            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-md">{error}</p>
            )}
            <div>
              <label className="block text-[11px] tracking-widest text-fg-3 uppercase mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full py-2.5 text-sm bg-transparent border-b border-border-2 outline-none focus:border-sage"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] tracking-widest text-fg-3 uppercase mb-2">Internal notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full py-2.5 text-sm bg-transparent border-b border-border-2 outline-none focus:border-sage resize-y"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="text-xs tracking-widest uppercase bg-sage text-bg px-8 py-3 hover:bg-sage-light transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </form>

          <form onSubmit={handleReply} className="bg-bg-2 border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-medium">Send reply</h2>
            <input
              value={replySubject}
              onChange={(e) => setReplySubject(e.target.value)}
              placeholder="Subject (optional)"
              className="w-full py-2 text-sm bg-transparent border-b border-border-2 outline-none focus:border-sage"
            />
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              rows={4}
              placeholder="Reply message..."
              required
              className="w-full py-2 text-sm bg-transparent border-b border-border-2 outline-none focus:border-sage resize-y"
            />
            <button
              type="submit"
              disabled={loading}
              className="text-xs tracking-widest uppercase border border-sage-border text-sage px-8 py-3 hover:bg-sage hover:text-bg transition-colors disabled:opacity-50"
            >
              Send reply
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex gap-4">
      <span className="text-[11px] tracking-widest uppercase text-fg-3 w-28 shrink-0">{label}</span>
      <span className="text-sm text-fg-2">{value || "—"}</span>
    </div>
  );
}
