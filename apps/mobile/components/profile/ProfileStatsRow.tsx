import { StyleSheet, Text, View } from "react-native";
import { colors, radius, typography } from "@/constants/theme";

type ProfileStat = {
  value: number;
  label: string;
};

type ProfileStatsRowProps = {
  stats: ProfileStat[];
};

export function ProfileStatsRow({ stats }: ProfileStatsRowProps) {
  return (
    <View style={styles.row}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.card}>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  value: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "400",
    color: colors.link,
    textAlign: "center",
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
