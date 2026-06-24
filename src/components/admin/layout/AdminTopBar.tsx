"use client";

type Props = {
  title: string;
  breadcrumbs?: string[];
  previewHref?: string;
  onSave?: () => void;
  saving?: boolean;
  saveLabel?: string;
};

export default function AdminTopBar({
  title,
  breadcrumbs = [],
  previewHref = "/",
  onSave,
  saving,
  saveLabel = "Save all",
}: Props) {
  return (
    <div className="sticky top-0 z-30 -mx-8 px-8 py-4 mb-6 bg-bg/95 backdrop-blur border-b border-border flex items-center justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        {breadcrumbs.length > 0 && (
          <p className="text-[10px] tracking-widest uppercase text-fg-3 mb-1">
            {breadcrumbs.join(" / ")}
          </p>
        )}
        <h1 className="font-display text-2xl font-light truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={previewHref}
          target="_blank"
          rel="noreferrer"
          className="text-xs tracking-widest uppercase border border-border px-4 py-2 rounded hover:border-sage hover:text-sage transition-colors"
        >
          Preview
        </a>
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="text-xs tracking-widest uppercase bg-sage text-bg px-5 py-2 rounded hover:bg-sage-light transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : saveLabel}
          </button>
        )}
      </div>
    </div>
  );
}
