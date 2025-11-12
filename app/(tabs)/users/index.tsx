import UsersList from "@/components/users/UsersList";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UsersPage() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flex: 1 }}>
          <UsersList />
        </View>
      </View>
    </SafeAreaView>
  );
}
