import EditSkill from "@/components/skills/EditSkill";
import { useLocalSearchParams } from "expo-router";

export default function SkillDetailsScreen() {
  const { id } = useLocalSearchParams();
  return <EditSkill skillId={id as string} />;
}
