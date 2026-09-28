import { useEffect, useRef, useState } from "react";
import { Keyboard, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { saveUser } from "../../lib/auth";
import { api, setToken } from "../../lib/api";

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp,setOtp]=useState(""); const [seconds,setSeconds]=useState(30);
  const inputRef=useRef<TextInput>(null);
  useEffect(()=>{const timer=setInterval(()=>setSeconds(v=>v>0?v-1:0),1000);return()=>clearInterval(timer)},[]);
  const verify=async()=>{if(otp.length===6){Keyboard.dismiss();const result=await api<{token:string;user:{phone:string}}>("/auth/verify-otp",{method:"POST",body:JSON.stringify({phone,code:otp})});await setToken(result.token);router.replace({pathname:"/onboarding/profile",params:{phone}})}};
  return <SafeAreaView style={styles.container}><View style={styles.content}>
    <Pressable onPress={()=>router.back()}><Text style={styles.back}>‹  Back</Text></Pressable>
    <View style={styles.badge}><Text style={styles.badgeText}>VERIFY</Text></View>
    <Text style={styles.title}>One more step.</Text><Text style={styles.subtitle}>Enter the code sent to{"\n"}<Text style={styles.phone}>+91 {phone??""}</Text></Text>
    <Pressable onPress={()=>inputRef.current?.focus()} style={styles.otpBox}><Text style={[styles.otpText,!otp&&styles.placeholder]}>{otp?otp.padEnd(6,"•"):"• • • • • •"}</Text></Pressable>
    <TextInput
      ref={inputRef}
      value={otp}
      onChangeText={v=>setOtp(v.replace(/\D/g,"").slice(0,6))}
      keyboardType="number-pad"
      returnKeyType="done"
      blurOnSubmit
      onSubmitEditing={verify}
      maxLength={6}
      style={styles.hiddenInput}
      autoFocus
    />
    <Pressable onPress={verify} disabled={otp.length!==6} style={[styles.button,otp.length!==6&&styles.disabled]}><Text style={styles.buttonText}>Verify & continue  →</Text></Pressable>
    <Text style={styles.resend}>{seconds>0?"Resend code in "+seconds+"s":"Didn't get it? Resend code"}</Text>
  </View></SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#0B0D12"},content:{flex:1,paddingHorizontal:24,justifyContent:"center"},
 back:{fontSize:15,fontWeight:"800",color:"#9CA1AD",marginBottom:30},badge:{alignSelf:"flex-start",paddingHorizontal:12,paddingVertical:7,borderRadius:20,backgroundColor:"#171A22",marginBottom:22},
 badgeText:{fontSize:11,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},title:{fontSize:40,lineHeight:44,fontWeight:"900",color:"#FFF",letterSpacing:-1},
 subtitle:{marginTop:14,fontSize:16,lineHeight:24,color:"#8E94A0"},phone:{color:"#FFF",fontWeight:"800"},
 otpBox:{marginTop:32,height:72,borderRadius:18,backgroundColor:"#151821",borderWidth:1,borderColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},
 otpText:{fontSize:26,fontWeight:"900",letterSpacing:7,color:"#FFF"},placeholder:{color:"#505560"},hiddenInput:{position:"absolute",opacity:0,height:1,width:1},
 button:{marginTop:20,height:60,borderRadius:17,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},disabled:{opacity:.25},
 buttonText:{fontSize:16,fontWeight:"900",color:"#0B0D12"},resend:{marginTop:20,textAlign:"center",fontSize:13,color:"#666C78"}
});