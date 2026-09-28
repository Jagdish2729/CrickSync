import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { router } from "expo-router";
import { addTeamPlayer, getTeams, Team, subscribeTeam } from "../../lib/teams";
import { getUser } from "../../lib/auth";

export default function CaptainTeamScreen() {
 const [teams,setTeams]=useState<Team[]>([]);
 const [selectedTeamId,setSelectedTeamId]=useState("");
 const [phone,setPhone]=useState("");
 const [userPhone,setUserPhone]=useState("");

 const refresh=useCallback(()=>{Promise.all([getTeams(),getUser()]).then(([list,u])=>{setTeams(list);setSelectedTeamId(current=>current&&list.some(t=>t.id===current)?current:(list[0]?.id||""));setUserPhone(u?.phone||"");});},[]);
 useEffect(()=>{refresh();const off=subscribeTeam(refresh);return off;},[refresh]);
 useFocusEffect(useCallback(()=>{refresh();},[refresh]));

 const team=teams.find(item=>item.id===selectedTeamId);
 const add=async()=>{
   const normalized=phone.replace(/\D/g,"");
   if(!team||!normalized||normalized===userPhone.replace(/\D/g,"")) return;
   const updated=await addTeamPlayer(team.id,normalized);
   if(updated){setTeams(current=>current.map(item=>item.id===updated.id?updated:item));setPhone("");}
 };

 return <SafeAreaView style={styles.container}><ScrollView contentContainerStyle={styles.content}>
  <Pressable onPress={()=>router.back()}><Text style={styles.back}>‹  Captain Home</Text></Pressable>
  <Text style={styles.eyebrow}>MY TEAMS</Text>
  <Text style={styles.title}>Build your squads.</Text>
  <Text style={styles.subtitle}>Create multiple teams and manage each squad separately.</Text>

  <Pressable onPress={()=>router.push("/captain/team/create")} style={styles.createButton}><Text style={styles.createText}>＋ Create another team</Text></Pressable>

  <Text style={styles.section}>YOUR TEAMS · {teams.length}</Text>
  {teams.length?teams.map(item=><Pressable key={item.id} onPress={()=>setSelectedTeamId(item.id)} style={[styles.teamCard,item.id===selectedTeamId&&styles.teamCardActive]}><View style={styles.teamCopy}><Text style={styles.teamName}>{item.name}</Text><Text style={styles.teamMeta}>{item.players.length} players</Text></View><Text style={styles.teamCheck}>{item.id===selectedTeamId?"✓":"○"}</Text></Pressable>):<View style={styles.empty}><Text style={styles.emptyTitle}>No teams yet</Text><Text style={styles.emptyText}>Create your first team to start scheduling matches.</Text></View>}

  {team&&<><Text style={styles.section}>SELECTED TEAM · {team.name.toUpperCase()}</Text>
   <View style={styles.addBox}><Text style={styles.label}>ADD PLAYER</Text><TextInput value={phone} onChangeText={v=>setPhone(v.replace(/\D/g,"").slice(0,10))} keyboardType="phone-pad" placeholder="10-digit mobile number" placeholderTextColor="#666C78" style={styles.input}/><Pressable disabled={phone.length<10} onPress={add} style={[styles.button,phone.length<10&&styles.disabled]}><Text style={styles.buttonText}>Send team invite  →</Text></Pressable><Text style={styles.note}>The player must accept before becoming a team member.</Text></View>
   <Text style={styles.section}>SQUAD · {team.players.length}</Text>
   {team.players.length?team.players.map(player=><View key={player.id} style={styles.player}><View style={styles.initial}><Text style={styles.initialText}>{player.name?.charAt(0)?.toUpperCase()||"?"}</Text></View><View style={styles.playerCopy}><Text style={styles.playerName}>{player.name||player.phone}</Text><Text style={styles.playerPhone}>{player.phone}</Text></View><Text style={[styles.status,player.status==="ACCEPTED"&&styles.accepted]}>{player.status}</Text></View>):<View style={styles.empty}><Text style={styles.emptyTitle}>No players yet</Text><Text style={styles.emptyText}>Add your first player using their CrickSync mobile number.</Text></View>}
  </>}
 </ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#0B0D12"},content:{padding:24,paddingBottom:40},back:{fontSize:15,fontWeight:"800",color:"#9CA1AD",marginBottom:30},
 eyebrow:{fontSize:10,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},title:{marginTop:8,fontSize:38,lineHeight:42,fontWeight:"900",color:"#FFF"},subtitle:{marginTop:12,fontSize:15,lineHeight:22,color:"#858B97"},
 createButton:{marginTop:22,height:52,borderRadius:15,borderWidth:1,borderColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},createText:{fontSize:14,fontWeight:"900",color:"#B8FF4A"},
 section:{marginTop:26,fontSize:10,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},teamCard:{marginTop:9,minHeight:68,borderRadius:17,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821",padding:14,flexDirection:"row",alignItems:"center"},teamCardActive:{borderColor:"#B8FF4A",backgroundColor:"#171C14"},teamCopy:{flex:1},teamName:{fontSize:15,fontWeight:"900",color:"#FFF"},teamMeta:{marginTop:4,fontSize:10,color:"#777D89"},teamCheck:{fontSize:20,color:"#B8FF4A"},
 addBox:{marginTop:10,padding:18,borderRadius:20,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821"},label:{fontSize:10,fontWeight:"900",letterSpacing:1.3,color:"#777D89",marginBottom:9},input:{height:56,borderRadius:15,borderWidth:1,borderColor:"#2A2E39",backgroundColor:"#0F1117",paddingHorizontal:15,fontSize:16,fontWeight:"700",color:"#FFF"},button:{marginTop:12,height:56,borderRadius:15,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},disabled:{opacity:.25},buttonText:{fontSize:15,fontWeight:"900",color:"#0B0D12"},note:{marginTop:10,fontSize:11,lineHeight:17,color:"#666C78"},
 player:{marginTop:9,minHeight:68,borderRadius:17,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821",padding:12,flexDirection:"row",alignItems:"center"},initial:{width:40,height:40,borderRadius:12,backgroundColor:"#242832",alignItems:"center",justifyContent:"center"},initialText:{fontWeight:"900",color:"#B8FF4A"},playerCopy:{flex:1,marginLeft:11},playerName:{fontSize:14,fontWeight:"900",color:"#FFF"},playerPhone:{marginTop:3,fontSize:10,color:"#777D89"},status:{fontSize:8,fontWeight:"900",letterSpacing:.7,color:"#E0A84A"},accepted:{color:"#B8FF4A"},empty:{marginTop:10,padding:18,borderRadius:18,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821"},emptyTitle:{fontSize:15,fontWeight:"900",color:"#FFF"},emptyText:{marginTop:5,fontSize:11,lineHeight:17,color:"#666C78"}
});