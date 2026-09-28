import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { createTeam } from "../../../lib/teams";
import { getUser } from "../../../lib/auth";

export default function CreateTeamScreen(){
 const [name,setName]=useState("");
 const save=async()=>{
   const user=await getUser();
   if(!name.trim()||!user) return;
   await createTeam(name,user.phone);
   router.replace("/captain/team");
 };
 return <SafeAreaView style={styles.container}><View style={styles.content}>
  <Pressable onPress={()=>router.back()}><Text style={styles.back}>‹  Captain Home</Text></Pressable>
  <Text style={styles.eyebrow}>FIRST STEP</Text><Text style={styles.title}>Name your team.</Text>
  <Text style={styles.subtitle}>Your team will be the base for every match you schedule and every player you invite.</Text>
  <Text style={styles.label}>TEAM NAME</Text><TextInput autoFocus value={name} onChangeText={setName} placeholder="e.g. Pahadi Panthers" placeholderTextColor="#666C78" style={styles.input}/>
  <Pressable disabled={!name.trim()} onPress={save} style={[styles.button,!name.trim()&&styles.disabled]}><Text style={styles.buttonText}>Create my team  →</Text></Pressable>
 </View></SafeAreaView>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:"#0B0D12"},content:{flex:1,padding:24,paddingTop:22},back:{fontSize:15,fontWeight:"800",color:"#9CA1AD",marginBottom:45},eyebrow:{fontSize:10,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},title:{marginTop:8,fontSize:40,lineHeight:43,fontWeight:"900",color:"#FFF"},subtitle:{marginTop:14,fontSize:15,lineHeight:22,color:"#858B97"},label:{marginTop:35,fontSize:10,fontWeight:"900",letterSpacing:1.3,color:"#777D89",marginBottom:9},input:{height:58,borderRadius:16,borderWidth:1,borderColor:"#2A2E39",backgroundColor:"#151821",paddingHorizontal:16,fontSize:16,fontWeight:"700",color:"#FFF"},button:{marginTop:16,height:60,borderRadius:17,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},disabled:{opacity:.25},buttonText:{fontSize:16,fontWeight:"900",color:"#0B0D12"}});
