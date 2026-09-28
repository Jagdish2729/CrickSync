import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

export default function PhoneScreen() {
  const [phone, setPhone] = useState("");
  const continueToOtp = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) router.push({ pathname: "/auth/otp", params: { phone: digits } });
  };

  return (
    <SafeAreaView style={styles.container}><View style={styles.content}>
      <Text style={styles.brand}>CrickSync</Text>
      <Text style={styles.title}>Your cricket schedule, synced.</Text>
      <Text style={styles.subtitle}>Sign in with your mobile number to manage matches, teams and invitations.</Text>
      <View style={styles.field}><Text style={styles.label}>Mobile number</Text>
        <View style={styles.phoneRow}><Text style={styles.prefix}>+91</Text>
          <TextInput value={phone} onChangeText={v => setPhone(v.replace(/\D/g, "").slice(0,10))}
            placeholder="98765 43210" placeholderTextColor="#9AA0A6" keyboardType="phone-pad" maxLength={10} style={styles.input}/>
        </View>
      </View>
      <Pressable onPress={continueToOtp} disabled={phone.length !== 10}
        style={[styles.button, phone.length !== 10 && styles.buttonDisabled]}><Text style={styles.buttonText}>Continue</Text></Pressable>
      <Text style={styles.terms}>By continuing, you agree to CrickSync's Terms and Privacy Policy.</Text>
    </View></SafeAreaView>
  );
}
const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:"#F7F8FA"},content:{flex:1,padding:28,justifyContent:"center"},
  brand:{fontSize:18,fontWeight:"800",marginBottom:28},title:{fontSize:34,lineHeight:40,fontWeight:"800",color:"#111827"},
  subtitle:{marginTop:14,fontSize:16,lineHeight:24,color:"#5F6368"},field:{marginTop:38},label:{fontSize:14,fontWeight:"700",color:"#374151",marginBottom:9},
  phoneRow:{flexDirection:"row",alignItems:"center",backgroundColor:"#FFFFFF",borderWidth:1,borderColor:"#D9DDE3",borderRadius:14,paddingHorizontal:16,height:58},
  prefix:{fontSize:16,fontWeight:"700",color:"#111827",marginRight:12},input:{flex:1,fontSize:17,color:"#111827"},
  button:{marginTop:20,height:56,borderRadius:14,backgroundColor:"#111827",alignItems:"center",justifyContent:"center"},buttonDisabled:{opacity:.35},
  buttonText:{color:"#FFFFFF",fontSize:16,fontWeight:"800"},terms:{marginTop:18,fontSize:12,lineHeight:18,color:"#8A919A",textAlign:"center"}
});
