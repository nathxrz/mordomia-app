import { useSkill } from "@/hooks/useSkill";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

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
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/skills/editSkill",
            params: { id: id },
          });
        }}
      >
        <Icon name="edit" size={24} color="#000" />
      </TouchableOpacity>
      <View style={{ marginBottom: 20 }}>
        <Text>{skill?.name}</Text>
        <Text>{skill?.description}</Text>
        <Text>
          Última atualização por:{" "}
          {skill?.users?.name ? skill.users.name : "Desconhecido"}
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={() => {
          router.back();
        }}
      >
        voltar
      </Button>
    </View>
  );
}
