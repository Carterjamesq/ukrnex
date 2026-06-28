import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

export function UkrnexLogo() {
  return (
    <View style={styles.container}>
      <Text style={styles.ukr}>Ukr</Text>
      <View style={styles.nexWrapper}>
        <Text style={styles.nex}>nex</Text>
      </View>
    </View>
  );
}

export function AppHeader({
  onSettingsPress,
}: {
  onSettingsPress?: () => void;
}) {
  function handleSettingsPress() {
    if (onSettingsPress) {
      onSettingsPress();
      return;
    }

    router.push("/(tabs)/profile");
  }

  return (
    <View style={styles.header}>
      <UkrnexLogo />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Налаштування"
        hitSlop={12}
        onPress={handleSettingsPress}
        style={styles.settingsButton}
      >
        <MaterialIcons name="settings" size={20} color={colors.textNav} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  ukr: {
    color: colors.primaryRed,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  nexWrapper: {
    transform: [{ skewX: "-12deg" }],
    marginLeft: -2,
  },
  nex: {
    color: colors.primaryNavy,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  header: {
    height: 64,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  settingsButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
