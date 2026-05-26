import { useState } from "react";
import { Modal, View, ScrollView, Image, Pressable, StyleSheet, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, Check, X, Image as ImageIcon, Trash2 } from "lucide-react-native";
import { router } from "expo-router";
import { AppHeader } from "@/components/shared/AppHeader";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { useTheme, space, radius } from "@/theme";
import profile from "@/product/sections/20-profile/data.json";
import type { UserProfile } from "@/product/sections/20-profile/types";

const LANGUAGE_CHIPS = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "es", label: "Español" },
  { code: "wo", label: "Wolof" },
] as const;

const GENDERS = [
  { key: "woman", label: "Woman" },
  { key: "man", label: "Man" },
  { key: "non_binary", label: "Non-binary" },
  { key: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

function formatDob(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ProfilePersonalInfo({
  initialPhotoSheet = false,
}: { initialPhotoSheet?: boolean } = {}) {
  const t = useTheme();
  const data = profile as unknown as UserProfile;
  const { identity } = data;
  const [photoOpen, setPhotoOpen] = useState(initialPhotoSheet);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Personal info" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 120, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", marginTop: space.sm }}>
          <View>
            <Image source={{ uri: identity.avatarUrl }} style={styles.avatar} />
            <Pressable
              style={[styles.cameraDot, { backgroundColor: t.primary, borderColor: t.bg }]}
              onPress={() => setPhotoOpen(true)}
            >
              <Camera size={14} color="#fff" />
            </Pressable>
          </View>
          <Text variant="caption" tone="secondary" style={{ marginTop: space.sm }}>
            Tap the camera to change your photo
          </Text>
        </View>

        <Card>
          <FieldLabel>Full name</FieldLabel>
          <Input value={identity.fullName} />
          <Divider />
          <FieldLabel>Preferred name</FieldLabel>
          <Input value={identity.preferredName} placeholder="What we'll call you" />
        </Card>

        <Card>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
            <FieldLabel>About you</FieldLabel>
            <Text variant="micro" tone="muted">
              {identity.bio.length}/280
            </Text>
          </View>
          <Input value={identity.bio} multiline />
        </Card>

        <Card>
          <FieldLabel>Languages you speak</FieldLabel>
          <View style={styles.chipWrap}>
            {LANGUAGE_CHIPS.map((opt) => {
              const selected = identity.languagesSpoken.includes(opt.code as never);
              return (
                <View
                  key={opt.code}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected ? t.primarySoft : t.bgMuted,
                      borderColor: selected ? t.primary : t.border,
                    },
                  ]}
                >
                  {selected ? <Check size={11} color={t.primary} strokeWidth={3} /> : null}
                  <Text
                    variant="caption"
                    weight={selected ? "semibold" : "regular"}
                    style={{ color: selected ? t.primary : t.textPrimary }}
                  >
                    {opt.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        <Card>
          <FieldLabel>Location</FieldLabel>
          <View style={{ flexDirection: "row", gap: space.sm }}>
            <View style={{ flex: 1 }}>
              <Text variant="micro" tone="muted" style={{ marginBottom: 4 }}>
                CITY
              </Text>
              <Input value={identity.city} />
            </View>
            <View style={{ flex: 1.2 }}>
              <Text variant="micro" tone="muted" style={{ marginBottom: 4 }}>
                COUNTRY
              </Text>
              <Input value={identity.country} />
            </View>
          </View>
        </Card>

        <Card>
          <FieldLabel>Date of birth</FieldLabel>
          <Input value={formatDob(identity.dateOfBirth)} />
          <Text variant="micro" tone="muted" style={{ marginTop: 6 }}>
            Used to confirm you're over 18. We never display this.
          </Text>
        </Card>

        <Card>
          <FieldLabel>Gender</FieldLabel>
          <View style={styles.chipWrap}>
            {GENDERS.map((g) => {
              const selected = identity.gender === g.key;
              return (
                <View
                  key={g.key}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected ? t.primarySoft : t.bgMuted,
                      borderColor: selected ? t.primary : t.border,
                    },
                  ]}
                >
                  <Text
                    variant="caption"
                    weight={selected ? "semibold" : "regular"}
                    style={{ color: selected ? t.primary : t.textPrimary }}
                  >
                    {g.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      </ScrollView>

      <View style={[styles.saveBar, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button label="Discard" variant="ghost" leadingIcon={<X size={16} color={t.primary} />} />
        <View style={{ flex: 1 }} />
        <Button
          label="Save changes"
          variant="primary"
          trailingIcon={<Check size={16} color="#fff" strokeWidth={3} />}
        />
      </View>

      <PhotoSheet open={photoOpen} onClose={() => setPhotoOpen(false)} />
    </View>
  );
}

function PhotoSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={photoStyles.backdrop} onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            photoStyles.sheet,
            {
              backgroundColor: t.surface,
              borderColor: t.border,
              paddingBottom: insets.bottom + space.lg,
            },
          ]}
        >
          <View style={[photoStyles.handle, { backgroundColor: t.bgMuted }]} />

          <View style={{ paddingHorizontal: space.lg, paddingBottom: space.md }}>
            <Text variant="h3" weight="bold">
              Update profile photo
            </Text>
            <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
              Your photo appears to other circle members.
            </Text>
          </View>

          <PhotoOption Icon={Camera} label="Take photo" sub="Open camera and capture" t={t} />
          <PhotoOption Icon={ImageIcon} label="Choose from gallery" sub="Pick an existing image" t={t} />
          <PhotoOption
            Icon={Trash2}
            label="Remove photo"
            sub="Replace with your initials"
            t={t}
            tone="danger"
            last
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function PhotoOption({
  Icon,
  label,
  sub,
  t,
  tone,
  last,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  sub: string;
  t: ReturnType<typeof useTheme>;
  tone?: "danger";
  last?: boolean;
}) {
  const fg = tone === "danger" ? t.danger : t.textPrimary;
  const iconBg = tone === "danger" ? t.dangerSoft : t.primarySoft;
  const iconFg = tone === "danger" ? t.danger : t.primary;
  return (
    <Pressable
      style={[
        photoStyles.option,
        !last && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={[photoStyles.optionIcon, { backgroundColor: iconBg }]}>
        <Icon size={20} color={iconFg} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="body" weight="semibold" style={{ color: fg }}>
          {label}
        </Text>
        <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
          {sub}
        </Text>
      </View>
    </Pressable>
  );
}

const photoStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderTopWidth: 1,
    paddingTop: space.sm,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: space.lg,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});

function FieldLabel({ children }: { children: string }) {
  return (
    <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: 6 }}>
      {children.toUpperCase()}
    </Text>
  );
}

function Input({
  value,
  placeholder,
  multiline,
}: {
  value: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const t = useTheme();
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      placeholderTextColor={t.textMuted}
      multiline={multiline}
      editable={false}
      style={[
        styles.input,
        {
          color: t.textPrimary,
          backgroundColor: t.bgMuted,
          borderColor: t.border,
          minHeight: multiline ? 80 : 44,
          textAlignVertical: multiline ? "top" : "center",
        },
      ]}
    />
  );
}

function Divider() {
  const t = useTheme();
  return <View style={{ height: 1, backgroundColor: t.border, marginVertical: space.md }} />;
}

const styles = StyleSheet.create({
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  cameraDot: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
  input: {
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    fontSize: 14,
    borderWidth: 1,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  saveBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
