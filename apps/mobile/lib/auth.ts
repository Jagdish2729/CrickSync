import AsyncStorage from "@react-native-async-storage/async-storage";

export type CrickSyncUser = {
  phone: string;
  name: string;
  city: string;
  role: "PLAYER" | "CAPTAIN";
};

const KEY = "cricksync.user";

export async function getUser(): Promise<CrickSyncUser | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveUser(user: CrickSyncUser): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(user));
}
