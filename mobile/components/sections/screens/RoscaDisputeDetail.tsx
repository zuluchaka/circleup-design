import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Image as ImageIcon,
  FileText,
  Video,
  Mic,
  AlertCircle,
  Clock,
  Check,
  ArrowUpRight,
  MessageCircle,
  Send,
  ShieldAlert,
  CircleDot,
  Plus,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Status = "open" | "acknowledged" | "escalated" | "resolved";
type TimelineKind = "filed" | "acknowledged" | "evidence" | "escalated" | "comment" | "resolved";
type EvidenceKind = "image" | "document" | "video" | "audio";

type Evidence = {
  id: string;
  kind: EvidenceKind;
  label: string;
  size: string;
  uploadedAt: string;
};

type TimelineEvent = {
  id: string;
  kind: TimelineKind;
  actor: string;
  actorRole: string;
  at: string;
  body: string;
};

type Detail = {
  id: string;
  title: string;
  description: string;
  filedBy: string;
  against: string;
  status: Status;
  priority: "low" | "medium" | "high";
  cycle: number;
  amountInvolved: number;
  currency: string;
  evidence: Evidence[];
  timeline: TimelineEvent[];
  yourRole: "filer" | "respondent" | "organizer" | "observer";
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function timeSince(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function statusMeta(s: Status, t: AppTheme) {
  if (s === "open") return { color: t.warning, bg: t.warningSoft, label: "Open" };
  if (s === "acknowledged") return { color: t.info, bg: t.infoSoft, label: "Acknowledged" };
  if (s === "escalated") return { color: t.danger, bg: t.dangerSoft, label: "Escalated to platform" };
  return { color: t.success, bg: t.successSoft, label: "Resolved" };
}

function evidenceMeta(kind: EvidenceKind) {
  if (kind === "image") return { Icon: ImageIcon, label: "Image" };
  if (kind === "video") return { Icon: Video, label: "Video" };
  if (kind === "audio") return { Icon: Mic, label: "Audio" };
  return { Icon: FileText, label: "Document" };
}

function timelineMeta(kind: TimelineKind, t: AppTheme) {
  if (kind === "filed") return { color: t.warning, bg: t.warningSoft, Icon: CircleDot };
  if (kind === "acknowledged") return { color: t.info, bg: t.infoSoft, Icon: Clock };
  if (kind === "evidence") return { color: t.primary, bg: t.primarySoft, Icon: FileText };
  if (kind === "escalated") return { color: t.danger, bg: t.dangerSoft, Icon: ArrowUpRight };
  if (kind === "comment") return { color: t.textSecondary, bg: t.bgMuted, Icon: MessageCircle };
  return { color: t.success, bg: t.successSoft, Icon: Check };
}

export function RoscaDisputeDetail() {
  const t = useTheme();
  const d = rosca.disputeDetail as Detail;
  const status = statusMeta(d.status, t);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Dispute"
        subtitle={`Cycle ${d.cycle} · ${formatCurrency(d.amountInvolved, d.currency)}`}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 160, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status hero */}
        <View style={[styles.hero, { backgroundColor: status.bg }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <ShieldAlert size={14} color={status.color} />
            <Text variant="micro" weight="bold" style={{ color: status.color, letterSpacing: 1.5 }}>
              {status.label.toUpperCase()}
            </Text>
          </View>
          <Text variant="h2" weight="bold" style={{ color: status.color, marginTop: space.xs }}>
            {d.title}
          </Text>
          <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
            {d.description}
          </Text>
        </View>

        {/* Parties */}
        <View style={[styles.parties, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={styles.partySide}>
            <Avatar name={d.filedBy} size="md" />
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6, marginTop: space.xs }}>
              FILED BY
            </Text>
            <Text variant="caption" weight="bold">{d.filedBy}</Text>
          </View>
          <View style={[styles.partyArrow, { backgroundColor: t.bgMuted }]}>
            <AlertCircle size={14} color={t.textSecondary} />
          </View>
          <View style={styles.partySide}>
            <Avatar name={d.against.replace("Treasurer (", "").replace(")", "")} size="md" />
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6, marginTop: space.xs }}>
              AGAINST
            </Text>
            <Text variant="caption" weight="bold" numberOfLines={1}>{d.against.split(" (")[0]}</Text>
          </View>
        </View>

        {/* Evidence carousel */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">Evidence</Text>
            <Pressable style={[styles.addEv, { backgroundColor: t.primarySoft }]}>
              <Plus size={11} color={t.primary} />
              <Text variant="micro" weight="bold" style={{ color: t.primary, letterSpacing: 0.5 }}>ADD</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
            {d.evidence.map((e) => (
              <EvidenceCard key={e.id} ev={e} t={t} />
            ))}
          </ScrollView>
        </View>

        {/* Timeline */}
        <View>
          <Text variant="h3" weight="bold" style={{ marginBottom: space.sm }}>Timeline</Text>
          <Card padded>
            {d.timeline.map((ev, i) => (
              <TimelineRow key={ev.id} ev={ev} isFirst={i === 0} isLast={i === d.timeline.length - 1} t={t} />
            ))}
          </Card>
        </View>

        {/* Composer */}
        <View style={[styles.composer, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Avatar name="Amara Ofori" size="sm" />
          <View style={{ flex: 1 }}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
              YOU · ORGANISER
            </Text>
            <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
              Reply or add a private note…
            </Text>
          </View>
          <Pressable style={[styles.sendBtn, { backgroundColor: t.primary }]}>
            <Send size={14} color="#fff" />
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <View style={{ flexDirection: "row", gap: space.sm }}>
          <Pressable style={[styles.escalateBtn, { borderColor: t.danger, backgroundColor: t.surface }]}>
            <ArrowUpRight size={14} color={t.danger} />
            <Text variant="caption" weight="bold" style={{ color: t.danger }}>Escalate</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Button
              label="Resolve dispute"
              fullWidth
              size="lg"
              trailingIcon={<Check size={16} color="#fff" strokeWidth={3} />}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function EvidenceCard({ ev, t }: { ev: Evidence; t: AppTheme }) {
  const meta = evidenceMeta(ev.kind);
  const Icon = meta.Icon;
  const bgColor =
    ev.kind === "image" ? t.primarySoft :
    ev.kind === "audio" ? t.warningSoft :
    ev.kind === "video" ? t.dangerSoft : t.successSoft;
  const iconColor =
    ev.kind === "image" ? t.primary :
    ev.kind === "audio" ? t.warning :
    ev.kind === "video" ? t.danger : t.success;

  return (
    <View style={[styles.evCard, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.evThumb, { backgroundColor: bgColor }]}>
        <Icon size={20} color={iconColor} />
      </View>
      <View style={{ padding: space.sm, gap: 2 }}>
        <Text variant="micro" weight="bold" numberOfLines={2} style={{ lineHeight: 13 }}>{ev.label}</Text>
        <Text variant="micro" tone="muted">{ev.size}</Text>
      </View>
    </View>
  );
}

function TimelineRow({
  ev,
  isFirst,
  isLast,
  t,
}: {
  ev: TimelineEvent;
  isFirst: boolean;
  isLast: boolean;
  t: AppTheme;
}) {
  const meta = timelineMeta(ev.kind, t);
  const Icon = meta.Icon;
  return (
    <View style={styles.tlRow}>
      <View style={styles.tlRail}>
        <View style={[styles.tlLine, { backgroundColor: isFirst ? "transparent" : t.border }]} />
        <View style={[styles.tlDot, { backgroundColor: meta.bg, borderColor: meta.color }]}>
          <Icon size={11} color={meta.color} strokeWidth={2.5} />
        </View>
        <View style={[styles.tlLine, { backgroundColor: isLast ? "transparent" : t.border, flex: isLast ? 0 : 1 }]} />
      </View>
      <View style={{ flex: 1, paddingBottom: isLast ? 0 : space.md }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="caption" weight="bold">{ev.actor}</Text>
          <View style={[styles.actorPill, { backgroundColor: t.bgMuted }]}>
            <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>
              {ev.actorRole.toUpperCase()}
            </Text>
          </View>
          <Text variant="micro" tone="muted">· {timeSince(ev.at)}</Text>
        </View>
        <Text variant="caption" tone="secondary" style={{ marginTop: 4, lineHeight: 16 }}>{ev.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  parties: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  partySide: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  partyArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addEv: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  evCard: {
    width: 140,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  evThumb: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  tlRow: {
    flexDirection: "row",
    gap: space.sm,
    minHeight: 56,
  },
  tlRail: {
    width: 24,
    alignItems: "center",
  },
  tlLine: {
    width: 2,
    flex: 1,
    minHeight: 6,
  },
  tlDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  actorPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
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
  escalateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
});
