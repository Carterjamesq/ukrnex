import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { analyzeLotRequestSchema } from "@ukrnex/shared";
import { AppHeader } from "@/components/AppHeader";
import { EmptyStateIllustration } from "@/components/EmptyStateIllustration";
import { LotUrlInput } from "@/components/LotUrlInput";
import { colors, spacing } from "@/constants/theme";
import { analyzeLot } from "@/lib/api";
import { normalizeLotUrl } from "@/lib/lot-url";

export default function StarterScreen() {
  const [lotUrl, setLotUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    const normalizedUrl = normalizeLotUrl(lotUrl);
    const validation = analyzeLotRequestSchema.safeParse({ url: normalizedUrl });

    if (!validation.success) {
      setError(validation.error.errors[0]?.message ?? "Невірне посилання");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await analyzeLot(validation.data.url);
      router.push(`/lot-details?url=${encodeURIComponent(validation.data.url)}` as never);
    } catch (analyzeError) {
      setError(
        analyzeError instanceof Error ? analyzeError.message : "Не вдалося запустити аналіз"
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleChangeText(value: string) {
    setLotUrl(value);
    if (error) {
      setError(null);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LotUrlInput
          value={lotUrl}
          onChangeText={handleChangeText}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          error={error}
        />

        <EmptyStateIllustration />
      </ScrollView>
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
});
