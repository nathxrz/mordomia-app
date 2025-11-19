import EditCatExtraInfo from "@/components/cats/EditCatExtraInfo";
import { useLocalSearchParams } from "expo-router";

export default function EditCatExtraInfoScreen() {
  const { id } = useLocalSearchParams();

  return <EditCatExtraInfo catId={id as string} />;
}
