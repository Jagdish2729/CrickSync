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
};

const KEY = "cricksync.matches";

export async function getMatches(): Promise<SavedMatch[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveMatch(match: SavedMatch): Promise<void> {
  const matches = await getMatches();
  await AsyncStorage.setItem(KEY, JSON.stringify([match, ...matches]));
}
