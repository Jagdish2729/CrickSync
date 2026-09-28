import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import { getUser } from "../lib/auth";
import { getInvitationsForPhone, MatchInvitation, respondToInvitation, subscribeInvitations } from "../lib/invitations";
import { getMatches, saveMatch } from "../lib/matches";

function overlaps(aStart:number,aEnd:number,bStart:number,bEnd:number){return aStart<bEnd&&aEnd>bStart;}

export default function InvitesScreen(){
 const [invites,setInvites]=useState<MatchInvitation[]>([]);
 const refresh=useCallback(async()=>{const user=await getUser();if(user)setInvites((await getInvitationsForPhone(user.phone)).filter(item=>item.status==="PENDING"));},[]);
 useEffect(()=>{refresh();const off=subscribeInvitations(refresh);return off;},[refresh]);

 const respond=async(invite:MatchInvitation,status:"ACCEPTED"|"DECLINED")=>{
   if(status==="ACCEPTED"){
     const matches=await getMatches();
     const start=Date.parse(invite.match.startsAt);
     const currentIndex=matches.findIndex(item=>item.id===invite.match.id);
     const durationHours=Math.max(1,Number(invite.match.overs||"20")/6);
     const end=start+durationHours*60*60*1000;
     const conflict=matches.some((match,index)=>{
       if(index===currentIndex)return false;
       const otherStart=Date.parse(match.startsAt);
       const otherDuration=Math.max(1,Number(match.overs||"20")/6);
       return overlaps(start,end,otherStart,otherStart+otherDuration*60*60*1000);
     });
     if(conflict){Alert.alert("Schedule clash","You already have another match around this time. Decline this invite or check your calendar first.");return;}
     await saveMatch(invite.match);
   }
   await respondToInvitation(invite.id,status);
   await refresh();
 };

 return <SafeAreaView style={styles.container}><ScrollView contentContainerStyle={styles.content}>
  <Pressable onPress={()=>router.back()}><Text style={styles.back}>‹  Home</Text></Pressable>
  <Text style={styles.eyebrow}>MATCH INVITES</Text><Text style={styles.title}>Your next call.</Text><Text style={styles.subtitle}>Captains can invite you directly to their scheduled games.</Text>
  {invites.length?invites.map(invite=>{const m=invite.match;return <View key={invite.id} style={styles.card}><View style={styles.badge}><Text style={styles.badgeText}>INVITATION</Text></View><Text style={styles.teams}>{m.myTeam}{m.opponent?"  vs  "+m.opponent:""}</Text><Text style={styles.meta}>{m.date} · {m.time}</Text><Text style={styles.meta}>{m.ground}</Text>{m.stage&&<Text style={styles.stage}>{m.stage}</Text>}<View style={styles.actions}><Pressable onPress={()=>respond(invite,"DECLINED")} style={styles.decline}><Text style={styles.declineText}>Decline</Text></Pressable><Pressable onPress={()=>respond(invite,"ACCEPTED")} style={styles.accept}><Text style={styles.acceptText}>Accept  →</Text></Pressable></View></View>}) : <View style={styles.empty}><Text style={styles.emptyTitle}>No pending invites</Text><Text style={styles.emptyText}>New match invitations will appear here.</Text></View>}
 </ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:"#0B0D12"},content:{padding:24,paddingBottom:40},back:{fontSize:15,fontWeight:"800",color:"#9CA1AD",marginBottom:34},eyebrow:{fontSize:10,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},title:{marginTop:8,fontSize:40,lineHeight:43,fontWeight:"900",color:"#FFF"},subtitle:{marginTop:12,fontSize:15,lineHeight:22,color:"#858B97"},card:{marginTop:26,borderRadius:22,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821",padding:18},badge:{alignSelf:"flex-start",paddingHorizontal:9,paddingVertical:5,borderRadius:8,backgroundColor:"#B8FF4A"},badgeText:{fontSize:8,fontWeight:"900",letterSpacing:1,color:"#0B0D12"},teams:{marginTop:16,fontSize:21,fontWeight:"900",color:"#FFF"},meta:{marginTop:7,fontSize:12,fontWeight:"700",color:"#858B97"},stage:{marginTop:10,fontSize:10,fontWeight:"900",letterSpacing:1,color:"#B8FF4A"},actions:{marginTop:20,flexDirection:"row",gap:9},decline:{flex:1,height:52,borderRadius:15,borderWidth:1,borderColor:"#383D48",alignItems:"center",justifyContent:"center"},declineText:{fontSize:14,fontWeight:"900",color:"#9CA1AD"},accept:{flex:1,height:52,borderRadius:15,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},acceptText:{fontSize:14,fontWeight:"900",color:"#0B0D12"},empty:{marginTop:26,padding:20,borderRadius:20,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821"},emptyTitle:{fontSize:16,fontWeight:"900",color:"#FFF"},emptyText:{marginTop:6,fontSize:12,color:"#666C78"}});
