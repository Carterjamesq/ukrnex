import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography } from "@/constants/theme";

type LotDetailsHeaderProps = {
  onBackPress?: () => void;
  onSettingsPress?: () => void;
};

export function LotDetailsHeader({ onBackPress, onSettingsPress }: LotDetailsHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Назад"
          hitSlop={12}
          onPress={onBackPress}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.primaryNavy} />
        </Pressable>
        <Text style={styles.title}>Деталі лоту</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Налаштування"
        hitSlop={12}
        onPress={onSettingsPress}
        style={styles.settingsButton}
      >
        <MaterialIcons name="settings" size={20} color={colors.textNav} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: "500",
    color: colors.primaryNavy,
  },
  settingsButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
