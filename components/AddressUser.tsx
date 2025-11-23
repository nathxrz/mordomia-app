import { useUser } from "@/hooks/useUser";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AddressUser({ refresh }: { refresh: number }) {
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

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress, refresh]);

  return (
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

      <View style={styles.cardTextContainer}>
        {address ? (
          <View>
            {address?.cep ? (
              <>
                <Text style={styles.titleCard}>
                  {address?.city} - {address?.state}
                </Text>
                <Text style={styles.subtitleCard}>
                  {address?.street}, {address?.number}, {address?.neighborhood}.{" "}
                  {address?.complement || ""}
                </Text>
              </>
            ) : null}
          </View>
        ) : (
          <Text style={styles.subtitleCard}>Nenhum endereço cadastrado.</Text>
        )}
      </View>
    </View>
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
