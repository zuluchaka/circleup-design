import { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, TextInput, Image } from "react-native";
import { router } from "expo-router";
import {
  Search as SearchIcon,
  Plus,
  Building2,
  TrendingUp,
  AlertTriangle,
  CalendarClock,
  FileSignature,
  Sparkles,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/shared/Text";
import { RelationshipCard } from "@/components/shared/RelationshipCard";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";
import { CURRENT_USER } from "@/data/currentUser";
import {
  RELATIONSHIPS,
  BR_STATUS_FILTERS,
  BR_TIER_FILTERS,
  BR_RISK_FILTERS,
  type BrStatus,
  type BrTier,
  type BusinessRelationship,
} from "@/data/businessRelationships";

// ============================================================================
// Sub-components
// ============================================================================

function FilterChips<T extends string>({
  options,
  value,
  onChange,
  variant = "primary",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  variant?: "primary" | "secondary";
}) {
  const t = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.sm }}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        const activeBg = variant === "primary" ? t.primary : t.accent;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? activeBg : t.bgElevated,
                borderColor: selected ? activeBg : t.border,
              },
            ]}
          >
            <Text
              variant="caption"
              weight="semibold"
              style={{ color: selected ? "#fff" : t.textSecondary }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function MetricCard({
  t,
  label,
  count,
  value,
  tone,
}: {
  t: AppTheme;
  label: string;
  count?: number;
  value?: string;
  tone: "success" | "warning" | "danger" | "primary";
}) {
  const toneMap = {
    success: { bg: t.successSoft, fg: t.success },
    warning: { bg: t.warningSoft, fg: t.warning },
    danger: { bg: t.dangerSoft, fg: t.danger },
    primary: { bg: t.primarySoft, fg: t.primary },
  } as const;
  const c = toneMap[tone];
  return (
    <View style={[styles.metricCard, { backgroundColor: c.bg }]}>
      <Text variant="micro" weight="bold" style={{ color: c.fg, letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="h2" weight="bold" style={{ color: c.fg, marginTop: 2 }}>
        {value ?? String(count ?? 0)}
      </Text>
    </View>
  );
}

function NotACmGate() {
  const t = useTheme();
  return (
    <View style={[styles.gateWrap, { backgroundColor: t.bg }]}>
      <View style={[styles.gateIcon, { backgroundColor: t.bgMuted }]}>
        <Building2 size={28} color={t.textMuted} />
      </View>
      <Text variant="h3" weight="semibold" align="center">
        Circle Manager access only
      </Text>
      <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: space.xs }}>
        Business Relationships are visible to Mafao employees with an active Circle Manager profile.
      </Text>
    </View>
  );
}

// ============================================================================
// Main
// ============================================================================

export function MyRelationships() {
  const t = useTheme();

  // Hold the BR list in state so card-level lifecycle confirms can mutate.
  const [items, setItems] = useState<BusinessRelationship[]>(RELATIONSHIPS);

  const [query, setQuery] = useState("");
  const [brStatus, setBrStatus] = useState<BrStatus | "all">("all");
  const [brTier, setBrTier] = useState<BrTier | "all">("all");
  const [brRisk, setBrRisk] = useState<"all" | "expiring" | "churn" | "overdue">("all");

  const filtered = useMemo(() => {
    if (!CURRENT_USER.isCircleManager) return [];
    const q = query.trim().toLowerCase();
    return items.filter((br) => {
      const matchesQ =
        !q ||
        br.associationName.toLowerCase().includes(q) ||
        br.reference.toLowerCase().includes(q) ||
        br.region.toLowerCase().includes(q);
      const matchesStatus = brStatus === "all" || br.status === brStatus;
      const matchesTier = brTier === "all" || br.tier === brTier;
      const matchesRisk =
        brRisk === "all" ||
        (brRisk === "expiring" && br.isExpiringSoon) ||
        (brRisk === "churn" && br.isChurnRisk) ||
        (brRisk === "overdue" && (br.overdueAmount ?? 0) > 0);
      return matchesQ && matchesStatus && matchesTier && matchesRisk;
    });
  }, [items, query, brStatus, brTier, brRisk]);

  const mrr = useMemo(
    () =>
      items.filter((br) => br.status === "active").reduce((s, br) => s + br.monthlyRevenue, 0),
    [items],
  );

  const counts = useMemo(
    () => ({
      active: items.filter((r) => r.status === "active").length,
      pending: items.filter((r) => r.status === "pending").length,
      atRisk: items.filter((r) => r.isChurnRisk || r.isExpiringSoon).length,
    }),
    [items],
  );

  const handleUpdate = (next: BusinessRelationship) => {
    setItems((prev) => prev.map((br) => (br.id === next.id ? next : br)));
  };

  if (!CURRENT_USER.isCircleManager) {
    return <NotACmGate />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Hero header */}
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <View style={[styles.userBadge]}>
              <Image source={{ uri: CURRENT_USER.avatar }} style={styles.userAvatar} />
              <View style={[styles.cmDot, { backgroundColor: palette.amber[400], borderColor: palette.indigo[900] }]}>
                <Building2 size={9} color={palette.indigo[900]} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1.2 }}>
                CIRCLE MANAGER · {CURRENT_USER.employeeId}
              </Text>
              <Text variant="h3" weight="bold" style={{ color: "#fff" }}>
                {CURRENT_USER.name}
              </Text>
              <Text variant="micro" style={{ color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                {CURRENT_USER.cmActiveCircles}/{CURRENT_USER.cmMaxCircles} circles · CHF{" "}
                {mrr.toLocaleString("en-CH")} MRR
              </Text>
            </View>
          </View>

          <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.xl }}>
            Business Relationships
          </Text>
          <Text variant="body" style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
            Contracts you manage between Mafao and partner associations.
          </Text>

          {/* Search */}
          <View
            style={[
              styles.searchWrap,
              {
                backgroundColor: "rgba(255,255,255,0.12)",
                borderColor: "rgba(255,255,255,0.18)",
              },
            ]}
          >
            <SearchIcon size={18} color="rgba(255,255,255,0.7)" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search relationships, BR-ref, association..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.searchInput}
            />
          </View>
        </LinearGradient>

        {/* Primary CTA: New Business Relationship */}
        <View style={{ paddingHorizontal: space.lg, marginTop: -space.lg }}>
          <Pressable
            onPress={() => router.push("/business-relationships/new" as never)}
            style={[styles.ctaPrimary, { backgroundColor: t.surface, borderColor: t.primary }]}
          >
            <View style={[styles.ctaIcon, { backgroundColor: t.primary }]}>
              <FileSignature size={18} color={t.primaryOn} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" style={{ color: t.primary }}>
                New Business Relationship
              </Text>
              <Text variant="micro" tone="secondary">
                Start a contract with a prospect or existing association
              </Text>
            </View>
            <Plus size={20} color={t.primary} />
          </Pressable>
        </View>

        {/* Metric cards */}
        <View style={{ paddingHorizontal: space.lg, flexDirection: "row", gap: space.sm, marginTop: space.lg }}>
          <MetricCard t={t} label="Active" count={counts.active} tone="success" />
          <MetricCard t={t} label="Pending" count={counts.pending} tone="warning" />
          <MetricCard t={t} label="At risk" count={counts.atRisk} tone="danger" />
          <MetricCard t={t} label="MRR" value={`CHF ${(mrr / 1000).toFixed(1)}k`} tone="primary" />
        </View>

        {/* Dashboard entry */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.sm }}>
          <Pressable
            onPress={() => router.push("/business-relationships/dashboard" as never)}
            style={[styles.dashLink, { backgroundColor: t.bgElevated, borderColor: t.border }]}
          >
            <View style={[styles.dashLinkIcon, { backgroundColor: t.primarySoft }]}>
              <TrendingUp size={14} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="caption" weight="bold">
                Open BR dashboard
              </Text>
              <Text variant="micro" tone="secondary">
                Trends · renewals timeline · churn list
              </Text>
            </View>
            <Text variant="caption" weight="semibold" tone="accent">
              View →
            </Text>
          </Pressable>
        </View>

        {/* Filters */}
        <View style={{ marginTop: space.lg, gap: space.md }}>
          <FilterChips options={BR_STATUS_FILTERS} value={brStatus} onChange={setBrStatus} />
          <FilterChips options={BR_TIER_FILTERS} value={brTier} onChange={setBrTier} variant="secondary" />
          <FilterChips options={BR_RISK_FILTERS} value={brRisk} onChange={setBrRisk} variant="secondary" />
        </View>

        {/* List header */}
        <View
          style={{
            paddingHorizontal: space.lg,
            marginTop: space.lg,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text variant="h3" weight="bold">
            {filtered.length} {filtered.length === 1 ? "relationship" : "relationships"}
          </Text>
          <Text variant="caption" tone="accent" weight="semibold">
            Sort: Recent
          </Text>
        </View>

        {/* List */}
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: t.bgMuted }]}>
              <SearchIcon size={26} color={t.textMuted} />
            </View>
            <Text variant="h3" weight="semibold" align="center">
              No relationships match your filters
            </Text>
            <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: space.xs }}>
              Try clearing the search or switching the status/tier filter.
            </Text>
            <Pressable
              onPress={() => {
                setQuery("");
                setBrStatus("all");
                setBrTier("all");
                setBrRisk("all");
              }}
              style={[styles.btnClear, { backgroundColor: t.primary }]}
            >
              <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                Clear filters
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.md, gap: space.md }}>
            {filtered.map((br) => (
              <RelationshipCard key={br.id} br={br} onUpdate={handleUpdate} />
            ))}
          </View>
        )}

        {/* Footnote: at-risk callout */}
        {counts.atRisk > 0 ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
            <View style={[styles.footnote, { backgroundColor: t.warningSoft, borderColor: t.warning }]}>
              <Sparkles size={14} color={t.warning} />
              <Text variant="caption" weight="semibold" style={{ color: t.warning, flex: 1 }}>
                {counts.atRisk} relationship{counts.atRisk === 1 ? "" : "s"} need your attention this
                cycle.
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
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
  userBadge: {
    position: "relative",
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: palette.slate[300],
  },
  cmDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    marginTop: space.lg,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    padding: 0,
  },

  ctaPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  ctaIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  metricCard: {
    flex: 1,
    paddingHorizontal: space.sm,
    paddingVertical: space.md,
    borderRadius: radius.md,
  },

  dashLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  dashLinkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  chip: {
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },

  empty: {
    paddingHorizontal: space.xl,
    paddingVertical: space.xxxl,
    alignItems: "center",
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.md,
  },
  btnClear: {
    marginTop: space.lg,
    paddingHorizontal: space.lg,
    paddingVertical: 10,
    borderRadius: radius.md,
  },

  footnote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  // Non-CM gate
  gateWrap: {
    flex: 1,
    paddingHorizontal: space.xl,
    paddingTop: 96,
    alignItems: "center",
  },
  gateIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.md,
  },
});
