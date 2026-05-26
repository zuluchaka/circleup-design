import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  FileText,
  ShieldQuestion,
  Cookie,
  Building2,
  Code2,
  ChevronRight,
  Info,
} from "lucide-react-native";
import { router } from "expo-router";
import { AppHeader } from "@/components/shared/AppHeader";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { useTheme, space, radius } from "@/theme";
import profile from "@/product/sections/20-profile/data.json";
import type { LegalLink, UserProfile } from "@/product/sections/20-profile/types";

const LEGAL_ICONS: Record<LegalLink["key"], React.ComponentType<{ size?: number; color?: string }>> = {
  terms: FileText,
  privacy: ShieldQuestion,
  cookies: Cookie,
  finma_disclosure: Building2,
  open_source_licenses: Code2,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ProfileLegalAbout() {
  const t = useTheme();
  const data = profile as unknown as UserProfile;
  const { legal, about } = data;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Legal & about" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 64, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginLeft: space.xs, marginBottom: space.sm }}>
            LEGAL
          </Text>
          <Card padded={false}>
            {legal.map((entry, i) => (
              <LegalRow key={entry.key} entry={entry} last={i === legal.length - 1} />
            ))}
          </Card>
        </View>

        <View>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginLeft: space.xs, marginBottom: space.sm }}>
            ABOUT THIS APP
          </Text>
          <Card>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
              <View style={[styles.appIcon, { backgroundColor: t.primary }]}>
                <Text variant="h2" weight="bold" style={{ color: "#fff" }}>
                  C
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="bold">
                  {about.appName} for Android
                </Text>
                <Text variant="micro" tone="secondary">
                  {about.poweredBy} · {about.region}
                </Text>
              </View>
              <View style={[styles.envPill, { backgroundColor: t.successSoft }]}>
                <Text variant="micro" weight="bold" style={{ color: t.success, letterSpacing: 0.4 }}>
                  {about.channel.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={[styles.metaGrid, { borderColor: t.border, backgroundColor: t.bgMuted }]}>
              <Meta label="VERSION" value={about.version} />
              <View style={[styles.metaSep, { backgroundColor: t.border }]} />
              <Meta label="BUILD" value={about.build} />
              <View style={[styles.metaSep, { backgroundColor: t.border }]} />
              <Meta label="REGION" value="CH" />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: space.md }}>
              <Info size={12} color={t.textMuted} />
              <Text variant="micro" tone="muted" style={{ flex: 1 }}>
                Tap the version 7 times to access developer mode.
              </Text>
            </View>
          </Card>
        </View>

        <Text variant="caption" tone="muted" align="center" style={{ marginTop: space.sm, lineHeight: 16 }}>
          © {about.copyrightYear} {about.poweredBy}.{"\n"}
          Built with care in Geneva, Zurich, and Dakar.
        </Text>
      </ScrollView>
    </View>
  );
}

function LegalRow({ entry, last }: { entry: LegalLink; last: boolean }) {
  const t = useTheme();
  const Icon = LEGAL_ICONS[entry.key];
  return (
    <Pressable
      style={[
        styles.legalRow,
        !last && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={[styles.legalIcon, { backgroundColor: t.bgMuted }]}>
        <Icon size={18} color={t.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="semibold">
          {entry.label}
        </Text>
        <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
          Updated {formatDate(entry.updatedAt)}
        </Text>
      </View>
      <ChevronRight size={18} color={t.textMuted} />
    </Pressable>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
        {label}
      </Text>
      <Text variant="bodySmall" weight="bold" style={{ marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  legalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
  legalIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  envPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  metaGrid: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.md,
    borderRadius: radius.md,
    marginTop: space.md,
  },
  metaSep: {
    width: 1,
    height: 28,
  },
});
