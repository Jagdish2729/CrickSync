import { useEffect, useRef, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(""); const [seconds, setSeconds] = useState(30);
  const inputRef = useRef<TextInput>(null);
  useEffect(() => { const timer=setInterval(()=>setSeconds(v=>v>0?v-1:0),1000); return ()=>clearInterval(timer); }, []);
  const verify=()=>{ if(otp.length===6) router.replace("/onboarding/profile"); };

  return <SafeAreaView style={styles.container}><View style={styles.content}>
    <Pressable onPress={()=>router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
    <Text style={styles.title}>Verify your number</Text><Text style={styles.subtitle}>Enter the 6-digit OTP sent to +91 {phone ?? ""}.</Text>
    <Pressable onPress={()=>inputRef.current?.focus()} style={styles.otpBox}><Text style={[styles.otpText,!otp&&styles.placeholder]}>{otp?otp.padEnd(6,"•"):"• • • • • •"}</Text></Pressable>
    <TextInput ref={inputRef} value={otp} onChangeText={v=>setOtp(v.replace(/\D/g,"").slice(0,6))} keyboardType="number-pad" maxLength={6} style={styles.hiddenInput} autoFocus/>
    <Pressable onPress={verify} disabled={otp.length!==6} style={[styles.button,otp.length!==6&&styles.buttonDisabled]}><Text style={styles.buttonText}>Verify</Text></Pressable>
    <Text style={styles.resendText}>{seconds>0 ? "Resend OTP in "+seconds+"s" : "Didn't receive it? Resend OTP"}</Text>
  </View></SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#F7F8FA"},content:{flex:1,padding:28,justifyContent:"center"},back:{fontSize:16,fontWeight:"700",color:"#374151",marginBottom:38},
 title:{fontSize:30,fontWeight:"800",color:"#111827"},subtitle:{marginTop:12,fontSize:16,lineHeight:24,color:"#5F6368"},
 otpBox:{marginTop:34,height:60,borderRadius:14,borderWidth:1,borderColor:"#D9DDE3",backgroundColor:"#FFF",justifyContent:"center",alignItems:"center"},
 otpText:{fontSize:24,fontWeight:"800",letterSpacing:5,color:"#111827"},placeholder:{color:"#C4C9D0"},hiddenInput:{position:"absolute",opacity:0,height:1,width:1},
 button:{marginTop:20,height:56,borderRadius:14,backgroundColor:"#111827",alignItems:"center",justifyContent:"center"},buttonDisabled:{opacity:.35},
 buttonText:{color:"#FFF",fontSize:16,fontWeight:"800"},resendText:{marginTop:20,textAlign:"center",color:"#6B7280",fontSize:14}
});
