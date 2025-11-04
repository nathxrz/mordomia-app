import { router } from "expo-router";
import { View } from "react-native";
import { Button } from "react-native-paper";

export default function EditPortfolio() {
  return (
    <View>
      Edit Portfolio
      <Button onPress={() => router.back()}>Voltar</Button>
    </View>
  );
}
