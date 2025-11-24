import { useSkill } from "@/hooks/useSkill";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfirmedModal from "../modais/ConfirmedModal";

async function fetchSkills() {
  try {
    const { data: skills, error } = await supabase
      .from("skills")
      .select("*, users(name)")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(translateError(error.code));
    }

    return skills;
  } catch (error) {
    Alert.alert("Erro ao buscar as habilidades", String(error));
    return [];
  }
}
export default function SkillsList() {
  const { user } = useUser();

  const [skills, setSkills] = useState<
    {
      id: string;
      name: string;
      description: string;
      id_admin: string;
      users?: { name: string };
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
    userName,
  }: {
    id: string;
    name: string;
    description: string;
    userName?: string;
  }) => {
    const { deleteSkill } = useSkill(id);
    const [modalVisibleConfirmed, setModalVisibleConfirmed] = useState(false);

    return (
      <>
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() => router.push(`/(tabs)/skills/${id}`)}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{name}</Text>
              <Text style={styles.cardSubtitle}>
                {description || "Sem descrição"}
              </Text>
              <Text style={styles.metaText}>
                <Text style={styles.bold}>Última atualização por: </Text>
                {userName ? userName : "Desconhecido"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setModalVisibleConfirmed(true)}
            >
              <Text style={styles.iconButton}>delete</Text>
            </TouchableOpacity>
          </View>
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
            userName={item.users?.name}
          />
        )}
      />
    );
  }

  return renderComponent();
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#FCFCFC",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardInfo: {
    flex: 1,
    padding: 16,
  },
  cardTitle: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    alignSelf: "stretch",
    backgroundColor: "#FAE5FF",
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
  },
  iconButton: {
    fontFamily: "MaterialSymbolsOutlined",
    fontSize: 30,
    lineHeight: 30,
    color: "#CF0790",
  },
  bold: {
    fontWeight: "bold",
    color: "#605A6D",
  },
  metaText: {
    fontFamily: "Roboto",
    fontSize: 13,
    color: "#B83FCF",
    marginTop: 12,
  },
});
