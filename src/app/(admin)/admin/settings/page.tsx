import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/admin/settings/SettingsForm";
import { SITE_SETTING_KEYS } from "@/lib/site-settings.server";

export default async function SettingsPage() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: [...SITE_SETTING_KEYS, "contact_email", "contact_phone", "contact_wechat", "studio_address"] } },
  });
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const allKeys = [
    ...SITE_SETTING_KEYS,
    "contact_email",
    "contact_phone",
    "contact_wechat",
    "studio_address",
  ];

  const initial = allKeys.map((key) => ({
    key,
    value: settingsMap[key] ?? "",
  }));

  return (
    <div>
      <h1 className="font-display text-3xl font-light mb-2">Settings</h1>
      <p className="text-fg-3 text-sm mb-8">
        站点全局配置：页脚社交链接、Shop/Projects 页面标题等。Super admin only.
      </p>
      <SettingsForm initial={initial} />
    </div>
  );
}
