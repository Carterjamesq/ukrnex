import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { colors, radius } from "@/constants/theme";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

type ProfileMenuItem = {
  id: string;
  label: string;
  icon: MaterialIconName;
  onPress?: () => void;
};

type ProfileMenuListProps = {
  items: ProfileMenuItem[];
};

export function ProfileMenuList({ items }: ProfileMenuListProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          onPress={item.onPress}
          style={[styles.item, index > 0 && styles.itemBorder]}
        >
          <View style={styles.itemLeft}>
            <MaterialIcons name={item.icon} size={20} color={colors.textPrimary} />
            <Text style={styles.itemLabel}>{item.label}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 17,
    paddingBottom: 16,
  },
  itemBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.menuBorder,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    color: colors.textPrimary,
  },
});
