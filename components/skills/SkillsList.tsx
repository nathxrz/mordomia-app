import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

async function fetchSkills() {
  try {
    const { data: skills, error } = await supabase.from("skills").select("*");

    if (error) {
      throw new Error(translateError(error.code));
    }
    return skills;
  } catch (error) {
    Alert.alert("Erro ao buscar as habilidades", String(error));
  }
}

export default function SkillsList() {
  const { user } = useUser();
  const [skills, setSkills] = React.useState<
    {
      id: string;
      name: string;
      description: string;
      icon_skill: string;
      id_admin: string;
    }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;

      fetchSkills().then((data) => {
        if (data) setSkills(data);
      });
    }, [user?.id])
  );

  const SkillItem = ({
    id,
    name,
    description,
    icon_skill,
    id_admin,
  }: {
    id: string;
    name: string;
    description: string;
    icon_skill: string;
    id_admin: string;
  }) => {
    return (
      <>
        <View
          style={{
            marginBottom: 20,
            borderColor: "#ccc",
            borderWidth: 1,
            padding: 10,
          }}
        >
          <View>
            <TouchableOpacity
            // onPress={() => {
            //   router.push("/edits/editSkill");
            // }}
            >
              <Icon name="edit" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
            // onPress={() => {
            //   router.push("/edits/editSkill");
            // }}
            >
              <Icon name="delete" size={24} color="#000" />
            </TouchableOpacity>
            <View>
              <Image
                source={
                  icon_skill
                    ? { uri: icon_skill }
                    : require("../../assets/images/avatar.png")
                }
                style={{ width: 100, height: 100 }}
              />
              <Text>{name}</Text>
              <Text>{description}</Text>
              <Text>Criado por: {id_admin}</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  function renderComponent() {
    if (skills.length === 0) {
      return <Text>Você não possui habilidades cadastradas.</Text>;
    }

    return (
      <FlatList
        data={skills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SkillItem
            id={item.id}
            name={item.name}
            description={item.description}
            icon_skill={item.icon_skill}
            id_admin={item.id_admin}
          />
        )}
      />
    );
  }

  return <View>{renderComponent()}</View>;
}
