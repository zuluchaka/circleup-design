import { View, ScrollView, StyleSheet } from "react-native";
import { Clock, Vote, CheckCircle2, FilePlus } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { StatChip } from "@/components/shared/StatChip";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/shared/Button";
import { useTheme, space, radius } from "@/theme";
import governance from "@/product/sections/05-governance-and-voting/data.json";

type GovernanceData = typeof governance;

export function GovernanceProposalsEmpty() {
  return <GovernanceProposals data={{ ...governance, proposals: [] }} />;
}

export function GovernanceProposals({
  data = governance,
}: { data?: GovernanceData } = {}) {
  const t = useTheme();
  const isEmpty = data.proposals.length === 0;
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Proposals"
        subtitle={isEmpty ? "Nothing to vote on" : "Governance & Voting"}
      />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        {isEmpty ? (
          <Card padded bordered>
            <View style={{ alignItems: "center", paddingVertical: space.xl }}>
              <View style={[styles.emptyIcon, { backgroundColor: t.primarySoft }]}>
                <Vote size={28} color={t.primary} />
              </View>
              <Text variant="h2" weight="bold" align="center" style={{ marginTop: space.md }}>
                No active proposals
              </Text>
              <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: space.sm, lineHeight: 18, paddingHorizontal: space.md }}>
                Treasurers and organisers can put rule changes, fee adjustments, or elections to a vote. Members get notified the moment a proposal opens.
              </Text>
              <View style={{ marginTop: space.lg, width: "100%" }}>
                <Button label="Draft a proposal" leadingIcon={<FilePlus size={16} color="#fff" />} fullWidth />
              </View>
            </View>
          </Card>
        ) : null}
        {data.proposals.map((p) => {
          const totalVotes = p.votes.yes + p.votes.no + p.votes.abstain;
          const quorumPct = (p.quorum.current / p.quorum.required) * 100;
          const tone = p.status === "Voting" ? "primary" : p.status === "Discussion" ? "info" : "neutral";
          const Icon = p.status === "Voting" ? Vote : p.status === "Discussion" ? Clock : CheckCircle2;
          return (
            <Card key={p.id} padded>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: space.sm }}>
                <View style={[styles.kindBubble, { backgroundColor: tone === "primary" ? t.primarySoft : tone === "info" ? t.infoSoft : t.bgMuted }]}>
                  <Icon size={16} color={tone === "primary" ? t.primary : tone === "info" ? t.info : t.textSecondary} />
                </View>
                <View style={{ flex: 1, marginLeft: space.sm }}>
                  <Text variant="caption" tone="muted" weight="semibold">
                    {p.status === "Voting" ? `ENDS ${new Date(p.endsAt).toLocaleDateString("en-CH", { day: "2-digit", month: "short" })}` : p.status.toUpperCase()}
                  </Text>
                  <Text variant="h3" weight="bold">{p.title}</Text>
                </View>
                <StatChip label={p.status} tone={tone} compact />
              </View>
              <Text variant="bodySmall" tone="secondary" numberOfLines={3}>{p.body}</Text>

              {p.status === "Voting" ? (
                <View style={{ marginTop: space.md, gap: space.sm }}>
                  <View>
                    <View style={styles.row}>
                      <Text variant="caption" tone="muted" weight="semibold">QUORUM</Text>
                      <Text variant="caption" tone="secondary">{p.quorum.current} / {p.quorum.required}</Text>
                    </View>
                    <View style={{ marginTop: 4 }}>
                      <ProgressBar value={quorumPct} tone={quorumPct >= 100 ? "success" : "primary"} />
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", gap: space.sm }}>
                    <VoteCell label="Yes" count={p.votes.yes} total={totalVotes} tone={t.success} />
                    <VoteCell label="No"  count={p.votes.no}  total={totalVotes} tone={t.danger} />
                    <VoteCell label="Abs" count={p.votes.abstain} total={totalVotes} tone={t.textMuted} />
                  </View>
                </View>
              ) : null}

              {p.outcome ? (
                <View style={{ marginTop: space.md, flexDirection: "row", alignItems: "center", gap: space.sm }}>
                  <CheckCircle2 size={14} color={t.success} />
                  <Text variant="caption" tone="success" weight="semibold">Outcome: {p.outcome}</Text>
                </View>
              ) : null}
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

function VoteCell({ label, count, total, tone }: { label: string; count: number; total: number; tone: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text variant="h3" weight="bold" style={{ color: tone }}>{count}</Text>
      <Text variant="micro" tone="muted">{label} · {total ? Math.round((count / total) * 100) : 0}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kindBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
