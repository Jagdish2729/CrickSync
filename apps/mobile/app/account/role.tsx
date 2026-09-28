import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { getUser, switchRole, CrickSyncUser, Role } from "../../lib/auth";

export default function AccountRoleScreen(){
 const [user,setUser]=useState<CrickSyncUser|null>(null);
 useEffect(()=>{getUser().then(setUser);},[]);
 if(!user) return <SafeAreaView style={styles.container}/>;
 const roles=user.roles?.length?user.roles:[user.role];
 const other:Role=user.role==="PLAYER"?"CAPTAIN":"PLAYER";
 const hasOther=roles.includes(other);
 const change=async(role:Role)=>{const updated=await switchRole(role);if(updated){setUser(updated);router.replace("/home");}};
 return <SafeAreaView style={styles.container}><View style={styles.content}>
  <Pressable onPress={()=>router.back()}><Text style={styles.back}>‹  Back</Text></Pressable>
  <Text style={styles.eyebrow}>YOUR MODE</Text><Text style={styles.title}>How are you{"\n"}playing today?</Text>
  <Text style={styles.subtitle}>Your account stays the same. Only your active mode changes.</Text>
  <View style={styles.current}><Text style={styles.currentLabel}>ACTIVE NOW</Text><Text style={styles.currentValue}>{user.role==="CAPTAIN"?"Captain":"Player"}</Text></View>
  <Pressable onPress={()=>change("PLAYER")} style={[styles.card,user.role==="PLAYER"&&styles.selected]}><View style={styles.icon}><Text style={styles.iconText}>P</Text></View><View style={styles.copy}><Text style={styles.cardTitle}>Player</Text><Text style={styles.cardText}>Join teams and manage your own match schedule.</Text></View><Text style={styles.radio}>{user.role==="PLAYER"?"●":"○"}</Text></Pressable>
  <Pressable onPress={()=>change("CAPTAIN")} style={[styles.card,user.role==="CAPTAIN"&&styles.selected]}><View style={styles.icon}><Text style={styles.iconText}>C</Text></View><View style={styles.copy}><Text style={styles.cardTitle}>Captain</Text><Text style={styles.cardText}>{hasOther?"Create teams, schedule games & manage your squad.":"Unlock Captain mode for this account."}</Text></View><Text style={styles.radio}>{user.role==="CAPTAIN"?"●":"○"}</Text></Pressable>
 </View></SafeAreaView>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:"#0B0D12"},content:{flex:1,paddingHorizontal:24,paddingTop:22},back:{fontSize:15,fontWeight:"800",color:"#9CA1AD",marginBottom:42},eyebrow:{fontSize:10,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},title:{marginTop:8,fontSize:39,lineHeight:43,fontWeight:"900",color:"#FFF",letterSpacing:-1},subtitle:{marginTop:14,fontSize:15,lineHeight:22,color:"#858B97"},current:{marginTop:28,padding:18,borderRadius:18,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821"},currentLabel:{fontSize:9,fontWeight:"900",letterSpacing:1.3,color:"#666C78"},currentValue:{marginTop:6,fontSize:22,fontWeight:"900",color:"#B8FF4A"},card:{marginTop:14,minHeight:92,borderRadius:19,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821",padding:14,flexDirection:"row",alignItems:"center"},selected:{borderColor:"#B8FF4A",backgroundColor:"#171C14"},icon:{width:42,height:42,borderRadius:13,backgroundColor:"#242832",alignItems:"center",justifyContent:"center"},iconText:{fontSize:15,fontWeight:"900",color:"#B8FF4A"},copy:{flex:1,marginLeft:12},cardTitle:{fontSize:17,fontWeight:"900",color:"#FFF"},cardText:{marginTop:4,fontSize:12,lineHeight:17,color:"#858B97"},radio:{fontSize:21,color:"#B8FF4A",marginLeft:8}});
