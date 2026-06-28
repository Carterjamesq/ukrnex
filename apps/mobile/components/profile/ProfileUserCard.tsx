import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/theme";

type ProfileUserCardProps = {
  name: string;
  avatarSource?: number;
};

export function ProfileUserCard({
  name,
  avatarSource = require("@/assets/images/profile/avatar.png"),
}: ProfileUserCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
      </View>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: colors.imageBg,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "400",
    color: colors.textPrimary,
  },
});
