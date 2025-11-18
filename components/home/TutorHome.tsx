import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import CatSittersList from "../users/CatSittersList";

export default function TutorHome() {
  const [textSearch, setTextSearch] = useState("");
  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.searchBox}>
            <TextInput
              mode="outlined"
              placeholderTextColor="#4A4459"
              outlineColor="#E5E5E5"
              activeOutlineColor="#979797"
              textColor="#4A4459"
              theme={{ roundness: 100 }}
              placeholder="Buscar cuidador de gatos"
              value={textSearch}
              onChangeText={setTextSearch}
              left={
                <TextInput.Icon
                  icon={() => <Icon name="search" size={24} color="#7F13EC" />}
                />
              }
              onSubmitEditing={() => Alert.alert("Em desenvolvimento..")}
            />
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.listItems}>
          <CatSittersList />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          Alert.alert("Filtragem em desenvolvimento...");
        }}
        style={{
          position: "absolute",
          bottom: 20,
          right: 16,
          backgroundColor: "#7F13EC",
          padding: 20,
          borderRadius: 17,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "MaterialSymbolsOutlined",
            fontSize: 30,
            lineHeight: 30,
            color: "#fff",
          }}
        >
          filter_list
        </Text>
      </TouchableOpacity>
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
  },
  searchBox: {
    marginTop: 22,
  },
  listItems: {
    height: "85%",
    marginTop: 28,
  },
});
