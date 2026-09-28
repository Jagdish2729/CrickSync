import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
type Role="PLAYER"|"CAPTAIN";

export default function RoleScreen(){
 const [role,setRole]=useState<Role>("PLAYER");
 return <SafeAreaView style={styles.container}><View style={styles.content}>
  <View style={styles.progress}><View style={styles.done}/><View style={styles.done}/><View style={styles.active}/></View>
  <Text style={styles.step}>02 / 02</Text><Text style={styles.title}>What's your{"\n"}game?</Text>
  <Text style={styles.subtitle}>Pick how you want to use CrickSync. You can do both later.</Text>
  <Pressable onPress={()=>setRole("PLAYER")} style={[styles.card,role==="PLAYER"&&styles.selected]}>
   <View style={styles.icon}><Text style={styles.iconText}>P</Text></View><View style={styles.copy}><Text style={styles.cardTitle}>Player</Text><Text style={styles.cardText}>Join teams, accept invites & never miss a match.</Text></View><Text style={styles.radio}>{role==="PLAYER"?"●":"○"}</Text>
  </Pressable>
  <Pressable onPress={()=>setRole("CAPTAIN")} style={[styles.card,role==="CAPTAIN"&&styles.selected]}>
   <View style={styles.icon}><Text style={styles.iconText}>C</Text></View><View style={styles.copy}><Text style={styles.cardTitle}>Captain</Text><Text style={styles.cardText}>Build teams, organise matches & call the shots.</Text></View><Text style={styles.radio}>{role==="CAPTAIN"?"●":"○"}</Text>
  </Pressable>
  <Pressable onPress={()=>router.replace("/home")} style={styles.button}><Text style={styles.buttonText}>Let's go  →</Text></Pressable>
 </View></SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#0B0D12"},content:{flex:1,paddingHorizontal:24,justifyContent:"center"},
 progress:{flexDirection:"row",gap:6,marginBottom:24},done:{height:4,flex:1,borderRadius:5,backgroundColor:"#B8FF4A"},active:{height:4,flex:1,borderRadius:5,backgroundColor:"#343844"},
 step:{fontSize:11,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},title:{marginTop:10,fontSize:40,lineHeight:43,fontWeight:"900",color:"#FFF",letterSpacing:-1},
 subtitle:{marginTop:14,fontSize:16,lineHeight:23,color:"#8E94A0"},
 card:{marginTop:22,minHeight:108,borderRadius:20,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821",padding:16,flexDirection:"row",alignItems:"center"},
 selected:{borderColor:"#B8FF4A",backgroundColor:"#171C14"},icon:{width:44,height:44,borderRadius:14,backgroundColor:"#242832",alignItems:"center",justifyContent:"center"},
 iconText:{fontSize:16,fontWeight:"900",color:"#B8FF4A"},copy:{flex:1,marginLeft:13},cardTitle:{fontSize:18,fontWeight:"900",color:"#FFF"},cardText:{marginTop:5,fontSize:13,lineHeight:18,color:"#858B97"},radio:{fontSize:23,color:"#B8FF4A",marginLeft:8},
 button:{marginTop:28,height:60,borderRadius:17,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},buttonText:{fontSize:16,fontWeight:"900",color:"#0B0D12"}
});