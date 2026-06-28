import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LotImageGallery } from "@/components/lot-details/LotImageGallery";
import type { LotDetails } from "@/types/lot";
import { colors, radius, typography } from "@/constants/theme";
const SPEC_ICONS = {
  speed: "speed" as const,
  engine: "build" as const,
  drivetrain: "sync" as const,
  location: "place" as const,
};

type LotSummaryCardProps = {
  lot: Pick<
    LotDetails,
    "images" | "title" | "year" | "lotNumber" | "specs" | "nextAuctionDate"
  >;
};

export function LotSummaryCard({ lot }: LotSummaryCardProps) {
  return (
    <View style={styles.card}>
      <LotImageGallery images={lot.images} />
      <View style={styles.titleBlock}>
        <Text style={styles.title}>
          <Text style={styles.titleBold}>{lot.title} </Text>
          <Text style={styles.titleYear}>{lot.year}</Text>
        </Text>
        <View style={styles.lotIdBadge}>
          <Text style={styles.lotId}>{lot.lotNumber}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.specGrid}>
          {lot.specs.map((spec) => (
            <View key={spec.label} style={styles.specItem}>
              <MaterialIcons
                name={SPEC_ICONS[spec.icon]}
                size={16}
                color={colors.specLabel}
              />
              <View style={styles.specText}>
                <Text style={styles.specLabel}>{spec.label}</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.auctionBanner}>
          <View style={styles.auctionLeft}>
            <MaterialIcons name="event" size={18} color={colors.primaryRed} />
            <View>
              <Text style={styles.auctionLabel}>Наступний аукціон</Text>
              <Text style={styles.auctionDate}>{lot.nextAuctionDate}</Text>
            </View>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={colors.primaryRed}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardOverlay,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  titleBlock: { paddingHorizontal: 16, paddingTop: 16, gap: 8 },
  title: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.primaryNavy,
  },
  titleBold: {
    fontWeight: "700",
  },
  titleYear: {
    fontWeight: "400",
  },
  lotIdBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.lotIdBg,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  lotId: {
    ...typography.caption,
    color: colors.link,
  },
  body: {
    padding: 16,
    gap: 12,
  },
  specGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  specItem: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 63,
  },
  specText: {
    flex: 1,
    gap: 2,
  },
  specLabel: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.specLabel,
  },
  specValue: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  auctionBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.auctionBanner,
    borderRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  auctionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  auctionLabel: {
    fontSize: 10,
    lineHeight: 15,
    color: colors.primaryRed,
  },
  auctionDate: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: colors.primaryRed,
  },
});
