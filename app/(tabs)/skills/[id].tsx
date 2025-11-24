import { useSkill } from "@/hooks/useSkill";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SkillDetails() {
  const { id } = useLocalSearchParams();
  const { skill, fetchSkill } = useSkill(id as string);

  useFocusEffect(
    useCallback(() => {
      if (!skill) return;
      fetchSkill();
    }, [skill, fetchSkill])
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Detalhes da Habilidade",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/skills")}
              style={{ marginLeft: 16 }}
            >
              <Text
                style={{
                  fontFamily: "MaterialSymbolsOutlined",
                  fontSize: 30,
                  lineHeight: 30,
                  color: "#000",
                }}
              >
                arrow_back
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <SafeAreaView style={styles.safeArea} edges={[]}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.cardContainer}>
              <View style={styles.cardContent}>
                <View style={styles.userInfoTitle}>
                  <Text style={styles.cardTitle}>{skill?.name}</Text>
                </View>
                <View style={styles.metaContainer}>
                  <Text style={styles.metaText}>
                    {skill?.description || "Nenhuma descrição adicionada."}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <TouchableOpacity
                style={styles.button_submit}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/skills/editSkill",
                    params: { id: id },
                  })
                }
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F7F6F8",
    flex: 1,
  },
  container: {
    position: "relative",
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 8,
  },

  button_submit: {
    width: 260,
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#DFD2FF",
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 100,
  },

  buttonText: {
    color: "#5910A2",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  metaContainer: {
    gap: 5,
  },
  metaText: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#605A6D",
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#FCFCFC",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 12,
  },
  cardContent: {
    padding: 16,
  },
  userInfoTitle: {
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
});
