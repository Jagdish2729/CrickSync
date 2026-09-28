import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { getMatches, SavedMatch, subscribeMatches } from "../lib/matches";
import { getUser, CrickSyncUser } from "../lib/auth";
import { router, Redirect } from "expo-router";
import { switchRole } from "../lib/auth";
import { getInvitationsForPhone, subscribeInvitations } from "../lib/invitations";

function matchStart(match: SavedMatch) {
 const parsed=Date.parse(match.startsAt);
 if(!Number.isNaN(parsed)) return parsed;
 const fallback=Date.parse(`${match.date} ${match.time}`);
 return Number.isNaN(fallback)?0:fallback;
}
export default function HomeScreen(){
 const [matches,setMatches]=useState<SavedMatch[]>([]);
 const [totalMatches,setTotalMatches]=useState(0);
 const [user,setUser]=useState<CrickSyncUser|null>(null);
 const [inviteCount,setInviteCount]=useState(0);
 const changeMode=async(role:"PLAYER"|"CAPTAIN")=>{const updated=await switchRole(role);if(updated)setUser(updated);router.replace(role==="CAPTAIN"?"/captain/home":"/home");};
 const refresh=useCallback(async()=>{
  const [all,currentUser]=await Promise.all([getMatches(),getUser()]);
  const upcoming=all.map(match=>({match,start:matchStart(match)})).filter(x=>x.start>Date.now()).sort((a,b)=>a.start-b.start).map(x=>x.match);
  const invites=currentUser?await getInvitationsForPhone(currentUser.phone):[];
  setMatches(upcoming);setTotalMatches(all.length);setUser(currentUser);setInviteCount(invites.filter(invite=>invite.status==="PENDING").length);
 },[]);
 useEffect(()=>{refresh();const unsubscribe=subscribeMatches(()=>refresh());const timer=setInterval(refresh,30000);return()=>{unsubscribe();clearInterval(timer);};},[refresh]);
 useFocusEffect(useCallback(()=>{refresh();},[refresh]));
 if(user?.role==="CAPTAIN") return <Redirect href="/captain/home" />;
 return <SafeAreaView style={styles.container}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
  <View style={styles.top}><View><Text style={styles.eyebrow}>PLAYER MODE</Text><Text style={styles.brand}>CrickSync <Text style={styles.dot}>●</Text></Text></View><View style={styles.topActions}><Pressable onPress={()=>changeMode("CAPTAIN")} style={styles.modeSwitch}><Text style={styles.modeSwitchText}>CAPTAIN ↗</Text></Pressable><Pressable onPress={()=>router.push("/account/role")} style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase()||"J"}</Text></Pressable></View></View>
  <Text style={styles.greeting}>Ready to{"\n"}play?</Text>
  <Pressable onPress={()=>router.push("/calendar")} style={({pressed})=>[styles.hero,pressed&&styles.pressed]}><Text style={styles.heroLabel}>YOUR SCHEDULE</Text><Text style={styles.heroTitle}>See your cricket calendar.</Text><Text style={styles.heroText}>Check matches, availability and upcoming games in one place.</Text><View style={styles.line}/><Text style={styles.heroAction}>Open calendar  →</Text></Pressable>
  <Text style={styles.sectionTitle}>SCHEDULED MATCHES</Text>
  {matches.length>0?<View style={styles.matchesList}>{matches.map(match=>{const d=new Date(matchStart(match));return <Pressable key={match.id} onPress={()=>router.push("/calendar")} style={styles.matchCard}><View style={styles.matchDate}><Text style={styles.matchDay}>{d.getDate()}</Text><Text style={styles.matchMonth}>{d.toLocaleDateString("en-IN",{month:"short"}).toUpperCase()}</Text></View><View style={styles.matchInfo}><Text style={styles.matchTeams}>{match.myTeam}</Text><Text style={styles.matchMeta}>{d.toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit"})}  ·  {match.ground}</Text></View></Pressable>})}</View>:<View style={styles.empty}><Text style={styles.emptyTitle}>No upcoming matches</Text><Text style={styles.emptyText}>Schedule your next game from the calendar.</Text></View>}
  <View style={styles.row}><View style={styles.small}><Text style={styles.smallNumber}>{totalMatches}</Text><Text style={styles.smallLabel}>MATCHES</Text></View><View style={styles.small}><Text style={styles.smallNumber}>0</Text><Text style={styles.smallLabel}>TEAMS</Text></View><Pressable onPress={()=>router.push("/invites")} style={styles.small}><Text style={styles.smallNumber}>{inviteCount}</Text><Text style={styles.smallLabel}>INVITES</Text></Pressable></View>
 </ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:"#0B0D12"},content:{paddingHorizontal:24,paddingTop:20,paddingBottom:30},top:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},eyebrow:{fontSize:9,fontWeight:"900",letterSpacing:1.4,color:"#666C78"},brand:{marginTop:4,fontSize:20,fontWeight:"900",color:"#FFF"},dot:{color:"#B8FF4A",fontSize:13},avatar:{width:42,height:42,borderRadius:21,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},avatarText:{fontSize:17,fontWeight:"900",color:"#0B0D12"},greeting:{marginTop:54,fontSize:46,lineHeight:47,fontWeight:"900",letterSpacing:-1.5,color:"#FFF"},sectionTitle:{marginTop:22,fontSize:10,fontWeight:"900",letterSpacing:1.6,color:"#B8FF4A"},matchesList:{paddingTop:10,paddingBottom:4,gap:8},matchCard:{borderRadius:18,backgroundColor:"#151821",borderWidth:1,borderColor:"#292D38",padding:14,flexDirection:"row",alignItems:"center"},matchDate:{width:50,height:50,borderRadius:14,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},matchDay:{fontSize:20,fontWeight:"900",color:"#0B0D12"},matchMonth:{fontSize:8,fontWeight:"900",color:"#243019"},matchInfo:{flex:1,marginLeft:12},matchTeams:{fontSize:14,fontWeight:"900",color:"#FFF"},matchMeta:{marginTop:5,fontSize:11,fontWeight:"700",color:"#858B97"},empty:{marginTop:10,borderRadius:18,borderWidth:1,borderColor:"#292D38",padding:18,backgroundColor:"#151821"},emptyTitle:{fontSize:15,fontWeight:"900",color:"#FFF"},emptyText:{marginTop:5,fontSize:11,color:"#666C78"},hero:{marginTop:28,borderRadius:24,backgroundColor:"#151821",borderWidth:1,borderColor:"#292D38",padding:22},pressed:{transform:[{scale:.985}]},heroLabel:{fontSize:10,fontWeight:"900",letterSpacing:1.6,color:"#B8FF4A"},heroTitle:{marginTop:18,fontSize:25,fontWeight:"900",color:"#FFF"},heroText:{marginTop:8,fontSize:14,lineHeight:20,color:"#858B97"},line:{height:1,backgroundColor:"#292D38",marginVertical:20},heroAction:{fontSize:14,fontWeight:"900",color:"#B8FF4A"},row:{flexDirection:"row",gap:10,marginTop:14},small:{flex:1,borderRadius:18,backgroundColor:"#151821",borderWidth:1,borderColor:"#292D38",padding:16},smallNumber:{fontSize:26,fontWeight:"900",color:"#FFF"},topActions:{flexDirection:"row",alignItems:"center",gap:8},modeSwitch:{height:34,paddingHorizontal:10,borderRadius:17,borderWidth:1,borderColor:"#B8FF4A",justifyContent:"center"},modeSwitchText:{fontSize:9,fontWeight:"900",letterSpacing:.7,color:"#B8FF4A"},smallLabel:{marginTop:4,fontSize:9,fontWeight:"900",letterSpacing:1,color:"#666C78"}});
