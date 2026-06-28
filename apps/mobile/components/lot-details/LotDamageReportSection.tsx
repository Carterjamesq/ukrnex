import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Card, SectionHeading } from "@/components/lot-details/SectionHeading";
import type { DamageAction, DamageSeverity, LotDetails } from "@/types/lot";
import { colors, typography } from "@/constants/theme";

const SEVERITY_LABELS: Record<DamageSeverity, string> = {
  light: "Легка",
  medium: "Середня",
  heavy: "Тяжка",
};

const ACTION_LABELS: Record<DamageAction, string> = {
  replacement: "Заміна",
  repair: "Ремонт",
};

const DIAGRAM_LABELS = [
  { text: "Передня Частина", position: "top" as const, active: false },
  { text: "Задня Частина", position: "bottom" as const, active: true },
  { text: "Право", position: "right" as const, active: false },
  { text: "Ліво", position: "left" as const, active: false },
];

type LotDamageReportSectionProps = {
  lot: Pick<LotDetails, "damageSeverity" | "damageItems">;
};

export function LotDamageReportSection({ lot }: LotDamageReportSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeading title="Звіт про пошкодження" icon="warning" />

      <Card>
        <View style={styles.scaleBlock}>
          <View style={styles.scaleHeader}>
            <Text style={styles.scaleTitle}>Шкала пошкоджень</Text>
            <Text style={styles.scaleValue}>
              {SEVERITY_LABELS[lot.damageSeverity]}
            </Text>
          </View>

          <View style={styles.scaleTrackWrap}>
            <View style={styles.scaleTrack}>
              <View style={[styles.scaleSegment, styles.scaleLight]} />
              <View style={[styles.scaleSegment, styles.scaleMedium]} />
              <View style={[styles.scaleSegment, styles.scaleHeavy]} />
            </View>
            <View
              style={[
                styles.scaleIndicator,
                indicatorPosition(lot.damageSeverity),
              ]}
            />
          </View>

          <View style={styles.scaleLabels}>
            <Text style={[styles.scaleLabel, { color: colors.damageLight }]}>
              Легкі
            </Text>
            <Text style={[styles.scaleLabel, { color: colors.damageMedium }]}>
              Середні
            </Text>
            <Text style={[styles.scaleLabel, { color: colors.damageHeavy }]}>
              Тяжкі
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.diagramWrap}>
            <Image
              source={require("@/assets/images/car-diagram.png")}
              style={styles.diagram}
              resizeMode="contain"
            />
            {DIAGRAM_LABELS.map((label) => (
              <View
                key={label.text}
                style={[
                  styles.diagramLabel,
                  label.active
                    ? styles.diagramLabelActive
                    : styles.diagramLabelInactive,
                  label.position === "top" && styles.labelTop,
                  label.position === "bottom" && styles.labelBottom,
                  label.position === "right" && styles.labelRight,
                  label.position === "left" && styles.labelLeft,
                ]}
              >
                <Text
                  style={[
                    styles.diagramLabelText,
                    label.active && styles.diagramLabelTextActive,
                  ]}
                >
                  {label.text}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.damageList}>
            {lot.damageItems.map((item, index) => (
              <View
                key={item.part}
                style={[
                  styles.damageRow,
                  index < lot.damageItems.length - 1 && styles.damageRowBorder,
                ]}
              >
                <Text style={styles.damagePart}>{item.part}</Text>
                <View
                  style={[
                    styles.damageBadge,
                    item.action === "replacement"
                      ? styles.replacementBadge
                      : styles.repairBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.damageBadgeText,
                      item.action === "repair" && styles.repairBadgeText,
                    ]}
                  >
                    {ACTION_LABELS[item.action]}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Card>
    </View>
  );
}

function indicatorPosition(severity: DamageSeverity): ViewStyle {
  switch (severity) {
    case "light":
      return { left: "25%" as const };
    case "heavy":
      return { left: "75%" as const };
    default:
      return { left: "50%" as const };
  }
}

const styles = StyleSheet.create({
  section: {
    gap: 16,
  },
  scaleBlock: {
    backgroundColor: "rgba(249, 249, 251, 0.5)",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderCard,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 17,
    gap: 4,
  },
  scaleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scaleTitle: {
    ...typography.body,
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },
  scaleValue: {
    ...typography.body,
    fontWeight: "500",
    color: colors.accentBlue,
  },
  scaleTrackWrap: {
    height: 36,
    justifyContent: "flex-end",
    position: "relative",
  },
  scaleTrack: {
    flexDirection: "row",
    height: 14,
    overflow: "hidden",
  },
  scaleSegment: {
    flex: 1,
    height: 8,
  },
  scaleLight: {
    backgroundColor: colors.damageLight,
  },
  scaleMedium: {
    backgroundColor: colors.damageMedium,
  },
  scaleHeavy: {
    backgroundColor: colors.damageHeavy,
  },
  scaleIndicator: {
    position: "absolute",
    top: 14,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.damageIndicator,
    borderWidth: 2,
    borderColor: colors.white,
    marginLeft: -10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scaleLabel: {
    fontSize: 14,
    lineHeight: 15,
    letterSpacing: -0.5,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  diagramWrap: {
    backgroundColor: colors.diagramBg,
    borderWidth: 1,
    borderColor: "rgba(193, 198, 215, 0.3)",
    borderRadius: 2,
    padding: 17,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 276,
    position: "relative",
  },
  diagram: {
    width: 242,
    height: 242,
  },
  diagramLabel: {
    position: "absolute",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
  diagramLabelInactive: {
    backgroundColor: colors.border,
  },
  diagramLabelActive: {
    backgroundColor: colors.accentBlue,
  },
  diagramLabelText: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  diagramLabelTextActive: {
    color: colors.white,
  },
  labelTop: {
    top: 7,
    alignSelf: "center",
  },
  labelBottom: {
    bottom: 7,
    alignSelf: "center",
  },
  labelRight: {
    top: 129,
    right: 9,
  },
  labelLeft: {
    top: 129,
    left: 9,
  },
  damageList: {
    gap: 8,
  },
  damageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  damageRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderCard,
    paddingBottom: 9,
  },
  damagePart: {
    ...typography.body,
    color: colors.textPrimary,
  },
  damageBadge: {
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  replacementBadge: {
    backgroundColor: colors.replacementBg,
  },
  repairBadge: {
    backgroundColor: colors.accentBlue,
  },
  damageBadgeText: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "500",
    color: colors.replacementText,
  },
  repairBadgeText: {
    color: colors.white,
  },
});
