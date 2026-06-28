import { Image, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/constants/theme";

export function EmptyStateIllustration() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Image
          source={require("@/assets/images/car-silhouette.png")}
          style={styles.carImage}
          resizeMode="contain"
        />

        <View style={styles.searchBadge}>
          <View style={styles.searchButton}>
            <MaterialIcons name="search" size={32} color={colors.white} />
          </View>
        </View>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>Аналіз повної вартості</Text>
        <Text style={styles.description}>
          Вставте посилання на лот з аукціону США,{"\n"}
          щоб отримати детальний розрахунок та звіт{"\n"}
          про пошкодження.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    width: "100%",
    paddingTop: spacing.lg,
  },
  card: {
    width: 254,
    minHeight: 192,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  carImage: {
    width: 190,
    height: 128,
    opacity: 0.3,
  },
  searchBadge: {
    position: "absolute",
    right: -12,
    bottom: -16,
    transform: [{ rotate: "10deg" }],
  },
  searchButton: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.link,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#F9F9FB",
  },
  copy: {
    alignItems: "center",
    paddingTop: spacing.lg,
    gap: 12,
    maxWidth: 351,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: "center",
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
