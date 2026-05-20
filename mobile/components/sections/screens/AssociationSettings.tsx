import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, TextInput, Image } from "react-native";
import { router } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Building2,
  Languages,
  Palette,
  Coins,
  Bell,
  AlertTriangle,
  Sparkles,
  Globe,
  Lock,
  Users,
  Mail,
  Smartphone,
  MessageSquare,
  Archive,
  ArrowRightLeft,
  Trash2,
  Info,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/shared/Text";
import { useTheme, space, radius, palette } from "@/theme";

// ============================================================================
// Inline catalog (smaller than AssociationDetail's — settings-relevant fields only)
// ============================================================================

type AssocSettings = {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  brand: [string, string];
  city: string;
  country: string;
  founded: string;
  isVerified: boolean;
  visibility: "public" | "private" | "invite_only";
  language: "en" | "fr" | "de" | "es" | "it" | "pt";
  currency: "CHF" | "EUR";
  emergencyFundPct: number; // 0.5 .. 5.0 typical
  lateFeeFlat: number;
  graceDays: number;
  approvalThreshold: number;
  members: number;
  notifications: {
    duesPaid: { email: boolean; push: boolean; sms: boolean };
    payoutSent: { email: boolean; push: boolean; sms: boolean };
    governanceVote: { email: boolean; push: boolean; sms: boolean };
    weeklyDigest: { email: boolean; push: boolean; sms: boolean };
  };
};

const ASSOC_SETTINGS: Record<string, AssocSettings> = {
  ma1: {
    id: "ma1",
    name: "Senegalese Union of Switzerland",
    tagline: "Geneva chapter · Saving and serving together since 2014",
    logo: "https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=200&h=200&fit=crop",
    brand: [palette.indigo[600], palette.amber[400]],
    city: "Geneva",
    country: "Switzerland",
    founded: "2014",
    isVerified: true,
    visibility: "invite_only",
    language: "fr",
    currency: "CHF",
    emergencyFundPct: 1.0,
    lateFeeFlat: 15,
    graceDays: 7,
    approvalThreshold: 5000,
    members: 248,
    notifications: {
      duesPaid: { email: true, push: true, sms: false },
      payoutSent: { email: true, push: true, sms: true },
      governanceVote: { email: true, push: true, sms: false },
      weeklyDigest: { email: true, push: false, sms: false },
    },
  },
};

// Fallback when an unknown id is hit — keeps the screen renderable.
function fallback(id: string): AssocSettings {
  return {
    ...ASSOC_SETTINGS.ma1,
    id,
    name: "Association",
  };
}

function findSettings(id: string): AssocSettings {
  return ASSOC_SETTINGS[id] ?? fallback(id);
}

// ============================================================================
// Helpers
// ============================================================================

const BRAND_SWATCHES: { name: string; colors: [string, string] }[] = [
  { name: "Indigo / Amber", colors: [palette.indigo[600], palette.amber[400]] },
  { name: "Rose / Amber", colors: [palette.rose[500], palette.amber[400]] },
  { name: "Emerald / Indigo", colors: [palette.emerald[600], palette.indigo[500]] },
  { name: "Sky / Indigo", colors: [palette.sky[500], palette.indigo[500]] },
  { name: "Amber / Indigo", colors: [palette.amber[500], palette.indigo[700]] },
];

const LANGUAGE_OPTIONS: { value: AssocSettings["language"]; label: string }[] = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "es", label: "Español" },
  { value: "it", label: "Italiano" },
  { value: "pt", label: "Português" },
];

const NOTIF_EVENTS = [
  { key: "duesPaid" as const, label: "Dues paid", description: "A member completes a dues payment." },
  { key: "payoutSent" as const, label: "Payout sent", description: "A ROSCA payout is disbursed." },
  { key: "governanceVote" as const, label: "Governance vote", description: "A proposal opens or closes." },
  { key: "weeklyDigest" as const, label: "Weekly digest", description: "Sunday recap of association activity." },
];

// ============================================================================
// Sub-components
// ============================================================================

function Card({
  title,
  Icon,
  children,
  tone = "default",
}: {
  title: string;
  Icon: typeof Building2;
  children: React.ReactNode;
  tone?: "default" | "danger";
}) {
  const t = useTheme();
  const accent = tone === "danger" ? t.danger : t.textPrimary;
  return (
    <View style={[styles.card, { backgroundColor: t.surface, borderColor: tone === "danger" ? t.danger : t.border }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.md }}>
        <Icon size={16} color={accent} />
        <Text variant="bodySmall" weight="bold" style={{ color: accent, letterSpacing: 0.2 }}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: space.md }}>
      <Text variant="caption" tone="secondary" weight="semibold">
        {label}
      </Text>
      {hint ? (
        <Text variant="micro" tone="muted" style={{ marginTop: 2, marginBottom: 6 }}>
          {hint}
        </Text>
      ) : (
        <View style={{ height: 4 }} />
      )}
      {children}
    </View>
  );
}

function TextField({
  value,
  onChange,
  placeholder,
  multiline,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const t = useTheme();
  return (
    <View style={[styles.inputWrap, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={t.textMuted}
        multiline={multiline}
        style={[
          styles.input,
          { color: t.textPrimary, minHeight: multiline ? 56 : undefined },
        ]}
      />
    </View>
  );
}

function PillChoice<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; Icon?: typeof Globe }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
      {options.map((opt) => {
        const active = opt.value === value;
        const I = opt.Icon;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.pill,
              {
                backgroundColor: active ? t.primary : t.bgElevated,
                borderColor: active ? t.primary : t.border,
              },
            ]}
          >
            {I ? <I size={11} color={active ? "#fff" : t.textSecondary} /> : null}
            <Text variant="caption" weight="semibold" style={{ color: active ? "#fff" : t.textSecondary }}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const t = useTheme();
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={[
        styles.toggle,
        { backgroundColor: value ? t.success : t.bgMuted, borderColor: value ? t.success : t.border },
      ]}
    >
      <View
        style={[
          styles.toggleKnob,
          {
            backgroundColor: "#fff",
            transform: [{ translateX: value ? 18 : 2 }],
          },
        ]}
      />
    </Pressable>
  );
}

function Slider({
  value,
  min,
  max,
  step,
  onChange,
  formatLabel,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  formatLabel: (v: number) => string;
}) {
  const t = useTheme();
  const pct = ((value - min) / (max - min)) * 100;
  const stops: number[] = [];
  for (let v = min; v <= max + 0.0001; v += step) stops.push(Math.round(v * 100) / 100);

  return (
    <View style={{ gap: space.sm }}>
      <View style={[styles.sliderTrack, { backgroundColor: t.bgMuted }]}>
        <View style={[styles.sliderFill, { width: `${pct}%`, backgroundColor: t.primary }]} />
        <View
          style={[
            styles.sliderThumb,
            { backgroundColor: t.primary, borderColor: t.surface, left: `${pct}%` },
          ]}
        />
      </View>
      <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
        {stops.map((v) => {
          const active = Math.abs(v - value) < step / 2;
          return (
            <Pressable
              key={v}
              onPress={() => onChange(v)}
              style={[
                styles.sliderChip,
                {
                  backgroundColor: active ? t.primary : t.bgElevated,
                  borderColor: active ? t.primary : t.border,
                },
              ]}
            >
              <Text variant="micro" weight="bold" style={{ color: active ? "#fff" : t.textSecondary }}>
                {formatLabel(v)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ============================================================================
// Main
// ============================================================================

export function AssociationSettings({ id }: { id: string }) {
  const t = useTheme();
  const initial = findSettings(id);
  const [s, setS] = useState<AssocSettings>(initial);
  const [toast, setToast] = useState<string | null>(null);

  const save = (msg: string) => {
    setToast(msg);
    // The toast auto-clears on next state mutation; nothing else to do for design.
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Hero — uses the association brand hue so the screen feels grounded */}
        <LinearGradient
          colors={s.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={20} color="#fff" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.8)", letterSpacing: 1.2 }}>
                ASSOCIATION SETTINGS
              </Text>
              <Text variant="micro" weight="semibold" style={{ color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                {s.city} · {s.country} · Founded {s.founded}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md, marginTop: space.lg }}>
            <Image source={{ uri: s.logo }} style={styles.assocLogo} />
            <View style={{ flex: 1 }}>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }} numberOfLines={2}>
                {s.name}
              </Text>
              <Text variant="caption" style={{ color: "rgba(255,255,255,0.85)" }} numberOfLines={1}>
                {s.members} members · {s.currency}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Toast */}
        {toast ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: -space.lg }}>
            <View style={[styles.toast, { backgroundColor: t.success, borderColor: t.success }]}>
              <Sparkles size={14} color="#fff" />
              <Text variant="caption" weight="semibold" style={{ color: "#fff", flex: 1 }}>
                {toast}
              </Text>
              <Pressable onPress={() => setToast(null)}>
                <Text variant="micro" weight="bold" style={{ color: "#fff" }}>
                  UNDO
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={{ paddingHorizontal: space.lg, marginTop: toast ? space.md : -space.lg, gap: space.md }}>
          {/* 1. Profile */}
          <Card title="Profile" Icon={Building2}>
            <Field label="Name">
              <TextField
                value={s.name}
                onChange={(v) => setS({ ...s, name: v })}
                placeholder="Association name"
              />
            </Field>
            <Field label="Tagline" hint="Shown in member directory and search">
              <TextField
                value={s.tagline}
                onChange={(v) => setS({ ...s, tagline: v })}
                multiline
              />
            </Field>
            <Field label="Visibility">
              <PillChoice
                options={[
                  { value: "public", label: "Public", Icon: Globe },
                  { value: "invite_only", label: "Invite only", Icon: Lock },
                  { value: "private", label: "Private", Icon: Users },
                ]}
                value={s.visibility}
                onChange={(v) => setS({ ...s, visibility: v })}
              />
            </Field>
          </Card>

          {/* 2. Locale & currency */}
          <Card title="Locale & currency" Icon={Languages}>
            <Field label="Primary language">
              <PillChoice
                options={LANGUAGE_OPTIONS}
                value={s.language}
                onChange={(v) => setS({ ...s, language: v })}
              />
            </Field>
            <Field label="Currency" hint="Used across ledger, dues, and circles. Changing this is operational, not financial.">
              <PillChoice
                options={[
                  { value: "CHF" as const, label: "CHF" },
                  { value: "EUR" as const, label: "EUR" },
                ]}
                value={s.currency}
                onChange={(v) => setS({ ...s, currency: v })}
              />
            </Field>
          </Card>

          {/* 3. Branding */}
          <Card title="Branding" Icon={Palette}>
            <Field label="Brand hue" hint="Tints the dashboard header and avatar badge.">
              <View style={{ flexDirection: "row", gap: space.sm, flexWrap: "wrap" }}>
                {BRAND_SWATCHES.map((sw) => {
                  const active = sw.colors[0] === s.brand[0] && sw.colors[1] === s.brand[1];
                  return (
                    <Pressable
                      key={sw.name}
                      onPress={() => setS({ ...s, brand: sw.colors })}
                      style={[styles.swatchBtn, active && { borderColor: t.primary, borderWidth: 2 }]}
                    >
                      <LinearGradient
                        colors={sw.colors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.swatch}
                      />
                      <Text variant="micro" tone={active ? "primary" : "secondary"} weight={active ? "bold" : "semibold"}>
                        {sw.name}
                      </Text>
                      {active ? <Check size={11} color={t.primary} /> : null}
                    </Pressable>
                  );
                })}
              </View>
            </Field>
          </Card>

          {/* 4. Fees & Emergency Fund */}
          <Card title="Fees & Emergency Fund" Icon={Coins}>
            <View style={[styles.banner, { backgroundColor: t.infoSoft, borderColor: t.info }]}>
              <Info size={13} color={t.info} />
              <Text variant="caption" weight="semibold" style={{ color: t.info, flex: 1 }}>
                Changing fees affects future contributions only.
              </Text>
            </View>

            <View style={{ height: space.md }} />

            <Field label="Emergency Fund rate" hint={`Skim ${s.emergencyFundPct.toFixed(1)}% of each contribution into the welfare fund.`}>
              <Slider
                value={s.emergencyFundPct}
                min={0.5}
                max={3.0}
                step={0.5}
                onChange={(v) => setS({ ...s, emergencyFundPct: v })}
                formatLabel={(v) => `${v.toFixed(1)}%`}
              />
            </Field>

            <Field label="Late fee (flat)" hint="Applied per overdue invoice once grace period expires.">
              <View style={[styles.inputWrap, { backgroundColor: t.bgMuted, borderColor: t.border, flexDirection: "row", alignItems: "center", gap: 6 }]}>
                <Text variant="bodySmall" tone="secondary" weight="bold">
                  {s.currency}
                </Text>
                <TextInput
                  value={String(s.lateFeeFlat)}
                  onChangeText={(v) => setS({ ...s, lateFeeFlat: parseInt(v || "0", 10) || 0 })}
                  keyboardType="number-pad"
                  style={[styles.input, { color: t.textPrimary, flex: 1 }]}
                />
              </View>
            </Field>

            <Field label="Grace period" hint="Days after due date before late fees kick in.">
              <PillChoice
                options={[
                  { value: "3", label: "3 days" },
                  { value: "7", label: "7 days" },
                  { value: "14", label: "14 days" },
                  { value: "30", label: "30 days" },
                ]}
                value={String(s.graceDays) as "3" | "7" | "14" | "30"}
                onChange={(v) => setS({ ...s, graceDays: parseInt(v, 10) })}
              />
            </Field>

            <Field label="Approval threshold" hint="Transactions ≥ this amount need president sign-off.">
              <View style={[styles.inputWrap, { backgroundColor: t.bgMuted, borderColor: t.border, flexDirection: "row", alignItems: "center", gap: 6 }]}>
                <Text variant="bodySmall" tone="secondary" weight="bold">
                  {s.currency}
                </Text>
                <TextInput
                  value={String(s.approvalThreshold)}
                  onChangeText={(v) => setS({ ...s, approvalThreshold: parseInt(v || "0", 10) || 0 })}
                  keyboardType="number-pad"
                  style={[styles.input, { color: t.textPrimary, flex: 1 }]}
                />
              </View>
            </Field>

            <Pressable
              onPress={() => save(`Emergency Fund rate updated. Next cycle uses ${s.emergencyFundPct.toFixed(1)}%.`)}
              style={[styles.saveBtn, { backgroundColor: t.primary }]}
            >
              <Check size={14} color="#fff" />
              <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>
                Save fee changes
              </Text>
            </Pressable>
          </Card>

          {/* 5. Notifications */}
          <Card title="Notifications" Icon={Bell}>
            <View style={[styles.notifHeader, { borderColor: t.border }]}>
              <View style={{ flex: 1 }} />
              <View style={styles.notifChannel}>
                <Mail size={12} color={t.textMuted} />
              </View>
              <View style={styles.notifChannel}>
                <Smartphone size={12} color={t.textMuted} />
              </View>
              <View style={styles.notifChannel}>
                <MessageSquare size={12} color={t.textMuted} />
              </View>
            </View>
            {NOTIF_EVENTS.map((evt) => {
              const row = s.notifications[evt.key];
              return (
                <View key={evt.key} style={[styles.notifRow, { borderColor: t.border }]}>
                  <View style={{ flex: 1, paddingRight: space.sm }}>
                    <Text variant="bodySmall" weight="semibold">
                      {evt.label}
                    </Text>
                    <Text variant="micro" tone="secondary">
                      {evt.description}
                    </Text>
                  </View>
                  <View style={styles.notifChannel}>
                    <Toggle
                      value={row.email}
                      onChange={(v) =>
                        setS({
                          ...s,
                          notifications: {
                            ...s.notifications,
                            [evt.key]: { ...row, email: v },
                          },
                        })
                      }
                    />
                  </View>
                  <View style={styles.notifChannel}>
                    <Toggle
                      value={row.push}
                      onChange={(v) =>
                        setS({
                          ...s,
                          notifications: {
                            ...s.notifications,
                            [evt.key]: { ...row, push: v },
                          },
                        })
                      }
                    />
                  </View>
                  <View style={styles.notifChannel}>
                    <Toggle
                      value={row.sms}
                      onChange={(v) =>
                        setS({
                          ...s,
                          notifications: {
                            ...s.notifications,
                            [evt.key]: { ...row, sms: v },
                          },
                        })
                      }
                    />
                  </View>
                </View>
              );
            })}
          </Card>

          {/* 6. Danger Zone */}
          <Card title="Danger zone" Icon={AlertTriangle} tone="danger">
            <DangerRow
              Icon={Archive}
              label="Archive association"
              description="Hide from member directory · keep history read-only"
              onPress={() => save("Association archived · members notified")}
              tone="warning"
            />
            <DangerRow
              Icon={ArrowRightLeft}
              label="Transfer to new president"
              description="Hand off ownership to another verified member"
              onPress={() => save("Transfer initiated · awaiting acceptance")}
              tone="info"
            />
            <DangerRow
              Icon={Trash2}
              label="Delete association"
              description="Permanent · only allowed when balance is zero"
              onPress={() => save("Delete requires zero balance · contact support")}
              tone="danger"
            />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function DangerRow({
  Icon,
  label,
  description,
  onPress,
  tone,
}: {
  Icon: typeof Archive;
  label: string;
  description: string;
  onPress: () => void;
  tone: "danger" | "warning" | "info";
}) {
  const t = useTheme();
  const toneMap = {
    danger: { bg: t.dangerSoft, fg: t.danger },
    warning: { bg: t.warningSoft, fg: t.warning },
    info: { bg: t.infoSoft, fg: t.info },
  } as const;
  const c = toneMap[tone];
  return (
    <Pressable
      onPress={onPress}
      style={[styles.dangerRow, { borderColor: t.border }]}
    >
      <View style={[styles.dangerIcon, { backgroundColor: c.bg }]}>
        <Icon size={14} color={c.fg} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="bold" style={{ color: c.fg }}>
          {label}
        </Text>
        <Text variant="micro" tone="secondary">
          {description}
        </Text>
      </View>
      <ChevronRight size={14} color={t.textMuted} />
    </Pressable>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  header: {
    paddingTop: 64,
    paddingBottom: space.xl + space.lg,
    paddingHorizontal: space.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
  },
  assocLogo: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: palette.slate[200],
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.24)",
  },

  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  card: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  // Inputs
  inputWrap: {
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  input: {
    fontSize: 14,
    padding: 0,
  },

  // Pills (shared)
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },

  // Toggle
  toggle: {
    width: 40,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    justifyContent: "center",
  },
  toggleKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },

  // Slider (chip-based for mobile clarity)
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    position: "relative",
  },
  sliderFill: {
    height: "100%",
    borderRadius: 3,
  },
  sliderThumb: {
    position: "absolute",
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    marginLeft: -10,
  },
  sliderChip: {
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },

  // Branding swatches
  swatchBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "transparent",
  },
  swatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },

  // Save CTA inside fees card
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: radius.md,
    marginTop: space.sm,
  },

  // Notifications matrix
  notifHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  notifRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  notifChannel: {
    width: 50,
    alignItems: "center",
  },

  // Danger
  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dangerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
