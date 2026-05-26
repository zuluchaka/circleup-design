import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { Check, ChevronRight, MapPin, Coins, Sun, Moon, Smartphone } from "lucide-react-native";
import { router } from "expo-router";
import { AppHeader } from "@/components/shared/AppHeader";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { useTheme, space, radius } from "@/theme";
import { useThemeMode, type ThemeMode } from "@/theme/ThemeModeProvider";
import profile from "@/product/sections/20-profile/data.json";
import type { CurrencyCode, LanguageOption, UserProfile } from "@/product/sections/20-profile/types";

const APPEARANCE_OPTIONS: { key: ThemeMode; label: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { key: "light", label: "Light", Icon: Sun },
  { key: "dark", label: "Dark", Icon: Moon },
  { key: "system", label: "System", Icon: Smartphone },
];

const CURRENCIES: CurrencyCode[] = ["CHF", "EUR", "USD"];

export function ProfileLanguage() {
  const t = useTheme();
  const { mode, setMode } = useThemeMode();
  const data = profile as unknown as UserProfile;
  const { language } = data;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Language & appearance" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 120, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginLeft: space.xs, marginBottom: space.sm }}>
            APPEARANCE
          </Text>
          <Card>
            <View style={{ flexDirection: "row", gap: space.sm }}>
              {APPEARANCE_OPTIONS.map((opt) => {
                const selected = mode === opt.key;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => setMode(opt.key)}
                    style={[
                      styles.appearanceTile,
                      {
                        backgroundColor: selected ? t.primary : t.surface,
                        borderColor: selected ? t.primary : t.border,
                      },
                    ]}
                  >
                    <opt.Icon size={18} color={selected ? "#fff" : t.textSecondary} />
                    <Text
                      variant="bodySmall"
                      weight="bold"
                      style={{ color: selected ? "#fff" : t.textPrimary, marginTop: 4 }}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text variant="micro" tone="muted" style={{ marginTop: space.sm }}>
              {mode === "system"
                ? "Follows your phone's dark-mode setting."
                : `Always uses the ${mode} palette, regardless of system setting.`}
            </Text>
          </Card>
        </View>

        <View>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginLeft: space.xs, marginBottom: space.sm }}>
            APP LANGUAGE
          </Text>
          <Card padded={false}>
            {language.options.map((opt, i) => (
              <LanguageRow
                key={opt.code}
                option={opt}
                selected={opt.code === language.language}
                last={i === language.options.length - 1}
              />
            ))}
          </Card>
          <Text variant="micro" tone="muted" style={{ marginTop: 6, marginLeft: space.xs, lineHeight: 14 }}>
            New strings ship in EN first; other locales catch up within a release.
          </Text>
        </View>

        <View>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginLeft: space.xs, marginBottom: space.sm }}>
            DISPLAY CURRENCY
          </Text>
          <Card>
            <View style={{ flexDirection: "row", gap: space.sm }}>
              {CURRENCIES.map((c) => {
                const selected = c === language.currency;
                return (
                  <Pressable
                    key={c}
                    style={[
                      styles.currencyTile,
                      {
                        backgroundColor: selected ? t.primary : t.surface,
                        borderColor: selected ? t.primary : t.border,
                      },
                    ]}
                  >
                    <Coins size={16} color={selected ? "#fff" : t.textMuted} />
                    <Text
                      variant="body"
                      weight="bold"
                      style={{ color: selected ? "#fff" : t.textPrimary, marginTop: 4 }}
                    >
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text variant="micro" tone="muted" style={{ marginTop: space.sm }}>
              Amounts inside circles always use the circle's own currency. This setting controls what you see across summaries and reports.
            </Text>
          </Card>
        </View>

        <View>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginLeft: space.xs, marginBottom: space.sm }}>
            COUNTRY
          </Text>
          <Card padded={false}>
            <Pressable style={styles.countryRow}>
              <View style={[styles.iconTile, { backgroundColor: t.bgMuted }]}>
                <MapPin size={18} color={t.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="semibold">
                  {language.country}
                </Text>
                <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                  Drives KYC requirements and available payment methods.
                </Text>
              </View>
              <ChevronRight size={18} color={t.textMuted} />
            </Pressable>
          </Card>
        </View>
      </ScrollView>

      <View style={[styles.saveBar, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
          Language change reloads the app.
        </Text>
        <Button label="Save" variant="primary" />
      </View>
    </View>
  );
}

function LanguageRow({
  option,
  selected,
  last,
}: {
  option: LanguageOption;
  selected: boolean;
  last: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable
      style={[
        styles.langRow,
        !last && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <Text style={styles.flag}>{option.flag}</Text>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="semibold">
          {option.nativeName}
        </Text>
        <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
          {option.englishName}
        </Text>
      </View>
      {selected ? (
        <View style={[styles.checkPill, { backgroundColor: t.primary }]}>
          <Check size={12} color="#fff" strokeWidth={3} />
        </View>
      ) : (
        <View style={[styles.checkPill, { borderColor: t.border, borderWidth: 1 }]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
  flag: {
    fontSize: 28,
  },
  checkPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  currencyTile: {
    flex: 1,
    alignItems: "center",
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  appearanceTile: {
    flex: 1,
    alignItems: "center",
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    paddingBottom: space.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
