import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileLogoutButton } from "@/components/profile/ProfileLogoutButton";
import { ProfileMenuList } from "@/components/profile/ProfileMenuList";
import { ProfileStatsRow } from "@/components/profile/ProfileStatsRow";
import { ProfileUserCard } from "@/components/profile/ProfileUserCard";
import { colors, spacing } from "@/constants/theme";

const PROFILE_STATS = [
  { value: 42, label: "Перевірено" },
  { value: 12, label: "Збережено" },
  { value: 3, label: "Активні звіти" },
] as const;

const PROFILE_MENU_ITEMS = [
  {
    id: "notifications",
    label: "Налаштування сповіщень",
    icon: "notifications-none" as const,
  },
  {
    id: "language",
    label: "Мова (Українська)",
    icon: "language" as const,
  },
  {
    id: "support",
    label: "Допомога та підтримка",
    icon: "help-outline" as const,
  },
] as const;

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ProfileHeader />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileUserCard name="Олексій Коваленко" />
        <ProfileStatsRow stats={[...PROFILE_STATS]} />
        <ProfileMenuList items={[...PROFILE_MENU_ITEMS]} />
        <View style={styles.logoutWrapper}>
          <ProfileLogoutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.body,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  logoutWrapper: {
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
});
