import { StyleSheet, Text, View } from "react-native";
import type { LotDetails } from "@/types/lot";
import { colors, radius } from "@/constants/theme";

type LotTotalInvestmentCardProps = {
  lot: Pick<
    LotDetails,
    "totalPrice" | "totalPriceLabel" | "repairNote" | "marketPrice" | "savings" | "savingsPercent"
  >;
};

export function LotTotalInvestmentCard({ lot }: LotTotalInvestmentCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerBlock}>
        <Text style={styles.eyebrow}>Орієнтовна ЦІНА</Text>
        <Text style={styles.headline}>{lot.totalPriceLabel}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{lot.totalPrice}</Text>
          <Text style={styles.priceSuffix}>Під ключ</Text>
        </View>
        <Text style={styles.repairNote}>{lot.repairNote}</Text>
      </View>

      <View style={styles.comparisonBlock}>
        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonLabel}>Середня ціна на Auto.ria</Text>
          <Text style={styles.comparisonValue}>{lot.marketPrice}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.comparisonRow}>
          <Text style={styles.savingsLabel}>Ваша економія</Text>
          <Text style={styles.savingsValue}>{lot.savings}</Text>
        </View>

        <View style={styles.savingsBadge}>
          <Text style={styles.savingsBadgeText}>{lot.savingsPercent}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryNavy,
    borderRadius: radius.md,
    padding: 24,
    gap: 16,
    opacity: 0.65,
  },
  headerBlock: {
    gap: 6,
    paddingBottom: 24,
  },
  eyebrow: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: colors.navyMuted,
    letterSpacing: 0.28,
  },
  headline: {
    fontSize: 32,
    lineHeight: 40,
    color: colors.white,
    letterSpacing: -0.8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    paddingTop: 4,
  },
  price: {
    fontSize: 42,
    lineHeight: 42,
    fontWeight: "700",
    color: colors.white,
  },
  priceSuffix: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: colors.white,
    letterSpacing: 0.28,
  },
  repairNote: {
    fontSize: 11,
    lineHeight: 16.5,
    color: colors.whiteFaint,
    paddingTop: 4,
  },
  comparisonBlock: {
    backgroundColor: colors.summaryOverlay,
    borderWidth: 1,
    borderColor: colors.summaryBorder,
    borderRadius: 2,
    padding: 17,
    gap: 12,
  },
  comparisonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  comparisonLabel: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.whiteMuted,
  },
  comparisonValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: colors.white,
    letterSpacing: 0.28,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  savingsLabel: {
    fontSize: 18,
    lineHeight: 27,
    color: colors.white,
  },
  savingsValue: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: colors.greenBright,
  },
  savingsBadge: {
    backgroundColor: colors.savingsBg,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 1,
    alignItems: "center",
  },
  savingsBadgeText: {
    fontSize: 10,
    lineHeight: 15,
    color: colors.greenBright,
    textAlign: "right",
  },
});
