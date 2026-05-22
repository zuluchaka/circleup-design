import { useState, useMemo } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Calendar,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  FileCode2,
  Check,
  Clock,
  Bell,
  Download,
  Lock,
  AlertCircle,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import treasury from "@/product/sections/04-treasury-and-funds/data.json";

type Format = "pdf" | "csv" | "xbrl";

type Section = {
  id: string;
  label: string;
  description: string;
  included: boolean;
  required: boolean;
};

type Attestation = {
  signerId: string;
  signerName: string;
  signerRole: string;
  signerTrust: number;
  state: "attested" | "pending" | "expired";
  attestedAt: string | null;
  lastReminded: string | null;
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function dateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("en-CH", { day: "numeric", month: "short" })} — ${e.toLocaleDateString("en-CH", { day: "numeric", month: "short", year: "numeric" })}`;
}

function timeAgo(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function attMeta(state: Attestation["state"], t: AppTheme) {
  if (state === "attested") return { color: t.success, bg: t.successSoft, Icon: Check, label: "ATTESTED" };
  if (state === "pending")  return { color: t.warning, bg: t.warningSoft, Icon: Clock,  label: "PENDING" };
  return { color: t.danger, bg: t.dangerSoft, Icon: AlertCircle, label: "EXPIRED" };
}

function formatMeta(f: Format) {
  if (f === "pdf")  return { Icon: FileText,         label: "PDF",  detail: "Audit-grade PDF · 1.6 MB est.",  rec: true };
  if (f === "csv")  return { Icon: FileSpreadsheet,  label: "CSV",  detail: "Machine-readable rows",          rec: false };
  return { Icon: FileCode2, label: "XBRL", detail: "Swiss financial-reporting format · preview", rec: false };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function TreasuryAuditReport() {
  const t = useTheme();
  const s = treasury.auditReportSetup as {
    rangeStart: string;
    rangeEnd: string;
    scopeLabel: string;
    format: Format;
    sections: Section[];
    attestations: Attestation[];
    estimatedPages: number;
    estimatedSize: string;
  };

  const [format, setFormat] = useState<Format>(s.format);
  const [sections, setSections] = useState<Section[]>(s.sections);

  const includedCount = useMemo(() => sections.filter((x) => x.included).length, [sections]);
  const attestedCount = s.attestations.filter((a) => a.state === "attested").length;
  const pendingCount = s.attestations.filter((a) => a.state === "pending").length;
  const allAttested = pendingCount === 0;

  const toggle = (id: string) => {
    setSections(sections.map((x) => (x.id === id && !x.required ? { ...x, included: !x.included } : x)));
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Audit report"
        subtitle="Auditor-ready export"
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 160, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header card */}
        <View style={[styles.headerCard, { backgroundColor: t.primary }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={14} color="rgba(255,255,255,0.85)" />
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.5 }}>
              AUDITOR-READY
            </Text>
          </View>
          <Text variant="h2" weight="bold" style={{ color: "#fff", marginTop: space.xs }}>
            {s.scopeLabel}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
            <Calendar size={11} color="rgba(255,255,255,0.85)" />
            <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.92)" }}>
              {dateRange(s.rangeStart, s.rangeEnd)}
            </Text>
          </View>
          <View style={[styles.headerFooter, { borderTopColor: "rgba(255,255,255,0.18)" }]}>
            <FooterStat label="Sections" value={`${includedCount}/${s.sections.length}`} />
            <FooterStat label="Attestations" value={`${attestedCount}/${s.attestations.length}`} />
            <FooterStat label="Est. size" value={s.estimatedSize} />
          </View>
        </View>

        {/* Format picker */}
        <View>
          <FieldLabel>Format</FieldLabel>
          <View style={{ gap: space.sm }}>
            {(["pdf", "csv", "xbrl"] as Format[]).map((f) => {
              const meta = formatMeta(f);
              const Icon = meta.Icon;
              const active = format === f;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFormat(f)}
                  style={[
                    styles.formatRow,
                    {
                      backgroundColor: active ? t.primarySoft : t.surface,
                      borderColor: active ? t.primary : t.border,
                      borderWidth: active ? 1.5 : 1,
                    },
                  ]}
                >
                  <View style={[styles.formatIcon, { backgroundColor: active ? "rgba(255,255,255,0.6)" : t.bgMuted }]}>
                    <Icon size={16} color={active ? t.primary : t.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <Text variant="bodySmall" weight="bold">{meta.label}</Text>
                      {f === "xbrl" ? (
                        <View style={[styles.previewPill, { backgroundColor: t.warningSoft }]}>
                          <Text variant="micro" weight="bold" style={{ color: t.warning, letterSpacing: 0.5 }}>PREVIEW</Text>
                        </View>
                      ) : meta.rec ? (
                        <View style={[styles.previewPill, { backgroundColor: t.successSoft }]}>
                          <Text variant="micro" weight="bold" style={{ color: t.success, letterSpacing: 0.5 }}>RECOMMENDED</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>{meta.detail}</Text>
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
            })}
          </View>
        </View>

        {/* Included sections */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">Included sections</Text>
            <Text variant="caption" tone="secondary">{includedCount} of {sections.length}</Text>
          </View>
          <View style={{ gap: space.sm }}>
            {sections.map((sec) => (
              <SectionRow key={sec.id} sec={sec} onToggle={() => toggle(sec.id)} t={t} />
            ))}
          </View>
        </View>

        {/* Signer attestations */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">Signer attestations</Text>
            <Text variant="caption" tone="secondary">{attestedCount}/{s.attestations.length}</Text>
          </View>

          {!allAttested ? (
            <View style={[styles.attentionBanner, { backgroundColor: t.warningSoft }]}>
              <AlertCircle size={14} color={t.warning} />
              <Text variant="micro" weight="semibold" style={{ color: t.warning, flex: 1, lineHeight: 14 }}>
                {pendingCount} signer{pendingCount === 1 ? " hasn't" : "s haven't"} attested yet. Reports can still be generated, but the auditor footer will mark them as unsigned.
              </Text>
            </View>
          ) : null}

          <Card padded={false}>
            {s.attestations.map((a, i) => (
              <AttestationRow key={a.signerId} a={a} t={t} last={i === s.attestations.length - 1} />
            ))}
          </Card>
        </View>

        {/* Estimated output */}
        <View style={[styles.estimate, { backgroundColor: t.bgMuted }]}>
          <FileText size={12} color={t.textMuted} />
          <Text variant="micro" tone="secondary" style={{ flex: 1, lineHeight: 14 }}>
            Estimated ≈ {s.estimatedPages} pages · {s.estimatedSize}. Generated PDFs are auditor-ready with signed metadata.
          </Text>
        </View>
      </ScrollView>

      {/* CTA dock */}
      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
          <Lock size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted">
            Saved to your device with the audit hash embedded for tamper-proofing.
          </Text>
        </View>
        <Button
          label={`Generate ${formatMeta(format).label}`}
          fullWidth
          size="lg"
          trailingIcon={<Download size={16} color="#fff" />}
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
      <Text variant="bodySmall" weight="bold" style={{ color: "#fff", marginTop: 2 }}>{value}</Text>
    </View>
  );
}

function SectionRow({
  sec,
  onToggle,
  t,
}: {
  sec: Section;
  onToggle: () => void;
  t: AppTheme;
}) {
  const checked = sec.included;
  return (
    <Pressable
      onPress={sec.required ? undefined : onToggle}
      style={[
        styles.sectionRow,
        {
          backgroundColor: checked ? t.successSoft : t.surface,
          borderColor: checked ? t.success : t.border,
          borderWidth: checked ? 1.5 : 1,
          opacity: sec.required ? 0.95 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.check,
          {
            backgroundColor: checked ? t.success : "transparent",
            borderColor: checked ? t.success : t.borderStrong,
          },
        ]}
      >
        {checked ? <Check size={11} color="#fff" strokeWidth={3} /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="bodySmall" weight="bold">{sec.label}</Text>
          {sec.required ? (
            <View style={[styles.reqPill, { backgroundColor: t.bgMuted }]}>
              <Lock size={9} color={t.textMuted} />
              <Text variant="micro" weight="bold" tone="muted" style={{ letterSpacing: 0.5 }}>REQUIRED</Text>
            </View>
          ) : null}
        </View>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>{sec.description}</Text>
      </View>
    </Pressable>
  );
}

function AttestationRow({ a, t, last }: { a: Attestation; t: AppTheme; last: boolean }) {
  const meta = attMeta(a.state, t);
  const Icon = meta.Icon;
  return (
    <View style={[styles.attRow, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Avatar name={a.signerName} size="sm" />
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="caption" weight="bold">{a.signerName}</Text>
          <View style={[styles.trustPill, { backgroundColor: t.bgMuted }]}>
            <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>T·{a.signerTrust}</Text>
          </View>
        </View>
        <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>{a.signerRole}</Text>
        {a.attestedAt ? (
          <Text variant="micro" tone="muted">Attested {timeAgo(a.attestedAt)}</Text>
        ) : a.lastReminded ? (
          <Text variant="micro" tone="muted">Last reminded {timeAgo(a.lastReminded)}</Text>
        ) : null}
      </View>
      <View style={{ alignItems: "flex-end", gap: 4 }}>
        <View style={[styles.attPill, { backgroundColor: meta.bg }]}>
          <Icon size={10} color={meta.color} strokeWidth={3} />
          <Text variant="micro" weight="bold" style={{ color: meta.color, letterSpacing: 0.5 }}>{meta.label}</Text>
        </View>
        {a.state === "pending" ? (
          <Pressable style={[styles.remindBtn, { backgroundColor: t.bgMuted }]}>
            <Bell size={10} color={t.textPrimary} />
            <Text variant="micro" weight="bold">Remind</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  headerFooter: {
    flexDirection: "row",
    gap: space.md,
    marginTop: space.md,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  formatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  formatIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  previewPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
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
  sectionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  reqPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  attentionBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    marginBottom: space.sm,
  },
  attRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  trustPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  attPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  remindBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  estimate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
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
