import { Pressable, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, radius } from "@/constants/theme";

type ProfileLogoutButtonProps = {
  onPress?: () => void;
};

export function ProfileLogoutButton({ onPress }: ProfileLogoutButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Вийти з акаунту"
      onPress={onPress}
      style={styles.button}
    >
      <MaterialIcons name="logout" size={18} color={colors.logoutRed} />
      <Text style={styles.label}>Вийти з акаунту</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  label: {
    fontSize: 16,
    lineHeight: 32,
    fontWeight: "400",
    color: colors.logoutRed,
    textAlign: "center",
  },
});
