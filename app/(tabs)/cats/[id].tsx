import CatDetailsProfile from "@/components/cats/CatDetails";
import CatExtraInfoProfile from "@/components/cats/CatExtraInfoProfile";
import ConfirmedModal from "@/components/modais/ConfirmedModal";
import { useCat } from "@/hooks/useCat";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useLayoutEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function CatDetails() {
  const { id } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = React.useState(false);

  const { deleteCat } = useCat(id as string);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text
            style={{
              fontFamily: "MaterialSymbolsOutlined",
              fontSize: 30,
              lineHeight: 30,
              marginRight: 16,
              color: "#CF0790",
            }}
          >
            delete
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Detalhes do Felino",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/cats")}
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
            <CatDetailsProfile catId={id as string} />

            <CatExtraInfoProfile catId={id as string} />

            <View>
              <TouchableOpacity
                style={styles.button_submit}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/cats/editCat",
                    params: { id: id },
                  })
                }
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
            </View>

            <ConfirmedModal
              modalVisible={modalVisible}
              onConfirm={() => {
                setModalVisible(false);
                deleteCat();
              }}
              onCancel={() => setModalVisible(false)}
              message="Tem certeza que deseja excluir este felino?"
            />
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
});
