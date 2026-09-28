import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SavedMatch } from "./matches";

const KEY = "cricksync.captain.matches";
type Listener = (matches: SavedMatch[]) => void;
const listeners = new Set<Listener>();

function notify(matches: SavedMatch[]) { listeners.forEach(listener => listener(matches)); }

export async function getCaptainMatches(): Promise<SavedMatch[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export async function saveCaptainMatch(match: SavedMatch): Promise<void> {
  const matches = await getCaptainMatches();
  const updated = [match, ...matches.filter(item => item.id !== match.id)];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  notify(updated);
}

export async function deleteCaptainMatch(id: string): Promise<void> {
  const matches = await getCaptainMatches();
  const updated = matches.filter(match => match.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  notify(updated);
}

export function subscribeCaptainMatches(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
