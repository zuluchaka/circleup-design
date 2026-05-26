// AI Assistant chat for /sections/ai-insights/assistant.
// Suggested prompt chips, message thread with citations, input bar at bottom.

import { View, ScrollView, StyleSheet, Pressable, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Sparkles, Send, ChevronRight, Info, Mic, Plus,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const SUGGESTED = [
  "How am I doing this cycle?",
  "When is my next payout?",
  "Why did my Trust change?",
  "Am I eligible for a payout advance?",
];

type Msg = {
  role: "user" | "assistant";
  content: string;
  citations?: { label: string; target: string }[];
};

const CONVERSATION: Msg[] = [
  { role: "user", content: "When is my next payout?" },
  {
    role: "assistant",
    content: "August 25, CHF 2,400 — cycle 11 of Main CHF Circle. You're 4th in the rotation. The pot will hit your default IBAN within 1 business day of the cycle close.",
    citations: [
      { label: "Payout schedule", target: "/sections/rosca-circles/payouts" },
      { label: "Pay-out method",  target: "/profile/payment-methods" },
    ],
  },
  { role: "user", content: "Can I get it earlier?" },
  {
    role: "assistant",
    content: "Yes — your Trust Score (824) qualifies you for a payout advance of up to CHF 1,200, repaid automatically from the August payout. Fee is 1.2%.",
    citations: [
      { label: "Apply for advance", target: "/sections/credit-and-lending/advance" },
    ],
  },
];

export function AiAssistant() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="AI Assistant" subtitle="Personalised for Amara" />

      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}>
        {/* Greeting */}
        <LinearGradient
          colors={[palette.indigo[600], palette.indigo[800]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.greeting}
        >
          <View style={styles.sparkleIcon}>
            <Sparkles size={20} color="#fff" />
          </View>
          <Text variant="h2" weight="bold" style={{ color: "#fff", marginTop: space.md }}>
            Hi Amara, how can I help?
          </Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.85)", marginTop: space.xs, lineHeight: 18 }}>
            I can look up payouts, explain your Trust Score, surface circle risks, and walk through advances or loans. All data stays inside CircleUp.
          </Text>
        </LinearGradient>

        {/* Suggested */}
        <View>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            SUGGESTED
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
            {SUGGESTED.map((s) => (
              <Pressable key={s} style={[styles.chip, { backgroundColor: t.surface, borderColor: t.border }]}>
                <Sparkles size={11} color={t.primary} />
                <Text variant="caption" weight="semibold">{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Conversation */}
        <View style={{ gap: space.md }}>
          {CONVERSATION.map((m, i) => (
            <View key={i} style={{ alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
              {m.role === "assistant" ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <View style={[styles.botBubble, { backgroundColor: t.primary }]}>
                    <Sparkles size={10} color="#fff" />
                  </View>
                  <Text variant="micro" tone="muted" weight="semibold">CircleUp AI</Text>
                </View>
              ) : null}
              <View
                style={[
                  styles.bubble,
                  m.role === "user"
                    ? { backgroundColor: t.primary, borderTopRightRadius: 4 }
                    : { backgroundColor: t.surface, borderColor: t.border, borderWidth: 1, borderTopLeftRadius: 4 },
                ]}
              >
                <Text
                  variant="bodySmall"
                  style={{ color: m.role === "user" ? "#fff" : t.textPrimary, lineHeight: 20 }}
                >
                  {m.content}
                </Text>
                {m.citations ? (
                  <View style={{ gap: 6, marginTop: space.sm }}>
                    {m.citations.map((c) => (
                      <Pressable
                        key={c.label}
                        style={[styles.citation, { backgroundColor: t.bgMuted }]}
                      >
                        <Info size={11} color={t.textMuted} />
                        <Text variant="micro" weight="semibold" tone="accent" style={{ flex: 1 }}>{c.label}</Text>
                        <ChevronRight size={11} color={t.textMuted} />
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        <Text variant="caption" tone="muted" align="center" style={{ marginTop: space.md, lineHeight: 16, paddingHorizontal: space.lg }}>
          The Assistant only answers from your association's data + public CircleUp docs. It can be wrong — verify before acting on financial advice.
        </Text>
      </ScrollView>

      {/* Input bar */}
      <View style={[styles.inputBar, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Pressable style={[styles.iconBtn, { backgroundColor: t.bgMuted }]}>
          <Plus size={16} color={t.textSecondary} />
        </Pressable>
        <View style={[styles.input, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
          <TextInput
            value="Ask anything about your circles…"
            editable={false}
            placeholderTextColor={t.textMuted}
            style={{ flex: 1, color: t.textMuted, fontSize: 14 }}
          />
        </View>
        <Pressable style={[styles.iconBtn, { backgroundColor: t.bgMuted }]}>
          <Mic size={16} color={t.textSecondary} />
        </Pressable>
        <Pressable style={[styles.sendBtn, { backgroundColor: t.primary }]}>
          <Send size={16} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  sparkleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  botBubble: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    maxWidth: "88%",
    padding: space.md,
    borderRadius: radius.lg,
  },
  citation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  inputBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.md,
    paddingBottom: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
