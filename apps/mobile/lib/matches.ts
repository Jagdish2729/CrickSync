import AsyncStorage from "@react-native-async-storage/async-storage";

export type SavedMatch = {
  id: string;
  startsAt: string;
  date: string;
  time: string;
  myTeam: string;
  opponent?: string;
  ground: string;
  ball: "WHITE" | "RED";
  overs: string;
  teamId?: string;
  opponent?: string;
  stage?: string;
  playerIds?: string[];
};

const KEY = "cricksync.matches";
type Listener = (matches: SavedMatch[]) => void;
const listeners = new Set<Listener>();

function notify(matches: SavedMatch[]) {
  listeners.forEach(listener => listener(matches));
}

export function subscribeMatches(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function getMatches(): Promise<SavedMatch[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveMatch(match: SavedMatch): Promise<void> {
  const matches = await getMatches();
  const updated = [match, ...matches.filter(item => item.id !== match.id)];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  notify(updated);
}

export async function deleteMatch(id: string): Promise<void> {
  const matches = await getMatches();
  const updated = matches.filter(match => match.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  notify(updated);
}
