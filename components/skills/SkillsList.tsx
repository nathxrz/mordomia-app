import { useSkill } from "@/hooks/useSkill";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ConfirmedModal from "../modais/ConfirmedModal";

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
  const { user, getUserAdmin } = useUser();
  const [modalVisibleConfirmed, setModalVisibleConfirmed] = useState(false);
  const [skills, setSkills] = useState<
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
    const { deleteSkill } = useSkill(id);
    const [adminName, setAdminName] = useState<string | null>(null);

    useEffect(() => {
      if (!id_admin) return;
      getUserAdmin(id_admin).then(({ name }) => {
        setAdminName(name);
      });
    }, [id_admin]);

    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            marginBottom: 20,
            borderColor: "#ccc",
            borderWidth: 1,
            padding: 10,
          }}
        >
          <TouchableOpacity onPress={() => router.push(`./skills/${id}`)}>
            <View>
              <TouchableOpacity onPress={() => setModalVisibleConfirmed(true)}>
                <Icon name="delete" size={24} color="#000" />
              </TouchableOpacity>

              <ConfirmedModal
                modalVisible={modalVisibleConfirmed}
                onConfirm={() => {
                  deleteSkill(id);
                  setSkills((prevSkills) =>
                    prevSkills.filter((skill) => skill.id !== id)
                  );
                  setModalVisibleConfirmed(false);
                }}
                onCancel={() => setModalVisibleConfirmed(false)}
                message="Tem certeza que deseja excluir esta habilidade?"
              />

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
                <Text>Última atualização por: {adminName}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // async function deleteSkill(skillId: string) {
  //   try {
  //     const { error } = await supabase
  //       .from("skills")
  //       .delete()
  //       .eq("id", skillId);

  //     if (error) {
  //       throw new Error(translateError(error.code));
  //     }

  //     setSkills((prevSkills) =>
  //       prevSkills.filter((skill) => skill.id !== skillId)
  //     );
  //   } catch (error) {
  //     Alert.alert("Erro ao excluir a habilidade", String(error));
  //   }
  // }

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
