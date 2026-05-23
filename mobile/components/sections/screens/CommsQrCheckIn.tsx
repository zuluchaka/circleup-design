import { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import {
  ScanLine,
  Ticket,
  CheckCircle2,
  Clock,
  Users,
  Zap,
  Share2,
  Copy,
  RefreshCw,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";
import comms from "@/product/sections/06-communication-and-events/data.json";

type Mode = "scanner" | "ticket";

const QR_SIZE = 17;
// Deterministic pattern that reads like a real QR. Fixed corners, scattered modules.
function buildQrCells(): boolean[][] {
  const grid: boolean[][] = Array.from({ length: QR_SIZE }, () => Array(QR_SIZE).fill(false));
  // Finder patterns at three corners.
  const finders: Array<[number, number]> = [
    [0, 0],
    [0, QR_SIZE - 7],
    [QR_SIZE - 7, 0],
  ];
  for (const [r, c] of finders) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const onBorder = i === 0 || i === 6 || j === 0 || j === 6;
        const inner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        grid[r + i][c + j] = onBorder || inner;
      }
    }
  }
  // Timing lines.
  for (let i = 8; i < QR_SIZE - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }
  // Pseudo-random data modules (deterministic via simple hash).
  for (let r = 0; r < QR_SIZE; r++) {
    for (let c = 0; c < QR_SIZE; c++) {
      if (grid[r][c]) continue;
      if (r < 8 && c < 8) continue;
      if (r < 8 && c >= QR_SIZE - 8) continue;
      if (r >= QR_SIZE - 8 && c < 8) continue;
      grid[r][c] = ((r * 31 + c * 17 + r * c) % 3) === 0;
    }
  }
  // Alignment block.
  const ar = QR_SIZE - 5;
  const ac = QR_SIZE - 5;
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      const r = ar + i;
      const c = ac + j;
      if (r < 0 || r >= QR_SIZE || c < 0 || c >= QR_SIZE) continue;
      const onBorder = Math.abs(i) === 2 || Math.abs(j) === 2;
      const centre = i === 0 && j === 0;
      grid[r][c] = onBorder || centre;
    }
  }
  return grid;
}

export function CommsQrCheckIn() {
  const t = useTheme();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("scanner");
  const qr = comms.qr;
  const event = comms.events.find((e) => e.id === qr.eventId) ?? comms.events[0];
  const cells = useMemo(() => buildQrCells(), []);

  const progress = qr.checkedIn / qr.expected;
  const cellSize = 13;
  const qrPixel = cellSize * QR_SIZE;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title={mode === "scanner" ? "QR check-in" : "Your ticket"}
        subtitle={event.title}
        onBack={() => router.back()}
        trailing={
          mode === "ticket" ? (
            <HeaderIconButton>
              <Share2 size={18} color={t.textSecondary} />
            </HeaderIconButton>
          ) : (
            <HeaderIconButton>
              <RefreshCw size={18} color={t.textSecondary} />
            </HeaderIconButton>
          )
        }
      />

      <View style={{ paddingHorizontal: space.lg, paddingTop: space.md }}>
        <View style={[styles.modeWrap, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
          <Pressable
            onPress={() => setMode("scanner")}
            style={[
              styles.modeOption,
              { backgroundColor: mode === "scanner" ? t.bgElevated : "transparent" },
            ]}
          >
            <ScanLine size={14} color={mode === "scanner" ? t.primary : t.textSecondary} />
            <Text
              variant="caption"
              weight="bold"
              style={{ color: mode === "scanner" ? t.textPrimary : t.textSecondary }}
            >
              Organiser
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("ticket")}
            style={[
              styles.modeOption,
              { backgroundColor: mode === "ticket" ? t.bgElevated : "transparent" },
            ]}
          >
            <Ticket size={14} color={mode === "ticket" ? t.primary : t.textSecondary} />
            <Text
              variant="caption"
              weight="bold"
              style={{ color: mode === "ticket" ? t.textPrimary : t.textSecondary }}
            >
              My ticket
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: space.xl }}>
        {mode === "scanner" ? (
          <View>
            <View
              style={[
                styles.scannerFrame,
                { backgroundColor: palette.slate[950], borderColor: t.border },
              ]}
            >
              <View style={styles.scannerCorner} />
              <View style={[styles.scannerCorner, styles.cornerTR]} />
              <View style={[styles.scannerCorner, styles.cornerBL]} />
              <View style={[styles.scannerCorner, styles.cornerBR]} />
              <View style={[styles.scannerLine, { backgroundColor: t.primary }]} />
              <View style={styles.scannerHint}>
                <ScanLine size={20} color="rgba(255,255,255,0.85)" />
                <Text variant="caption" weight="semibold" style={{ color: "rgba(255,255,255,0.85)" }}>
                  Point camera at a member's QR
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <StatCard
                label="Checked in"
                value={`${qr.checkedIn}`}
                hint={`of ${qr.expected} expected`}
                tone="success"
                icon={<CheckCircle2 size={16} color={t.success} />}
                progress={progress}
              />
              <StatCard
                label="On the way"
                value={`${qr.expected - qr.checkedIn}`}
                hint="RSVP'd · pending"
                tone="warning"
                icon={<Clock size={16} color={t.warning} />}
              />
            </View>

            <View
              style={[styles.actionRow, { backgroundColor: t.surface, borderColor: t.border }]}
            >
              <View style={[styles.actionIcon, { backgroundColor: t.primarySoft }]}>
                <Zap size={16} color={t.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="semibold">
                  Manual entry
                </Text>
                <Text variant="micro" tone="muted">
                  Member can't scan? Enter their 6-digit code.
                </Text>
              </View>
              <View style={[styles.manualCode, { borderColor: t.border, backgroundColor: t.bgMuted }]}>
                <Text variant="caption" weight="bold">
                  ENTER
                </Text>
              </View>
            </View>

            <View style={styles.sectionHead}>
              <Text variant="caption" weight="semibold" tone="muted" style={{ letterSpacing: 0.6 }}>
                RECENT CHECK-INS · {qr.lastFive.length}
              </Text>
            </View>
            {qr.lastFive.map((entry, idx) => (
              <View
                key={`${entry.name}-${idx}`}
                style={[
                  styles.checkRow,
                  { borderBottomColor: t.border, backgroundColor: t.surface },
                ]}
              >
                <Avatar name={entry.name} size="sm" />
                <View style={{ flex: 1 }}>
                  <Text variant="bodySmall" weight="semibold">
                    {entry.name}
                  </Text>
                  <Text variant="micro" tone="muted">
                    Checked in at {entry.at}
                  </Text>
                </View>
                <View style={[styles.checkBadge, { backgroundColor: t.successSoft }]}>
                  <CheckCircle2 size={12} color={t.success} />
                  <Text variant="micro" weight="bold" style={{ color: t.success }}>
                    OK
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ paddingHorizontal: space.lg, paddingTop: space.lg, gap: space.md }}>
            <View
              style={[
                styles.ticketCard,
                { backgroundColor: t.bgElevated, borderColor: t.border, shadowColor: t.shadow },
              ]}
            >
              <View style={[styles.ticketHeader, { borderBottomColor: t.border }]}>
                <View
                  style={[
                    styles.ticketAccent,
                    { backgroundColor: event.accent ?? t.primary },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 0.6 }}>
                    EVENT TICKET
                  </Text>
                  <Text variant="body" weight="bold" numberOfLines={1}>
                    {event.title}
                  </Text>
                  <Text variant="micro" tone="secondary">
                    {event.location.kind === "online" ? "Online" : event.location.venue} ·{" "}
                    {event.associationName}
                  </Text>
                </View>
              </View>

              <View style={styles.qrWrap}>
                <View
                  style={{
                    width: qrPixel + 16,
                    height: qrPixel + 16,
                    padding: 8,
                    backgroundColor: "#fff",
                    borderRadius: radius.sm,
                  }}
                >
                  {cells.map((row, r) => (
                    <View key={r} style={{ flexDirection: "row" }}>
                      {row.map((on, c) => (
                        <View
                          key={c}
                          style={{
                            width: cellSize,
                            height: cellSize,
                            backgroundColor: on ? palette.slate[950] : "#fff",
                          }}
                        />
                      ))}
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.codeRow}>
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.6 }}>
                    MANUAL CODE
                  </Text>
                  <Text variant="h2" weight="bold" style={{ letterSpacing: 6, marginTop: 2 }}>
                    482 · 196
                  </Text>
                </View>
                <Pressable
                  hitSlop={6}
                  style={[styles.copyBtn, { backgroundColor: t.bgMuted, borderColor: t.border }]}
                >
                  <Copy size={14} color={t.textSecondary} />
                </Pressable>
              </View>

              <View style={[styles.ticketFooter, { borderTopColor: t.border }]}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="micro" tone="muted">
                    Holder
                  </Text>
                  <Text variant="bodySmall" weight="semibold">
                    You · CHF 15 paid
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 2 }}>
                  <Text variant="micro" tone="muted">
                    Doors open
                  </Text>
                  <Text variant="bodySmall" weight="semibold">
                    Jul 12 · 12:00
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[styles.tipRow, { backgroundColor: t.surface, borderColor: t.border }]}
            >
              <View style={[styles.actionIcon, { backgroundColor: t.warningSoft }]}>
                <Users size={16} color={t.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="semibold">
                  Family ticket?
                </Text>
                <Text variant="micro" tone="muted">
                  Show this code at the door for up to 4 people.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone,
  icon,
  progress,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "success" | "warning";
  icon: React.ReactNode;
  progress?: number;
}) {
  const t = useTheme();
  const color = tone === "success" ? t.success : t.warning;
  return (
    <View
      style={[
        statStyles.card,
        { backgroundColor: t.surface, borderColor: t.border },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {icon}
        <Text variant="caption" weight="semibold" tone="muted">
          {label}
        </Text>
      </View>
      <Text variant="h2" weight="bold" style={{ color, marginTop: 2 }}>
        {value}
      </Text>
      <Text variant="micro" tone="muted">
        {hint}
      </Text>
      {progress !== undefined ? (
        <View style={[statStyles.progressTrack, { backgroundColor: t.bgMuted, marginTop: 6 }]}>
          <View
            style={[
              statStyles.progressFill,
              {
                width: `${Math.min(progress * 100, 100)}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
});

const styles = StyleSheet.create({
  modeWrap: {
    flexDirection: "row",
    padding: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: 4,
  },
  modeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  scannerFrame: {
    marginHorizontal: space.lg,
    marginTop: space.md,
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
  },
  scannerCorner: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "rgba(255,255,255,0.9)",
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    left: undefined,
    right: 16,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    top: undefined,
    bottom: 16,
    borderTopWidth: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    top: undefined,
    bottom: 16,
    left: undefined,
    right: 16,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 4,
  },
  scannerLine: {
    position: "absolute",
    left: 32,
    right: 32,
    top: "50%",
    height: 2,
    opacity: 0.85,
  },
  scannerHint: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  statsRow: {
    flexDirection: "row",
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    marginHorizontal: space.lg,
    marginTop: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  manualCode: {
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  sectionHead: {
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.xs,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  checkBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  ticketCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  ticketHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.md,
    paddingRight: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ticketAccent: {
    width: 6,
    alignSelf: "stretch",
    borderTopRightRadius: radius.sm,
    borderBottomRightRadius: radius.sm,
  },
  qrWrap: {
    alignItems: "center",
    padding: space.lg,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    paddingBottom: space.md,
    gap: space.md,
  },
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketFooter: {
    flexDirection: "row",
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
