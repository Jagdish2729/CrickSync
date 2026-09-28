import { SafeAreaView, StyleSheet, Text, View, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function CreateMatchScreen(){
 const {date,time}=useLocalSearchParams<{date?:string;time?:string}>();
 return <SafeAreaView style={styles.container}><View style={styles.content}>
  <Pressable onPress={()=>router.back()}><Text style={styles.back}>‹  Calendar</Text></Pressable>
  <Text style={styles.eyebrow}>NEW MATCH</Text><Text style={styles.title}>Schedule a game.</Text>
  <Text style={styles.subtitle}>You picked a slot from your calendar. Finish the match details here.</Text>
  <View style={styles.selected}><Text style={styles.label}>SELECTED SLOT</Text><Text style={styles.value}>{date||"Selected date"}</Text><Text style={styles.time}>{time||"Selected time"}</Text></View>
  <Pressable style={styles.button}><Text style={styles.buttonText}>Continue  →</Text></Pressable>
 </View></SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#0B0D12"},content:{flex:1,padding:24},
 back:{fontSize:15,fontWeight:"800",color:"#9CA1AD",marginBottom:38},eyebrow:{fontSize:10,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},
 title:{marginTop:8,fontSize:40,lineHeight:44,fontWeight:"900",color:"#FFF",letterSpacing:-1},subtitle:{marginTop:14,fontSize:15,lineHeight:22,color:"#858B97"},
 selected:{marginTop:30,borderRadius:20,borderWidth:1,borderColor:"#B8FF4A",backgroundColor:"#171C14",padding:20},label:{fontSize:10,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},value:{marginTop:12,fontSize:20,fontWeight:"900",color:"#FFF"},time:{marginTop:5,fontSize:15,fontWeight:"700",color:"#9CA1AD"},
 button:{marginTop:24,height:58,borderRadius:17,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},buttonText:{fontSize:16,fontWeight:"900",color:"#0B0D12"}
});