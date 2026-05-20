import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRight,
  Eye,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Globe,
  Users,
  CheckCircle2,
  PiggyBank,
  Clock,
  Trophy,
  Sprout,
  Home,
  Briefcase,
  Target,
  PlusCircle,
  Banknote,
  ShieldAlert,
  ChevronDown,
  Star,
  Check,
  X,
  Smartphone,
  Apple,
  Award,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { useTheme, space, radius, palette } from "@/theme";

// ---------- Static content (mirrors product/sections/homepage/data.json) ----------

const HERO = {
  eyebrow: "TRUSTED BY 45,000+ MEMBERS",
  title: "Save Together,\nGrow Together",
  subtitle:
    "CircleUp digitizes traditional savings circles — tontines, tandas, chit funds — with automated payments, transparent tracking, and built-in default protection.",
  trustBadges: ["Bank-level encryption", "Swiss compliant", "Secured by Stripe"],
};

const PLATFORM_STATS = [
  { id: "members", label: "Active Members", value: "45K+", Icon: Users },
  { id: "circles", label: "Circles Completed", value: "2,800+", Icon: CheckCircle2 },
  { id: "saved", label: "Total Saved", value: "CHF 28.5M", Icon: PiggyBank },
  { id: "rate", label: "Completion Rate", value: "97.2%", Icon: TrendingUp },
  { id: "countries", label: "Countries Served", value: "23", Icon: Globe },
  { id: "ontime", label: "On-Time Payments", value: "94.8%", Icon: Clock },
];

const BENEFITS = [
  {
    id: "transparency",
    Icon: Eye,
    title: "Complete Transparency",
    body: "See every contribution, every payout, and every member's status in real-time. No more wondering where your money is.",
    tone: "primary",
  },
  {
    id: "automation",
    Icon: RefreshCw,
    title: "Automated Everything",
    body: "Payments collected automatically, payouts disbursed on schedule, reminders sent before due dates. Set it and forget it.",
    tone: "info",
  },
  {
    id: "protection",
    Icon: ShieldCheck,
    title: "Default Protection",
    body: "Our Emergency Fund covers missed payments so your circle stays on track even if someone can't pay.",
    tone: "success",
  },
  {
    id: "trust-score",
    Icon: TrendingUp,
    title: "AI Trust Score",
    body: "Know who you're saving with. Our AI rates member reliability from 0–1000 based on history and verification.",
    tone: "accent",
  },
  {
    id: "easy-payments",
    Icon: CreditCard,
    title: "Easy Payments",
    body: "Pay with card, bank transfer, or mobile money. Automatic payments mean you never miss a contribution.",
    tone: "primary",
  },
  {
    id: "multi-language",
    Icon: Globe,
    title: "Your Language",
    body: "Available in English, French, German, Italian, and Portuguese. Invite your community in their language.",
    tone: "info",
  },
] as const;

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Create or Join",
    body: "Start your own savings circle with friends, family, or colleagues — or join an existing one. Set your contribution amount and schedule.",
  },
  {
    step: 2,
    title: "Contribute Together",
    body: "Everyone contributes the same amount each period. Payments collected automatically and tracked transparently.",
  },
  {
    step: 3,
    title: "Receive Your Payout",
    body: "Each period, one member receives the full pot. Payouts continue until everyone has been paid out.",
  },
  {
    step: 4,
    title: "Complete & Repeat",
    body: "Once everyone has received their payout, the circle is complete. Start a new one or take a break.",
  },
];

const TESTIMONIALS = [
  {
    id: "t1",
    name: "Aminata Diallo",
    role: "Member",
    community: "Senegalese Diaspora, Zurich",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop",
    quote:
      "I was nervous joining a tontine online, but CircleUp changed everything. After 8 months, I received CHF 4,800 for my daughter's university fees.",
    metric: "CHF 4,800 saved",
  },
  {
    id: "t2",
    name: "Carlos Mendoza",
    role: "Organizer",
    community: "Latino Community, Geneva",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    quote:
      "I used to spend 10 hours a week chasing payments. Now CircleUp does it all. I manage 5 tandas with 60 members in 30 minutes a week.",
    metric: "5 circles · 60 members",
  },
  {
    id: "t3",
    name: "Fatou Ndiaye",
    role: "Member",
    community: "West African Tontine, Basel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    quote:
      "The Emergency Fund saved our circle when one member lost her job. We all still got our payouts on time. No WhatsApp group can do that.",
    metric: "100% on-time payouts",
  },
  {
    id: "t4",
    name: "Priya Sharma",
    role: "Organizer",
    community: "Indian Professionals, Lausanne",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
    quote:
      "Trust Score helped me vet new members I'd never met in person. No defaults in 14 months across 3 circles.",
    metric: "0 defaults · 14 months",
  },
];

const COMPARISON = [
  {
    label: "Payment Collection",
    traditional: "Chase via calls and WhatsApp",
    circleup: "Automatic card or bank",
  },
  {
    label: "Default Protection",
    traditional: "Circle fails or organizer covers",
    circleup: "Emergency Fund covers it",
  },
  {
    label: "Transparency",
    traditional: "Trust the organizer's notebook",
    circleup: "Real-time dashboard for all",
  },
  {
    label: "Organizer Time",
    traditional: "10+ hours per week",
    circleup: "30 minutes per week",
  },
  {
    label: "Geographic Limits",
    traditional: "Same city, cash handoffs",
    circleup: "Any currency, global",
  },
];

const CIRCLE_EXAMPLES = [
  {
    id: "starter",
    name: "Starter Circle",
    Icon: Sprout,
    members: 5,
    contribution: "CHF 100",
    cadence: "bi-weekly",
    payout: "CHF 500",
    blurb: "Low-commitment circle for first-timers. Build your Trust Score while saving.",
    tag: "Beginner",
  },
  {
    id: "family",
    name: "Family Savings",
    Icon: Home,
    members: 6,
    contribution: "CHF 200",
    cadence: "monthly",
    payout: "CHF 1,200",
    blurb: "Perfect for close family saving for shared goals like holidays or events.",
    tag: "Low trust",
  },
  {
    id: "community",
    name: "Community Tontine",
    Icon: Users,
    members: 12,
    contribution: "CHF 500",
    cadence: "monthly",
    payout: "CHF 6,000",
    blurb: "Traditional diaspora circle. Larger group, higher payouts.",
    tag: "Most popular",
  },
  {
    id: "professional",
    name: "Professional Network",
    Icon: Briefcase,
    members: 10,
    contribution: "CHF 1,000",
    cadence: "monthly",
    payout: "CHF 10,000",
    blurb: "For colleagues or associations. Verified members only.",
    tag: "High trust",
  },
  {
    id: "goal",
    name: "Goal-Based Circle",
    Icon: Target,
    members: 8,
    contribution: "CHF 750",
    cadence: "monthly",
    payout: "CHF 6,000",
    blurb: "Everyone saves toward similar goals — home down payments, business capital.",
    tag: "Focused",
  },
];

const COMMUNITIES = [
  {
    id: "west-african",
    name: "West African Tontine",
    localName: "Tontine · Osusu · Esusu",
    countries: "Senegal · Nigeria · Ghana · Cameroon",
    members: "12,000+ members",
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=240&fit=crop",
  },
  {
    id: "latin",
    name: "Latin American Tandas",
    localName: "Tanda · Junta · San",
    countries: "Mexico · Peru · Colombia · DR",
    members: "8,500+ members",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=240&fit=crop",
  },
  {
    id: "south-asian",
    name: "South Asian Chit Funds",
    localName: "Chit Fund · Kameti · Committee",
    countries: "India · Pakistan · Sri Lanka · Bangladesh",
    members: "6,200+ members",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=240&fit=crop",
  },
  {
    id: "caribbean",
    name: "Caribbean Sou-Sou",
    localName: "Sou-Sou · Sol · Partner",
    countries: "Jamaica · Trinidad · Haiti · Guyana",
    members: "4,800+ members",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=240&fit=crop",
  },
];

const PARTNERS = ["Stripe", "UBS", "PostFinance", "TWINT", "Sumsub", "AWS"];

const PRICING = [
  {
    id: "free",
    name: "Free",
    price: "CHF 0",
    cadence: "forever",
    fee: "3.5% per contribution",
    tagline: "Try CircleUp or run one small circle",
    features: ["1 active circle", "Up to 8 members", "Basic payment tracking", "Email support"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "CHF 99",
    cadence: "per month",
    fee: "2.0% per contribution",
    tagline: "For serious organizers and associations",
    features: [
      "Unlimited circles",
      "Up to 200 members",
      "Advanced analytics",
      "Governance & voting",
      "Custom branding",
      "Phone & chat support",
    ],
    cta: "Start Pro",
    highlighted: true,
  },
  {
    id: "basic",
    name: "Basic",
    price: "CHF 29",
    cadence: "per month",
    fee: "2.5% per contribution",
    tagline: "For multiple circles or small associations",
    features: ["5 active circles", "Up to 50 members", "Full payment tracking", "Export reports"],
    cta: "Start Basic",
    highlighted: false,
  },
];

const FAQS = [
  {
    q: "Is my money safe with CircleUp?",
    a: "Yes. CircleUp never holds your money — funds flow directly between members via Stripe, a PCI-DSS Level 1 certified processor. We're also FINMA-regulated and GDPR compliant.",
  },
  {
    q: "What happens if someone doesn't pay?",
    a: "Our Emergency Fund protects your circle. Every contribution includes ~1% that pools into a protection fund. If a member misses a payment, the fund covers it so payouts continue. The defaulting member then repays the fund.",
  },
  {
    q: "Are there any hidden fees?",
    a: "No hidden fees. We charge a transparent 2–3.5% platform fee per contribution depending on your plan. You see the exact fee before every payment.",
  },
  {
    q: "How do you verify members?",
    a: "Multiple levels: email verification, phone verification, and full KYC with government ID. Our AI Trust Score also rates member reliability from 0–1000.",
  },
  {
    q: "When will I receive my payout?",
    a: "Your payout date is determined when you join — by fixed order, random draw, bidding, or Trust Score. Payouts are disbursed within 1–2 business days.",
  },
  {
    q: "Can I customize circle rules?",
    a: "Absolutely. As organizer you control contribution amounts, frequency, payout order, Emergency Fund rate, late penalties, and more.",
  },
];

// ---------- Helpers ----------

function useToneColors() {
  const t = useTheme();
  return {
    primary: { fg: t.primary, bg: t.primarySoft },
    info: { fg: t.info, bg: t.infoSoft },
    success: { fg: t.success, bg: t.successSoft },
    accent: { fg: t.accent, bg: t.accentSoft },
  } as const;
}

// ---------- Section components ----------

function Hero({ t }: { t: ReturnType<typeof useTheme> }) {
  return (
    <LinearGradient
      colors={[palette.indigo[700], palette.indigo[900], palette.slate[950]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.hero}
    >
      <View style={styles.heroBadge}>
        <Star size={11} color={palette.amber[300]} fill={palette.amber[300]} />
        <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1.2 }}>
          {HERO.eyebrow}
        </Text>
      </View>

      <Text variant="display" weight="bold" style={styles.heroTitle}>
        {HERO.title}
      </Text>

      <Text variant="body" style={styles.heroSubtitle}>
        {HERO.subtitle}
      </Text>

      <View style={{ gap: space.sm, marginTop: space.xl }}>
        <Button
          label="Start Free Trial"
          fullWidth
          size="lg"
          trailingIcon={<ArrowRight size={18} color="#fff" />}
        />
        <Pressable style={styles.secondaryBtn}>
          <Text variant="body" weight="semibold" style={{ color: "#fff" }}>
            Watch Demo
          </Text>
        </Pressable>
      </View>

      <View style={styles.trustRow}>
        {HERO.trustBadges.map((b) => (
          <View key={b} style={styles.trustChip}>
            <ShieldCheck size={12} color={palette.emerald[400]} />
            <Text variant="micro" style={{ color: "rgba(255,255,255,0.85)" }}>
              {b}
            </Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

function StatsSection({ t }: { t: ReturnType<typeof useTheme> }) {
  return (
    <View style={[styles.statsWrap, { backgroundColor: t.bgElevated, borderColor: t.border }]}>
      {PLATFORM_STATS.map((s) => {
        const Icon = s.Icon;
        return (
          <View key={s.id} style={styles.statCell}>
            <View style={[styles.statIcon, { backgroundColor: t.primarySoft }]}>
              <Icon size={16} color={t.primary} />
            </View>
            <Text variant="h2" weight="bold">
              {s.value}
            </Text>
            <Text variant="micro" tone="secondary">
              {s.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <View style={{ gap: space.xs, marginBottom: space.lg, alignItems: align === "center" ? "center" : "flex-start" }}>
      {eyebrow ? (
        <Text variant="caption" weight="bold" tone="accent" style={{ letterSpacing: 1.4 }}>
          {eyebrow.toUpperCase()}
        </Text>
      ) : null}
      <Text variant="h1" weight="bold" align={align}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="body" tone="secondary" align={align}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function BenefitsSection({ t }: { t: ReturnType<typeof useTheme> }) {
  const tones = useToneColors();
  return (
    <View style={styles.sectionPad}>
      <SectionHeader
        eyebrow="Why CircleUp"
        title="Everything you need, nothing you don't"
        subtitle="Six core capabilities that make digital savings circles actually work."
      />
      <View style={{ gap: space.md }}>
        {BENEFITS.map((b) => {
          const Icon = b.Icon;
          const tone = tones[b.tone as keyof typeof tones];
          return (
            <Card key={b.id} padded>
              <View style={{ flexDirection: "row", gap: space.md, alignItems: "flex-start" }}>
                <View style={[styles.iconBubble, { backgroundColor: tone.bg }]}>
                  <Icon size={20} color={tone.fg} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text variant="h3" weight="semibold">
                    {b.title}
                  </Text>
                  <Text variant="bodySmall" tone="secondary">
                    {b.body}
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    </View>
  );
}

function HowItWorksSection({ t }: { t: ReturnType<typeof useTheme> }) {
  return (
    <View style={[styles.sectionPad, { backgroundColor: t.bgMuted, paddingVertical: space.xxxl }]}>
      <SectionHeader
        eyebrow="How it works"
        title="Four steps to your payout"
        subtitle="Whether you join an existing circle or start your own, the flow is the same."
      />
      <View style={{ gap: space.md, marginTop: space.sm }}>
        {HOW_IT_WORKS.map((step, idx) => (
          <View key={step.step} style={{ flexDirection: "row", gap: space.md }}>
            <View style={{ alignItems: "center" }}>
              <View style={[styles.stepNum, { backgroundColor: t.primary }]}>
                <Text variant="body" weight="bold" style={{ color: t.primaryOn }}>
                  {step.step}
                </Text>
              </View>
              {idx < HOW_IT_WORKS.length - 1 ? (
                <View style={[styles.stepConnector, { backgroundColor: t.border }]} />
              ) : null}
            </View>
            <View style={{ flex: 1, paddingBottom: idx < HOW_IT_WORKS.length - 1 ? space.lg : 0 }}>
              <Text variant="h3" weight="semibold">
                {step.title}
              </Text>
              <Text variant="bodySmall" tone="secondary" style={{ marginTop: 2 }}>
                {step.body}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function TestimonialsSection({ t }: { t: ReturnType<typeof useTheme> }) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - space.lg * 2, 320);
  return (
    <View style={{ paddingTop: space.xxxl, paddingBottom: space.xxxl }}>
      <View style={{ paddingHorizontal: space.lg }}>
        <SectionHeader
          eyebrow="Member stories"
          title="Real circles, real payouts"
          subtitle="From Zurich to Geneva, members are saving more and stressing less."
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.md }}
        snapToInterval={cardWidth + space.md}
        decelerationRate="fast"
      >
        {TESTIMONIALS.map((tt) => (
          <View
            key={tt.id}
            style={[
              styles.testimonialCard,
              { width: cardWidth, backgroundColor: t.surface, borderColor: t.border },
            ]}
          >
            <View style={{ flexDirection: "row", gap: 2 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={14} color={palette.amber[400]} fill={palette.amber[400]} />
              ))}
            </View>
            <Text variant="body" style={{ marginTop: space.md, flex: 1 }}>
              "{tt.quote}"
            </Text>
            <View style={{ marginTop: space.md, flexDirection: "row", alignItems: "center", gap: space.md }}>
              <Image source={{ uri: tt.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="semibold">
                  {tt.name}
                </Text>
                <Text variant="micro" tone="secondary">
                  {tt.role} · {tt.community}
                </Text>
              </View>
            </View>
            <View style={[styles.metricChip, { backgroundColor: t.successSoft, marginTop: space.sm }]}>
              <Trophy size={12} color={t.success} />
              <Text variant="micro" weight="semibold" style={{ color: t.success }}>
                {tt.metric}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function ComparisonSection({ t }: { t: ReturnType<typeof useTheme> }) {
  return (
    <View style={styles.sectionPad}>
      <SectionHeader
        eyebrow="The difference"
        title="Traditional vs CircleUp"
        subtitle="Same community spirit. Better protection, transparency, and automation."
      />
      <View style={[styles.compareTable, { backgroundColor: t.surface, borderColor: t.border }]}>
        <View style={[styles.compareHeader, { borderBottomColor: t.border }]}>
          <View style={{ flex: 1 }} />
          <View style={styles.compareHeaderCell}>
            <Text variant="micro" weight="bold" tone="secondary" align="center">
              TRADITIONAL
            </Text>
          </View>
          <View style={styles.compareHeaderCell}>
            <Text variant="micro" weight="bold" align="center" style={{ color: t.primary }}>
              CIRCLEUP
            </Text>
          </View>
        </View>
        {COMPARISON.map((row, i) => (
          <View
            key={row.label}
            style={[
              styles.compareRow,
              { borderTopColor: t.border, borderTopWidth: i === 0 ? 0 : StyleSheet.hairlineWidth },
            ]}
          >
            <View style={{ flex: 1.1, paddingRight: space.xs }}>
              <Text variant="caption" weight="semibold">
                {row.label}
              </Text>
            </View>
            <View style={styles.compareCell}>
              <X size={12} color={t.textMuted} />
              <Text variant="micro" tone="muted" style={{ flex: 1 }}>
                {row.traditional}
              </Text>
            </View>
            <View style={styles.compareCell}>
              <Check size={12} color={t.success} />
              <Text variant="micro" style={{ flex: 1, color: t.textPrimary }}>
                {row.circleup}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function CircleExamplesSection({ t }: { t: ReturnType<typeof useTheme> }) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - space.lg * 2 - 40, 280);
  return (
    <View style={{ paddingTop: space.xxxl, paddingBottom: space.xxxl, backgroundColor: t.bgMuted }}>
      <View style={{ paddingHorizontal: space.lg }}>
        <SectionHeader
          eyebrow="Circle examples"
          title="Configurations that work"
          subtitle="Five proven setups — pick one or design your own."
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.md }}
        snapToInterval={cardWidth + space.md}
        decelerationRate="fast"
      >
        {CIRCLE_EXAMPLES.map((ex) => {
          const Icon = ex.Icon;
          return (
            <View
              key={ex.id}
              style={[
                styles.exampleCard,
                { width: cardWidth, backgroundColor: t.surface, borderColor: t.border },
              ]}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={[styles.iconBubble, { backgroundColor: t.primarySoft }]}>
                  <Icon size={20} color={t.primary} />
                </View>
                <View style={[styles.tag, { backgroundColor: t.accentSoft }]}>
                  <Text variant="micro" weight="semibold" style={{ color: t.warning }}>
                    {ex.tag}
                  </Text>
                </View>
              </View>
              <Text variant="h3" weight="bold" style={{ marginTop: space.md }}>
                {ex.name}
              </Text>
              <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                {ex.blurb}
              </Text>
              <View style={[styles.exampleStats, { borderTopColor: t.border }]}>
                <View>
                  <Text variant="micro" tone="muted">
                    Members
                  </Text>
                  <Text variant="bodySmall" weight="semibold">
                    {ex.members}
                  </Text>
                </View>
                <View>
                  <Text variant="micro" tone="muted">
                    Contribution
                  </Text>
                  <Text variant="bodySmall" weight="semibold">
                    {ex.contribution}
                  </Text>
                </View>
                <View>
                  <Text variant="micro" tone="muted">
                    Payout
                  </Text>
                  <Text variant="bodySmall" weight="semibold" style={{ color: t.success }}>
                    {ex.payout}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function CommunitiesSection({ t }: { t: ReturnType<typeof useTheme> }) {
  return (
    <View style={styles.sectionPad}>
      <SectionHeader
        eyebrow="Communities we serve"
        title="Your tradition, your terminology"
        subtitle="CircleUp speaks your community's language and follows your governance traditions."
      />
      <View style={{ gap: space.md }}>
        {COMMUNITIES.map((c) => (
          <View key={c.id} style={[styles.commCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Image source={{ uri: c.image }} style={styles.commImage} />
            <LinearGradient
              colors={["transparent", "rgba(15, 23, 42, 0.85)"]}
              style={styles.commGradient}
            />
            <View style={styles.commOverlay}>
              <View style={[styles.localNameChip]}>
                <Text variant="micro" weight="semibold" style={{ color: palette.indigo[200] }}>
                  {c.localName}
                </Text>
              </View>
              <Text variant="h2" weight="bold" style={{ color: "#fff", marginTop: space.xs }}>
                {c.name}
              </Text>
              <Text variant="caption" style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
                {c.countries}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: space.xs }}>
                <Users size={11} color={palette.amber[300]} />
                <Text variant="micro" weight="semibold" style={{ color: palette.amber[300] }}>
                  {c.members}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function TrustSection({ t }: { t: ReturnType<typeof useTheme> }) {
  return (
    <View style={[styles.sectionPad, { backgroundColor: t.bgMuted }]}>
      <SectionHeader
        eyebrow="Trust & security"
        title="Built on solid foundations"
        subtitle="Bank-grade infrastructure, regulated processors, and institutional partners."
      />
      <View style={[styles.partnersWrap, { backgroundColor: t.surface, borderColor: t.border }]}>
        <Text variant="caption" weight="semibold" tone="secondary" style={{ marginBottom: space.md }}>
          OUR PARTNERS
        </Text>
        <View style={styles.partnerRow}>
          {PARTNERS.map((p) => (
            <View key={p} style={[styles.partnerChip, { borderColor: t.border, backgroundColor: t.bgMuted }]}>
              <Text variant="caption" weight="bold" tone="secondary">
                {p}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm, marginTop: space.md }}>
        {[
          { Icon: ShieldCheck, label: "AES-256 encryption" },
          { Icon: Award, label: "Swiss FINMA compliant" },
          { Icon: CreditCard, label: "PCI-DSS Level 1" },
          { Icon: ShieldAlert, label: "GDPR compliant" },
        ].map((badge) => {
          const Icon = badge.Icon;
          return (
            <View
              key={badge.label}
              style={[
                styles.securityBadge,
                { backgroundColor: t.surface, borderColor: t.border, flexBasis: "48%" },
              ]}
            >
              <Icon size={16} color={t.success} />
              <Text variant="caption" weight="semibold" style={{ flex: 1 }}>
                {badge.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function PricingSection({ t }: { t: ReturnType<typeof useTheme> }) {
  return (
    <View style={styles.sectionPad}>
      <SectionHeader
        eyebrow="Simple pricing"
        title="Pay only for what you use"
        subtitle="Start free. Upgrade when you're ready. No hidden fees."
      />
      <View style={{ gap: space.md }}>
        {PRICING.map((p) => (
          <View
            key={p.id}
            style={[
              styles.pricingCard,
              {
                backgroundColor: p.highlighted ? t.primary : t.surface,
                borderColor: p.highlighted ? t.primary : t.border,
              },
            ]}
          >
            {p.highlighted ? (
              <View style={styles.popularBadge}>
                <Text variant="micro" weight="bold" style={{ color: t.primary, letterSpacing: 1 }}>
                  MOST POPULAR
                </Text>
              </View>
            ) : null}
            <Text
              variant="caption"
              weight="bold"
              style={{ color: p.highlighted ? "rgba(255,255,255,0.85)" : t.textSecondary, letterSpacing: 1.2 }}
            >
              {p.name.toUpperCase()}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: space.xs, marginTop: space.xs }}>
              <Text
                variant="display"
                weight="bold"
                style={{ color: p.highlighted ? "#fff" : t.textPrimary }}
              >
                {p.price}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: p.highlighted ? "rgba(255,255,255,0.75)" : t.textSecondary }}
              >
                {p.cadence}
              </Text>
            </View>
            <Text
              variant="bodySmall"
              style={{
                color: p.highlighted ? "rgba(255,255,255,0.85)" : t.textSecondary,
                marginTop: space.xs,
              }}
            >
              {p.tagline}
            </Text>
            <View
              style={[
                styles.feePill,
                {
                  backgroundColor: p.highlighted ? "rgba(255,255,255,0.15)" : t.primarySoft,
                  marginTop: space.md,
                },
              ]}
            >
              <Text
                variant="micro"
                weight="semibold"
                style={{ color: p.highlighted ? "#fff" : t.primary }}
              >
                {p.fee}
              </Text>
            </View>
            <View style={{ marginTop: space.lg, gap: space.sm }}>
              {p.features.map((f) => (
                <View key={f} style={{ flexDirection: "row", gap: space.sm, alignItems: "flex-start" }}>
                  <Check
                    size={16}
                    color={p.highlighted ? palette.emerald[400] : t.success}
                    style={{ marginTop: 2 }}
                  />
                  <Text
                    variant="bodySmall"
                    style={{ color: p.highlighted ? "#fff" : t.textPrimary, flex: 1 }}
                  >
                    {f}
                  </Text>
                </View>
              ))}
            </View>
            <View style={{ marginTop: space.lg }}>
              <Pressable
                style={[
                  styles.pricingCta,
                  {
                    backgroundColor: p.highlighted ? "#fff" : t.primary,
                  },
                ]}
              >
                <Text
                  variant="body"
                  weight="semibold"
                  style={{ color: p.highlighted ? t.primary : t.primaryOn }}
                >
                  {p.cta}
                </Text>
                <ArrowRight size={16} color={p.highlighted ? t.primary : t.primaryOn} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function FaqSection({ t }: { t: ReturnType<typeof useTheme> }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <View style={[styles.sectionPad, { backgroundColor: t.bgMuted }]}>
      <SectionHeader
        eyebrow="Common questions"
        title="Got questions? We've got answers"
      />
      <View style={{ gap: space.sm }}>
        {FAQS.map((faq, idx) => {
          const open = openIdx === idx;
          return (
            <Pressable
              key={faq.q}
              onPress={() => setOpenIdx(open ? null : idx)}
              style={[styles.faqItem, { backgroundColor: t.surface, borderColor: t.border }]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
                <Text variant="bodySmall" weight="semibold" style={{ flex: 1 }}>
                  {faq.q}
                </Text>
                <View style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
                  <ChevronDown size={18} color={t.textSecondary} />
                </View>
              </View>
              {open ? (
                <Text variant="bodySmall" tone="secondary" style={{ marginTop: space.sm }}>
                  {faq.a}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function QuizCta({ t }: { t: ReturnType<typeof useTheme> }) {
  return (
    <View style={styles.sectionPad}>
      <View
        style={[
          styles.quizCard,
          { backgroundColor: t.primarySoft, borderColor: t.primary },
        ]}
      >
        <View style={[styles.iconBubble, { backgroundColor: t.primary }]}>
          <Trophy size={20} color={t.primaryOn} />
        </View>
        <Text variant="caption" weight="bold" tone="accent" style={{ marginTop: space.md, letterSpacing: 1.2 }}>
          TAKE THE QUIZ
        </Text>
        <Text variant="h2" weight="bold" style={{ marginTop: space.xs }}>
          Are you ready for a savings circle?
        </Text>
        <Text variant="bodySmall" tone="secondary" style={{ marginTop: space.xs }}>
          4 quick questions, no email needed. We'll point you to the right starting place.
        </Text>
        <View style={{ marginTop: space.lg, alignSelf: "flex-start" }}>
          <Button label="Take the 60-second quiz" trailingIcon={<ArrowRight size={16} color="#fff" />} />
        </View>
      </View>
    </View>
  );
}

function FinalCta({ t }: { t: ReturnType<typeof useTheme> }) {
  return (
    <LinearGradient
      colors={[palette.indigo[600], palette.indigo[800]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.finalCta}
    >
      <Text variant="display" weight="bold" align="center" style={{ color: "#fff" }}>
        Start saving together today
      </Text>
      <Text variant="body" align="center" style={{ color: "rgba(255,255,255,0.88)", marginTop: space.sm }}>
        Join 45,000+ members building wealth the way their communities always have.
      </Text>
      <View style={{ marginTop: space.xl, gap: space.sm, width: "100%" }}>
        <Button label="Start Free Trial" fullWidth size="lg" trailingIcon={<ArrowRight size={18} color="#fff" />} />
        <Pressable style={styles.secondaryBtn}>
          <Text variant="body" weight="semibold" style={{ color: "#fff" }}>
            Book a Demo
          </Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: "row", gap: space.md, marginTop: space.xl }}>
        <View style={styles.appBadge}>
          <Apple size={20} color="#fff" />
          <View>
            <Text variant="micro" style={{ color: "rgba(255,255,255,0.7)" }}>Download on</Text>
            <Text variant="bodySmall" weight="semibold" style={{ color: "#fff" }}>App Store</Text>
          </View>
        </View>
        <View style={styles.appBadge}>
          <Smartphone size={20} color="#fff" />
          <View>
            <Text variant="micro" style={{ color: "rgba(255,255,255,0.7)" }}>Get it on</Text>
            <Text variant="bodySmall" weight="semibold" style={{ color: "#fff" }}>Google Play</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

function Footer({ t }: { t: ReturnType<typeof useTheme> }) {
  return (
    <View style={[styles.footer, { backgroundColor: palette.slate[950] }]}>
      <Text variant="h2" weight="bold" style={{ color: "#fff" }}>
        CircleUp
      </Text>
      <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.6)", marginTop: space.xs }}>
        Save together. Grow together.
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.lg, marginTop: space.lg }}>
        {["Product", "Pricing", "Security", "Communities", "Help", "About"].map((link) => (
          <Text key={link} variant="bodySmall" style={{ color: "rgba(255,255,255,0.75)" }}>
            {link}
          </Text>
        ))}
      </View>
      <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.lg }}>
        {["🇬🇧 EN", "🇫🇷 FR", "🇩🇪 DE", "🇮🇹 IT", "🇵🇹 PT"].map((lang) => (
          <View key={lang} style={[styles.langChip]}>
            <Text variant="micro" style={{ color: "rgba(255,255,255,0.85)" }}>
              {lang}
            </Text>
          </View>
        ))}
      </View>
      <Text variant="micro" style={{ color: "rgba(255,255,255,0.4)", marginTop: space.xl }}>
        © 2026 CircleUp · Zurich · FINMA regulated · GDPR compliant
      </Text>
    </View>
  );
}

// ---------- Main export ----------

export function HomepageWelcome() {
  const t = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.bg }}
      contentContainerStyle={{ paddingBottom: 0 }}
      showsVerticalScrollIndicator={false}
    >
      <Hero t={t} />
      <StatsSection t={t} />
      <BenefitsSection t={t} />
      <HowItWorksSection t={t} />
      <TestimonialsSection t={t} />
      <ComparisonSection t={t} />
      <CircleExamplesSection t={t} />
      <CommunitiesSection t={t} />
      <TrustSection t={t} />
      <PricingSection t={t} />
      <FaqSection t={t} />
      <QuizCta t={t} />
      <FinalCta t={t} />
      <Footer t={t} />
    </ScrollView>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  // Hero
  hero: {
    paddingTop: 72,
    paddingBottom: space.xxxl,
    paddingHorizontal: space.lg,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  heroTitle: {
    color: "#fff",
    marginTop: space.lg,
    lineHeight: 40,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.85)",
    marginTop: space.md,
  },
  secondaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  trustRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
    marginTop: space.xl,
  },
  trustChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  // Stats
  statsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: space.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  statCell: {
    width: "33.33%",
    alignItems: "center",
    gap: 4,
    paddingVertical: space.sm,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  // Generic
  sectionPad: {
    paddingHorizontal: space.lg,
    paddingTop: space.xxxl,
    paddingBottom: space.xxxl,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  // How It Works
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  stepConnector: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },

  // Testimonials
  testimonialCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    minHeight: 280,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.slate[200],
  },
  metricChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },

  // Comparison
  compareTable: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  compareHeader: {
    flexDirection: "row",
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    borderBottomWidth: 1,
  },
  compareHeaderCell: {
    flex: 1,
    paddingHorizontal: space.xs,
  },
  compareRow: {
    flexDirection: "row",
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    alignItems: "center",
  },
  compareCell: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    alignItems: "flex-start",
    paddingHorizontal: space.xs,
  },

  // Examples
  exampleCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  tag: {
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  exampleStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: space.md,
    paddingTop: space.md,
    borderTopWidth: 1,
  },

  // Communities
  commCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
    height: 180,
  },
  commImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  commGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
  },
  commOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: space.lg,
  },
  localNameChip: {
    backgroundColor: "rgba(99, 102, 241, 0.25)",
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(165, 180, 252, 0.4)",
  },

  // Trust / partners
  partnersWrap: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  partnerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  partnerChip: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    flexGrow: 1,
  },

  // Pricing
  pricingCard: {
    padding: space.xl,
    borderRadius: radius.lg,
    borderWidth: 2,
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    right: space.lg,
    backgroundColor: "#fff",
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  feePill: {
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  pricingCta: {
    paddingVertical: 14,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
  },

  // FAQ
  faqItem: {
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  // Quiz CTA
  quizCard: {
    padding: space.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
  },

  // Final CTA
  finalCta: {
    paddingHorizontal: space.lg,
    paddingVertical: 56,
    alignItems: "center",
  },
  appBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  // Footer
  footer: {
    paddingHorizontal: space.lg,
    paddingVertical: space.xxxl,
  },
  langChip: {
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
});
