// import { useUser } from "@/hooks/useUser";
// import { supabase } from "@/lib/supabase";
// import translateError from "@/scripts/translate-error";
// import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
// import { useCallback } from "react";
// import { Alert, Image, Text, View } from "react-native";
// import { Button } from "react-native-paper";

// async function fetchUser(id: string) {
//   try {
//     const { data: userData, error } = await supabase
//       .from("user_with_email")
//       .select("*")
//       .eq("id", id)
//       .order("name", { ascending: true });

//     if (error) {
//       throw new Error(translateError(error.code));
//     }

//     return userData;
//   } catch (error) {
//     Alert.alert("Erro ao buscar os usuários", String(error));
//     return [];
//   }
// }

// export default function UserDetails() {
//   const { id } = useLocalSearchParams();
//   const { user } = useUser();

//   useFocusEffect(
//     useCallback(() => {
//       if (!user) return;
//       fetchUser(id as string);
//     }, [user, id])
//   );

//   return (
//     <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
//       <View style={{ marginBottom: 20 }}>
//         <Image
//           source={
//             user?.avatar_url
//               ? { uri: user.avatar_url }
//               : require("../../assets/images/avatar.png")
//           }
//           style={{ width: 100, height: 100 }}
//         />
//         <Text>{user?.name}</Text>
//       </View>

//       <Button
//         mode="contained"
//         onPress={() => {
//           router.back();
//         }}
//       >
//         voltar
//       </Button>
//     </View>
//   );
// }
