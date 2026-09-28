import AsyncStorage from "@react-native-async-storage/async-storage";

export type Role = "PLAYER" | "CAPTAIN";

export type CrickSyncUser = {
  phone: string;
  name: string;
  city: string;
  role: Role;
  roles?: Role[];
};

const KEY = "cricksync.user";

export async function getUser(): Promise<CrickSyncUser | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as CrickSyncUser;
    const roles = user.roles?.length ? user.roles : [user.role];
    return { ...user, roles };
  } catch {
    return null;
  }
}

export async function saveUser(user: CrickSyncUser): Promise<void> {
  const roles = user.roles?.length ? user.roles : [user.role];
  await AsyncStorage.setItem(KEY, JSON.stringify({ ...user, roles }));
}

export async function switchRole(role: Role): Promise<CrickSyncUser | null> {
  const user = await getUser();
  if (!user) return null;
  const roles = Array.from(new Set([...(user.roles || [user.role]), role]));
  const updated = { ...user, role, roles };
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
