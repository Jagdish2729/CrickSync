import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import { getUser, switchRole, CrickSyncUser } from "../../lib/auth";
import { getMatches, SavedMatch, subscribeMatches } from "../../lib/matches";

export default function CaptainHome(){
 const [user,setUser]=useState<CrickSyncUser|null>(null);
 const [matches,setMatches]=useState<SavedMatch[]>([]);
 const refresh=useCallback(async()=>{const [u,m]=await Promise.all([getUser(),getMatches()]);setUser(u);setMatches(m.sort((a,b)=>Date.parse(a.startsAt)-Date.parse(b.startsAt)));},[]);
 useEffect(()=>{refresh();const off=subscribeMatches(()=>refresh());return off;},[refresh]);
 const changeMode=async(role:"PLAYER"|"CAPTAIN")=>{const u=await switchRole(role);if(u){setUser(u);router.replace("/home");}};
 return <SafeAreaView style={styles.container}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
  <View style={styles.top}><View><Text style={styles.eyebrow}>CAPTAIN MODE</Text><Text style={styles.brand}>CrickSync <Text style={styles.dot}>●</Text></Text></View><View style={styles.topActions}><Pressable onPress={()=>changeMode("PLAYER")} style={styles.modeSwitch}><Text style={styles.modeSwitchText}>PLAYER ↗</Text></Pressable><Pressable onPress={()=>router.push("/account/role")} style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase()||"J"}</Text></Pressable></View></View>
  <Text style={styles.greeting}>Run your{"\n"}game.</Text>
  <View style={styles.grid}><Pressable onPress={()=>router.push("/calendar")} style={styles.card}><Text style={styles.cardIcon}>◷</Text><Text style={styles.cardTitle}>My schedule</Text><Text style={styles.cardText}>See every game and availability.</Text></Pressable><Pressable onPress={()=>router.push("/calendar")} style={[styles.card,styles.lime]}><Text style={styles.limeIcon}>＋</Text><Text style={styles.limeTitle}>Create match</Text><Text style={styles.limeText}>Schedule a new game.</Text></Pressable></View>
  <View style={styles.stats}><View><Text style={styles.statNumber}>{matches.length}</Text><Text style={styles.statLabel}>MATCHES</Text></View><View><Text style={styles.statNumber}>0</Text><Text style={styles.statLabel}>TEAMS</Text></View><View><Text style={styles.statNumber}>0</Text><Text style={styles.statLabel}>INVITES</Text></View></View>
  <Text style={styles.section}>CAPTAIN TOOLS</Text>
  <Pressable style={styles.row} onPress={()=>router.push("/calendar")}><Text style={styles.rowIcon}>▦</Text><View style={styles.rowCopy}><Text style={styles.rowTitle}>Manage schedule</Text><Text style={styles.rowText}>View and manage your matches.</Text></View><Text style={styles.arrow}>→</Text></Pressable>
  <Pressable style={styles.row}><Text style={styles.rowIcon}>♟</Text><View style={styles.rowCopy}><Text style={styles.rowTitle}>My teams</Text><Text style={styles.rowText}>Create a team and build your squad.</Text></View><Text style={styles.arrow}>→</Text></Pressable>
  <Pressable style={styles.row}><Text style={styles.rowIcon}>✦</Text><View style={styles.rowCopy}><Text style={styles.rowTitle}>Player invites</Text><Text style={styles.rowText}>Invite players to your upcoming games.</Text></View><Text style={styles.arrow}>→</Text></Pressable>
 </ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#0B0D12"},content:{paddingHorizontal:24,paddingTop:20,paddingBottom:35},
 top:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},topActions:{flexDirection:"row",alignItems:"center",gap:8},eyebrow:{fontSize:9,fontWeight:"900",letterSpacing:1.4,color:"#B8FF4A"},brand:{marginTop:4,fontSize:20,fontWeight:"900",color:"#FFF"},dot:{color:"#B8FF4A",fontSize:13},
 modeSwitch:{height:34,paddingHorizontal:10,borderRadius:17,borderWidth:1,borderColor:"#B8FF4A",justifyContent:"center"},modeSwitchText:{fontSize:9,fontWeight:"900",letterSpacing:.7,color:"#B8FF4A"},avatar:{width:42,height:42,borderRadius:21,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},avatarText:{fontSize:17,fontWeight:"900",color:"#0B0D12"},
 greeting:{marginTop:52,fontSize:46,lineHeight:47,fontWeight:"900",letterSpacing:-1.5,color:"#FFF"},grid:{flexDirection:"row",gap:10,marginTop:28},card:{flex:1,minHeight:150,borderRadius:22,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821",padding:18},lime:{backgroundColor:"#B8FF4A",borderColor:"#B8FF4A"},cardIcon:{fontSize:28,color:"#B8FF4A"},limeIcon:{fontSize:30,color:"#0B0D12"},cardTitle:{marginTop:22,fontSize:18,fontWeight:"900",color:"#FFF"},limeTitle:{marginTop:20,fontSize:18,fontWeight:"900",color:"#0B0D12"},cardText:{marginTop:6,fontSize:11,lineHeight:16,color:"#858B97"},limeText:{marginTop:6,fontSize:11,lineHeight:16,color:"#243019"},
 stats:{marginTop:14,padding:18,borderRadius:20,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821",flexDirection:"row",justifyContent:"space-between"},statNumber:{fontSize:25,fontWeight:"900",color:"#FFF"},statLabel:{marginTop:3,fontSize:8,fontWeight:"900",letterSpacing:1,color:"#666C78"},
 section:{marginTop:25,fontSize:10,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},row:{marginTop:10,minHeight:72,borderRadius:17,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821",padding:14,flexDirection:"row",alignItems:"center"},rowIcon:{width:34,fontSize:22,color:"#B8FF4A"},rowCopy:{flex:1},rowTitle:{fontSize:14,fontWeight:"900",color:"#FFF"},rowText:{marginTop:4,fontSize:11,color:"#777D89"},arrow:{fontSize:20,color:"#B8FF4A"}
});