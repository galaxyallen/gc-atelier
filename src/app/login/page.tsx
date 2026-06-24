import { redirect } from "next/navigation";

export default function LoginRedirectPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const query = searchParams.callbackUrl
    ? `?callbackUrl=${encodeURIComponent(searchParams.callbackUrl)}`
    : "";
  redirect(`/admin/login${query}`);
}
