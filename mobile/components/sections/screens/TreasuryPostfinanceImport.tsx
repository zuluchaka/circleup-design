import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Upload,
  ScanLine,
  ArrowRightLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Building2,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import treasury from "@/product/sections/04-treasury-and-funds/data.json";

type Step = 1 | 2 | 3 | 4;
type Field = "date" | "amount" | "description" | "counterparty" | "reference" | "currency" | "skip";

type CsvColumn = {
  id: string;
  label: string;
  sample: string;
  mappedTo: Field;
  confidence: "high" | "medium" | "low";
};

type ImportEntry = {
  id: string;
  date: string;
  amount: number;
  currency: string;
  description: string;
  counterparty: string;
  reference: string;
  match: "ready" | "needs_attention";
  matchReason: string | null;
};

const STEPS: { n: Step; label: string; Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }> }[] = [
  { n: 1, label: "Upload",  Icon: Upload },
  { n: 2, label: "Detect",  Icon: ScanLine },
  { n: 3, label: "Map",     Icon: ArrowRightLeft },
  { n: 4, label: "Confirm", Icon: Check },
];

const FIELD_LABEL: Record<Field, string> = {
  date: "Date",
  amount: "Amount",
  description: "Description",
  counterparty: "Counterparty",
  reference: "Reference",
  currency: "Currency",
  skip: "Skip",
};

function formatCurrency(amount: number, currency: string) {
  return `${amount < 0 ? "−" : ""}${currency} ${Math.abs(amount).toLocaleString("de-CH")}`;
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "short" });
}

function confidenceMeta(c: CsvColumn["confidence"], t: AppTheme) {
  if (c === "high")   return { color: t.success, bg: t.successSoft, label: "HIGH" };
  if (c === "medium") return { color: t.warning, bg: t.warningSoft, label: "MEDIUM" };
  return { color: t.danger, bg: t.dangerSoft, label: "LOW" };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function TreasuryPostfinanceImport() {
  const t = useTheme();
  const i = treasury.postfinanceImport as {
    step: Step;
    fileName: string;
    fileSize: string;
    bank: string;
    detection: any;
    columns: CsvColumn[];
    entries: ImportEntry[];
    summary: { ready: number; needsAttention: number; duplicates: number };
  };

  const [step, setStep] = useState<Step>(i.step);

  const goBack = () => (step > 1 ? setStep((step - 1) as Step) : router.back());
  const goNext = () => step < 4 && setStep((step + 1) as Step);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="PostFinance import"
        subtitle={`Step ${step} of 4 · ${STEPS[step - 1].label}`}
        onBack={goBack}
      />

      {/* Stepper */}
      <View style={[styles.dots, { backgroundColor: t.surface, borderBottomColor: t.border }]}>
        {STEPS.map((s) => {
          const done = step > s.n;
          const active = step === s.n;
          const Icon = s.Icon;
          return (
            <View key={s.n} style={{ flex: 1, alignItems: "center", gap: 4 }}>
              <View style={[styles.dot, { backgroundColor: done ? t.success : active ? t.primary : t.bgMuted }]}>
                {done ? (
                  <Check size={10} color="#fff" strokeWidth={3} />
                ) : (
                  <Icon size={11} color={active ? "#fff" : t.textMuted} />
                )}
              </View>
              <Text
                variant="micro"
                weight={active ? "bold" : "semibold"}
                tone={active ? "accent" : done ? "primary" : "muted"}
                style={{ letterSpacing: 0.4, fontSize: 9 }}
              >
                {s.label.toUpperCase()}
              </Text>
            </View>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 ? (
          <Step1Upload i={i} t={t} />
        ) : step === 2 ? (
          <Step2Detect i={i} t={t} />
        ) : step === 3 ? (
          <Step3Map columns={i.columns} t={t} />
        ) : (
          <Step4Confirm i={i} t={t} />
        )}
      </ScrollView>

      {/* CTA dock */}
      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <View style={{ flexDirection: "row", gap: space.sm }}>
          {step > 1 ? (
            <Pressable
              onPress={goBack}
              style={[styles.secondaryBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}
            >
              <ChevronLeft size={16} color={t.textPrimary} />
              <Text variant="bodySmall" weight="semibold">Back</Text>
            </Pressable>
          ) : null}
          <View style={{ flex: 1 }}>
            <Button
              label={
                step < 4
                  ? `Continue to ${STEPS[step].label}`
                  : `Post ${i.summary.ready} entries to ledger`
              }
              onPress={step < 4 ? goNext : undefined}
              fullWidth
              size="lg"
              trailingIcon={
                step < 4 ? (
                  <ChevronRight size={16} color="#fff" />
                ) : (
                  <Check size={16} color="#fff" strokeWidth={3} />
                )
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Upload
// ---------------------------------------------------------------------------

function Step1Upload({ i, t }: { i: any; t: AppTheme }) {
  return (
    <>
      <View>
        <Text variant="h2" weight="bold">Drop your PostFinance CSV</Text>
        <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
          Export the account statement from PostFinance e-finance and drop it here. We support the standard CSV format.
        </Text>
      </View>

      <View style={[styles.dropzone, { borderColor: t.primary, backgroundColor: t.primarySoft }]}>
        <View style={[styles.dropIcon, { backgroundColor: t.surface }]}>
          <Upload size={26} color={t.primary} />
        </View>
        <Text variant="bodySmall" weight="bold" align="center">Drop a CSV here</Text>
        <Text variant="micro" tone="secondary" align="center" style={{ maxWidth: 240, marginTop: 4, lineHeight: 14 }}>
          Or pick from your device. We never store raw statements — we parse, post entries, then delete.
        </Text>
        <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
          <Pressable style={[styles.uploadBtn, { backgroundColor: t.primary }]}>
            <Upload size={14} color="#fff" />
            <Text variant="caption" weight="bold" style={{ color: "#fff" }}>Pick a file</Text>
          </Pressable>
        </View>
      </View>

      {/* Already-uploaded preview (design state simulates a re-import) */}
      <View style={[styles.fileCard, { backgroundColor: t.surface, borderColor: t.border }]}>
        <View style={[styles.fileIcon, { backgroundColor: t.bgMuted }]}>
          <FileSpreadsheet size={16} color={t.textSecondary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="caption" weight="bold">{i.fileName}</Text>
          <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
            {i.fileSize} · CSV · just dropped
          </Text>
        </View>
        <View style={[styles.miniPill, { backgroundColor: t.successSoft }]}>
          <Check size={9} color={t.success} strokeWidth={3} />
          <Text variant="micro" weight="bold" style={{ color: t.success, letterSpacing: 0.5 }}>READY</Text>
        </View>
      </View>

      <View style={[styles.hint, { backgroundColor: t.bgMuted }]}>
        <Building2 size={11} color={t.textMuted} />
        <Text variant="micro" tone="secondary" style={{ flex: 1, lineHeight: 14 }}>
          Linked account: <Text variant="micro" weight="bold">{i.bank}</Text>
        </Text>
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Detect
// ---------------------------------------------------------------------------

function Step2Detect({ i, t }: { i: any; t: AppTheme }) {
  return (
    <>
      <View>
        <Text variant="h2" weight="bold">We've parsed the file</Text>
        <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
          Check that the separator, decimals, and date format look right. We auto-detect the common Swiss formats.
        </Text>
      </View>

      <View style={[styles.detectBanner, { backgroundColor: t.successSoft }]}>
        <Sparkles size={14} color={t.success} />
        <Text variant="caption" weight="semibold" style={{ color: t.success, flex: 1, lineHeight: 16 }}>
          Auto-detected · {i.detection.rowCount} rows ready · standard PostFinance schema.
        </Text>
      </View>

      <Card padded>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
          DETECTED FORMAT
        </Text>
        <DetectRow label="Separator"    value={i.detection.separator === ";" ? '"; " (semicolon)' : i.detection.separator} t={t} />
        <DetectRow label="Decimal"      value={`"${i.detection.decimal}" (period)`} t={t} />
        <DetectRow label="Date format"  value={i.detection.dateFormat} t={t} />
        <DetectRow label="Encoding"     value={i.detection.encoding} t={t} />
        <DetectRow label="Rows"         value={`${i.detection.rowCount} entries`} t={t} last />
      </Card>

      <Pressable style={[styles.advancedBtn, { borderColor: t.border, backgroundColor: t.surface }]}>
        <ChevronDown size={11} color={t.textPrimary} />
        <Text variant="caption" weight="bold">Override detected format</Text>
      </Pressable>
    </>
  );
}

function DetectRow({ label, value, t, last }: { label: string; value: string; t: AppTheme; last?: boolean }) {
  return (
    <View style={[styles.detectRow, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Text variant="caption" tone="secondary" style={{ flex: 1 }}>{label}</Text>
      <Text variant="caption" weight="bold" style={{ fontFamily: "Menlo" }}>{value}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Map
// ---------------------------------------------------------------------------

function Step3Map({ columns, t }: { columns: CsvColumn[]; t: AppTheme }) {
  return (
    <>
      <View>
        <Text variant="h2" weight="bold">Map columns to ledger fields</Text>
        <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
          Suggested mappings are pre-filled. Tap a row to switch the destination field.
        </Text>
      </View>

      <View style={{ gap: space.sm }}>
        {columns.map((c) => (
          <ColumnRow key={c.id} c={c} t={t} />
        ))}
      </View>

      <View style={[styles.hint, { backgroundColor: t.bgMuted }]}>
        <Sparkles size={11} color={t.textMuted} />
        <Text variant="micro" tone="secondary" style={{ flex: 1, lineHeight: 14 }}>
          We remember mappings per bank. Next month's PostFinance import will skip this step.
        </Text>
      </View>
    </>
  );
}

function ColumnRow({ c, t }: { c: CsvColumn; t: AppTheme }) {
  const conf = confidenceMeta(c.confidence, t);
  const isSkip = c.mappedTo === "skip";

  return (
    <Pressable
      style={[
        styles.colRow,
        {
          backgroundColor: isSkip ? t.bgMuted : t.surface,
          borderColor: isSkip ? t.borderStrong : t.border,
          opacity: isSkip ? 0.7 : 1,
        },
      ]}
    >
      {/* CSV column */}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.5 }}>
          CSV COLUMN
        </Text>
        <Text variant="caption" weight="bold" style={{ fontFamily: "Menlo" }} numberOfLines={1}>
          {c.label}
        </Text>
        <Text variant="micro" tone="secondary" style={{ fontFamily: "Menlo", marginTop: 1 }} numberOfLines={1}>
          e.g. {c.sample || "—"}
        </Text>
      </View>

      <View style={[styles.colArrow, { backgroundColor: t.bgMuted }]}>
        <ArrowRightLeft size={12} color={t.textSecondary} />
      </View>

      {/* Ledger field */}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.5 }}>
          LEDGER FIELD
        </Text>
        <View style={[styles.fieldPill, { backgroundColor: isSkip ? t.surface : t.primarySoft, borderColor: isSkip ? t.borderStrong : t.primary }]}>
          <Text
            variant="caption"
            weight="bold"
            style={{ color: isSkip ? t.textSecondary : t.primary }}
            numberOfLines={1}
          >
            {FIELD_LABEL[c.mappedTo]}
          </Text>
          <ChevronDown size={11} color={isSkip ? t.textSecondary : t.primary} />
        </View>
        <View style={[styles.confPill, { backgroundColor: conf.bg }]}>
          <Text variant="micro" weight="bold" style={{ color: conf.color, letterSpacing: 0.5 }}>
            {conf.label} CONFIDENCE
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Confirm
// ---------------------------------------------------------------------------

function Step4Confirm({ i, t }: { i: any; t: AppTheme }) {
  const ready = (i.entries as ImportEntry[]).filter((e) => e.match === "ready");
  const needsAttention = (i.entries as ImportEntry[]).filter((e) => e.match === "needs_attention");

  return (
    <>
      <View>
        <Text variant="h2" weight="bold">Review &amp; post</Text>
        <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
          {i.summary.ready} ready · {i.summary.needsAttention} need attention. Only ready entries post to the ledger.
        </Text>
      </View>

      {/* Summary tiles */}
      <View style={styles.summaryGrid}>
        <SumTile label="Ready"             value={String(i.summary.ready)}          color={t.success} t={t} />
        <SumTile label="Needs attention"   value={String(i.summary.needsAttention)} color={t.warning} t={t} />
        <SumTile label="Duplicates"        value={String(i.summary.duplicates)}     color={t.textSecondary} t={t} />
      </View>

      {/* Needs attention block */}
      {needsAttention.length > 0 ? (
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
            <AlertCircle size={14} color={t.warning} />
            <Text variant="h3" weight="bold">Needs your attention</Text>
          </View>
          <View style={{ gap: space.sm }}>
            {needsAttention.map((e) => (
              <EntryRow key={e.id} e={e} t={t} />
            ))}
          </View>
        </View>
      ) : null}

      {/* Ready preview */}
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
          <Check size={14} color={t.success} strokeWidth={3} />
          <Text variant="h3" weight="bold">Ready to post</Text>
        </View>
        <Card padded={false}>
          {ready.map((e, idx) => (
            <View
              key={e.id}
              style={[styles.entryRowLine, idx === ready.length - 1 ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}
            >
              <View style={{ flex: 1 }}>
                <Text variant="caption" weight="bold" numberOfLines={1}>{e.description}</Text>
                <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
                  {shortDate(e.date)} · {e.counterparty} · {e.reference}
                </Text>
              </View>
              <Text
                variant="caption"
                weight="bold"
                style={{ color: e.amount < 0 ? t.danger : t.success }}
              >
                {formatCurrency(e.amount, e.currency)}
              </Text>
            </View>
          ))}
        </Card>
      </View>
    </>
  );
}

function SumTile({ label, value, color, t }: { label: string; value: string; color: string; t: AppTheme }) {
  return (
    <View style={[styles.sumTile, { backgroundColor: t.surface, borderColor: t.border }]}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="h2" weight="bold" style={{ color, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

function EntryRow({ e, t }: { e: ImportEntry; t: AppTheme }) {
  return (
    <View style={[styles.attentionRow, { backgroundColor: t.surface, borderColor: t.warning }]}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="caption" weight="bold" numberOfLines={1}>{e.description}</Text>
          <View style={[styles.attChip, { backgroundColor: t.warningSoft }]}>
            <Text variant="micro" weight="bold" style={{ color: t.warning, letterSpacing: 0.5 }}>NEEDS ATTENTION</Text>
          </View>
        </View>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
          {shortDate(e.date)} · {e.counterparty || "—"} · {formatCurrency(e.amount, e.currency)}
        </Text>
        {e.matchReason ? (
          <Text variant="micro" weight="semibold" style={{ color: t.warning, marginTop: 4 }}>
            {e.matchReason}
          </Text>
        ) : null}
        <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.sm }}>
          <Pressable style={[styles.skipBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}>
            <Text variant="micro" weight="bold">Skip</Text>
          </Pressable>
          <Pressable style={[styles.matchBtn, { backgroundColor: t.warning }]}>
            <Text variant="micro" weight="bold" style={{ color: "#fff" }}>Match manually</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: {
    flexDirection: "row",
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    gap: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dropzone: {
    alignItems: "center",
    padding: space.xl,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    borderStyle: "dashed",
    gap: 4,
  },
  dropIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.sm,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  fileIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  miniPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
  },
  detectBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  detectRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.sm,
  },
  advancedBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  colRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  colArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  confPill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: space.sm,
  },
  sumTile: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  attentionRow: {
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  attChip: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  skipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  matchBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  entryRowLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
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
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.md,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
