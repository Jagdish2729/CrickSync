import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

export default function ProfileScreen() {
  const [name,setName]=useState(""); const [city,setCity]=useState("");
  const next=()=>{if(name.trim()&&city.trim()) router.push("/onboarding/role");};
  return <SafeAreaView style={styles.container}><View style={styles.content}>
    <Text style={styles.step}>STEP 1 OF 2</Text><Text style={styles.title}>Let's set up your profile</Text>
    <Text style={styles.subtitle}>Your name and city will help teammates and captains identify you.</Text>
    <View style={styles.field}><Text style={styles.label}>Full name</Text><TextInput value={name} onChangeText={setName} placeholder="Enter your name" placeholderTextColor="#9AA0A6" style={styles.input}/></View>
    <View style={styles.field}><Text style={styles.label}>City</Text><TextInput value={city} onChangeText={setCity} placeholder="e.g. Delhi" placeholderTextColor="#9AA0A6" style={styles.input}/></View>
    <Pressable onPress={next} disabled={!name.trim()||!city.trim()} style={[styles.button,(!name.trim()||!city.trim())&&styles.buttonDisabled]}><Text style={styles.buttonText}>Continue</Text></Pressable>
  </View></SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#F7F8FA"},content:{flex:1,padding:28,justifyContent:"center"},step:{fontSize:12,fontWeight:"800",letterSpacing:1.2,color:"#6B7280",marginBottom:12},
 title:{fontSize:30,lineHeight:36,fontWeight:"800",color:"#111827"},subtitle:{marginTop:12,fontSize:16,lineHeight:24,color:"#5F6368"},field:{marginTop:26},
 label:{fontSize:14,fontWeight:"700",color:"#374151",marginBottom:9},input:{height:56,borderRadius:14,borderWidth:1,borderColor:"#D9DDE3",backgroundColor:"#FFF",paddingHorizontal:16,fontSize:16,color:"#111827"},
 button:{marginTop:30,height:56,borderRadius:14,backgroundColor:"#111827",alignItems:"center",justifyContent:"center"},buttonDisabled:{opacity:.35},buttonText:{color:"#FFF",fontSize:16,fontWeight:"800"}
});
