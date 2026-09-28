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

const KEY = "cricksync.teams";
const LEGACY_KEY = "cricksync.team";
type Listener = (teams: Team[]) => void;
const listeners = new Set<Listener>();

function notify(teams: Team[]) { listeners.forEach(listener => listener(teams)); }

export async function getTeams(): Promise<Team[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    const legacy = await AsyncStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const team = JSON.parse(legacy) as Team;
      if (team?.id) {
        await AsyncStorage.setItem(KEY, JSON.stringify([team]));
        return [team];
      }
    }
    return [];
  } catch { return []; }
}

export async function getTeam(): Promise<Team | null> {
  const teams = await getTeams();
  return teams[0] || null;
}

export async function saveTeams(teams: Team[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(teams));
  notify(teams);
}

export async function saveTeam(team: Team): Promise<void> {
  const teams = await getTeams();
  const updated = [team, ...teams.filter(item => item.id !== team.id)];
  await saveTeams(updated);
}

export async function createTeam(name: string, captainPhone: string): Promise<Team> {
  const team: Team = {
    id: Date.now().toString(),
    name: name.trim(),
    captainPhone,
    players: [],
    createdAt: new Date().toISOString()
  };
  const teams = await getTeams();
  await saveTeams([team, ...teams]);
  return team;
}

export async function addTeamPlayer(teamId: string, phone: string): Promise<Team | null> {
  const teams = await getTeams();
  const team = teams.find(item => item.id === teamId);
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