import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, radius, typography } from "@/constants/theme";

type LotUrlInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onAnalyze: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  showLinkIcon?: boolean;
  error?: string | null;
};

export function LotUrlInput({
  value,
  onChangeText,
  onAnalyze,
  isLoading = false,
  disabled = false,
  showLinkIcon = false,
  error = null,
}: LotUrlInputProps) {
  const canAnalyze = value.trim().length > 0 && !isLoading && !disabled;

  return (
    <View style={styles.section}>
      <Text style={styles.label}>Посилання на лот</Text>
      <View style={styles.inputRow}>
        {showLinkIcon ? (
          <Image
            source={require("@/assets/images/link-icon.png")}
            style={styles.linkIcon}
            resizeMode="contain"
          />
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Вставте посилання"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          style={[styles.input, error ? styles.inputError : null]}
          returnKeyType="go"
          onSubmitEditing={canAnalyze ? onAnalyze : undefined}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Аналіз"
          disabled={!canAnalyze}
          onPress={onAnalyze}
          style={[
            styles.analyzeButton,
            !canAnalyze && styles.analyzeButtonDisabled,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.analyzeLabel}>🔍︎</Text>
          )}
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.caption}>
        Аукціони: <Text style={styles.captionHighlight}>Copart</Text>,{" "}
        <Text style={styles.captionHighlight}>IAAI</Text>{" "}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 6,
    width: "100%",
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
  },
  inputRow: {
    minHeight: 70,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  linkIcon: {
    width: 20,
    height: 10,
  },
  input: {
    flex: 1,
    ...typography.input,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  inputError: {
    color: colors.primaryRed,
  },
  error: {
    ...typography.caption,
    color: colors.primaryRed,
  },
  analyzeButton: {
    backgroundColor: colors.link,
    borderRadius: radius.sm,
    minWidth: 12,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  analyzeButtonDisabled: {
    backgroundColor: colors.buttonDisabled,
  },
  analyzeLabel: {
    ...typography.button,
    color: colors.white,
    fontSize: 20,
  },
  caption: {
    ...typography.caption,
    color: colors.textCaption,
  },
  captionHighlight: {
    color: colors.textCaption,
  },
});
