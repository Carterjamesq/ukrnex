import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SectionHeading } from "@/components/lot-details/SectionHeading";
import type { LotDetails } from "@/types/lot";
import { colors, radius, typography } from "@/constants/theme";

type LotPaywallSectionProps = {
  lot: Pick<LotDetails, "logistics">;
  onUnlockPress?: () => void;
};

export function LotPaywallSection({
  lot,
  onUnlockPress,
}: LotPaywallSectionProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.blurredContent}>
        <SectionHeading
          title="Логістика та митниця"
          icon="local-shipping"
          iconColor={colors.textSecondary}
        />

        <View style={styles.logisticsCard}>
          {lot.logistics.map((line, index) => (
            <View
              key={line.label}
              style={[
                styles.logisticsRow,
                index < lot.logistics.length - 1 && styles.logisticsRowBorder,
              ]}
            >
              <View style={styles.logisticsLabelWrap}>
                <Text style={styles.logisticsLabel}>{line.label}</Text>
                {line.sublabel ? (
                  <Text style={styles.logisticsSublabel}>{line.sublabel}</Text>
                ) : null}
              </View>
              <Text style={styles.logisticsValue}>{line.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.paywallCard}>
        <View style={styles.lockIconWrap}>
          <MaterialIcons name="lock" size={28} color={colors.primaryButton} />
        </View>

        <Text style={styles.paywallTitle}>Отримати повний доступ до звіту</Text>
        <Text style={styles.paywallDescription}>
          Повна історія, детальний{"\n"}
          розрахунок мита та аналіз{"\n"}
          пошкоджень для цього лота.
        </Text>

        <Pressable style={styles.unlockButton} onPress={onUnlockPress}>
          <Text style={styles.unlockButtonText}>Відкрити звіт за 100 ₴</Text>
        </Pressable>

        <View style={styles.secureRow}>
          <MaterialIcons
            name="verified-user"
            size={14}
            color={colors.secureGreen}
          />
          <Text style={styles.secureText}>Безпечна оплата</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    minHeight: 420,
  },
  blurredContent: {
    gap: 16,
    opacity: 0.35,
  },
  logisticsCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 2,
    padding: 17,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  logisticsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    gap: 12,
  },
  logisticsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderCard,
    paddingBottom: 9,
  },
  logisticsLabelWrap: {
    flex: 1,
    gap: 2,
  },
  logisticsLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  logisticsSublabel: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "500",
    color: colors.specLabel,
    textTransform: "uppercase",
  },
  logisticsValue: {
    ...typography.button,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  paywallCard: {
    position: "absolute",
    top: 120,
    left: 16,
    right: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#C0C0C0",
    borderRadius: radius.md,
    padding: 25,
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 8,
  },
  lockIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.paywallIconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  paywallTitle: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: "center",
  },
  paywallDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  unlockButton: {
    width: "100%",
    backgroundColor: colors.primaryButton,
    borderRadius: radius.sm,
    paddingVertical: 16,
    alignItems: "center",
  },
  unlockButtonText: {
    ...typography.body,
    color: colors.white,
    textAlign: "center",
  },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  secureText: {
    ...typography.body,
    color: colors.secureGreen,
  },
});
