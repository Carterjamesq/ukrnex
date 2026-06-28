import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, SectionHeading } from "@/components/lot-details/SectionHeading";
import type { LotDetails } from "@/types/lot";
import { colors, typography } from "@/constants/theme";

type LotBasicInfoSectionProps = {
  lot: Pick<
    LotDetails,
    "sellerType" | "sellerDescription" | "documentType" | "exportEligible"
  >;
};

export function LotBasicInfoSection({ lot }: LotBasicInfoSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeading title="Основна Інформація про авто" icon="verified-user" />

      <Card>
        <View style={styles.sellerRow}>
          <View style={styles.sellerIcon}>
            <MaterialIcons name="add" size={14} color={colors.green} />
          </View>
          <View style={styles.sellerText}>
            <Text style={styles.sellerTitle}>{lot.sellerType}</Text>
            <Text style={styles.sellerDescription}>{lot.sellerDescription}</Text>
          </View>
        </View>

        <View style={styles.documentBlock}>
          <View style={styles.documentRow}>
            <Text style={styles.documentLabel}>Тип документа:</Text>
            <Text style={styles.documentValue}>{lot.documentType}</Text>
          </View>

          {lot.exportEligible ? (
            <View style={styles.exportRow}>
              <MaterialIcons name="check-circle" size={15} color={colors.green} />
              <Text style={styles.exportText}>Документи підходять для експорту</Text>
            </View>
          ) : null}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 16,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderCard,
  },
  sellerIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.insuranceIconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  sellerText: {
    flex: 1,
    gap: 4,
  },
  sellerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  sellerDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  documentBlock: {
    backgroundColor: "rgba(249, 249, 251, 0.5)",
    padding: 16,
    gap: 8,
  },
  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  documentLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  documentValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  exportRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  exportText: {
    ...typography.caption,
    color: colors.green,
  },
});
