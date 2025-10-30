import { useUser } from "@/hooks/useUser";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
      <Text>Endereço</Text>
      {address && (
        <>
          <View>
            <Text>{address?.city}</Text>
            <Text>{address?.state}</Text>
          </View>
          <Text>
            <Text>{address?.street}</Text>
            <Text>{address?.number}</Text>
            <Text>{address?.neighborhood}</Text>
            <Text>{address?.complement || ""}</Text>
          </Text>
        </>
      )}

      <TouchableOpacity
        onPress={() => {
          router.push("/edits/editaddress");
        }}
      >
        <Icon name={address ? "edit" : "add"} size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}
