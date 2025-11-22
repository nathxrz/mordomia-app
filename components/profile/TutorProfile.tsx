import { AuthContext } from "@/context/AuthProvider";
import { useUser } from "@/hooks/useUser";
import { formatPhone } from "@/scripts/format-phone";

import formatDate from "@/scripts/format-date";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddressUser from "../AddressUser";
import ConfirmedModal from "../modais/ConfirmedModal";
import ConfirmedModalPassword from "../modais/ConfirmedModalPassword";

export default function TutorProfile() {
  const { user: userData, fetchData } = useUser();
  const { signOut } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleConfirmedPassword, setModalVisibleConfirmedPassword] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {userData ? (
          <View style={styles.container}>
            <View style={styles.profileHeader}>
              <Image
                style={styles.profileImage}
                source={
                  userData?.avatar_url
                    ? { uri: userData?.avatar_url }
                    : require("../../assets/images/avatar.png")
                }
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData?.name}</Text>
                <Text style={styles.profileEmail}>{userData?.email}</Text>
                <View style={styles.ratingContainer}>
                  <Text
                    style={{
                      fontFamily: "MaterialSymbolsOutlined",
                      fontSize: 14,
                      lineHeight: 14,
                      color: "#F08000",
                      marginRight: 4,
                    }}
                  >
                    star
                  </Text>
                  <Text style={styles.profileReviews}>4.9 (23 reviews)</Text>
                </View>
              </View>
            </View>

            <View style={styles.basicInfoContainer}>
              <Text style={styles.titleSection}>Informações básicas</Text>
              <View style={styles.cardContainer}>
                <Text
                  style={{
                    fontFamily: "MaterialSymbolsOutlined",
                    fontSize: 25,
                    lineHeight: 25,
                    color: "#B434CC",
                    backgroundColor: "#FAE5FF",
                    padding: 14,
                    borderRadius: 13,
                  }}
                >
                  phone
                </Text>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.titleCard}>Telefone</Text>
                  <Text style={styles.subtitleCard}>
                    {formatPhone(userData?.phone)}
                  </Text>
                </View>
              </View>

              <AddressUser />

              <View style={styles.cardContainer}>
                <Text
                  style={{
                    fontFamily: "MaterialSymbolsOutlined",
                    fontSize: 25,
                    lineHeight: 25,
                    color: "#B434CC",
                    backgroundColor: "#FAE5FF",
                    padding: 14,
                    borderRadius: 13,
                  }}
                >
                  cake
                </Text>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.titleCard}>Data de nascimento</Text>
                  <Text style={styles.subtitleCard}>
                    {formatDate(userData?.date_birth)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.basicInfoContainer}>
              <Text style={styles.titleSection}>Felinos</Text>
              <TouchableOpacity
                onPress={() => {
                  router.push("/cats");
                }}
              >
                <View style={styles.cardContainer}>
                  <Text
                    style={{
                      fontFamily: "MaterialSymbolsOutlined",
                      fontSize: 25,
                      lineHeight: 25,
                      color: "#B434CC",
                      backgroundColor: "#FAE5FF",
                      padding: 14,
                      borderRadius: 13,
                    }}
                  >
                    pets
                  </Text>

                  <View style={styles.cardPetContainer}>
                    <View>
                      <Text style={styles.titleCard}>Ver pets</Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: "MaterialSymbolsOutlined",
                        fontSize: 25,
                        lineHeight: 25,
                        color: "#000",
                        marginLeft: 10,
                      }}
                    >
                      keyboard_arrow_right
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.basicInfoContainer}>
              <Text style={styles.titleSection}>Configurações</Text>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Relatórios",
                    "Funcionalidade em desenvolvimento."
                  );
                }}
              >
                <View style={styles.cardContainer}>
                  <Text
                    style={{
                      fontFamily: "MaterialSymbolsOutlined",
                      fontSize: 25,
                      lineHeight: 25,
                      color: "#B434CC",
                      backgroundColor: "#FAE5FF",
                      padding: 14,
                      borderRadius: 13,
                    }}
                  >
                    assignment
                  </Text>

                  <View style={styles.cardPetContainer}>
                    <View>
                      <Text style={styles.titleCard}>Relatórios</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Trocar usuário",
                    "Funcionalidade em desenvolvimento."
                  );
                }}
              >
                <View style={styles.cardContainer}>
                  <Text
                    style={{
                      fontFamily: "MaterialSymbolsOutlined",
                      fontSize: 25,
                      lineHeight: 25,
                      color: "#B434CC",
                      backgroundColor: "#FAE5FF",
                      padding: 14,
                      borderRadius: 13,
                    }}
                  >
                    group
                  </Text>

                  <View style={styles.cardPetContainer}>
                    <View>
                      <Text style={styles.titleCard}>Trocar usuário</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <View style={styles.cardContainer}>
                  <Text
                    style={{
                      fontFamily: "MaterialSymbolsOutlined",
                      fontSize: 25,
                      lineHeight: 25,
                      color: "#B434CC",
                      backgroundColor: "#FAE5FF",
                      padding: 14,
                      borderRadius: 13,
                    }}
                  >
                    person_cancel
                  </Text>

                  <View style={styles.cardPetContainer}>
                    <View>
                      <Text style={styles.titleCard}>Excluir conta</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  signOut(userData.deleted_at);
                }}
              >
                <View style={styles.cardContainer}>
                  <Text
                    style={{
                      fontFamily: "MaterialSymbolsOutlined",
                      fontSize: 25,
                      lineHeight: 25,
                      color: "#B434CC",
                      backgroundColor: "#FAE5FF",
                      padding: 14,
                      borderRadius: 13,
                    }}
                  >
                    logout
                  </Text>

                  <View style={styles.cardPetContainer}>
                    <View>
                      <Text style={[styles.titleCard, styles.Alert]}>Sair</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <ConfirmedModal
                modalVisible={modalVisible}
                onConfirm={() => {
                  setModalVisible(false);
                  setModalVisibleConfirmedPassword(true);
                }}
                onCancel={() => setModalVisible(false)}
                message="Tem certeza que deseja suspender sua conta?"
              />

              <ConfirmedModalPassword
                modalVisible={modalVisibleConfirmedPassword}
                onConfirm={() => setModalVisibleConfirmedPassword(false)}
                onCancel={() => setModalVisibleConfirmedPassword(false)}
              />
            </View>
          </View>
        ) : (
          <Text>Carregando informações...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F7F6F8",
    flex: 1,
  },
  container: {
    position: "relative",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 30,
  },
  profileHeader: {
    alignItems: "center",
    gap: 20,
  },
  profileImage: {
    width: 144,
    height: 144,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  profileInfo: {
    alignItems: "center",
    gap: 4,
  },
  profileName: {
    fontFamily: "Roboto",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 20,
  },
  profileEmail: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#B83FCF",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileReviews: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#4A4459",
  },
  basicInfoContainer: {
    gap: 10,
  },
  titleSection: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "700",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FCFCFC",
    padding: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  cardTextContainer: {
    gap: 2,
  },
  titleCard: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#000000",
    fontWeight: "700",
    lineHeight: 20,
  },
  subtitleCard: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#B83FCF",
  },
  aboutContainer: {
    gap: 10,
  },
  cardExpansiveContainer: {
    position: "relative",
    backgroundColor: "#FCFCFC",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 14,
    paddingVertical: 20,
    gap: 30,
  },
  titleAboutSection: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#000000",
    fontWeight: "700",
  },
  description: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#4A4459",
  },
  arrowIconAbout: {
    position: "absolute",
    right: 21,
    top: 20,
    alignSelf: "center",
  },
  button_submit: {
    alignSelf: "flex-end",
    marginVertical: 30,
    backgroundColor: "#7F13EC",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 100,
    boxShadow: "0px 4px 4px #00000025",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "center",
  },
  headerExpandable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },
  skillsText: {
    fontFamily: "Roboto",
    fontSize: 12,
    textAlign: "center",
    borderRadius: 100,
    color: "#A40BC0",
    backgroundColor: "#FAE5FF",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  cardPetContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  Alert: {
    color: "#EE0101",
  },
});
