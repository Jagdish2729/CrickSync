import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen(){
 return <SafeAreaView style={styles.container}><View style={styles.content}>
  <View style={styles.top}><View><Text style={styles.eyebrow}>GOOD TO HAVE YOU</Text><Text style={styles.brand}>CrickSync <Text style={styles.dot}>●</Text></Text></View><View style={styles.avatar}><Text style={styles.avatarText}>J</Text></View></View>
  <Text style={styles.greeting}>Ready to{"\n"}play?</Text>
  <View style={styles.hero}><Text style={styles.heroLabel}>UP NEXT</Text><Text style={styles.heroTitle}>No matches yet.</Text><Text style={styles.heroText}>Your confirmed games will show up here.</Text><View style={styles.line}/><Text style={styles.heroAction}>+ Create a match</Text></View>
  <View style={styles.row}><View style={styles.small}><Text style={styles.smallNumber}>0</Text><Text style={styles.smallLabel}>MATCHES</Text></View><View style={styles.small}><Text style={styles.smallNumber}>0</Text><Text style={styles.smallLabel}>TEAMS</Text></View><View style={styles.small}><Text style={styles.smallNumber}>0</Text><Text style={styles.smallLabel}>INVITES</Text></View></View>
 </View></SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#0B0D12"},content:{flex:1,paddingHorizontal:24,paddingTop:20},
 top:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},eyebrow:{fontSize:9,fontWeight:"900",letterSpacing:1.4,color:"#666C78"},
 brand:{marginTop:4,fontSize:20,fontWeight:"900",color:"#FFF"},dot:{color:"#B8FF4A",fontSize:13},avatar:{width:42,height:42,borderRadius:21,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},avatarText:{fontSize:17,fontWeight:"900",color:"#0B0D12"},
 greeting:{marginTop:54,fontSize:46,lineHeight:47,fontWeight:"900",letterSpacing:-1.5,color:"#FFF"},hero:{marginTop:28,borderRadius:24,backgroundColor:"#151821",borderWidth:1,borderColor:"#292D38",padding:22},
 heroLabel:{fontSize:10,fontWeight:"900",letterSpacing:1.6,color:"#B8FF4A"},heroTitle:{marginTop:18,fontSize:25,fontWeight:"900",color:"#FFF"},heroText:{marginTop:8,fontSize:14,lineHeight:20,color:"#858B97"},line:{height:1,backgroundColor:"#292D38",marginVertical:20},heroAction:{fontSize:14,fontWeight:"900",color:"#B8FF4A"},
 row:{flexDirection:"row",gap:10,marginTop:14},small:{flex:1,borderRadius:18,backgroundColor:"#151821",borderWidth:1,borderColor:"#292D38",padding:16},smallNumber:{fontSize:26,fontWeight:"900",color:"#FFF"},smallLabel:{marginTop:4,fontSize:9,fontWeight:"900",letterSpacing:1,color:"#666C78"}
});