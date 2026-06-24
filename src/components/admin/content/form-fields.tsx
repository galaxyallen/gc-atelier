export const labelClass = "block text-[11px] tracking-widest text-fg-3 uppercase mb-2";
export const inputClass =
  "w-full py-2.5 text-sm bg-bg-2 border border-border rounded px-3 outline-none focus:border-sage transition-colors";
export const textareaClass = `${inputClass} resize-y min-h-[88px]`;

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-bg-2 border border-border rounded-lg p-6 space-y-4">
      <div>
        <h2 className="font-display text-xl font-light">{title}</h2>
        {description && <p className="text-xs text-fg-3 mt-1">{description}</p>}
      </div>
      {children}
    </section>
  );
}
