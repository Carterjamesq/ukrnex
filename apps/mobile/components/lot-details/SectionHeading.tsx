import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography } from "@/constants/theme";

type SectionHeadingProps = {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  uppercase?: boolean;
};

export function SectionHeading({
  title,
  icon,
  iconColor = colors.textPrimary,
  uppercase = false,
}: SectionHeadingProps) {
  return (
    <View style={styles.row}>
      <MaterialIcons name={icon} size={18} color={iconColor} />
      <Text style={[styles.title, uppercase && styles.uppercase]}>{title}</Text>
    </View>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
  },
  uppercase: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
});
