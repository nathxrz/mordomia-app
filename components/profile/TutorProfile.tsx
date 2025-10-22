import { AuthContext } from "@/context/AuthProvider";
import { useUser } from "@/hooks/useUser";

import { router } from "expo-router";
import React, { useContext } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import ConfirmedModal from "../modais/ConfirmedModal";

export default function TutorProfile() {
  const { user: userData, desactivateProfile } = useUser();
  const { signOut } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {userData ? (
          <>
            <View>
              <TouchableOpacity
                onPress={() => {
                  router.push("/edits/editprofile");
                }}
              >
                <Icon name="edit" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <View>
              <Image
                style={{ borderRadius: 150, width: 144, height: 144 }}
                // source={require("../../assets/images/avatar.png")}
                source={
                  userData.avatar_url
                    ? { uri: userData.avatar_url }
                    : require("../../assets/images/avatar.png")
                }
              />
              <Text>{userData.name}</Text>
              <Text>{userData.email}</Text>
            </View>

            <View>
              <Text>Informações básicas</Text>
              <Text>{userData.phone}</Text>
              <Text>
                <Text>
                  Cidade, <Text>Estado</Text>
                </Text>
                <Text>
                  Rua, <Text>número</Text>, <Text>bairro</Text>,{" "}
                  <Text>complemento</Text>
                </Text>
              </Text>
              <Text>{new Date(userData.date_birth).toLocaleDateString()}</Text>
            </View>

            <View>
              <Text>Pets</Text>
              {/* <Link href="/pets">Gerenciar meus pets</Link> */}
              <Text>Gerenciar meus pets</Text>
            </View>

            <View style={styles.gap}>
              <Text>Configurações</Text>
              {/* <Link href="/relatorios">Relatórios</Link> */}
              {/* <Link href="/trocarusuario">Trocar usuário</Link> */}
              <Button
                title="Excluir conta"
                onPress={() => setModalVisible(true)}
              />
              <ConfirmedModal
                modalVisible={modalVisible}
                onConfirm={() => {
                  desactivateProfile();
                  setModalVisible(false);
                }}
                onCancel={() => {
                  setModalVisible(false);
                }}
              />
              <Button title="Sair" onPress={signOut} />
            </View>
          </>
        ) : (
          <Text>Carregando informações...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  gap: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
});
