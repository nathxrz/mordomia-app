import UsersList from "@/components/users/UsersList";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { TextInput } from "react-native-paper";

import Icon from "react-native-vector-icons/MaterialIcons";

export default function UsersPage() {
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
              style={{ backgroundColor: "#fcfcfc" }}
              placeholder="Pesquisar usuário"
              value={textSearch}
              onChangeText={setTextSearch}
              left={
                <TextInput.Icon
                  icon={() => <Icon name="search" size={24} color="#7F13EC" />}
                />
              }
              onSubmitEditing={() =>
                Alert.alert("Busca", "Funcionalidade em desenvolvimento.")
              }
            />
          </View>
        </KeyboardAwareScrollView>

        <View style={styles.listItems}>
          <UsersList />
        </View>
      </View>
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
