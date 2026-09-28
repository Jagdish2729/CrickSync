import { Keyboard, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

type BallType="WHITE"|"RED";

export default function MatchDetailsScreen(){
 const {date,time}=useLocalSearchParams<{date?:string;time?:string}>();
 const [matchName,setMatchName]=useState("");
 const [myTeam,setMyTeam]=useState("");
 const [opponent,setOpponent]=useState("");
 const [ground,setGround]=useState("");
 const [ball,setBall]=useState<BallType>("WHITE");
 const [overs,setOvers]=useState("");

 const save=()=>{
   if(matchName.trim()&&myTeam.trim()&&opponent.trim()&&ground.trim()){
     Keyboard.dismiss();
     router.replace("/home");
   }
 };

 return <SafeAreaView style={styles.container}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
  <Pressable onPress={()=>router.back()}><Text style={styles.back}>‹  Schedule</Text></Pressable>
  <Text style={styles.eyebrow}>MATCH DETAILS</Text>
  <Text style={styles.title}>Set up your game.</Text>
  <Text style={styles.subtitle}>Add the details your team needs before match day.</Text>

  <View style={styles.locked}><View><Text style={styles.lockedLabel}>DATE & TIME</Text><Text style={styles.lockedValue}>{date||"Selected date"}</Text><Text style={styles.lockedTime}>{time||"Selected time"}</Text></View><Text style={styles.lock}>LOCKED</Text></View>

  <View style={styles.field}><Text style={styles.label}>MATCH NAME</Text><TextInput value={matchName} onChangeText={setMatchName} placeholder="e.g. Sunday League" placeholderTextColor="#666C78" style={styles.input} returnKeyType="next"/></View>
  <View style={styles.field}><Text style={styles.label}>MY TEAM</Text><TextInput value={myTeam} onChangeText={setMyTeam} placeholder="e.g. Pahadi Panthers" placeholderTextColor="#666C78" style={styles.input} returnKeyType="next"/></View>
  <View style={styles.field}><Text style={styles.label}>OPPOSITION</Text><TextInput value={opponent} onChangeText={setOpponent} placeholder="e.g. Delhi Strikers" placeholderTextColor="#666C78" style={styles.input} returnKeyType="next"/></View>
  <View style={styles.field}><Text style={styles.label}>GROUND / VENUE</Text><TextInput value={ground} onChangeText={setGround} placeholder="e.g. Noida Cricket Ground" placeholderTextColor="#666C78" style={styles.input} returnKeyType="next"/></View>

  <View style={styles.field}><Text style={styles.label}>BALL TYPE</Text>
   <View style={styles.options}>
    <Pressable onPress={()=>setBall("WHITE")} style={[styles.option,ball==="WHITE"&&styles.optionActive]}><View style={styles.ballWhite}/><View style={styles.optionCopy}><Text style={[styles.optionTitle,ball==="WHITE"&&styles.activeText]}>White Ball</Text><Text style={styles.optionSub}>Coloured clothing</Text></View><Text style={styles.radio}>{ball==="WHITE"?"●":"○"}</Text></Pressable>
    <Pressable onPress={()=>setBall("RED")} style={[styles.option,ball==="RED"&&styles.optionActive]}><View style={styles.ballRed}/><View style={styles.optionCopy}><Text style={[styles.optionTitle,ball==="RED"&&styles.activeText]}>Red Ball</Text><Text style={styles.optionSub}>White clothing</Text></View><Text style={styles.radio}>{ball==="RED"?"●":"○"}</Text></Pressable>
   </View>
  </View>

  <View style={styles.field}><Text style={styles.label}>OVERS</Text><TextInput value={overs} onChangeText={v=>setOvers(v.replace(/\D/g,"").slice(0,3))} placeholder="e.g. 20" placeholderTextColor="#666C78" style={styles.input} keyboardType="number-pad" returnKeyType="done" onSubmitEditing={Keyboard.dismiss}/></View>

  <Pressable onPress={save} disabled={!matchName.trim()||!myTeam.trim()||!opponent.trim()||!ground.trim()} style={[styles.button,(!matchName.trim()||!myTeam.trim()||!opponent.trim()||!ground.trim())&&styles.disabled]}><Text style={styles.buttonText}>Save match  →</Text></Pressable>
  <Text style={styles.note}>You can add players and manage invites after saving the match.</Text>
 </ScrollView></SafeAreaView>;
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#0B0D12"},content:{padding:24,paddingBottom:40},
 back:{fontSize:15,fontWeight:"800",color:"#9CA1AD",marginBottom:30},eyebrow:{fontSize:10,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},
 title:{marginTop:8,fontSize:38,lineHeight:42,fontWeight:"900",color:"#FFF",letterSpacing:-1},subtitle:{marginTop:12,fontSize:15,lineHeight:22,color:"#858B97"},
 locked:{marginTop:26,borderRadius:18,borderWidth:1,borderColor:"#343844",backgroundColor:"#151821",padding:17,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},lockedLabel:{fontSize:9,fontWeight:"900",letterSpacing:1.4,color:"#777D89"},lockedValue:{marginTop:7,fontSize:17,fontWeight:"900",color:"#FFF"},lockedTime:{marginTop:3,fontSize:13,fontWeight:"700",color:"#B8FF4A"},lock:{fontSize:8,fontWeight:"900",letterSpacing:1,color:"#666C78"},
 field:{marginTop:22},label:{fontSize:10,fontWeight:"900",letterSpacing:1.4,color:"#777D89",marginBottom:9},input:{height:58,borderRadius:16,borderWidth:1,borderColor:"#2A2E39",backgroundColor:"#151821",paddingHorizontal:16,fontSize:16,fontWeight:"600",color:"#FFF"},
 options:{gap:10},option:{minHeight:72,borderRadius:17,borderWidth:1,borderColor:"#2A2E39",backgroundColor:"#151821",padding:14,flexDirection:"row",alignItems:"center"},optionActive:{borderColor:"#B8FF4A",backgroundColor:"#171C14"},ballWhite:{width:28,height:28,borderRadius:14,backgroundColor:"#FFF",borderWidth:1,borderColor:"#777"},ballRed:{width:28,height:28,borderRadius:14,backgroundColor:"#8F2222",borderWidth:1,borderColor:"#B85A5A"},optionCopy:{flex:1,marginLeft:12},optionTitle:{fontSize:15,fontWeight:"900",color:"#FFF"},activeText:{color:"#B8FF4A"},optionSub:{marginTop:3,fontSize:11,color:"#777D89"},radio:{fontSize:20,color:"#B8FF4A"},
 button:{marginTop:28,height:60,borderRadius:17,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},disabled:{opacity:.25},buttonText:{fontSize:16,fontWeight:"900",color:"#0B0D12"},note:{marginTop:13,textAlign:"center",fontSize:11,lineHeight:17,color:"#5F6470"}
});