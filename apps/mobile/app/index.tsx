import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { getUser } from "../lib/auth";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    getUser().then(user => {
      setSignedIn(!!user);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <View style={styles.container}><ActivityIndicator color="#B8FF4A" /></View>;
  }

  return <Redirect href={signedIn ? "/home" : "/auth/phone"} />;
}

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:"#0B0D12",alignItems:"center",justifyContent:"center"}
});
