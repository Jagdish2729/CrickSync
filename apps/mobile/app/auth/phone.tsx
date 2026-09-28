import { useState } from "react";
import { Keyboard, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { api } from "../../lib/api";

export default function PhoneScreen() {
  const [phone, setPhone] = useState("");
  const continueToOtp = async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) return;
    Keyboard.dismiss();
    await api("/auth/request-otp", { method: "POST", body: JSON.stringify({ phone: digits }) });
    router.push({ pathname: "/auth/otp", params: { phone: digits } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badge}><Text style={styles.badgeText}>CRICKSYNC</Text></View>
        <Text style={styles.title}>Your cricket.{"\n"}Your schedule.{"\n"}Zero clashes.</Text>
        <Text style={styles.subtitle}>One place for your matches, teams and cricket life.</Text>
        <View style={styles.field}>
          <Text style={styles.label}>MOBILE NUMBER</Text>
          <View style={styles.phoneRow}>
            <Text style={styles.prefix}>+91</Text><View style={styles.divider} />
            <TextInput value={phone} onChangeText={v => setPhone(v.replace(/\D/g, "").slice(0,10))}
              placeholder="98765 43210" placeholderTextColor="#777B86" keyboardType="phone-pad"
              returnKeyType="done" blurOnSubmit onSubmitEditing={continueToOtp}
              maxLength={10} style={styles.input}/>
          </View>
          <Text style={styles.hint}>We'll send you a one-time verification code.</Text>
        </View>
        <Pressable onPress={continueToOtp} disabled={phone.length !== 10}
          style={({pressed}) => [styles.button, phone.length !== 10 && styles.buttonDisabled, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Let's play  →</Text>
        </Pressable>
        <Text style={styles.terms}>By continuing, you agree to our Terms & Privacy Policy.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:"#0B0D12"},content:{flex:1,paddingHorizontal:24,justifyContent:"center"},
  badge:{alignSelf:"flex-start",paddingHorizontal:13,paddingVertical:8,borderRadius:30,backgroundColor:"#171A22",borderWidth:1,borderColor:"#292D38",marginBottom:28},
  badgeText:{fontSize:12,fontWeight:"900",letterSpacing:1.2,color:"#B8FF4A"},
  title:{fontSize:42,lineHeight:45,fontWeight:"900",letterSpacing:-1.5,color:"#FFFFFF"},
  subtitle:{marginTop:16,fontSize:16,lineHeight:23,color:"#9CA1AD",maxWidth:330},field:{marginTop:38},
  label:{fontSize:11,fontWeight:"900",letterSpacing:1.5,color:"#777D89",marginBottom:10},
  phoneRow:{height:62,borderRadius:17,backgroundColor:"#151821",borderWidth:1,borderColor:"#2A2E39",flexDirection:"row",alignItems:"center",paddingHorizontal:16},
  prefix:{fontSize:17,fontWeight:"800",color:"#FFFFFF"},divider:{height:26,width:1,backgroundColor:"#343844",marginHorizontal:14},
  input:{flex:1,fontSize:18,fontWeight:"600",color:"#FFFFFF",paddingVertical:0},hint:{marginTop:9,fontSize:12,color:"#686E7B"},
  button:{marginTop:24,height:60,borderRadius:17,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},
  buttonDisabled:{opacity:.28},buttonPressed:{transform:[{scale:.98}]},buttonText:{fontSize:17,fontWeight:"900",color:"#0B0D12"},
  terms:{marginTop:18,fontSize:11,lineHeight:17,color:"#5F6470",textAlign:"center"}
});