export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] tracking-[0.16em] text-sage uppercase mb-5 flex items-center gap-3">
      <span className="w-6 h-px bg-sage" />
      {children}
    </p>
  );
}
