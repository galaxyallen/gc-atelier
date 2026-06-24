const ADMIN_ROLES = new Set(["SUPER_ADMIN", "EDITOR", "SALES"]);

export function isAdminRole(role: string | undefined): boolean {
  return !!role && ADMIN_ROLES.has(role);
}
