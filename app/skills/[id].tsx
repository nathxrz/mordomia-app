import { useSkill } from "@/hooks/useSkill";
import { useUser } from "@/hooks/useUser";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function SkillDetails() {
  const { id } = useLocalSearchParams();
  const { skill, fetchSkill } = useSkill(id as string);
  const [adminName, setAdminName] = useState<string | null>(null);
  const { getUserAdmin } = useUser();

  useFocusEffect(
    useCallback(() => {
      if (!skill) return;
      fetchSkill();
    }, [skill, fetchSkill])
  );

  useEffect(() => {
    if (!skill) return;
    getUserAdmin(skill.id_admin).then(({ name }) => {
      setAdminName(name);
    });
  }, [skill]);

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
        <Image
          source={
            skill?.icon_skill
              ? { uri: skill?.icon_skill }
              : require("../../assets/images/avatar.png")
          }
          style={{ width: 100, height: 100 }}
        />
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text>{skill?.name}</Text>
        <Text>{skill?.description}</Text>
        <Text>Última atualização por: {adminName}</Text>
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
