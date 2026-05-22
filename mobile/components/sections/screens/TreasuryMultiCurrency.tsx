import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Check,
  ArrowRight,
  Globe2,
  Clock,
  ShieldCheck,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import treasury from "@/product/sections/04-treasury-and-funds/data.json";

type Currency = {
  code: string;
  name: string;
  flag: string;
  rate: number;
  symbol: string;
};

type Provider = {
  id: string;
  label: string;
  rateBasis: string;
  freshness: string;
};

type Locale = {
  id: string;
  label: string;
  thousandsSeparator: string;
  decimalSeparator: string;
  example: string;
};

function formatNumber(value: number, locale: Locale): string {
  // Format with two decimals using locale separators
  const fixed = value.toFixed(2);
  const [intPart, fracPart] = fixed.split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, locale.thousandsSeparator);
  return `${withThousands}${locale.decimalSeparator}${fracPart}`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function TreasuryMultiCurrency() {
  const t = useTheme();
  const s = treasury.multiCurrencySettings as {
    defaultCurrency: string;
    supported: Currency[];
    providers: Provider[];
    selectedProviderId: string;
    locales: Locale[];
    selectedLocaleId: string;
    preview: { amount: number; in: string };
  };

  const [defaultCurrency, setDefaultCurrency] = useState(s.defaultCurrency);
  const [providerId, setProviderId] = useState(s.selectedProviderId);
  const [localeId, setLocaleId] = useState(s.selectedLocaleId);

  const selectedLocale = useMemo(() => s.locales.find((l) => l.id === localeId)!, [s.locales, localeId]);
  const selected = useMemo(() => s.supported.find((c) => c.code === defaultCurrency)!, [s.supported, defaultCurrency]);
  const provider = useMemo(() => s.providers.find((p) => p.id === providerId)!, [s.providers, providerId]);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Multi-currency"
        subtitle="Diaspora Circle Geneva"
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Active currency hero */}
        <View style={[styles.hero, { backgroundColor: t.primary }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Globe2 size={14} color="rgba(255,255,255,0.85)" />
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.5 }}>
              DEFAULT CURRENCY
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md, marginTop: space.sm }}>
            <Text style={{ fontSize: 44, lineHeight: 50 }}>{selected.flag}</Text>
            <View style={{ flex: 1 }}>
              <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 30, lineHeight: 34 }}>
                {selected.code}
              </Text>
              <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.92)", marginTop: 2 }}>
                {selected.name} · {selected.symbol}
              </Text>
            </View>
          </View>
          <View style={[styles.heroFooter, { borderTopColor: "rgba(255,255,255,0.18)" }]}>
            <FooterStat label="FX rates from" value={provider.label} />
            <FooterStat label="Updated" value={provider.freshness} />
          </View>
        </View>

        {/* Supported currencies */}
        <View>
          <FieldLabel>Supported currencies</FieldLabel>
          <View style={{ gap: space.sm }}>
            {s.supported.map((c) => (
              <CurrencyRow
                key={c.code}
                c={c}
                isDefault={c.code === defaultCurrency}
                onSetDefault={() => setDefaultCurrency(c.code)}
                t={t}
              />
            ))}
          </View>
        </View>

        {/* Conversion preview */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            CONVERSION PREVIEW
          </Text>
          <View style={[styles.previewRow, { backgroundColor: t.bgMuted }]}>
            <View style={styles.previewSide}>
              <Text variant="caption" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>FROM</Text>
              <Text variant="bodySmall" weight="bold" style={{ marginTop: 4 }}>
                {selected.code} {formatNumber(s.preview.amount, selectedLocale)}
              </Text>
            </View>
            <View style={[styles.previewArrow, { backgroundColor: t.surface }]}>
              <ArrowRight size={14} color={t.textSecondary} />
            </View>
            <View style={styles.previewSide}>
              <Text variant="caption" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>TO ALL</Text>
              <View style={{ marginTop: 4, gap: 2 }}>
                {s.supported.filter((c) => c.code !== defaultCurrency).map((c) => (
                  <Text key={c.code} variant="caption" weight="bold">
                    {c.code} {formatNumber(s.preview.amount * c.rate, selectedLocale)}
                  </Text>
                ))}
              </View>
            </View>
          </View>
          <Text variant="micro" tone="muted" style={{ marginTop: 6, lineHeight: 14 }}>
            Using {provider.label} · {provider.rateBasis}
          </Text>
        </Card>

        {/* FX provider */}
        <View>
          <FieldLabel>FX rate provider</FieldLabel>
          <View style={{ gap: space.sm }}>
            {s.providers.map((p) => (
              <ProviderRow
                key={p.id}
                p={p}
                active={p.id === providerId}
                onSelect={() => setProviderId(p.id)}
                t={t}
              />
            ))}
          </View>
        </View>

        {/* Locale */}
        <View>
          <FieldLabel>Locale &amp; formatting</FieldLabel>
          <View style={{ gap: space.sm }}>
            {s.locales.map((l) => (
              <LocaleRow
                key={l.id}
                l={l}
                active={l.id === localeId}
                onSelect={() => setLocaleId(l.id)}
                t={t}
              />
            ))}
          </View>
        </View>

        {/* Disclosure */}
        <View style={[styles.disclosure, { backgroundColor: t.infoSoft }]}>
          <ShieldCheck size={14} color={t.info} />
          <Text variant="micro" style={{ color: t.info, flex: 1, lineHeight: 14 }}>
            Per-circle currency overrides this default when a circle was created in a different currency. Conversion is for display only.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button
          label="Save settings"
          fullWidth
          size="lg"
          trailingIcon={<Check size={16} color="#fff" strokeWidth={3} />}
        />
      </View>
    </View>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
      {String(children).toUpperCase()}
    </Text>
  );
}

function FooterStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="caption" weight="bold" style={{ color: "#fff", marginTop: 2 }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function CurrencyRow({
  c,
  isDefault,
  onSetDefault,
  t,
}: {
  c: Currency;
  isDefault: boolean;
  onSetDefault: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onSetDefault}
      style={[
        styles.curRow,
        {
          backgroundColor: isDefault ? t.primarySoft : t.surface,
          borderColor: isDefault ? t.primary : t.border,
          borderWidth: isDefault ? 1.5 : 1,
        },
      ]}
    >
      <Text style={{ fontSize: 24 }}>{c.flag}</Text>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="bodySmall" weight="bold">{c.code}</Text>
          <Text variant="caption" tone="secondary">{c.symbol}</Text>
          {isDefault ? (
            <View style={[styles.defaultPill, { backgroundColor: t.primary }]}>
              <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.5 }}>DEFAULT</Text>
            </View>
          ) : null}
        </View>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
          {c.name}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>RATE</Text>
        <Text variant="caption" weight="bold" style={{ marginTop: 2 }}>
          {c.rate.toFixed(4)}
        </Text>
      </View>
    </Pressable>
  );
}

function ProviderRow({
  p,
  active,
  onSelect,
  t,
}: {
  p: Provider;
  active: boolean;
  onSelect: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.provRow,
        {
          backgroundColor: active ? t.primarySoft : t.surface,
          borderColor: active ? t.primary : t.border,
          borderWidth: active ? 1.5 : 1,
        },
      ]}
    >
      <View style={[styles.provIcon, { backgroundColor: active ? "rgba(255,255,255,0.6)" : t.bgMuted }]}>
        <Clock size={14} color={active ? t.primary : t.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="bold">{p.label}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
          {p.rateBasis} · {p.freshness}
        </Text>
      </View>
      <View
        style={[
          styles.radio,
          {
            borderColor: active ? t.primary : t.borderStrong,
            backgroundColor: active ? t.primary : "transparent",
          },
        ]}
      >
        {active ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

function LocaleRow({
  l,
  active,
  onSelect,
  t,
}: {
  l: Locale;
  active: boolean;
  onSelect: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.locRow,
        {
          backgroundColor: active ? t.primarySoft : t.surface,
          borderColor: active ? t.primary : t.border,
          borderWidth: active ? 1.5 : 1,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="bold">{l.label}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
          Example · <Text variant="micro" weight="bold" style={{ fontFamily: "Menlo" }}>{l.example}</Text>
        </Text>
      </View>
      <View
        style={[
          styles.radio,
          {
            borderColor: active ? t.primary : t.borderStrong,
            backgroundColor: active ? t.primary : "transparent",
          },
        ]}
      >
        {active ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  heroFooter: {
    flexDirection: "row",
    gap: space.md,
    marginTop: space.md,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  curRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  defaultPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: space.md,
    borderRadius: radius.md,
    gap: space.sm,
  },
  previewSide: {
    flex: 1,
  },
  previewArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  provRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  provIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  disclosure: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  ctaDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: space.lg,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
