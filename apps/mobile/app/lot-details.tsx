import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import type { LotDetails } from "@ukrnex/shared";
import { LotBasicInfoSection } from "@/components/lot-details/LotBasicInfoSection";
import { LotDamageReportSection } from "@/components/lot-details/LotDamageReportSection";
import { LotPaywallSection } from "@/components/lot-details/LotPaywallSection";
import { LotSummaryCard } from "@/components/lot-details/LotSummaryCard";
import { LotTotalInvestmentCard } from "@/components/lot-details/LotTotalInvestmentCard";
import { RecentlyViewedLots } from "@/components/lot-details/RecentlyViewedLots";
import { LotDetailsHeader } from "@/components/LotDetailsHeader";
import { colors, spacing } from "@/constants/theme";
import { getLotDetails } from "@/lib/api";

function readParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default function LotDetailsScreen() {
  const params = useLocalSearchParams<{ url?: string | string[] }>();
  const lotUrl = readParam(params.url);

  const [lot, setLot] = useState<LotDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!lotUrl) {
      setError("Посилання на лот відсутнє");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadLot() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getLotDetails(lotUrl);
        if (!cancelled) {
          setLot(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : "Не вдалося завантажити дані лоту"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadLot();

    return () => {
      cancelled = true;
    };
  }, [lotUrl]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <LotDetailsHeader onBackPress={() => router.back()} />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.link} />
          <Text style={styles.loadingText}>Завантаження даних лоту...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Не вдалося завантажити лот</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : lot ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <LotSummaryCard lot={lot} />
          <LotBasicInfoSection lot={lot} />
          <LotDamageReportSection lot={lot} />
          <LotPaywallSection lot={lot} />
          <LotTotalInvestmentCard lot={lot} />
          {lot.reviewedLots.length > 0 ? (
            <RecentlyViewedLots lots={lot.reviewedLots} />
          ) : null}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.body,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
