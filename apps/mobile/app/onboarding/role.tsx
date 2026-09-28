import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
type Role="PLAYER"|"CAPTAIN";

export default function RoleScreen() {
 const [role,setRole]=useState<Role>("PLAYER");
 return <SafeAreaView style={styles.container}><View style={styles.content}>
  <Text style={styles.step}>STEP 2 OF 2</Text><Text style={styles.title}>How do you play?</Text>
  <Text style={styles.subtitle}>You can be a player and captain on the same CrickSync account.</Text>
  <Pressable onPress={()=>setRole("PLAYER")} style={[styles.card,role==="PLAYER"&&styles.cardSelected]}><View><Text style={styles.cardTitle}>Player</Text><Text style={styles.cardText}>Join teams, receive match invites and manage your schedule.</Text></View><Text style={styles.radio}>{role==="PLAYER"?"●":"○"}</Text></Pressable>
  <Pressable onPress={()=>setRole("CAPTAIN")} style={[styles.card,role==="CAPTAIN"&&styles.cardSelected]}><View><Text style={styles.cardTitle}>Captain</Text><Text style={styles.cardText}>Create teams, organise matches and invite players.</Text></View><Text style={styles.radio}>{role==="CAPTAIN"?"●":"○"}</Text></Pressable>
  <Pressable onPress={()=>router.replace("/home")} style={styles.button}><Text style={styles.buttonText}>Finish setup</Text></Pressable>
 </View></SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#F7F8FA"},content:{flex:1,padding:28,justifyContent:"center"},step:{fontSize:12,fontWeight:"800",letterSpacing:1.2,color:"#6B7280",marginBottom:12},
 title:{fontSize:30,lineHeight:36,fontWeight:"800",color:"#111827"},subtitle:{marginTop:12,fontSize:16,lineHeight:24,color:"#5F6368"},
 card:{marginTop:20,minHeight:104,borderRadius:16,borderWidth:1,borderColor:"#D9DDE3",backgroundColor:"#FFF",padding:18,flexDirection:"row",alignItems:"center"},cardSelected:{borderColor:"#111827",borderWidth:2},
 cardTitle:{fontSize:18,fontWeight:"800",color:"#111827"},cardText:{marginTop:6,fontSize:13,lineHeight:19,color:"#6B7280",paddingRight:18},radio:{marginLeft:"auto",fontSize:24,color:"#111827"},
 button:{marginTop:28,height:56,borderRadius:14,backgroundColor:"#111827",alignItems:"center",justifyContent:"center"},buttonText:{color:"#FFF",fontSize:16,fontWeight:"800"}
});
