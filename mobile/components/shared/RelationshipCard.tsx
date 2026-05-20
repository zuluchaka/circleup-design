import { useState } from "react";
import { Pressable, View, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import {
  ChevronRight,
  MapPin,
  Users,
  TrendingUp,
  CalendarClock,
  AlertTriangle,
  Pause,
  XCircle,
  Clock,
  Briefcase,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import {
  ActivateSheet,
  SuspendSheet,
  TerminateSheet,
  applyActivate,
  applySuspend,
  applyTerminate,
} from "@/components/shared/BrLifecycleSheets";
import { findRelationshipDetail } from "@/data/businessRelationships";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";
import {
  BR_TIER_LABEL,
  type BrStatus,
  type BrTier,
  type BusinessRelationship,
} from "@/data/businessRelationships";

export function brStatusStyle(s: BrStatus, t: AppTheme) {
  switch (s) {
    case "pending":
      return { dot: t.warning, bg: t.warningSoft, fg: t.warning, label: "Pending" };
    case "active":
      return { dot: t.success, bg: t.successSoft, fg: t.success, label: "Active" };
    case "suspended":
      return { dot: t.danger, bg: t.dangerSoft, fg: t.danger, label: "Suspended" };
    case "terminated":
      return { dot: t.textMuted, bg: t.bgMuted, fg: t.textSecondary, label: "Terminated" };
  }
}

export function brTierStyle(tier: BrTier, t: AppTheme) {
  switch (tier) {
    case "pro":
      return { bg: t.primarySoft, fg: t.primary };
    case "basic":
      return { bg: t.infoSoft, fg: t.info };
    case "free":
      return { bg: t.bgMuted, fg: t.textSecondary };
  }
}

export function formatBrDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-CH", { day: "numeric", month: "short", year: "numeric" });
}

type CardSheet = null | "activate" | "suspend" | "terminate";

export function RelationshipCard({
  br,
  onPress,
  onUpdate,
}: {
  br: BusinessRelationship;
  onPress?: () => void;
  onUpdate?: (next: BusinessRelationship) => void;
}) {
  const t = useTheme();
  const status = brStatusStyle(br.status, t);
  const tier = brTierStyle(br.tier, t);
  const openDetail = () => router.push(`/business-relationships/${br.id}` as never);
  const [sheet, setSheet] = useState<CardSheet>(null);

  // Only enable inline sheets when caller wants list-level mutation.
  // Without `onUpdate`, the action buttons fall back to opening the detail view.
  const inlineActions = !!onUpdate;
  const handleAction = (which: CardSheet) => {
    if (!inlineActions) {
      openDetail();
      return;
    }
    setSheet(which);
  };

  // Hydrate to the full detail shape when applying lifecycle helpers.
  const hydrate = () => findRelationshipDetail(br.id) ?? null;

  return (
    <Pressable
      onPress={onPress ?? openDetail}
      style={[styles.brCard, { backgroundColor: t.surface, borderColor: t.border }]}
    >
      <View style={{ padding: space.lg, gap: space.md }}>
        <View style={{ flexDirection: "row", gap: space.md }}>
          <Image source={{ uri: br.associationLogo }} style={styles.brLogo} />
          <View style={{ flex: 1, gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text variant="h3" weight="semibold" numberOfLines={1} style={{ flex: 1 }}>
                {br.associationName}
              </Text>
              <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
                <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
                <Text variant="micro" weight="semibold" style={{ color: status.fg }}>
                  {status.label}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <View
                style={[
                  styles.tag,
                  { backgroundColor: tier.bg, flexDirection: "row", alignItems: "center", gap: 3 },
                ]}
              >
                <Briefcase size={9} color={tier.fg} />
                <Text
                  variant="micro"
                  weight="bold"
                  style={{ color: tier.fg, letterSpacing: 0.4 }}
                >
                  {BR_TIER_LABEL[br.tier].toUpperCase()}
                </Text>
              </View>
              <Text
                variant="micro"
                tone="muted"
                weight="semibold"
                style={{ fontFamily: "monospace" }}
              >
                {br.reference}
              </Text>
              <Text variant="micro" tone="secondary">
                · {br.relationshipType}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
              <MapPin size={10} color={t.textMuted} />
              <Text variant="micro" tone="secondary">
                {br.region}
              </Text>
              <Text variant="micro" tone="muted">·</Text>
              <Users size={10} color={t.textMuted} />
              <Text variant="micro" tone="secondary">
                {br.memberCount.toLocaleString()} members
              </Text>
            </View>
          </View>
        </View>

        {br.isChurnRisk ? (
          <View style={[styles.brBanner, { backgroundColor: t.dangerSoft, borderColor: t.danger }]}>
            <AlertTriangle size={13} color={t.danger} />
            <Text variant="caption" weight="semibold" style={{ color: t.danger, flex: 1 }}>
              Churn risk · {br.graceDaysLeft ? `${br.graceDaysLeft}d grace remaining` : "review now"}
            </Text>
          </View>
        ) : br.isExpiringSoon ? (
          <View style={[styles.brBanner, { backgroundColor: t.warningSoft, borderColor: t.warning }]}>
            <CalendarClock size={13} color={t.warning} />
            <Text variant="caption" weight="semibold" style={{ color: t.warning, flex: 1 }}>
              Renewal due · {formatBrDate(br.renewalDeadline ?? br.contractEndDate)}
            </Text>
          </View>
        ) : null}

        <View style={[styles.brStatsRow, { borderTopColor: t.border, borderBottomColor: t.border }]}>
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <TrendingUp size={11} color={t.textMuted} />
              <Text variant="micro" tone="muted" weight="semibold">MRR</Text>
            </View>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{ color: br.monthlyRevenue > 0 ? t.success : t.textSecondary }}
            >
              {br.monthlyRevenue > 0
                ? `${br.currency} ${br.monthlyRevenue.toLocaleString("en-CH")}`
                : "—"}
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: t.border, marginHorizontal: space.sm }} />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Clock size={11} color={t.textMuted} />
              <Text variant="micro" tone="muted" weight="semibold">STARTED</Text>
            </View>
            <Text variant="bodySmall" weight="bold">
              {formatBrDate(br.startedAt)}
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: t.border, marginHorizontal: space.sm }} />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <CalendarClock size={11} color={t.textMuted} />
              <Text variant="micro" tone="muted" weight="semibold">ENDS</Text>
            </View>
            <Text variant="bodySmall" weight="bold">
              {formatBrDate(br.contractEndDate)}
            </Text>
          </View>
        </View>

        {br.overdueAmount && br.overdueAmount > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text variant="micro" weight="bold" style={{ color: t.danger }}>
              Overdue billing: {br.currency} {br.overdueAmount.toLocaleString("en-CH")}
            </Text>
          </View>
        ) : null}

        <View style={{ flexDirection: "row", gap: space.sm }}>
          <Pressable
            onPress={openDetail}
            style={[styles.btnGhost, { backgroundColor: t.bgMuted, borderColor: t.border }]}
          >
            <Text variant="caption" weight="semibold">View detail</Text>
          </Pressable>
          {br.status === "pending" ? (
            <Pressable
              onPress={() => handleAction("activate")}
              style={[styles.btnPrimary, { backgroundColor: t.success }]}
            >
              <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                Activate
              </Text>
              <ChevronRight size={14} color="#fff" />
            </Pressable>
          ) : br.status === "active" ? (
            <Pressable
              onPress={() => handleAction("suspend")}
              style={[styles.btnPrimary, { backgroundColor: t.warning }]}
            >
              <Pause size={13} color="#fff" />
              <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                Suspend
              </Text>
            </Pressable>
          ) : br.status === "suspended" ? (
            <Pressable
              onPress={() => handleAction("terminate")}
              style={[styles.btnPrimary, { backgroundColor: t.danger }]}
            >
              <XCircle size={13} color="#fff" />
              <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                Terminate
              </Text>
            </Pressable>
          ) : (
            <Pressable style={[styles.btnPrimary, { backgroundColor: t.textMuted }]} disabled>
              <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                Closed
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Inline lifecycle sheets — only mounted when the caller wants list-level mutation */}
      {inlineActions ? (
        <>
          <ActivateSheet
            open={sheet === "activate"}
            onClose={() => setSheet(null)}
            brReference={br.reference}
            onConfirm={() => {
              const d = hydrate();
              if (d) onUpdate?.(applyActivate(d));
              setSheet(null);
            }}
          />
          <SuspendSheet
            open={sheet === "suspend"}
            onClose={() => setSheet(null)}
            onConfirm={(reason, graceDays) => {
              const d = hydrate();
              if (d) onUpdate?.(applySuspend(d, reason, graceDays));
              setSheet(null);
            }}
          />
          <TerminateSheet
            open={sheet === "terminate"}
            onClose={() => setSheet(null)}
            onConfirm={(noticeDays, legalReview) => {
              const d = hydrate();
              if (d) onUpdate?.(applyTerminate(d, noticeDays, legalReview));
              setSheet(null);
            }}
          />
        </>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  brCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  brLogo: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: palette.slate[200],
  },
  brBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.sm,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  brStatsRow: {
    flexDirection: "row",
    paddingVertical: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tag: {
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  btnGhost: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
  },
});
