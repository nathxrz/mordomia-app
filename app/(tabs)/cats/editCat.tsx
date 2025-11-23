import EditCat from "@/components/cats/EditCat";
import { useLocalSearchParams } from "expo-router";

export default function EditCatScreen() {
  const { id } = useLocalSearchParams();

  return <EditCat catId={id as string} />;
}
