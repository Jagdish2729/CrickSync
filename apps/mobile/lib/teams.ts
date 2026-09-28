import AsyncStorage from "@react-native-async-storage/async-storage";

export type TeamPlayerStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export type TeamPlayer = {
  id: string;
  phone: string;
  name?: string;
  status: TeamPlayerStatus;
};

export type Team = {
  id: string;
  name: string;
  captainPhone: string;
  players: TeamPlayer[];
  createdAt: string;
};

const KEY = "cricksync.team";
type Listener = (team: Team | null) => void;
const listeners = new Set<Listener>();

function notify(team: Team | null) { listeners.forEach(listener => listener(team)); }

export async function getTeam(): Promise<Team | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export async function saveTeam(team: Team): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(team));
  notify(team);
}

export async function createTeam(name: string, captainPhone: string): Promise<Team> {
  const team: Team = {
    id: Date.now().toString(),
    name: name.trim(),
    captainPhone,
    players: [],
    createdAt: new Date().toISOString()
  };
  await saveTeam(team);
  return team;
}

export async function addTeamPlayer(phone: string): Promise<Team | null> {
  const team = await getTeam();
  if (!team) return null;
  const normalized = phone.replace(/\D/g, "");
  if (!normalized || team.players.some(player => player.phone === normalized)) return team;
  const updated = {
    ...team,
    players: [...team.players, {
      id: Date.now().toString(),
      phone: normalized,
      status: "PENDING" as const
    }]
  };
  await saveTeam(updated);
  return updated;
}

export function subscribeTeam(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
