import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function Schedules() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F7FA", // fundo neutro
        padding: 20,
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          paddingVertical: 30,
          paddingHorizontal: 24,
          borderRadius: 16,
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: 6,
          gap: 10,
          width: "90%",
        }}
      >
        <MaterialCommunityIcons
          name="hammer-wrench"
          size={46}
          color="#6C63FF" // roxo base (altere se tiver paleta específica)
        />

        <Text
          variant="headlineSmall"
          style={{ fontWeight: "bold", textAlign: "center", color: "#1C1C1C" }}
        >
          Em desenvolvimento
        </Text>

        <Text
          variant="bodyMedium"
          style={{
            textAlign: "center",
            color: "#666",
          }}
        >
          Estamos construindo essa funcionalidade com muito carinho 💜 Em breve
          estará disponível.
        </Text>
      </View>
    </View>
  );
}
