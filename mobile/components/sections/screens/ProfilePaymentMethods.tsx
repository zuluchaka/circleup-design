import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Plus,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Star,
  Banknote,
} from "lucide-react-native";
import { router } from "expo-router";
import { AppHeader } from "@/components/shared/AppHeader";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { useTheme, space, radius, palette } from "@/theme";
import profile from "@/product/sections/20-profile/data.json";
import type { PaymentBrand, PaymentMethod, UserProfile } from "@/product/sections/20-profile/types";

const sampleProfile = profile as unknown as UserProfile;

const BRAND_VISUAL: Record<PaymentBrand, { label: string; bg: string; fg: string; Icon: React.ComponentType<{ size?: number; color?: string }> }> = {
  visa: { label: "VISA", bg: palette.indigo[600], fg: "#fff", Icon: CreditCard },
  mastercard: { label: "MC", bg: palette.rose[600], fg: "#fff", Icon: CreditCard },
  amex: { label: "AMEX", bg: palette.sky[600], fg: "#fff", Icon: CreditCard },
  twint: { label: "TWINT", bg: "#1F2937", fg: "#fff", Icon: Smartphone },
  postfinance: { label: "PF", bg: palette.amber[500], fg: "#1F2937", Icon: Building2 },
  iban: { label: "IBAN", bg: palette.slate[700], fg: "#fff", Icon: Building2 },
  mobile_wallet: { label: "WALLET", bg: palette.emerald[600], fg: "#fff", Icon: Wallet },
};

export function ProfilePaymentMethods({ data = sampleProfile }: { data?: UserProfile } = {}) {
  const t = useTheme();
  const payIn = data.paymentMethods.filter((m) => m.purpose === "pay_in");
  const payOut = data.paymentMethods.filter((m) => m.purpose === "pay_out");
  const hasExpiring = data.paymentMethods.some((m) => m.status === "expiring");
  const isEmpty = data.paymentMethods.length === 0;

  if (isEmpty) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
        <AppHeader title="Payment methods" onBack={() => router.back()} />
        <ScrollView
          contentContainerStyle={{ padding: space.lg, paddingBottom: 64, gap: space.lg }}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.emptyState, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={[styles.emptyIcon, { backgroundColor: t.primarySoft }]}>
              <Banknote size={28} color={t.primary} />
            </View>
            <Text variant="h2" weight="bold" align="center" style={{ marginTop: space.md }}>
              Add a method to receive payouts
            </Text>
            <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: space.sm, lineHeight: 18 }}>
              You need at least one pay-out method (IBAN, TWINT, or mobile wallet) before you can join a ROSCA circle.
              Adding a pay-in method lets you contribute by card or TWINT.
            </Text>
            <View style={{ marginTop: space.lg, width: "100%", gap: space.sm }}>
              <Pressable style={[styles.emptyCta, { backgroundColor: t.primary }]}>
                <Plus size={16} color="#fff" />
                <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>
                  Add pay-out method
                </Text>
              </Pressable>
              <Pressable
                style={[styles.emptyCta, { backgroundColor: t.surface, borderColor: t.border, borderWidth: 1 }]}
              >
                <Plus size={16} color={t.primary} />
                <Text variant="bodySmall" weight="bold" tone="accent">
                  Add pay-in method
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Payment methods" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 64, gap: space.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Section title="Pay in" sub="Used for contributions and circle joins">
          <Card padded={false}>
            {payIn.map((m, i) => (
              <MethodRow key={m.id} method={m} last={i === payIn.length - 1} />
            ))}
            <AddRow label="Add a pay-in method" sub="Card · TWINT · PostFinance" t={t} />
          </Card>
        </Section>

        <Section title="Pay out" sub="Where you receive ROSCA payouts">
          <Card padded={false}>
            {payOut.map((m, i) => (
              <MethodRow key={m.id} method={m} last={i === payOut.length - 1} />
            ))}
            <AddRow label="Add a pay-out method" sub="IBAN · TWINT · Mobile wallet" t={t} />
          </Card>
        </Section>

        {hasExpiring ? (
          <View style={[styles.notice, { backgroundColor: t.infoSoft, borderColor: t.info }]}>
            <AlertTriangle size={16} color={t.info} />
            <Text variant="caption" style={{ flex: 1, color: t.info, lineHeight: 16 }}>
              Mastercard •••• 9931 expires in 4 months. Update the expiry to keep it as a backup.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: space.sm }}>
      <View style={{ paddingHorizontal: space.xs, gap: 2 }}>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>
          {title.toUpperCase()}
        </Text>
        <Text variant="caption" tone="secondary">
          {sub}
        </Text>
      </View>
      {children}
    </View>
  );
}

function MethodRow({ method, last }: { method: PaymentMethod; last: boolean }) {
  const t = useTheme();
  const v = BRAND_VISUAL[method.brand];
  const isMonospaceMask = method.brand === "iban" || method.brand === "postfinance";
  return (
    <Pressable
      style={[
        styles.row,
        !last && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={[styles.brandTile, { backgroundColor: v.bg }]}>
        <Text variant="micro" weight="bold" style={{ color: v.fg, letterSpacing: 0.6 }}>
          {v.label}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text variant="bodySmall" weight="semibold">
            {method.label}
          </Text>
          {method.isDefault ? (
            <View style={[styles.tag, { backgroundColor: t.primarySoft }]}>
              <Star size={9} color={t.primary} fill={t.primary} />
              <Text variant="micro" weight="bold" style={{ color: t.primary, letterSpacing: 0.4 }}>
                DEFAULT
              </Text>
            </View>
          ) : method.isBackup ? (
            <View style={[styles.tag, { backgroundColor: t.bgMuted }]}>
              <Text variant="micro" weight="bold" style={{ color: t.textSecondary, letterSpacing: 0.4 }}>
                BACKUP
              </Text>
            </View>
          ) : null}
        </View>
        <Text
          variant="caption"
          tone="secondary"
          style={{
            fontFamily: isMonospaceMask ? "monospace" : undefined,
            marginTop: 2,
          }}
        >
          {method.mask}
          {method.exp ? ` · expires ${method.exp}` : ""}
        </Text>
        {method.status === "expiring" ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
            <AlertTriangle size={11} color={t.warning} />
            <Text variant="micro" weight="bold" style={{ color: t.warning, letterSpacing: 0.4 }}>
              EXPIRES SOON
            </Text>
          </View>
        ) : null}
      </View>
      <ChevronRight size={18} color={t.textMuted} />
    </Pressable>
  );
}

function AddRow({
  label,
  sub,
  t,
}: {
  label: string;
  sub: string;
  t: ReturnType<typeof useTheme>;
}) {
  return (
    <Pressable
      style={[
        styles.row,
        { borderTopColor: t.border, borderTopWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={[styles.addTile, { backgroundColor: t.primarySoft, borderColor: t.primary }]}>
        <Plus size={18} color={t.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="semibold" tone="accent">
          {label}
        </Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
          {sub}
        </Text>
      </View>
      <ChevronRight size={18} color={t.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
  brandTile: {
    width: 48,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  addTile: {
    width: 48,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  emptyState: {
    alignItems: "center",
    padding: space.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    paddingVertical: space.md,
    borderRadius: radius.md,
  },
});
