import { useUser } from "@/hooks/useUser";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    <TouchableOpacity
      onPress={() => {
        router.push("/edits/editaddress");
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
          location_on
        </Text>

        {/* Texto do endereço */}
        <View style={styles.cardTextContainer}>
          {address ? (
            <View>
              {address?.cep ? (
                <>
                  <Text style={styles.titleCard}>
                    {address?.city} - {address?.state}
                  </Text>
                  <Text style={styles.subtitleCard}>
                    {address?.street}, {address?.number},{" "}
                    {address?.neighborhood}. {address?.complement || ""}
                  </Text>
                </>
              ) : null}
            </View>
          ) : (
            <Text style={styles.subtitleCard}>Nenhum endereço cadastrado.</Text>
          )}
        </View>

        {/* Ícone de seta */}
        <Text
          style={{
            fontFamily: "MaterialSymbolsOutlined",
            fontSize: 25,
            lineHeight: 25,
            color: "#000",
            marginLeft: 10,
            alignSelf: "center",
          }}
        >
          keyboard_arrow_right
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FCFCFC",
    padding: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  cardTextContainer: {
    gap: 2,
    flex: 1,
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
});
