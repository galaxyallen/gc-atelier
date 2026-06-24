export default function SectionHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-display text-[clamp(28px,3.2vw,44px)] font-light leading-[1.3] ${className}`}
    >
      {children}
    </h2>
  );
}
