import { useUser } from "@/hooks/useUser";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function AddressUser() {
  const { getAddressUser } = useUser();
  const [address, setAddress] = useState<any>(null);

  const fetchAddress = useCallback(async () => {
    const address = await getAddressUser();
    if (address) {
      setAddress(address);
    } else {
      setAddress(null);
    }
  }, [getAddressUser]);

  useFocusEffect(() => {
    fetchAddress();
  });

  return (
    <View>
      {address ? (
        <View>
          {address?.cep && (
            <View>
              <Text style={styles.titleCard}>
                {address?.city} - {address?.state}
              </Text>
              <Text style={styles.subtitleCard}>
                {address?.street}, {address?.number}, {address?.neighborhood}.
              </Text>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.subtitleCard}>Nenhum endereço cadastrado.</Text>
      )}

      <TouchableOpacity
        style={styles.plusIcon}
        onPress={() => {
          router.push("/edits/editaddress");
        }}
      >
        <Icon name={address ? "edit" : "add"} size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    fontSize: 16,
    color: "#000000",
  },
  plusIcon: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});
