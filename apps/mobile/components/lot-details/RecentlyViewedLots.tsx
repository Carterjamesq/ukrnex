import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SectionHeading } from "@/components/lot-details/SectionHeading";
import type { ReviewedLot } from "@ukrnex/shared";
import { colors, typography } from "@/constants/theme";

type RecentlyViewedLotsProps = {
  lots: ReviewedLot[];
  onViewAllPress?: () => void;
};

export function RecentlyViewedLots({ lots, onViewAllPress }: RecentlyViewedLotsProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <SectionHeading
          title="ПЕРЕГЛЯНУТІ ЛОТИ"
          icon="history"
          iconColor={colors.textSecondary}
          uppercase
        />
        <Pressable onPress={onViewAllPress}>
          <Text style={styles.viewAll}>Дивитись всі</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {lots.map((lot) => (
          <View key={lot.id} style={styles.card}>
            <View style={styles.imageWrap}>
              {lot.imageUrl ? (
                <Image source={{ uri: lot.imageUrl }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialIcons name="directions-car" size={24} color={colors.specLabel} />
                </View>
              )}
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {lot.title}
              </Text>
              <Text style={styles.cardPrice}>{lot.price}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewAll: {
    ...typography.caption,
    color: colors.accentBlue,
  },
  list: {
    gap: 16,
    paddingBottom: 8,
  },
  card: {
    width: 160,
    backgroundColor: colors.cardOverlay,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 2,
    overflow: "hidden",
  },
  imageWrap: {
    height: 96,
    backgroundColor: colors.imageBg,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 8,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  cardPrice: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: colors.accentBlue,
  },
});
