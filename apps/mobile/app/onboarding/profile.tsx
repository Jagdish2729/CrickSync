import { Keyboard, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function ProfileScreen() {
 const [name,setName]=useState("");const [city,setCity]=useState("");
 const next=()=>{if(name.trim()&&city.trim()){Keyboard.dismiss();router.push("/onboarding/role")}};
 return <SafeAreaView style={styles.container}><View style={styles.content}>
  <View style={styles.progress}><View style={styles.progressOn}/><View/><View/></View>
  <Text style={styles.step}>01 / 02</Text><Text style={styles.title}>Tell us who{"\n"}you are.</Text>
  <Text style={styles.subtitle}>Let's create your cricket identity. Keep it simple.</Text>
  <View style={styles.field}><Text style={styles.label}>YOUR NAME</Text><TextInput value={name} onChangeText={setName} placeholder="e.g. Jagdish Negi" placeholderTextColor="#666C78" style={styles.input}/></View>
  <View style={styles.field}><Text style={styles.label}>CITY</Text><TextInput value={city} onChangeText={setCity} placeholder="e.g. Delhi NCR" placeholderTextColor="#666C78" style={styles.input} onSubmitEditing={next}/></View>
  <Pressable onPress={next} disabled={!name.trim()||!city.trim()} style={[styles.button,(!name.trim()||!city.trim())&&styles.disabled]}><Text style={styles.buttonText}>Next step  →</Text></Pressable>
 </View></SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#0B0D12"},content:{flex:1,paddingHorizontal:24,justifyContent:"center"},
 progress:{flexDirection:"row",gap:6,marginBottom:24},progressOn:{backgroundColor:"#B8FF4A"},step:{fontSize:11,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},
 title:{marginTop:10,fontSize:40,lineHeight:43,fontWeight:"900",letterSpacing:-1,color:"#FFF"},subtitle:{marginTop:14,fontSize:16,lineHeight:23,color:"#8E94A0"},
 field:{marginTop:30},label:{fontSize:10,fontWeight:"900",letterSpacing:1.5,color:"#777D89",marginBottom:9},
 input:{height:60,borderRadius:17,borderWidth:1,borderColor:"#2A2E39",backgroundColor:"#151821",paddingHorizontal:17,fontSize:16,fontWeight:"600",color:"#FFF"},
 button:{marginTop:28,height:60,borderRadius:17,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},disabled:{opacity:.25},
 buttonText:{fontSize:16,fontWeight:"900",color:"#0B0D12"}
});