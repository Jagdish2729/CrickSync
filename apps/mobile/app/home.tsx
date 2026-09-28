import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
 return <SafeAreaView style={styles.container}><View style={styles.content}>
  <Text style={styles.brand}>CrickSync</Text><Text style={styles.title}>You're all set.</Text>
  <Text style={styles.subtitle}>Your match calendar, teams and invitations will live here.</Text>
  <View style={styles.card}><Text style={styles.cardTitle}>Upcoming matches</Text><Text style={styles.cardText}>No matches yet. Your schedule will appear here.</Text></View>
 </View></SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#F7F8FA"},content:{flex:1,padding:28},brand:{marginTop:20,fontSize:18,fontWeight:"800",color:"#111827"},
 title:{marginTop:48,fontSize:32,fontWeight:"800",color:"#111827"},subtitle:{marginTop:12,fontSize:16,lineHeight:24,color:"#5F6368"},
 card:{marginTop:32,borderRadius:18,backgroundColor:"#FFF",borderWidth:1,borderColor:"#E1E4E8",padding:20},cardTitle:{fontSize:18,fontWeight:"800",color:"#111827"},cardText:{marginTop:8,fontSize:14,lineHeight:21,color:"#6B7280"}
});
