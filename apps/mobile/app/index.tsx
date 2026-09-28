import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.logo}>CrickSync</Text>
        <Text style={styles.title}>Your cricket schedule, synced.</Text>
        <Text style={styles.subtitle}>
          Foundation is ready. Authentication and the player/captain onboarding come next.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 28,
    backgroundColor: "#F7F8FA"
  },
  logo: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 18
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800"
  },
  subtitle: {
    marginTop: 14,
    fontSize: 16,
    lineHeight: 24,
    color: "#5F6368"
  }
});
