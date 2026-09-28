export type UserRole = "PLAYER" | "CAPTAIN";

export type MatchStatus = "DRAFT" | "INVITED" | "ACCEPTED" | "DECLINED" | "CANCELLED";

export type Match = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  ground?: string;
  status: MatchStatus;
};
