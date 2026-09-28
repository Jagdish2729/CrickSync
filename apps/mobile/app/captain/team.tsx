import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { router } from "expo-router";
import { addTeamPlayer, getTeam, Team, subscribeTeam } from "../../lib/teams";
import { getUser } from "../../lib/auth";

export default function CaptainTeamScreen() {
 const [team,setTeam]=useState<Team|null>(null);
 const [phone,setPhone]=useState("");
 const [userPhone,setUserPhone]=useState("");

 const refresh=useCallback(()=>{Promise.all([getTeam(),getUser()]).then(([t,u])=>{setTeam(t);setUserPhone(u?.phone||"");});},[]);
 useEffect(()=>{refresh();const off=subscribeTeam(refresh);return off;},[refresh]);
 useFocusEffect(useCallback(()=>{refresh();},[refresh]));

 const add=async()=>{
   const normalized=phone.replace(/\D/g,"");
   if(!normalized || normalized===userPhone.replace(/\D/g,"")) return;
   const updated=await addTeamPlayer(normalized);
   if(updated){setTeam(updated);setPhone("");}
 };

 return <SafeAreaView style={styles.container}><ScrollView contentContainerStyle={styles.content}>
  <Pressable onPress={()=>router.back()}><Text style={styles.back}>‹  Captain Home</Text></Pressable>
  <Text style={styles.eyebrow}>MY TEAM</Text>
  <Text style={styles.title}>{team?.name||"Your team"}</Text>
  <Text style={styles.subtitle}>Build your squad using the mobile numbers players use for CrickSync.</Text>

  <View style={styles.addBox}>
   <Text style={styles.label}>ADD PLAYER</Text>
   <TextInput value={phone} onChangeText={v=>setPhone(v.replace(/\D/g,"").slice(0,10))} keyboardType="phone-pad" placeholder="10-digit mobile number" placeholderTextColor="#666C78" style={styles.input}/>
   <Pressable disabled={phone.length<10} onPress={add} style={[styles.button,phone.length<10&&styles.disabled]}><Text style={styles.buttonText}>Send team invite  →</Text></Pressable>
   <Text style={styles.note}>The player must accept before becoming a team member.</Text>
  </View>

  <Text style={styles.section}>SQUAD · {team?.players.length||0}</Text>
  {team?.players.length ? team.players.map(player=><View key={player.id} style={styles.player}><View style={styles.initial}><Text style={styles.initialText}>{player.name?.charAt(0)?.toUpperCase()||"?"}</Text></View><View style={styles.playerCopy}><Text style={styles.playerName}>{player.name||player.phone}</Text><Text style={styles.playerPhone}>{player.phone}</Text></View><Text style={[styles.status,player.status==="ACCEPTED"&&styles.accepted]}>{player.status}</Text></View>) : <View style={styles.empty}><Text style={styles.emptyTitle}>No players yet</Text><Text style={styles.emptyText}>Add your first player using their CrickSync mobile number.</Text></View>}
 </ScrollView></SafeAreaView>;
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#0B0D12"},content:{padding:24,paddingBottom:40},back:{fontSize:15,fontWeight:"800",color:"#9CA1AD",marginBottom:34},
 eyebrow:{fontSize:10,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},title:{marginTop:8,fontSize:40,lineHeight:43,fontWeight:"900",color:"#FFF"},subtitle:{marginTop:12,fontSize:15,lineHeight:22,color:"#858B97"},
 addBox:{marginTop:26,padding:18,borderRadius:20,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821"},label:{fontSize:10,fontWeight:"900",letterSpacing:1.3,color:"#777D89",marginBottom:9},input:{height:56,borderRadius:15,borderWidth:1,borderColor:"#2A2E39",backgroundColor:"#0F1117",paddingHorizontal:15,fontSize:16,fontWeight:"700",color:"#FFF"},
 button:{marginTop:12,height:56,borderRadius:15,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},disabled:{opacity:.25},buttonText:{fontSize:15,fontWeight:"900",color:"#0B0D12"},note:{marginTop:10,fontSize:11,lineHeight:17,color:"#666C78"},
 section:{marginTop:28,fontSize:10,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},player:{marginTop:9,minHeight:68,borderRadius:17,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821",padding:12,flexDirection:"row",alignItems:"center"},initial:{width:40,height:40,borderRadius:12,backgroundColor:"#242832",alignItems:"center",justifyContent:"center"},initialText:{fontWeight:"900",color:"#B8FF4A"},playerCopy:{flex:1,marginLeft:11},playerName:{fontSize:14,fontWeight:"900",color:"#FFF"},playerPhone:{marginTop:3,fontSize:10,color:"#777D89"},status:{fontSize:8,fontWeight:"900",letterSpacing:.7,color:"#E0A84A"},accepted:{color:"#B8FF4A"},empty:{marginTop:10,padding:18,borderRadius:18,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821"},emptyTitle:{fontSize:15,fontWeight:"900",color:"#FFF"},emptyText:{marginTop:5,fontSize:11,lineHeight:17,color:"#666C78"}
});
