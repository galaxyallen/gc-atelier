/** Renders a CMS image or placeholder label when no URL is set. */

export default function CmsImage({
  src,
  alt = "",
  className = "cms-img-fill",
  placeholder,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  placeholder: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} />;
  }
  return <span>{placeholder}</span>;
}
