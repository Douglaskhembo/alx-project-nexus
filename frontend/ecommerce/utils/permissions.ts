export function hasPermission(role: string | null, allowedRoles: string[]) {
  if (!role) return false;
  return allowedRoles.map(r => r.toLowerCase()).includes(role.toLowerCase());
}
