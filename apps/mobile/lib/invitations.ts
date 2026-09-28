import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SavedMatch } from "./matches";

export type MatchInvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED";
export type MatchInvitation = { id:string; match:SavedMatch; recipientPhone:string; recipientName?:string; status:MatchInvitationStatus; createdAt:string; };
const KEY="cricksync.matchInvitations";
type Listener=(invites:MatchInvitation[])=>void;
const listeners=new Set<Listener>();
function notify(invites:MatchInvitation[]){listeners.forEach(listener=>listener(invites));}
export async function getInvitations():Promise<MatchInvitation[]>{try{const raw=await AsyncStorage.getItem(KEY);if(!raw)return [];const parsed=JSON.parse(raw);return Array.isArray(parsed)?parsed:[];}catch{return [];}}
export async function getInvitationsForPhone(phone:string):Promise<MatchInvitation[]>{const normalized=phone.replace(/\D/g,"");const invites=await getInvitations();return invites.filter(invite=>invite.recipientPhone===normalized);}
export async function createMatchInvitations(match:SavedMatch,players:{id:string;phone:string;name?:string}[]):Promise<void>{const existing=await getInvitations();const selected=match.playerIds||[];const newInvites=players.filter(player=>selected.includes(player.id)).map(player=>({id:match.id+"-"+player.id,match,recipientPhone:player.phone.replace(/\D/g,""),recipientName:player.name,status:"PENDING" as const,createdAt:new Date().toISOString()}));const updated=[...newInvites,...existing.filter(invite=>!newInvites.some(item=>item.id===invite.id))];await AsyncStorage.setItem(KEY,JSON.stringify(updated));notify(updated);}
export async function respondToInvitation(id:string,status:"ACCEPTED"|"DECLINED"):Promise<MatchInvitation|null>{const invites=await getInvitations();const invite=invites.find(item=>item.id===id);if(!invite)return null;const updatedInvite={...invite,status};const updated=invites.map(item=>item.id===id?updatedInvite:item);await AsyncStorage.setItem(KEY,JSON.stringify(updated));notify(updated);return updatedInvite;}
export function subscribeInvitations(listener:Listener):()=>void{listeners.add(listener);return()=>listeners.delete(listener);}