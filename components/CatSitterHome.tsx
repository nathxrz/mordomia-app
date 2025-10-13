import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CatSitterHome({ name }: { name: string }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cat Sitter Home Screen</Text>
      <Text>Welcome, {name}!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  container: { flex: 1, padding: 16 },
});
